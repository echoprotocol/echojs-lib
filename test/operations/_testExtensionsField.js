import { privateKey } from "../_test-data";
import { deepStrictEqual, fail, ok, strictEqual } from "assert";

/**
 * @param {import("../../types/echo").default} echo
 * @param {import("../../types/interfaces/OperationId").default} operationId
 * @param {(extensions?: unknown[]) => any} getProps
 */
export default function testExtensionsField(echo, operationId, getProps) {
	const positiveTests = [
		{ extensions: undefined, testName: 'is not provided' },
		{ extensions: [], testName: 'equals to empty array' },
	];
	for (const { extensions, testName } of positiveTests) {
		describe(`when "extension" field ${testName}`, () => {
			/** @type {import("../../types/echo/transaction").default} */
			let transaction;

			it('building should succeed', () => {
				transaction = echo.createTransaction()
					.addOperation(operationId, getProps(extensions))
					.addSigner(privateKey);
			});

			it('signing should succeed', async () => await transaction.sign());

			it('transaction object should contains "extensions" field, that equals to empty array', () => {
				const { extensions } = transaction.transactionObject.operations[0][1];
				deepStrictEqual(extensions, []);
			});

			it('broadcasting should succeed', async () => await transaction.broadcast()).timeout(7e3);
		});
	}

	describe('when "extension" field is non-empty array', () => {
		/** @type {Error} */
		let serializationError;
		it('serialization should fail', () => {
			try {
				echo.createTransaction().addOperation(operationId, getProps(['not empty']));
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
			`operation with id ${operationId}`,
			'key "extensions"',
			'array element with index 0',
			'serialization is not implemented',
		].join(': ');

		it(`with message "${expectedErrorMessage}"`, function () {
			if (!serializationError || !(serializationError instanceof Error)) this.skip();
			else strictEqual(serializationError.message, expectedErrorMessage);
		});
	});
}
