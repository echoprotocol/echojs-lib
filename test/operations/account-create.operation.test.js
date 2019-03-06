import "mocha";
import { ok } from "assert";

import { Echo, constants, PrivateKey } from "../../src/index";

import { privateKey, accountId, url } from "../_test-data";

const { OPERATIONS_IDS } = constants;

describe('account create operation', () => {

	/** @type {import("../../types/index").Echo} */
	const echo = new Echo();

	before(() => echo.connect(url));

	after(() => echo.disconnect());

	it('account create successful', async () => {

		const randomString = `newacc-${Date.now()}`;
		const publicKey = PrivateKey.fromSeed(randomString).toPublicKey().toString();

		const result = await echo.createTransaction()
			.addOperation(OPERATIONS_IDS.ACCOUNT_CREATE, {
				ed_key: "f2e2bf07dc5fe2d49d68b3e53a54fc74de149737d342c2f920bcf55e5ffcdf02",
				registrar: accountId,
				referrer: accountId,
				referrer_percent: 0,
				name: randomString,
				owner: { // by default has key_auths
					weight_threshold: 1,
					account_auths: [],
					key_auths: [[
						publicKey,
						1,
					]],
					address_auths: [],
				},
				active: { // by default has key_auths
					weight_threshold: 1,
					account_auths: [],
					key_auths: [[
						publicKey,
						1,
					]],
					address_auths: [],
				},
				options: {
					memo_key: publicKey,
					voting_account: "1.2.1",
					delegating_account: "1.2.1",
					num_witness: 0,
					num_committee: 0,
					votes: [],
					extensions: [],
				},
			})
			.addSigner(privateKey).broadcast();

		ok(result instanceof Array);
		ok(!!result[0].id);

	}).timeout(1000 * 100);

});
