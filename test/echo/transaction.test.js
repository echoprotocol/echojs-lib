import 'mocha';
import { expect } from 'chai';
import echo from '../../';
import Transaction from '../../src/echo/transaction';
import { strictEqual, notStrictEqual, deepStrictEqual, fail, ok } from 'assert';

describe('Transaction', () => {

	before(() => echo.connect('wss://echo-dev.io/ws'));

	describe('initialization', () => {
		it('echo is not instance of Echo', () => {
			expect(() => new Transaction('not_a_Echo_instance')).to.throw(Error, 'value is not instance of Echo');
		});
		it('successful', () => {
			const transaction = new Transaction(echo);
			strictEqual(transaction.echo, echo);
			notStrictEqual(transaction.operations, transaction.operations);
			deepStrictEqual(transaction.operations, []);
		});
	});

	describe('addOperation', () => {
		describe('failure', () => {
			it('without name', () => {
				expect(() => new Transaction(echo).addOperation()).to.throw(Error, 'name is missing');
			});
			it('name is not a string', () => {
				expect(() => new Transaction(echo).addOperation(123)).to.throw(Error, 'name is not a string');
			});
			it('props is not a object', () => {
				for (const props of ['not_a_object', null]) {
					const func = () => new Transaction(echo).addOperation('qwe', props);
					expect(func).to.throw(Error, 'argument "props" is not a object');
				}
			});
			it('invalid name', () => {
				const func = () => new Transaction(echo).addOperation('invalid_name', {});
				expect(func).to.throw(Error, 'unknown operation invalid_name');
			});
			it('invalid props', () => {
				const func = () => new Transaction(echo).addOperation('transfer', {});
				expect(func).to.throw(Error, 'invalid props');
			});
		});
		describe('successful', () => {
			it('transfer', () => {
				const transaction = new Transaction(echo);
				const operationProps = {
					from: '1.2.1',
					to: '1.2.2',
					amount: { amount: 123, assetId: '1.3.1' },
					extensions: [],
				};
				const transactionWithOperation = transaction.addOperation('transfer', operationProps);
				strictEqual(transaction, transactionWithOperation);
				deepStrictEqual(transaction.operations, [[0, operationProps]]);
			});
			// TODO: test with excess fields
		});
	});

	describe('setRequiredFees', () => {
		describe('failure', () => {
			it('no operations', async () => {
				const transaction = new Transaction(echo);
				try {
					await transaction.setRequiredFees();
				} catch (error) {
					strictEqual(error.message, 'no operations');
					return;
				}
				fail('should throws');
			});
		});
		describe('successful', () => {
			it('default asset', async () => {
				const operationProps = {
					from: '1.2.1',
					to: '1.2.2',
					amount: { amount: 123, assetId: '1.3.0' },
					extensions: [],
				};
				const transaction = new Transaction(echo).addOperation('transfer', operationProps);
				await transaction.setRequiredFees();
				deepStrictEqual(transaction.operations, [[0, {
					...operationProps,
					fee: { assetId: '1.3.0', amount: 20 },
				}]]);
			});
			it('custom asset', async () => {
				const operationProps = {
					from: '1.2.1',
					to: '1.2.2',
					amount: { amount: 123, assetId: '1.3.0' },
					fee: { assetId: '1.3.1' },
					extensions: [],
				};
				const transaction = new Transaction(echo).addOperation('transfer', operationProps);
				await transaction.setRequiredFees();
				const { fee } = transaction.operations[0][1];
				strictEqual(fee.assetId, '1.3.1');
				ok(fee.amount > 0);
			});

		});
	});
});
