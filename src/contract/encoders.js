import BigNumber from 'bignumber.js';
import $c from 'comprehension';
import { toBigInteger, toTwosPower } from './utils/converters';
import { toTwosComplementRepresentation } from './utils/number-representations';
import { checkBytesCount, checkIntegerSize } from './utils/solidity-utils';
import { addressRegExp } from './utils/validators';
import { constants } from 'echojs-lib';

/**
 * @param {boolean} value
 * @returns {string}
 */
export function encodeBool(value) {
	if (typeof value !== 'boolean') throw new Error('value is not a boolean');
	return $c(63, () => '0').join('') + (value ? '1' : '0');
}

/**
 * @param {number} bitsCount
 * @param {number|BigNumber} value
 * @returns {string}
 */
export function encodeUnsignedInteger(bitsCount, value) {
	checkIntegerSize(bitsCount);
	value = toBigInteger(value);
	if (value.isNegative()) throw new Error('value is negative');
	if (value.gte(toTwosPower(bitsCount))) {
		throw new Error(`uint${bitsCount} overflow`);
	}
	const preRes = value.toString(16);
	return $c(64 - preRes.length, () => '0').join('') + preRes;
}

/**
 * @param {number} bitsCount
 * @param {number|BigNumber} value
 * @returns {string}
 */
export function encodeInteger(bitsCount, value) {
	checkIntegerSize(bitsCount);
	value = toBigInteger(value);
	if (value.abs().gte(toTwosPower(bitsCount - 1))) throw new Error(`int${bitsCount} overflow`);
	const twosComplementRepresentation = toTwosComplementRepresentation(value, bitsCount);
	return encodeUnsignedInteger(bitsCount, twosComplementRepresentation);
}

/**
 * @param {string} address
 * @returns {string}
 */
export function encodeAddress(address) {
	if (typeof address !== 'string') throw new Error('address is not a string');
	if (/^0x[a-fA-F\d]{40}$/.test(address)) return address.slice(2).padStart(64, '0');
	if (!addressRegExp.test(address)) throw new Error('invalid address format');
	const [, instanceTypeId, objectId] = address.split('.').map((str) => new BigNumber(str, 10));
	const preRes = objectId.toString(16);
	if (preRes.length > 38) throw new Error('objectId is greater or equals to 2**152');
	const isContract = instanceTypeId.eq(constants.OBJECT_TYPES.CONTRACT);
	return [
		$c(25, () => 0).join(''),
		isContract ? '1' : '0',
		$c(38 - preRes.length, () => 0).join(''),
		preRes,
	].join('');
}

/** @typedef {'hex'|'ascii'|'utf8'|'utf16le'|'ucs2'|'base64'|'latin1'|'binary'} Encoding */

/**
 * @param {number} bytesCount
 * @param {Buffer|string|{value:Buffer|string,encoding:Encoding?,align:'left'|'right'|'none'}} input
 * @return {string}
 */
export function encodeStaticBytes(bytesCount, input) {
	const defaultEncoding = 'hex';
	const defaultAlign = 'none';
	// typeof is uncovered. see https://github.com/gotwarlost/istanbul/issues/582
	if (Buffer.isBuffer(input) || typeof input !== 'object') {
		input = { value: input, encoding: defaultEncoding, align: defaultAlign };
	}
	input.encoding = input.encoding || defaultEncoding;
	input.align = input.align || defaultAlign;
	checkBytesCount(bytesCount);
	if (!Buffer.isBuffer(input.value)) {
		if (input.encoding === 'hex' && input.value.substr(0, 2) === '0x') input.value = input.value.substr(2);
		if (input.encoding === 'hex' && !/^([\da-fA-F]{2}){1,32}$/.test(input.value)) {
			throw new Error('input is not a hex string');
		}
		input.value = Buffer.from(input.value, input.encoding);
	}
	if (input.value.length !== bytesCount) {
		if (input.value.length > bytesCount) throw new Error('input is too large');
		if (input.align === 'none') throw new Error('input is too short, maybe u need to use align?');
		const arr = Array.from(input.value);
		const zeros = $c(bytesCount - input.value.length, () => 0);
		if (input.align === 'left') input.value = Buffer.from([...arr, ...zeros]);
		else if (input.align === 'right') input.value = Buffer.from([...zeros, ...arr]);
		else throw new Error('unknown align');
	}
	return input.value.toString('hex').padStart(64, '0');
}

/** @typedef {{ type: ('dynamic'|'static'), code: Array.<string|_ArrayCode>, length: number }} _ArrayCode */

/**
 * @param {string|Buffer|{ value:(string|Buffer), encoding:Encoding }} input
 * @returns {_ArrayCode}
 */
