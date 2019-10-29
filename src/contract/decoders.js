import BigNumber from 'bignumber.js';
import $c from 'comprehension';
import { checkBytesCount, checkIntegerSize } from './utils/solidity-utils';
import { fromTwosComplementRepresentation } from './utils/number-representations';
import { toTwosPower } from './utils/converters';
import { PROTOCOL_OBJECT_TYPE_ID } from '../constants';

/** @param {string} value */
function checkValue(value) {
	if (typeof value !== 'string') throw new Error('decoding value is not a string');
	if (!/^[\da-fA-F]{64}$/.test(value)) throw new Error('decoding value is not a 32-byte in hex');
}

/**
 * @param {string} value
 * @return {boolean}
 */
export function decodeBool(value) {
	if (value === $c(64, () => '0').join('')) return false;
	if (value === `${$c(63, () => '0').join('')}1`) return true;
	throw new Error('unable to decode bool');
}

/**
 * @param {number} bitsCount
 * @param {string} value
 * @return {number|BigNumber}
 */
export function decodeUnsignedInteger(bitsCount, value) {
	checkIntegerSize(bitsCount);
	checkValue(value);
	const result = new BigNumber(value, 16);
	if (result.gte(toTwosPower(bitsCount))) throw new Error(`uint${bitsCount} overflow`);
	return bitsCount > 48 ? result : result.toNumber();
}

/**
 * @param {number} bitsCount
 * @param {string} value
 * @return {number|BigNumber}
 */
export function decodeSignedInteger(bitsCount, value) {
	checkIntegerSize(bitsCount);
	checkValue(value);
	const twosComplementRepresentation = new BigNumber(value, 16);
	if (twosComplementRepresentation.gte(toTwosPower(bitsCount))) {
		throw new Error(`int${bitsCount} overflow`);
	}
	const result = fromTwosComplementRepresentation(twosComplementRepresentation, bitsCount);
	return bitsCount > 48 ? result : result.toNumber();
}

/**
 * @param {string} value
 * @return {string}
 */
export function decodeAddress(value) {
	checkValue(value);
	if (value.startsWith(''.padStart(24, '0')) && value[24] !== '0') return `0x${value.substr(24)}`;
	if (!value.startsWith(''.padStart(25, '0'))) throw new Error('first 100 bits are not zeros');
	const _13thByte = value.substr(24, 2);
	if (!/^0[01]$/.test(_13thByte)) throw new Error('13th byte is not in ["00", "01"]');
	const isContract = _13thByte === '01';
	const accountIndex = new BigNumber(value.substr(26), 16);
	if (accountIndex.gte('2**32')) return `0x${accountIndex.toString(16).padStart(40, '0')}`;
	return ['1', isContract ? PROTOCOL_OBJECT_TYPE_ID.CONTRACT : '2', accountIndex.toString(10)].join('.');
}

/**
 * @param {number} bytesCount
 * @param value
 * @return {Buffer}
 */
export function decodeStaticBytes(bytesCount, value) {
	checkBytesCount(bytesCount);
	checkValue(value);
	if (value.split('').slice(bytesCount * 2).find((hexChar) => hexChar !== '0')) {
		throw new Error(`bytes${bytesCount} overflow`);
	}
	return Buffer.from(value.substr(0, bytesCount * 2), 'hex');
}

/**
 * @param {Array<string>} code
 * @param {number} from
 * @param {number} length
 * @param {import('../types/interfaces/Abi').SolType} type
 * @returns {{shift:number,res:Array<string>}}
 */
function decodeArray(code, from, length, type) {
	let shift = 0;
	const res = $c(length, () => {
		// eslint-disable-next-line no-shadow, no-use-before-define
		const { shift: elementShift, res } = decodeArgument(code, from + shift, type);
		shift += elementShift;
		return res;
	});
	return { shift, res };
}

/**
 * @param {number} rawOffset
 * @returns {number}
 */
function getOffset(rawOffset) {
	const result = Number.parseInt(rawOffset, 16);
	if (result % 32 !== 0) throw new Error('invalid offset');
	return result / 32;
}

