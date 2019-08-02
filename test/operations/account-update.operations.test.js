import 'mocha';

import { constants, Echo, PublicKey } from '../../src/index';

import { privateKey, accountId, url } from '../_test-data';

describe('account update', () => {

	/** @type {import("../../types/index").Echo} */
	const echo = new Echo();

	before(() => echo.connect(url));

	after(() => echo.disconnect());

	describe('account update', () => {
		it('successful', async () => {
			const result = await echo.createTransaction()
				.addOperation(constants.OPERATIONS_IDS.ACCOUNT_UPDATE, {
					fee: { asset_id: '1.3.0' },
					account: accountId,
					echorand_key: privateKey.toPublicKey().toString(),
					active: {
						weight_threshold: 1,
						account_auths: [],
						key_auths: [[
							privateKey.toPublicKey().toString(),
							1
						]],
					},
				})
				.addSigner(privateKey)
				.broadcast();
		}).timeout(10000);
	});
});
