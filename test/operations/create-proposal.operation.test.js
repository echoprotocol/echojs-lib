import { Echo, OPERATIONS_IDS } from "../../src";
import { url, accountId } from "../_test-data";
import { fail, ok, strictEqual } from "assert";

describe('create proposal', () => {
	const echo = new Echo();
	before(async () => await echo.connect(url));
	after(async () => await echo.disconnect());

	describe('when element of "proposed_ops" field is not an object', () => {
		/** @type {Error} */
		let serializationError;
		it('serialization should fail', () => {
			try {
				echo.createTransaction().addOperation(OPERATIONS_IDS.PROPOSAL_CREATE, {
					fee_paying_account: accountId,
					expiration_time: new Date(),
					proposed_ops: ['not a object'],
				});
			} catch (error) {
				serializationError = error;
				return;
			}
			fail('should fail');
		});
		it('instance of error', function () {
			if (!serializationError) this.skip();
			ok(serializationError instanceof Error);
		});
		const expectedErrorMessage = [
			'operation with id 20',
			'key "proposed_ops"',
			'array element with index 0',
			'value is not an array',
		].join(': ');
		it(`with message "${expectedErrorMessage}"`, function () {
			if (!serializationError || !(serializationError instanceof Error)) this.skip();
			else strictEqual(serializationError.message, expectedErrorMessage);
		});
	});

	describe('when invalid operation provided in field "proposed_ops"', () => {
		/** @type {Error} */
		let serializationError;
		it('serialization should rejects', () => {
			try {
				echo.createTransaction().addOperation(OPERATIONS_IDS.PROPOSAL_CREATE, {
					fee_paying_account: accountId,
					expiration_time: new Date(),
					proposed_ops: [[OPERATIONS_IDS.TRANSFER, {
						from: accountId,
						to: '1.2.10',
						amount: 'not a instance of "asset"',
					}]],
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
		const expectedErrorMessagePrefix = [
			'operation with id 20',
			'key "proposed_ops"',
			'array element with index 0',
			'static variant',
		].join(': ');
		it(`with message, that starts with ${expectedErrorMessagePrefix}`, function () {
			if (!serializationError || !(serializationError instanceof Error)) this.skip();
			ok(serializationError.message.startsWith(expectedErrorMessagePrefix));
		});
		const expectedErrorMessagePostfix = [
			'key "amount"',
			'serializable object is not a object',
		].join(': ');
		it('and ends with serialization error of inner operation', function () {
			if (
				!serializationError ||
				!(serializationError instanceof Error) ||
				!serializationError.message.startsWith(expectedErrorMessagePrefix)
			) this.skip();
			const expectedErrorMessage = [expectedErrorMessagePrefix, expectedErrorMessagePostfix].join(': ');
			strictEqual(serializationError.message, expectedErrorMessage);
		});
	});
});
