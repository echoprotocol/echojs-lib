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
                echorand_key: 'ECHOJDUP9qKT8rLzho8djKfuDMhAC4nanuVmLR8opgvjAXyt',
                active: {
                    weight_threshold: 1,
                    account_auths: [],
                    key_auths: [[
                        'ECHOJDUP9qKT8rLzho8djKfuDMhAC4nanuVmLR8opgvjAXyt',
                        1
					]],
                },
            })
    	    .addSigner(privateKey).broadcast();
		}).timeout(10000);
    })
});
