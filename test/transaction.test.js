import 'mocha';
import { expect } from 'chai';
import { Echo, Transaction } from '../src';
import { strictEqual, notStrictEqual, deepStrictEqual, fail, ok } from 'assert';
import { CONTRACT_CREATE, TRANSFER } from '../src/constants/operations-ids';
import PrivateKey from '../src/crypto/private-key';

import { url, WIF } from './_test-data';
import { ACCOUNT, ASSET} from '../src/constants/object-types';
import { DYNAMIC_GLOBAL_OBJECT_ID } from '../src/constants';
import { bytecode } from './operations/_contract.test';


const echo = new Echo();
const options = {
  from: `1.${ACCOUNT}.6`,
  to: `1.${ACCOUNT}.10`,
  // eth_accuracy: false,
  amount: { asset_id: `1.${ASSET}.0`, amount: 10 },
  fee: { asset_id: '1.3.0', amount: 0 },
  extensions: [],
};
const options2 = {
  registrar: `1.${ACCOUNT}.6`,
  value: { asset_id: '1.3.0', amount: 0 },
  eth_accuracy: false,
  code: bytecode,
  fee: { asset_id: '1.3.0', amount: 500 },
};

describe('Transaction', () => { //skip

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
	//
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
	//
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
	//
	// 	});
	// });
	//
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

	// describe('get potential signatures', () => {
	// 	it('asd', async () => {
	// 		const pk = '5KPT6sFAgx8sEiNyuF2QijsNCAPAvs4r6MV9Vn26z4NuTv86mfd';
	// 		const transaction = echo.createTransaction();
	// 		transaction.addOperation(TRANSFER, {
	// 			from: `1.${ACCOUNT}.6`,
	// 			to: `1.${ACCOUNT}.7`,
	// 			amount: { asset_id: `1.${ASSET}.0`, amount: 1000 },
	// 		});
	// 		// await transaction.sign(PrivateKey.fromWif(pk));
	// 		// console.log(await transaction.broadcast(console.log));
	// 		console.log(await transaction.getPotentialSignatures());
	// 	}).timeout(12e3);
	// });

  	describe('sing transaction offline', () => {
	  	it('should fall, already finalized', async () => {
			const tx = echo.createTransaction();
			const dynamicGlobalChainData = await echo.api.getObject(DYNAMIC_GLOBAL_OBJECT_ID, true);
			console.log('dynamicGlobalChainData.head_block_id', dynamicGlobalChainData.head_block_id);
			tx.refBlockNum = dynamicGlobalChainData.head_block_number;
			tx.refBlockPrefix = dynamicGlobalChainData.head_block_id;
			tx.chainId = await echo.api.getChainId();
			try {
				tx.addOperation(TRANSFER, options);
			} catch (err) {
			  	expect(err.message).to.equal('already finalized');
			}
	  	}).timeout(11000);
		it('should fall, when use invalid chainId data', async () => {
			const tx = new Transaction();
			try {
			  	tx.chainId = 'you shall not pass!!!';
		  	} catch (err) {
				expect(err.message).to.equal('invalid chainId format or length');
		 	}
		});
	  	it('should fall, when use negative refBlockNum value', async () => {
			const tx = new Transaction();
			try {
			  	tx.refBlockNum = -1;
			} catch (err) {
			  	expect(err.message).to.equal('value is not positive');
			}
	  	});
		it('should fall, when use not integer as refBlockNum value', async () => {
			const tx = new Transaction();
			try {
			  	tx.refBlockNum = 1.23;
			  	await tx.sign(privateKey);
			} catch (err) {
				expect(err.message).to.equal('undefined is not a integer');
			}
		});
		it('should fall, when use not a number as refBlockNum value', async () => {
			const tx = new Transaction();
			try {
				tx.refBlockNum = 'you shall not pass!!!';
				await tx.sign(privateKey);
			} catch (err) {
			  	expect(err.message).to.equal('undefined is not a number');
			}
		});
		it('should fall, when use not safe number as refBlockNum value', async () => {
			const tx = new Transaction();
			try {
				tx.refBlockNum = 100000000000000;
				await tx.sign(privateKey);
			} catch (err) {
			  	expect(err.message).to.equal('number is not safe');
			}
		});
		it('should fall, when use not UInt32 as refBlockPrefix value', async () => {
			const tx = new Transaction();
			try {
				tx.refBlockPrefix = 'notPass';
				await tx.sign(privateKey);
			} catch (err) {
			  	expect(err.message).to.equal('invalid refBlockPrefix format');
			}
		});
	  	it('should fall, when use offline sign did not provide all needed data', async () => {
			const tx = new Transaction();
			const dynamicGlobalChainData = await echo.api.getObject(DYNAMIC_GLOBAL_OBJECT_ID, true);
			const privateKey = PrivateKey.fromWif(WIF);
			tx.addOperation(TRANSFER, options);
			tx.refBlockNum = dynamicGlobalChainData.head_block_number;
			try {
				await tx.sign(privateKey);
		  	} catch (err) {
				expect(err.message).to.equal('Api instance does not exist, check your connection');
		  	}
		});
		it('should succeeded, sing offline and broadcast', async () => {
			const tx = new Transaction();
			const dynamicGlobalChainData = await echo.api.getObject(DYNAMIC_GLOBAL_OBJECT_ID, true);
			const privateKey = PrivateKey.fromWif(WIF);
			tx.addOperation(TRANSFER, options);
		  	tx.addOperation(CONTRACT_CREATE, options2);
			tx.chainId = await echo.api.getChainId();
			tx.refBlockNum = dynamicGlobalChainData.head_block_number;
			tx.refBlockPrefix = dynamicGlobalChainData.head_block_id;
			await tx.sign(privateKey);
			// const result2 = await echo.api.broadcastTransactionWithCallback(tx);
			// console.log('result2', result2);
		});
  	});
  	describe('sing transaction online', () => {
		it('should fall, when try sing offline', async () => {
			const tx = new Transaction();
			const dynamicGlobalChainData = await echo.api.getObject(DYNAMIC_GLOBAL_OBJECT_ID, true);
			const privateKey = PrivateKey.fromWif(WIF);
			tx.addOperation(TRANSFER, options);
			tx.refBlockPrefix = dynamicGlobalChainData.head_block_id;
			try {
			  	await tx.sign(privateKey);
			} catch (err) {
			  	expect(err.message).to.equal('Api instance does not exist, check your connection');
			}
		});
	  	it('should succeeded, sing with provided data and get rest of needed data', async () => {
			const dynamicGlobalChainData = await echo.api.getObject(DYNAMIC_GLOBAL_OBJECT_ID, true);
			const privateKey = PrivateKey.fromWif(WIF);
			const tx = echo.createTransaction();
			tx.addOperation(TRANSFER, options);
			tx.refBlockPrefix = dynamicGlobalChainData.head_block_id;
			await tx.sign(privateKey);
		  	// await tx.broadcast();
	  	});
	})

});
