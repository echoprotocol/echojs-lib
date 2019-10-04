import 'mocha';
import { bytecode } from './_contract.test';
import { privateKey, accountId, url, contractId } from '../_test-data';
import { Echo, constants } from '../../';
import { expect } from 'chai';

const { OPERATIONS_IDS } = constants;

/** @type {{contractAddress:string|null, netAddress:string, startValue:string}} */
const options = {
	contractAddress: null,
	startValue: '0123456789abcdeffedcba98765432100123456789abcdeffedcba9876543210',
};

describe('error while disconnecting and updating cache', () => {
	/** @type {import("../../types/index").Echo} */
	const echo = new Echo();

	before(() => echo.connect(url));
	describe('isContractHistoryId', () => {
		it('connection closed during get full accounts callbacks from account statistics', async () => {
			try {
				const tx = echo.createTransaction();
				tx.addOperation(OPERATIONS_IDS.CONTRACT_CREATE, {
					code: bytecode + options.startValue,
					eth_accuracy: false,
					registrar: accountId,
					value: {
						asset_id: '1.3.0',
						amount: 0
					},
				});
				await tx.sign(privateKey);
				await tx.broadcast();
				await echo.subscriber._api.getFullContract(contractId, true);
				await echo.disconnect();
			} catch (err) {
				expect(err.message).to.equal('Websocket is closed');
			}
		}).timeout(15e3);
	});

	describe('isAccountStatisticsId', () => {
		it('connection closed during get full accounts callbacks from history', async () => {
			try {
			await echo.subscriber.setAccountSubscribe(() => {}, [accountId]);
			await echo.createTransaction()
				.addOperation(constants.OPERATIONS_IDS.ACCOUNT_UPDATE, {
					fee: { asset_id: '1.3.0' },
					account: accountId,
					echorand_key: privateKey.toPublicKey()
						.toString(),
					active: {
						weight_threshold: 1,
						account_auths: [],
						key_auths: [[ privateKey.toPublicKey().toString(), 1 ]],
					},
				})
				.addSigner(privateKey)
				.broadcast();

			await echo.subscriber._api.getFullAccounts([accountId], true, true);
			await echo.disconnect();
			} catch (err) {
				expect(err.message).to.equal('Websocket is closed');
			}
		}).timeout(7e3);
	});

});

export { options };
