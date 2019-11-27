import 'mocha';
import { deepStrictEqual, notStrictEqual, strictEqual, ok } from 'assert';
import { expect } from 'chai';

import { Contract } from '../../';

/** @typedef {import("../types/interfaces/Abi").AbiMethod} AbiMethod */

/** @typedef {Array<AbiMethod>} Abi */

/** @type {AbiMethod} */
const defaultAbiMethod = {
	constant: true,
	inputs: [],
	name: 'test',
	outputs: [],
	payable: false,
	stateMutability: 'pure',
	type: 'function',
};

describe('Contract', () => {
	describe('initializing', () => {
		it('abi is not an array', () => {
			expect(() => new Contract('not_an_array')).to.throw(Error, 'abi is not an array');
		});
		it('abi method is not an object', () => {
			expect(() => new Contract(['not_a_object'])).to.throw(Error, 'abi method is not an object');
		});
		it('abi method inputs is not an array', () => {
			/** @type {Abi} */
			const abi = [{
				...defaultAbiMethod,
				inputs: 'not_an_array',
			}];
			expect(() => new Contract(abi)).to.throw(Error, 'inputs of abi method is not an array');
		});
		it('abi method outputs is not an array', () => {
			/** @type {Abi} */
			const abi = [{
				...defaultAbiMethod,
				outputs: 'not_an_array',
			}];
			expect(() => new Contract(abi)).to.throw(Error, 'outputs of abi method is not an array');
		});
		it('echo is not a instance of Echo', () => {
			const func = () => new Contract([], { echo: 'not_a_Echo_instance' });
			expect(func).to.throw(Error, 'value is not a instance of Echo');
		});
		// it('function without a name', () => {
		// 	/** @type {Abi} */
		// 	const abi = [{ ...defaultAbiMethod, name: undefined }];
		// 	expect(() => new Contract(abi)).to.throw(Error, 'abi method name is not a string');
		// });
		it('type not equals to "function"', () => {
			/** @type {Abi} */
			const abi = [{ ...defaultAbiMethod, type: 'not_a_function' }];
			deepStrictEqual(new Contract(abi).methods, {});
		});
		it('successful', () => {
			/** @type {Abi} */
			const abi = [{
				...defaultAbiMethod,
				inputs: [{ type: 'uint32', name: 'number' }],
				name: 'qwe',
				type: 'function',
			}];
			const contract = new Contract(abi);
			strictEqual(Object.keys(contract.methods).length, 3);
			strictEqual(typeof contract.methods.qwe, 'function');
			strictEqual(contract.methods['0x5a2f5928'], contract.methods.qwe);
			strictEqual(contract.methods['qwe(uint32)'], contract.methods.qwe);
			deepStrictEqual(contract.abi, abi);
		});
		it('abi getter clones', () => {
			/** @type {Abi} */
			const abi = [{
				...defaultAbiMethod,
				inputs: [{ type: 'uint32', name: 'number' }],
				name: 'qwe',
				type: 'function',
			}];
			const contract = new Contract(abi);
			notStrictEqual(contract.abi, abi);
			contract.abi.push({
				constant: false,
				inputs: [{ type: 'string', name: 'str' }],
				name: 'asd',
				outputs: [{ type: 'bool', name: 'success' }],
				payable: false,
				stateMutability: 'nonpayable',
				type: 'function',
			});
			deepStrictEqual(abi, contract.abi);
		});
		it('several methods with same names', () => {
			/** @type {Abi} */
			const abi = [
				{ ...defaultAbiMethod, name: 'qwe', inputs: [{ type: 'uint32', name: 'num' }] },
				{ ...defaultAbiMethod, name: 'qwe', inputs: [{ type: 'string', name: 'str' }] },
				{ ...defaultAbiMethod, name: 'qwe', inputs: [{ type: 'bytes', name: 'buffer' }] },
			];
			const contract = new Contract(abi);
			strictEqual(Object.keys(contract.methods).length, 6);
			strictEqual(contract.methods.qwe, undefined);

			strictEqual(typeof contract.methods['qwe(uint32)'], 'function');
			strictEqual(contract.methods['0x5a2f5928'], contract.methods['qwe(uint32)']);

			strictEqual(typeof contract.methods['qwe(string)'], 'function');
			strictEqual(contract.methods['0xbb70fa38'], contract.methods['qwe(string)']);
			notStrictEqual(contract.methods['qwe(string)'], contract.methods['qwe(uint32)']);

			strictEqual(typeof contract.methods['qwe(bytes)'], 'function');
			strictEqual(contract.methods['0xc6e5f097'], contract.methods['qwe(bytes)']);
			notStrictEqual(contract.methods['qwe(bytes)'], contract.methods['qwe(uint32)']);
			notStrictEqual(contract.methods['qwe(bytes)'], contract.methods['qwe(string)']);

			const { namesDublications } = contract;
			ok(namesDublications instanceof Set);
			deepStrictEqual([...namesDublications.values()], ['qwe']);
			notStrictEqual(namesDublications, contract.namesDublications);
		});
		it('invalid method arguments count', () => {
			const contract = new Contract([defaultAbiMethod]);
			expect(() => contract.methods.test(123)).to.throw(Error, 'invalid arguments count');
		});
	});
});
