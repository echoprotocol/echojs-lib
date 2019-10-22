import { Echo } from "../../src";
import { url, accountId } from "../_test-data";
import { OPERATIONS_IDS } from "../../src/constants";
import { fail, ok, strictEqual } from "assert";

describe('update asset feed producers', () => {
	const echo = new Echo();
	before(async () => await echo.connect(url));
	after(async () => await echo.disconnect());
	describe('when element of "new_feed_producers" is not a string', () => {
		/** @type {Error} */
		let serializationError;
		it('serialization should rejects', () => {
			try {
				echo.createTransaction().addOperation(OPERATIONS_IDS.ASSET_UPDATE_FEED_PRODUCERS, {
					issuer: accountId,
					asset_to_update: '1.3.0',
					new_feed_producers: [null],
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
			'static variant with key 10',
			'struct key "new_feed_producers"',
			'set',
			'vector element with index 0',
			'instance id',
			'value is not a number',
		].join(': ');
		it(`with message "${expectedErrorMessage}"`, function () {
			if (!serializationError || !(serializationError instanceof Error)) this.skip();
			else strictEqual(serializationError.message, expectedErrorMessage);
		});
	});
});