/**
 * @param {Array<string>} code
 * @param {number} offset
 */
function decodeDynamicBytes(code, offset) {
	const length = Number.parseInt(code[offset], 16);
	const hexCharsCount = length * 2;
	const fullCodes = $c(Math.floor(hexCharsCount / 64), (i) => code[offset + i + 1]);
	let postCode = hexCharsCount % 64 === 0 ? '' : code[offset + Math.ceil(hexCharsCount / 64)];
	if (hexCharsCount % 64 !== 0) {
		if (postCode.substr(hexCharsCount % 64).split('').find((expectedZero) => expectedZero !== '0')) {
			throw new Error('non-zero bytes in code after full dynamic bytes');
		}
		postCode = postCode.substr(0, hexCharsCount % 64);
	}
	return Buffer.from(fullCodes.join('') + postCode, 'hex');
}

/**
 * @param {Array.<string>} code
 * @param {number} index
 * @param {SolType} type
 * @return {{ shift: number, res: * }}
 */
export function decodeArgument(code, index, type) {
	if (type === 'bool') return { shift: 1, res: decodeBool(code[index]) };
	if (type === 'address') return { shift: 1, res: decodeAddress(code[index]) };
	if (type === 'bytes') return { shift: 1, res: decodeDynamicBytes(code, getOffset(code[index])) };
	if (type === 'string') return { shift: 1, res: decodeDynamicBytes(code, getOffset(code[index])).toString('utf8') };
	const uintMatch = type.match(/^uint(\d+)$/);
	if (uintMatch) {
		const bitsCount = Number.parseInt(uintMatch[1], 10);
		return { shift: 1, res: decodeUnsignedInteger(bitsCount, code[index]) };
	}
	const intMatch = type.match(/^int(\d+)$/);
	if (intMatch) {
		const bitsCount = Number.parseInt(intMatch[1], 10);
		return { shift: 1, res: decodeSignedInteger(bitsCount, code[index]) };
	}
	const staticBytesMatch = type.match(/^bytes(\d+)$/);
	if (staticBytesMatch) {
		const bytesCount = Number.parseInt(staticBytesMatch[1], 10);
		return { shift: 1, res: decodeStaticBytes(bytesCount, code[index]) };
	}
	const staticArrayMatch = type.match(/^(.+)\[(\d+)]$/);
	if (staticArrayMatch) {
		const typeOfMatch = staticArrayMatch[1];
		const length = Number.parseInt(staticArrayMatch[2], 10);
		return decodeArray(code, index, length, typeOfMatch);
	}
	const dynamicArrayMatch = type.match(/^(.+)\[]$/);
	if (dynamicArrayMatch) {
		const typeOfMatch = dynamicArrayMatch[1];
		const offset = getOffset(code[index]);
		const length = Number.parseInt(code[offset], 16);
		const { res } = decodeArray(code, offset + 1, length, typeOfMatch);
		return { shift: 1, res };
	}
	throw new Error(`unknown type ${type}`);
}

/**
 * @param {string} rawCode
 * @param {Array.<SolType>} types
 * @return {*|Array.<*>}
 */
export default function decode(rawCode, types) {
	if (rawCode.length % 64 !== 0) {
		if (rawCode.slice(0, 8) === '08c379a0') {
			const errMessageLen = Number.parseInt(rawCode.slice(72, 136), 16);
			const errMessage = Buffer.from(rawCode.slice(136), 'hex').slice(0, errMessageLen).toString();
			throw new Error(errMessage);
		}
		throw new Error('length of code is not divisible by 32 bytes');
	}
	const code = $c({ to: rawCode.length, step: 64 }, (i) => rawCode.substr(i, 64));
	let i = 0;
	/**
	 * @param {SolType} type
	 * @return {*}
	 */
	const decodeType = (type) => {
		const { shift, res } = decodeArgument(code, i, type);
		i += shift;
		return res;
	};
	const res = types.map((type) => decodeType(type));
	if (types.length === 1) return res[0];
	if (types.length === 0) return null;
	return res;
}
