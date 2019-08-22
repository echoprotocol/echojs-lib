import 'mocha';
import { expect } from 'chai';
import { Echo } from '../src';
import Transaction from '../src/echo/transaction';
import { strictEqual, notStrictEqual, deepStrictEqual, fail, ok } from 'assert';
import { TRANSFER } from '../src/constants/operations-ids';
import PrivateKey from '../src/crypto/private-key';

import { url } from './_test-data';
import { ACCOUNT, ASSET} from '../src/constants/object-types';


const echo = new Echo();

describe.skip('Transaction', () => {

	before(() => echo.connect(url));

	// describe('initialization', () => {
	// 	it('echo is not instance of Echo', () => {
	// 		expect(() => new Transaction('not_a_Echo_instance')).to.throw(Error, 'value is not instance of Echo');
	// 	});
	// 	it('successful', () => {
	// 		const transaction = echo.transaction;
	// 		strictEqual(transaction.echo, echo);
	// 		notStrictEqual(transaction.operations, transaction.operations);
	// 		deepStrictEqual(transaction.operations, []);
	// 	});
	// });

	// describe('addOperation', () => {
	// 	describe('failure', () => {
	// 		it('without name', () => {
	// 			expect(() => echo.transaction.addOperation()).to.throw(Error, 'name is missing');
	// 		});
	// 		it('name is not a string', () => {
	// 			expect(() => echo.transaction.addOperation(123)).to.throw(Error, 'name is not a string');
	// 		});
	// 		it('props is not a object', () => {
	// 			for (const props of ['not_a_object', null]) {
	// 				const func = () => echo.transaction.addOperation('qwe', props);
	// 				expect(func).to.throw(Error, 'argument "props" is not a object');
	// 			}
	// 		});
	// 		it('invalid name', () => {
	// 			const func = () => echo.transaction.addOperation('invalid_name', {});
	// 			expect(func).to.throw(Error, 'unknown operation invalid_name');
	// 		});
	// 		it('invalid props', () => {
	// 			const func = () => echo.transaction.addOperation('transfer', {});
	// 			expect(func).to.throw(Error, 'Parameter from is invalid');
	// 		});
	// 	});
	// 	describe('successful', () => {
	// 		it('transfer', () => {
	// 			const transaction = echo.transaction;
	// 			const operationProps = {
	// 				from: `1.${ACCOUNT}.1`,
	// 				to: `1.${ACCOUNT}.2`,
	// 				amount: { amount: 123, asset_id: `1.${ASSET}.1` },
	// 				extensions: [],
	// 			};
	// 			const transactionWithOperation = transaction.addOperation('transfer', operationProps);
	// 			strictEqual(transaction, transactionWithOperation);
	// 			deepStrictEqual(transaction.operations, [[0, operationProps]]);
	// 		});
	// 		// TODO: test with excess fields
	// 	});
	// });

	// describe('setRequiredFees', () => {
	// 	describe('failure', () => {
	// 		it('no operations', async () => {
	// 			const transaction = echo.transaction;
	// 			try {
	// 				await transaction.setRequiredFees();
	// 			} catch (error) {
	// 				strictEqual(error.message, 'no operations');
	// 				return;
	// 			}
	// 			fail('should throws');
	// 		});
	// 	});
	// 	describe('successful', () => {
	// 		it('default asset', async () => {
	// 			const operationProps = {
	// 				from: `1.${ACCOUNT}.1`,
	// 				to: `1.${ACCOUNT}.2`,
	// 				amount: { amount: 123, asset_id: `1.${ASSET}.0` },
	// 				extensions: [],
	// 			};
	// 			const transaction = echo.transaction.addOperation('transfer', operationProps);
	// 			await transaction.setRequiredFees();
	// 			deepStrictEqual(transaction.operations, [[0, {
	// 				...operationProps,
	// 				fee: { asset_id: `1.${ASSET}.0`, amount: 20 },
	// 			}]]);
	// 		});
	// 		it('custom asset', async () => {
	// 			const operationProps = {
	// 				from: `1.${ACCOUNT}.1`,
	// 				to: `1.${ACCOUNT}.2`,
	// 				amount: { amount: 123, asset_id: `1.${ASSET}.0` },
	// 				fee: { asset_id: `1.${ASSET}.1` },
	// 				extensions: [],
	// 			};
	// 			const transaction = echo.transaction.addOperation('transfer', operationProps);
	// 			await transaction.setRequiredFees();
	// 			const { fee } = transaction.operations[0][1];
	// 			strictEqual(fee.asset_id, `1.${ASSET}.1`);
	// 			ok(fee.amount > 0);
	// 		});

	// 	});
	// });

	// describe('broadcast', () => {
	// 	it('qwe', async () => {
	// 		const pk = 'WIF';
	// 		const transaction = echo.createTransaction();
	// 		transaction.addOperation(TRANSFER, {
	// 			from: `1.${ACCOUNT}.30`,
	// 			to: `1.${ACCOUNT}.10`,
	// 			amount: { asset_id: `1.${ASSET}.0`, amount: 1000 },
	// 		});
	// 		transaction.addSigner(PrivateKey.fromWif(pk));
	// 		const result = await transaction.broadcast(() => console.log(1));
	// 		console.log(result);
	// 	}).timeout(11000);
	// });

	describe('get potential signatures', () => {
		it('asd', async () => {
			const pk = '5KPT6sFAgx8sEiNyuF2QijsNCAPAvs4r6MV9Vn26z4NuTv86mfd';
			const transaction = echo.createTransaction();
			transaction.addOperation(TRANSFER, {
				from: `1.${ACCOUNT}.6`,
				to: `1.${ACCOUNT}.7`,
				amount: { asset_id: `1.${ASSET}.0`, amount: 1000 },
			});
			// await transaction.sign(PrivateKey.fromWif(pk));
			// console.log(await transaction.broadcast(console.log));
			console.log(await transaction.getPotentialSignatures());
		}).timeout(12e3);
	});

});
