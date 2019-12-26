import * as assert from "assert";
import { Echo, OPERATIONS_IDS, BigNumber } from "../../..";
import { url, accountId, privateKey } from "../../_test-data";
import { shouldReject } from "../../_test-utils";
import { deploy, emit, emit1, emit2 } from "../../_event-emitter-contract";

/**
 * @template T
 * @typedef {import("../../_test-utils").UnPromisify<T>} UnPromisify
 */

describe("getContractLogs", () => {
	const echo = new Echo();

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
			contractId = await deploy(echo);
			contractAddress = `01${new BigNumber(contractId.split('.')[2]).toString(16).padStart(38, '0')}`;
			await emit(echo, contractId, emit1, 123, 234);
			await emit(echo, contractId, emit2, 345, 456);
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
				anotherContractId = await deploy(echo);
				const anotherContractInstanceIndex = new BigNumber(anotherContractId.split('.')[2]);
				anotherContractAddress = `01${anotherContractInstanceIndex.toString(16).padStart(38, '0')}`;
				await emit(echo, anotherContractId, emit1, 123, 234);
				await emit(echo, anotherContractId, emit2, 345, 456);
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
