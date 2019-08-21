import 'mocha';
import { bytecode } from './_contract.test';
import { privateKey, accountId, url, contractId } from '../_test-data';
import { Echo, constants } from '../../src/index';
import { expect } from 'chai';

const { OPERATIONS_IDS } = constants;

/** @type {{contractAddress:string|null, netAddress:string, startValue:string}} */
const options = {
	contractAddress: null,
	startValue: '0123456789abcdeffedcba98765432100123456789abcdeffedcba9876543210',
};

describe.only('error disconnect', () => {
	/** @type {import("../../types/index").Echo} */
	const echo = new Echo();

	before(() => echo.connect(url));
	after(() => echo.disconnect(url));

	it('error when disconnect and cache renew in the same time', async () => {
		try {
			/** @type {import("../../types/index").Transaction} */
			const tx = echo.createTransaction();
			tx.addOperation(OPERATIONS_IDS.CREATE_CONTRACT, {
				code: bytecode + options.startValue,
				eth_accuracy: false,
				registrar: accountId,
				value: {
					asset_id: '1.3.0',
					amount: 0
				},
			});
			await tx.sign(privateKey);
			/** @type {string} */
			await tx.broadcast();
			await echo.subscriber._api.getFullContract(contractId, true);
			await echo.disconnect();
			// await echo.subscriber._api.getFullContract(contractId, true);
		} catch (err) {
			expect(err.message).to.equal('Websocket is closed');
		}
	}).timeout(7e3);

	// it('successful', async () => {
	// 	// try {
	// 		/** @type {import("../../types/index").Transaction} */
	// 		const check = await echo.api.getObject('2.1.0');
	//
	// 	const tx = echo.createTransaction();
	// 	tx.addOperation(OPERATIONS_IDS.CREATE_CONTRACT, {
	// 		code: bytecode + options.startValue,
	// 		eth_accuracy: false,
	// 		registrar: accountId,
	// 		value: {
	// 			asset_id: '1.3.0',
	// 			amount: 0
	// 		},
	// 	});
	// 	await tx.sign(privateKey);
	// 	/** @type {string} */
	// 	await tx.broadcast();
	// 	console.log(check);
	// 	// await echo.disconnect();
	// 	// } catch (err) {
	// 	// 	expect(err.message).to.equal('Websocket is closed');
	// 	// }
	// }).timeout(7e3);

});

export { options };
