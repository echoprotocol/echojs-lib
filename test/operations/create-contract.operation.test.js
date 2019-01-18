import "mocha";
import { ok, strictEqual } from "assert";
import { bytecode } from "./_contract.test";
import { privateKey, accountId } from "../_testAccount";
import { Echo, OPERATIONS_IDS } from "../../src/index";
import { ECHO_ASSET_ID } from "../../src/constants";

/** @type {{contractAddress:string|null, netAddress:string, startValue:string}} */
const options = {
	contractAddress: null,
	netAddress: 'ws://195.201.164.54:6311',
	startValue: '0123456789abcdeffedcba98765432100123456789abcdeffedcba9876543210',
};

describe('create contract', () => {
	/** @type {import("../../types/index").Echo} */
	const echo = new Echo();

	before(() => echo.connect(options.netAddress));

	after(() => echo.disconnect());

	it('successful', async () => {
		/** @type {import("../../types/index").Transaction} */
		const tx = echo.createTransaction();
		tx.addOperation(OPERATIONS_IDS.CREATE_CONTRACT, {
			code: bytecode + options.startValue,
			eth_accuracy: false,
			gas: 1e7,
			gasPrice: 0,
			registrar: accountId,
			value: { asset_id: '1.3.0', amount: 0 },
		});
		await tx.sign(privateKey);
		/** @type {string} */
		const operationResultId = await tx.broadcast().then((res) => res[0].trx.operation_results[0][1]);
		const contractId = await echo.api.getObject(operationResultId).then((res) => res.contracts_id[0]);
		ok(/^1\.16\.[1-9]\d*$/.test(contractId));
		options.contractAddress = contractId;
		// strictEqual(
		// 	await echo.api.callContractNoChangingState(contractId, accountId, ECHO_ASSET_ID, 'b6854a21'),
		// 	options.startValue,
		// );
	}).timeout(7e3);

});

export { options };