export function encodeDynamicBytes(input) {
	const defaultEncoding = 'hex';
	// typeof is uncovered. see https://github.com/gotwarlost/istanbul/issues/582
	if (Buffer.isBuffer(input) || typeof input !== 'object') {
		input = { value: input, encoding: defaultEncoding };
	}
	input.encoding = input.encoding || defaultEncoding;
	if (typeof input.value === 'string') input.value = Buffer.from(input.value, input.encoding);
	const partsCount = Math.ceil(input.value.length / 32);
	/** @type {Array<string>} */
	const code = $c({ count: partsCount, step: 32 }, (i) => input.value.slice(i, i + 32).toString('hex'));
	const lastCodeIndex = partsCount - 1;
	if (code[lastCodeIndex].length !== 64) {
		code[lastCodeIndex] = code[lastCodeIndex] + $c(64 - code[lastCodeIndex].length, () => '0').join('');
	}
	return { type: 'dynamic', length: input.value.length, code };
}

/**
 * @param {string|{ value:string, encoding:Encoding }} input
 * @returns {_ArrayCode}
 */
export function encodeString(input) {
	if (typeof input === 'string') input = { value: input, encoding: 'utf8' };
	return encodeDynamicBytes(input);
}

/**
 * @param {SolType} type
 * @param {Array.<*>} value
 * @returns {_ArrayCode}
 */
export function encodeDynamicArray(value, type) {
	if (!Array.isArray(value)) throw new Error('value is not an array');
	return { type: 'dynamic', length: value.length, code: value.map((element) => encodeArgument(element, type)) };
}

/**
 * @param {SolType} type
 * @param {Array.<*>} value
 * @param {number} length
 * @returns {_ArrayCode}
 */
export function encodeStaticArray(value, type, length) {
	if (!Array.isArray(value)) throw new Error('value is not an array');
	if (length !== value.length) throw new Error('invalid array elements count');
	return { type: 'static', length, code: value.map((element) => encodeArgument(element, type)) };
}

/**
 * @param {*} value
 * @param {SolType} type
 * @returns {string|_ArrayCode}
 */
export function encodeArgument(value, type) {
	const dynamicArrayMatch = type.match(/^(.*)\[]$/);
	if (dynamicArrayMatch) {
		const type = dynamicArrayMatch[1];
		return encodeDynamicArray(value, type);
	}
	const staticArrayMatch = type.match(/^(.*)\[(\d+)]$/);
	if (staticArrayMatch) {
		const type = staticArrayMatch[1];
		const length = Number.parseInt(staticArrayMatch[2], 10);
		return encodeStaticArray(value, type, length);
	}
	const bytesMatch = type.match(/^bytes(\d+)$/);
	if (bytesMatch) {
		const length = Number.parseInt(bytesMatch[1], 10);
		return encodeStaticBytes(length, value);
	}
	const unsignedIntegerMatch = type.match(/^uint(\d+)$/);
	if (unsignedIntegerMatch) {
		const bitsCount = Number.parseInt(unsignedIntegerMatch[1], 10);
		return encodeUnsignedInteger(bitsCount, value);
	}
	const signedIntegerMatch = type.match(/^int(\d+)$/);
	if (signedIntegerMatch) {
		const bitsCount = Number.parseInt(signedIntegerMatch[1], 10);
		return encodeInteger(bitsCount, value);
	}
	if (type === 'bool') return encodeBool(value);
	if (type === 'address') return encodeAddress(value);
	if (type === 'string') return encodeString(value);
	if (type === 'bytes') return encodeDynamicBytes(value);
	throw new Error(`unknown type ${type}`);
}

/**
 * @param {Array.<{ value: *, type: SolType }>|{ value: *, type: SolType }} input
 * @returns {string}
 */
export default function encode(input) {
	if (!Array.isArray(input)) input = [input];
	/** @type {Array.<(string|{type: (string), code: Array<string|{type: (string), code: Array<string|_ArrayCode>, length: number}>, length: number}|number)>} */
	let result = input.map(({ value, type }) => encodeArgument(value, type));
	let post = [];
	do {
		for (const { link, arr, length } of post) {
			// result[link] = encodeUnsignedInteger(256, result.length * 32);
			result[link] = result.length;
			result.push(encodeUnsignedInteger(256, length), ...arr);
		}
		post = [];
		for (let i = 0; i < result.length; i++) {
			if (['string', 'number'].includes(typeof result[i])) continue;
			if (result[i].type === 'static') {
				const shiftLength = result[i].code.length - 1;
				result = [
					...result.slice(0, i),
					...result[i].code,
					...result.slice(i + 1),
				];
				result = result.map((element) =>
					typeof element === 'number' && element > i ? element + shiftLength : element);
				i -= 1;
				continue;
			}
			post.push({ link: i, arr: result[i].code, length: result[i].length });
			result[i] = undefined;
		}
	} while (post.length > 0);
	return result.map((element) => typeof element === 'number' ? encodeUnsignedInteger(256, element * 32) : element)
		.join('');
}
