// import 'mocha';
// import { ok } from 'assert';
//
// import { Echo, constants } from '../../src/index';
//
// import { options } from './create-contract.operation.test';
//
// import { privateKey, accountId, url } from '../_test-data';
//
// const { OPERATIONS_IDS } = constants;

describe('call contract', () => {

	/** @type {import("../../types/index").Echo} */
	// const echo = new Echo();

	// before(() => echo.connect(url));

	// after(() => echo.disconnect());

	it('successful', async () => {
		// const result = await echo.createTransaction()
		// 	.addOperation(OPERATIONS_IDS.CONTRACT_CALL, {
		// 		registrar: accountId,
		// 		value: {
		// 			asset_id: '1.3.0',
		// 			amount: 0,
		// 		},
		// 		code: '86be3f80' + '0000000000000000000000000000000000000000000000000000000000000001', // setVariable(uint256)
		// 		callee: options.contractAddress,
		// 	})
		// 	.addSigner(privateKey)
		// 	.broadcast();
		// const resultId = result[0].trx.operation_results[0][1];
		// ok(/^1\.15\.[1-9]\d*$/.test(resultId));
		//
		// const contractResult = await echo.api.getContractResult(resultId);
		// const excepted = contractResult[1].exec_res.excepted;
		// ok(excepted === 'None');
	}).timeout(1000 * 100);

});
