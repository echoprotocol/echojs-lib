import { Echo, OPERATIONS_IDS } from "../../..";
import { url, accountId, privateKey } from "../../_test-data";
import { inspect } from "util";
import { ok, deepStrictEqual } from "assert";

/*
 * pragma solidity ^0.4.24;
 * contract Qwe {
 *     event Test(uint256 indexed indexedField, uint256 nonIndexedField);
 *     function test(uint256 indexedField, uint256 nonIndexedField) public { emit Test(indexedField, nonIndexedField); }
 * }
 */
const bytecode = [
	"608060405234801561001057600080fd5b5060e08061001f6000396000f300608060405260043610603f576000357c010000000000000000",
	"0000000000000000000000000000000000000000900463ffffffff168063eb8ac921146044575b600080fd5b348015604f57600080fd5b50",
	"607660048036038101908080359060200190929190803590602001909291905050506078565b005b817f91916a5e2c96453ddf6b58549726",
	"2675140eb9f7a774095fb003d93e6dc69216826040518082815260200191505060405180910390a250505600a165627a7a7230582085d4cd",
	"c749b60050d7df224ded452a41549e1880caf023c417b9e1aca69645670029",
].join("");

describe("getContractLogs", () => {
	const echo = new Echo();
	/** @type {string} */
	let contractId;
	before(async function () {
		this.timeout(12e3);
		await echo.connect(url);
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
		contractId = opRes.contracts_id[0];
		ok(contractId !== undefined);
	});
	describe("when options are not provided", () => {
		/** @type {[]} */
		let result;
		let promise;
		let cb = (data) => result = data;
		it("should not rejects", async () => {
			promise = await echo.api.getContractLogs(cb);
			ok(promise !== undefined);
		});
		it("should return empty array", function () {
			if (result === undefined) this.skip();
			else deepStrictEqual(result, [[]]);
		});
	});
});
