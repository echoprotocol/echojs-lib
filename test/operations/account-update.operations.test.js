import 'mocha';

import { constants, Echo, PublicKey, OPERATIONS_IDS } from '../../';

import { privateKey, accountId, url } from '../_test-data';
import { fail, ok, strictEqual } from 'assert';

import { ASSET } from '../../src/constants/object-types';

describe('account update', () => {

	/** @type {import("../../types/index").Echo} */
	const echo = new Echo();

	before(() => echo.connect(url));

	after(() => echo.disconnect());

	describe('account update', () => {
		it('successful', async () => {
			const result = await echo.createTransaction()
				.addOperation(constants.OPERATIONS_IDS.ACCOUNT_UPDATE, {
					fee: { asset_id: `1.${ASSET}.0` },
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

	describe('when field "active" is not an object or undefined', () => {
		/** @type {Error} */
		let serializationError;
		it('serialization should rejects', () => {
			try {
				echo.createTransaction().addOperation(OPERATIONS_IDS.ACCOUNT_UPDATE, {
					account: accountId,
					active: 'not a object',
				});
			} catch (error) {
				serializationError = error;
				return;
			}
			fail('should rejects');
		});
		it('instance of Error', function () {
			if (!serializationError) this.skip();
			ok(serializationError instanceof Error);
		});
		const expectedErrorMessage = [
			'static variant with key 4',
			'struct key "active"',
			'optional type',
			'serializable struct is not a object',
		].join(': ');
		it(`with message "${expectedErrorMessage}"`, function () {
			if (!serializationError || !(serializationError instanceof Error)) this.skip();
			strictEqual(serializationError.message, expectedErrorMessage);
		});
	});
});
