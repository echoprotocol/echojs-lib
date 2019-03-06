import "mocha";
import { ok } from "assert";

import { Echo, constants, PrivateKey } from "../../src/index";

import { privateKey, accountId, url } from "../_test-data";

const { OPERATIONS_IDS } = constants;

describe('account upgrade operation', () => {

	/** @type {import("../../types/index").Echo} */
	const echo = new Echo();

	before(() => echo.connect(url));

	after(() => echo.disconnect());

	it('successful', async () => {

		const result = await echo.createTransaction()
			.addOperation(OPERATIONS_IDS.ACCOUNT_UPGRADE, {
				account_to_upgrade: accountId,
				upgrade_to_lifetime_member: true
			})
			.addSigner(privateKey).broadcast();

		ok(result instanceof Array);
		ok(!!result[0].id);

	}).timeout(1000 * 100);

});
