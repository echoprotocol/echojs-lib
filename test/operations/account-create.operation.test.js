import "mocha";
import { ok } from "assert";

import { Echo, constants, PrivateKey, PublicKey } from "../../src/index";

import { privateKey, accountId, url } from "../_test-data";

const { OPERATIONS_IDS } = constants;
import bs58 from 'bs58'
describe('account create operation', () => {

	/** @type {import("../../types/index").Echo} */
	const echo = new Echo();

	before(() => echo.connect(url));

	after(() => echo.disconnect());

	it('account create successful', async () => {

		const edPrivateWithoutDETDecoded = bs58.decode('privatekey');
		const prKey = PrivateKey.fromBuffer(edPrivateWithoutDETDecoded);
		const randomString = `newacc-${Date.now()}`;
		const publicKey = PrivateKey.fromSeed(randomString).toPublicKey().toString();

		const result = await echo.createTransaction()
			.addOperation(OPERATIONS_IDS.ACCOUNT_CREATE, {
				ed_key: publicKey,
				registrar: accountId,
				referrer: accountId,
				referrer_percent: 0,
				name: randomString,
				active: { // by default has key_auths
					weight_threshold: 1,
					account_auths: [],
					key_auths: [[
						publicKey,
						1,
					]]
				},
				options: {
					memo_key: 'ECHO1111111111111111111111111111111114T1Anm',
					voting_account: "1.2.3",
					delegating_account: "1.2.3",
					num_committee: 0,
					votes: [],
					extensions: [],
				},
			})
			.addSigner(prKey).broadcast();

		ok(result instanceof Array);
		ok(!!result[0].id);

	}).timeout(1000 * 100);

});
