import { strictEqual, ok, fail } from "assert";
import { inspect } from "util";

/**
 * @param {() => Promise<any> | any} f
 * @param {string} expectedErrorMessage
 * @param {string} [testErrorMessage]
 */
export function shouldReject(f, expectedErrorMessage, testErrorMessage) {
	/** @type {Error} */
	let actualError;
	it('should rejects', async () => {
		let res;
		try {
			res = await f();
		} catch (error) {
			actualError = error;
			return;
		}
		console.log('got result:', inspect(res, false, null, true));
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

export function getMinContractBytecode() {
	return [
		'6080604052348015600f57600080fd5b50603280601d6000396000f30060806040520000a165627a7a7230582087136b',
		'218bd8b1ac3f4a17600b29970d584ed28b9189fa641b926d7b220102f60029',
	].join('');
}

/** @returns {string} */
export function getRandomAssetSymbol() {
	const charCodes = new Array(16).fill(0).map(() => Math.floor(Math.random() * 26) + 65);
	const result = String.fromCharCode(...charCodes);
	return result;
}

/**
 * @template T
 * @typedef {T extends Promise<infer U> ? U : T} UnPromisify
 */
