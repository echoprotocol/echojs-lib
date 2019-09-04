import "mocha";
import { ok } from "assert";

import { Echo, constants, PrivateKey, PublicKey } from "../../src/index";
import { ED25519 } from '../../src/crypto';

import { privateKey, accountId, url } from "../_test-data";
import { ACCOUNT } from '../../src/constants/object-types';

const { OPERATIONS_IDS } = constants;

describe('account create operation', () => {

	/** @type {import("../../types/index").Echo} */
	const echo = new Echo();

	before(() => echo.connect(url));

	after(() => echo.disconnect());

	it('account create successful', async () => {
		const edKeyPair = ED25519.createKeyPair();
		const prKey = PrivateKey.fromBuffer(edKeyPair.privateKey);
		const publicKey = prKey.toPublicKey().toPublicKeyString();

		const randomString = `newacc-${Date.now()}`;

		const result = await echo.createTransaction()
			.addOperation(OPERATIONS_IDS.ACCOUNT_CREATE, {
				registrar: accountId,
				name: randomString,
				active: { // by default has key_auths
					weight_threshold: 0,
					account_auths: [],
					key_auths: [[
						publicKey,
						1,
					]]
				},
				echorand_key: publicKey,
				options: {
					voting_account: `1.${ACCOUNT}.3`,
					delegating_account: `1.${ACCOUNT}.3`,
					num_committee: 0,
					votes: [],
				},
				extensions: [],
			})
			.addSigner(privateKey).broadcast();

		ok(result instanceof Array);
		ok(!!result[0].id);

	}).timeout(7e3);

});
