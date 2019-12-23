import * as assert from "assert";
import { Echo, OPERATIONS_IDS, BigNumber } from "../../..";
import { url, accountId, privateKey } from "../../_test-data";
import { shouldReject } from "../../_test-utils";

/**
 * @template T
 * @typedef {import("../../_test-utils").UnPromisify<T>} UnPromisify
 */

/*
 * pragma solidity ^0.4.23;
 * 
 * contract Emitter {
 *     event Event1(uint256 indexed indexedField, uint256 nonIndexedField);
 *     event Event2(uint256 indexed indexedField, uint256 nonIndexedField);
 *     function emit1(uint256 indexedField, uint256 nonIndexedField) public {
 *         emit Event1(indexedField, nonIndexedField);
 *     }
 *     function emit2(uint256 indexedField, uint256 nonIndexedField) public {
 *         emit Event2(indexedField, nonIndexedField);
 *     }
 * }
 */
const bytecode = [
	"608060405234801561001057600080fd5b50610163806100206000396000f30060806040526004361061004c576000357c010000000000000",
	"0000000000000000000000000000000000000000000900463ffffffff168063156d44ef146100515780631baea0ab14610088575b600080fd",
	"5b34801561005d57600080fd5b5061008660048036038101908080359060200190929190803590602001909291905050506100bf565b005b3",
	"4801561009457600080fd5b506100bd60048036038101908080359060200190929190803590602001909291905050506100fb565b005b817f",
	"d3610b1c54575b7f4f0dc03d210b8ac55624ae007679b7a928a4f25a709331a8826040518082815260200191505060405180910390a250505",
	"65b817f6a822560072e19c1981d3d3bb11e5954a77efa0caf306eb08d053f37de0040ba826040518082815260200191505060405180910390",
	"a250505600a165627a7a72305820fddab02616eb79d169bffcec273868d1795db6ede88d13a007343987fa332a370029",
].join("");

const emit1 = "156d44ef";
const emit2 = "1baea0ab";

