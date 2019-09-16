import { ok } from 'assert';
import { keccak256 } from 'js-sha3';
import { getSignature } from './solidity-utils';

/**
 * @param {string} type
 * @param {boolean?} isInput
 * @returns {{ res: string, tupleIsUsed?: boolean }}
 */
function parseType(type, isInput = true) {
	const prefix = isInput ? 'INPUT' : 'OUTPUT';
	if (type === 'bool') return { res: `${prefix}['boolean']` };
	if (type === 'address') return { res: `${prefix}['address']` };
	if (type === 'string') return { res: `${prefix}['string']` };
	const integerMatch = type.match(/^u?int(\d+)$/);
	if (integerMatch) {
		const bitsCount = Number.parseInt(integerMatch[1], 10);
		ok(bitsCount % 8 === 0);
		ok(bitsCount > 0);
		ok(bitsCount <= 256);
		if (bitsCount <= 48) return { res: `${prefix}['small_integer']` };
		return { res: `${prefix}['big_integer']` };
	}
	if (type === 'bytes') return { res: `${prefix}['bytes']` };
	const bytesMatch = type.match(/^bytes(\d+)?$/);
	if (bytesMatch) {
		const bytesCount = Number.parseInt(bytesMatch[1], 10);
		ok(bytesCount > 0);
		ok(bytesCount <= 32);
		return { res: `${prefix}['bytes']` };
	}
	const staticArrayMatch = type.match(/^(.*)\[(\d+)]$/);
	if (staticArrayMatch) {
		const length = Number.parseInt(staticArrayMatch[2], 10);
		return { res: `Tuple<${parseType(staticArrayMatch[1], isInput).res}, ${length}>`, tupleIsUsed: true };
	}
	const dynamicArrayMatch = type.match(/^(.*)\[]$/);
	if (dynamicArrayMatch) {
		const { res, tupleIsUsed } = parseType(dynamicArrayMatch[1], isInput);
		return { res: `Array<${res}>`, tupleIsUsed };
	}
	throw new Error(`unknown type ${type}`);
}

/**
 * @param {Array<import("../../types/_Abi").AbiArgument>} inputs
 * @returns {{ res: string, tupleIsUsed: boolean }}
 */
function getArgs(inputs) {
	let tupleIsUsed = false;
	const res = inputs.map(({ name, type }, argIndex) => {
		const { res, tupleIsUsed: tupleUsedInArg } = parseType(type, true);
		if (tupleUsedInArg) tupleIsUsed = true;
		return `${name || `arg${argIndex}`}: ${res}`;
	}).join(', ');
	return { res, tupleIsUsed };
}

/**
 * @param {string} contractName
 * @param {import("../../types/_Abi").Abi} abi
 * @param {Object} [props]
 * @param {string} [props.indent]
 * @param {number} [props.maxStringLength]
 * @returns {string}
 */
