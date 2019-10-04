import { ok, strictEqual } from 'assert';
import { url, accountId, privateKey } from '../../_test-data';
import { shouldReject, getMinContractBytecode } from '../../_test-utils';
import { Echo, OPERATIONS_IDS, constants } from '../../../';

describe('checkERC20Token', () => {
	/** @type {import("../../../types").Echo} */
	const echo = new Echo();
	before(async () => await echo.connect(url, { apis: constants.WS_CONSTANTS.CHAIN_APIS, }));
	describe('when contract id with invalid format provided', () => {
		shouldReject(async () => {
			await echo.api.checkERC20Token('invalid contract id format');
		}, 'invalid contract id format');
	});
	// TODO::
	describe.skip('when contract with provided id is not a ERC20 token.', () => {
		/** @type {string} */
		let contractId;
		before(async function () {
			this.timeout(25e3);
			const tx = echo.createTransaction().addOperation(OPERATIONS_IDS.CONTRACT_CREATE, {
				registrar: accountId,
				value: { asset_id: constants.CORE_ASSET_ID, amount: 0 },
				code: getMinContractBytecode(),
				eth_accuracy: false,
			}).addSigner(privateKey);
			await tx.sign();
			const broadcastingRes = await tx.broadcast();

			/** @type {string} */
			const opResId = broadcastingRes[0].trx.operation_results[0][1];
			const opRes = await echo.api.getObject(opResId);

			contractId = opRes.contracts_id[0];
		});
		/** @type {boolean} */
		let res;
		it('should not rejects', async () => { res = await echo.api.checkERC20Token(contractId); });
		it('should returns boolean', function () {
			if (res === undefined) this.skip();
			else ok(typeof res === 'boolean');
		});
		it('should equals to "false"', function () {
			if (typeof res !== 'boolean') this.skip();
			else strictEqual(res, false);
		});
	});
	// TODO::
	describe.skip('when nonexistent contract id provided', () => {
		/** @type {string} */
		let nonexistentContractId;
		before(async function () {
			this.timeout(7e3);
			const broadcastingRes = await echo.createTransaction().addOperation(OPERATIONS_IDS.CONTRACT_CREATE, {
				registrar: accountId,
				value: { asset_id: constants.CORE_ASSET_ID, amount: 0 },
				code: getMinContractBytecode(),
				eth_accuracy: false,
			}).addSigner(privateKey).broadcast();
			const opResId = broadcastingRes[0].trx.operation_results[0][1];
			const opRes = await echo.api.getObject(opResId);
			const contractId = opRes.contracts_id[0];
			nonexistentContractId = [
				constants.CHAIN_TYPES.RESERVED_SPACE_ID.PROTOCOL,
				constants.PROTOCOL_OBJECT_TYPE_ID.CONTRACT,
				Number.parseInt(contractId.split('.')[2]) + 1,
			].join('.');
			console.log(nonexistentContractId);
		});
		shouldReject(async () => await echo.api.checkERC20Token('1.9.3213213213'), '');
	});
});
