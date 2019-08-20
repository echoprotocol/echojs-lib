import { strictEqual, ok } from "assert";

/**
 * @param {() => Promise<any> | any} f
 * @param {string} expectedErrorMessage
 * @param {string} [testErrorMessage]
 */
export function shouldReject(f, expectedErrorMessage, testErrorMessage) {
	/** @type {Error} */
	let actualError;
	it('should rejects', async () => {
		try {
			await f();
		} catch (error) {
			actualError = error;
			return;
		}
		fail('should rejects');
	});
	it('instance of Error', function () {
		if (!actualError) this.skip();
		ok(actualError instanceof Error);
	});
	it(testErrorMessage || `with message "${expectedErrorMessage}"`, function () {
		if (!actualError || !(actualError instanceof Error)) this.skip();
		strictEqual(actualError.message, expectedErrorMessage);
	});
}