export default function generateInterface(contractName, abi, props = {}) {
	const { indent, maxStringLength } = { indent: '\t', maxStringLength: 120, ...props };
	let inputIsUsed = false;
	let outputIsUsed = false;
	let tupleIsUsed = false;
	// const events = [];
	/** @type {{ [nameOrSignature: string]: { name: string, str: string, signature: string, hash: string } }} */
	const methods = {};
	/** @type {Set<string>} */
	const names = new Set();
	/** @type {Set<string>} */
	const namesDuplicates = new Set();
	/** @type {boolean} */
	let hasEvents = false;
	/** @type {{ [key: string]: string }} */
	let events = `type ${contractName}Events = {`;
	/** @type {Array<{ name: string, type: string }>|undefined} */
	let constructorArgs;
	for (const abiMethod of abi) {
		const { name, type, inputs } = abiMethod;
		switch (type) {
			case 'function': {
				if (inputs.length > 0) inputIsUsed = true;
				const { res: args, tupleIsUsed: tupleUsedInFunc } = getArgs(inputs);
				if (tupleUsedInFunc) tupleIsUsed = true;
				const signature = getSignature(abiMethod);
				const hash = `0x${keccak256(signature).slice(0, 8)}`;
				const potentialArgument = `type f${hash} = (${args}) => Method<any, ${contractName}Events>;`;
				const str = potentialArgument.length >= maxStringLength
					? potentialArgument
						.replace('(', `(\n${indent}`)
						.replace(/, /g, `,\n${indent}`)
						.replace(')', ',\n)')
					: potentialArgument;
				if (names.has(name)) {
					namesDuplicates.add(name);
					names.delete(name);
				} else if (!namesDuplicates.has(name)) names.add(name);
				if (methods[signature]) throw new Error('signatures duplication');
				methods[signature] = { name, str, signature, hash };
				break;
			}
			case 'constructor':
				if (constructorArgs !== undefined) throw new Error('constructor duplicate');
				constructorArgs = inputs;
				break;
			case 'event':
				if (!hasEvents) {
					hasEvents = true;
					events += '\n';
				}
				events += `${indent}${name}: {\n`;
				for (const { name, type } of inputs) {
					const { res, tupleIsUsed: tupleUsedInArg } = parseType(type, false);
					if (tupleUsedInArg) tupleIsUsed = true;
					outputIsUsed = true;
					events += `${indent}${indent}${name}: ${res},\n`;
				}
				events += `${indent}},\n`;
				break;
			default:
		}
	}
	events += '};';
	let result = `import Contract${inputIsUsed ? ', { Method }' : ''} from "echojs-contract";\n`;
	if (inputIsUsed || constructorArgs) result += 'import INPUT from "echojs-contract/types/_inputs";\n';
	if (outputIsUsed) result += 'import OUTPUT from "echojs-contract/types/_outputs";\n';
	if (tupleIsUsed) result += 'import Tuple from "echojs-contract/types/_tuple";\n';
	result += '\n';
	result += Object.keys(methods).map((signature) => {
		const { str } = methods[signature];
		return `${str}\n`;
	}).join('');
	result += '\n';
	result += events;
	result += '\n';
	// result += methods.map(({ str }) => `${str}\n`).join('');
	result += '\n';
	let genericType = constructorArgs === undefined
		? '' : `<[${constructorArgs.map(({ type }) => parseType(type).res).join(', ')}]>`;
	const getInitStr = () => `export default class ${contractName} extends Contract${genericType} {`;
	if (getInitStr().length > maxStringLength) {
		genericType = '<[\n';
		for (const { type } of constructorArgs) {
			genericType += `${indent}${parseType(type).res},\n`;
		}
		genericType += ']>';
	}
	result += `${getInitStr()}\n`;
	// if (constructorArgs !== undefined) {
	// 	result += `${indent}static async deploy(\n`;
	// 	result += `${indent}${indent}code: string | Buffer,\n`;
	// 	result += `${indent}${indent}echo: Echo,\n`;
	// 	result += `${indent}${indent}privateKey: PrivateKey,\n`;
	// 	result += `${indent}${indent}options: {\n`;
	// 	result += `${indent}${indent}${indent}abi: Abi,\n`;
	// 	result += `${indent}${indent}${indent}ethAccuracy?: boolean,\n`;
	// 	result += `${indent}${indent}${indent}supportedAssetId?: string,\n`;
	// 	result += `${indent}${indent}${indent}value?: { amount?: number | string | BigNumber, asset_id?: string },\n`;
	// 	result += `${indent}${indent}${indent}args: [${constructorArgs.},\n`;
	// 	result += `${indent}${indent}},\n`;
	// }
	result += `${indent}readonly methods: {\n`;
	result += Object.keys(methods).map((type) => {
		const { name, signature, hash } = methods[type];
		return [
			...namesDuplicates.has(name) ? [] : [name],
			`'${signature}'`,
			`'${hash}'`,
		].map((methodName) => `${indent}${indent}${methodName}: f${hash},\n`).join('');
	}).join('');
	result += `${indent}};\n`;
	result += '}\n';
	return result;
}
