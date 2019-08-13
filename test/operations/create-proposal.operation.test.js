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
});