describe("getContractLogs", () => {
	const echo = new Echo();

	/** @returns {Promise<string>} */
	async function deploy() {
		const txRes = await echo.createTransaction().addOperation(OPERATIONS_IDS.CONTRACT_CREATE, {
			registrar: accountId,
			value: { amount: 0, asset_id: "1.3.0" },
			code: bytecode,
			eth_accuracy: false,
			extensions: [],
		}).addSigner(privateKey).broadcast();
		/** @type {string} */
		const opResId = txRes[0].trx.operation_results[0][1];
		const opRes = await echo.api.getObject(opResId);
		const contractId = opRes.contracts_id[0];
		assert.ok(contractId !== undefined);
		return contractId;
	}

	/**
	 * @param {string} contractId
	 * @param {string} methodSignature
	 * @param {number} indexed
	 * @param {number} notIndexed
	 */
	async function emit(contractId, methodSignature, indexed, notIndexed) {
		assert.ok(indexed >= 0);
		assert.ok(notIndexed >= 0);
		assert.ok(Number.isSafeInteger(indexed));
		assert.ok(Number.isSafeInteger(notIndexed));
		await echo.createTransaction().addOperation(OPERATIONS_IDS.CONTRACT_CALL, {
			registrar: accountId,
			value: { amount: 0, asset_id: '1.3.0' },
			code: [
				methodSignature,
				indexed.toString(16).padStart(64, '0'),
				notIndexed.toString(16).padStart(64, '0'),
			].join(''),
			callee: contractId,
			extensions: [],
		}).addSigner(privateKey).broadcast();
	}

	before(async () => await echo.connect(url));
	after(async () => await echo.disconnect());

	describe('when `contracts` is not an `set_t`', () => {
		shouldReject(async () => {
			await echo.api.getContractLogs({ contracts: 'not an array' });
		}, 'contracts: vector is not an array');
	});

	describe('when `contracts` has duplicates', () => {
		shouldReject(
			async () => await echo.api.getContractLogs({ contracts: ['1.11.1', '1.11.1'] }),
			'contracts element with index 1 is equals to the other one with index 0',
			'with indexes of duplicated elements',
		);
	});

	describe('when `contracts` first element is not a contract id', () => {
		shouldReject(async () => {
			await echo.api.getContractLogs({ contracts: ['1.10.1'] });
		}, 'contracts: vector element with index 0: invalid object type id');
	});

	describe('when `topics` is not an `set_t`', () => {
		shouldReject(async () => {
			await echo.api.getContractLogs({ topics: 'not an array' });
		}, '`topics` is not an array');
	});

	describe('when `fromBlock` is negative', () => {
		shouldReject(async () => {
			await echo.api.getContractLogs({ fromBlock: -1 });
		}, '`fromBlock` must be greater than or equal to zero');
	});

	describe('when `toBlock` is negative', () => {
		shouldReject(async () => {
			await echo.api.getContractLogs({ toBlock: -1 });
		}, '`toBlock` must be greater than zero');
	});

	describe('when `toBlock` is equals to zero', () => {
		shouldReject(async () => {
			await echo.api.getContractLogs({ toBlock: 0 });
		}, '`toBlock` must be greater than zero');
	});

	describe('when different events are emitted in different blocks', () => {
		/** @type {string} */
		let contractId;
		/** @type {string} */
		let contractAddress;
		before(async function () {
			this.timeout(25e3);
			contractId = await deploy();
			contractAddress = `01${new BigNumber(contractId.split('.')[2]).toString(16).padStart(38, '0')}`;
			await emit(contractId, emit1, 123, 234);
			await emit(contractId, emit2, 345, 456);
		});
		describe('when no filter provided', () => {
			/** @type {UnPromisify<ReturnType<Echo["api"]["getContractLogs"]>>} */
			let res;
			it('should succeed', async () => {
				res = await echo.api.getContractLogs();
				assert.ok(res !== undefined);
			});
			it('should return array', function () {
				if (res === undefined) this.skip();
				assert.ok(Array.isArray(res));
			});
			/** @type {typeof res} */
			let events;
			it('with length greater than or equals to 2', function () {
				if (res === undefined || !Array.isArray(res)) this.skip();
				assert.ok(res.length >= 2);
				events = res.slice(res.length - 2);
			});
			it('with all logs of contract', function () {
				if (events === undefined) this.skip();
				assert.ok(events.every(([_, { address }]) => address === contractAddress));
			});
			it('with different blocks', function () {
				if (events === undefined) this.skip();
				assert.ok(events[0][1].block_num !== events[1][1].block_num);
			});
		});
		describe('when there are another contract with the same logs', () => {
			/** @type {string} */
			let anotherContractId;
			/** @type {string} */
			let anotherContractAddress;
			before(async function () {
				this.timeout(30e3);
				anotherContractId = await deploy();
				const anotherContractInstanceIndex = new BigNumber(anotherContractId.split('.')[2]);
				anotherContractAddress = `01${anotherContractInstanceIndex.toString(16).padStart(38, '0')}`;
				await emit(anotherContractId, emit1, 123, 234);
				await emit(anotherContractId, emit2, 345, 456);
			});
			describe('when first contract provided in `contracts` filter', () => {
				/** @type {UnPromisify<ReturnType<Echo["api"]["getContractLogs"]>>} */
				let res;
				it('should succeed', async () => {
					res = await echo.api.getContractLogs({ contracts: [contractId] });
					assert.ok(res !== undefined);
				});
				it('should return array', function () {
					if (res === undefined) this.skip();
					assert.ok(Array.isArray(res));
				});
				it('with length equals to 2', function () {
					if (res === undefined || !Array.isArray(res)) this.skip();
					assert.strictEqual(res.length, 2);
				});
				it('with all logs of contract', function () {
					if (res === undefined || !Array.isArray(res) || res.length < 2) this.skip();
					assert.ok(res.every(([_, { address }]) => address === contractAddress));
				});
				it('with different blocks', function () {
					if (res === undefined || !Array.isArray(res) || res.length < 2) this.skip();
					assert.ok(res[0][1].block_num !== res[1][1].block_num);
				});
			});
			describe('when both contracts are provided in `contracts` filter', () => {
				/** @type {UnPromisify<ReturnType<Echo["api"]["getContractLogs"]>>} */
				let res;
				it('should succeed', async () => {
					res = await echo.api.getContractLogs({ contracts: [contractId, anotherContractId] });
					assert.ok(res !== undefined);
				});
				it('should return array', function () {
					if (res === undefined) this.skip();
					assert.ok(Array.isArray(res));
				});
				it('with length equals to 4', function () {
					if (res === undefined || !Array.isArray(res)) this.skip();
					assert.strictEqual(res.length, 4);
				});
				it('with all logs of both contracts', function () {
					if (res === undefined || !Array.isArray(res) || res.length < 4) this.skip();
					assert.deepStrictEqual(res.map(([_, { address }]) => {
						return address;
					}), [contractAddress, contractAddress, anotherContractAddress, anotherContractAddress]);
				});
			});
		});
	});
});
