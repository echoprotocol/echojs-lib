import "mocha";
import { ok } from "assert";
import { bytecode } from "./_contract.test";
import { privateKey, accountId, url } from "../_test-data";
import { Echo, constants } from "../../src/index";

const { OPERATIONS_IDS } = constants;
import { ECHO_ASSET_ID } from "../../src/constants";

/** @type {{contractAddress:string|null, netAddress:string, startValue:string}} */
const options = {
	contractAddress: null,
	startValue: '0123456789abcdeffedcba98765432100123456789abcdeffedcba9876543210',
};

describe('create contract', () => {
	/** @type {import("../../types/index").Echo} */
	const echo = new Echo();

	before(() => echo.connect(url));

	after(() => echo.disconnect());

	it('successful', async () => {
		/** @type {import("../../types/index").Transaction} */
		const tx = echo.createTransaction();
		tx.addOperation(OPERATIONS_IDS.CREATE_CONTRACT, {
			code: bytecode + options.startValue,
			eth_accuracy: false,
			registrar: accountId,
			value: { asset_id: '1.3.0', amount: 0 },
		});
		await tx.sign(privateKey);
		/** @type {string} */
		let operationResultId = await tx.broadcast().then((res) => res[0].trx.operation_results[0][1]);

		// TEMP: NEED TO BE DELETED AFTER BUG FIXED
		operationResultId = `1.15.${operationResultId.split('.')[2] - 1}`;

		const newAddress = await echo.api.getContractResult(operationResultId).then((res) => res[1].exec_res.new_address).catch((e) => console.log(e));
		const contractId = `1.14.${parseInt(newAddress.slice(2), 16)}`;

		ok(/^1\.14\.[1-9]\d*$/.test(contractId));
		options.contractAddress = contractId;
		// strictEqual(
		// 	await echo.api.callContractNoChangingState(contractId, accountId, ECHO_ASSET_ID, 'b6854a21'),
		// 	options.startValue,
		// );
	}).timeout(7e3);

});

export { options };
