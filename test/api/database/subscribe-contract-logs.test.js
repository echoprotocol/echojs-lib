import assert from "assert";
import { Echo } from "../../..";
import { url } from "../../_test-data";
import { deploy, emit, emit1 } from "../../_event-emitter-contract";

/** @typedef {import("../../../types/interfaces/vm/types").Log} Log */

describe('subscribeContractLogs', () => {
	const echo = new Echo();
	let contract1;
	let contract2;
	before(async function () {
		this.timeout(10e3);
		await echo.connect(url);
		[contract1, contract2] = await Promise.all(new Array(2).fill(null).map((_, i) => deploy(echo, 10 + i)));
	});
	after(async () => echo.disconnect());
	describe('when no any options are provided', () => {
		/** @type {number|string} */
		let cbId;
		/** @type {Log[]} */
		let emits = [];
		it('should succeed', async () => cbId = await echo.api.subscribeContractLogs((logs) => emits.push(...logs)));
		describe('when different contracts emit', () => {
			before(() => emits = []);
			it('should not rejects', async function () {
				this.timeout(10e3);
				await Promise.all([contract1, contract2].map(async (contract) => {
					await emit(echo, contract, emit1, 123, 234);
				}));
				await new Promise((resolve) => setTimeout(() => resolve(), 1e3));
			});
			it('should call callback', () => assert.ok(emits.length > 0));
			it('should call callback twice', () => assert.strictEqual(emits.length, 2));
			it('with both of contracts', function () {
				if (emits.length !== 2) this.skip();
				assert.deepStrictEqual(new Set([contract1, contract2]), new Set(emits.map((log) => log[1].address)));
			});
		});
		// TODO: unsubscribe
		after(async () => { if (cbId !== undefined); });
	});
});
