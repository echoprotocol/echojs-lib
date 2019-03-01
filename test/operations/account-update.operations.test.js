import "mocha";

import { constants, Echo, PublicKey } from "../../src/index";

import { privateKey, accountId, url } from "../_test-data";

describe('operations', () => {

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
                ed_key: 'eaf7ac57fb67e9c5ca51e4b9c12a2741db7fe3035c54eec44c182b9bf75f1a55',
                active: {
                    weight_threshold: 1,
                    account_auths: [],
                    key_auths: [[
                        'ECHO5CsThV98oW7rCWkcosyu5cMY9GXGyvXAqD5dtA5oudSGUiSNYU',
                        1
                      ]],
                    address_auths: []
                },
            })
    	    .addSigner(privateKey).broadcast();
		}).timeout(10000);
    })
});