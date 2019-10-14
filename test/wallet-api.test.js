import { expect } from 'chai';

import echo, { constants } from '../src';
import { DEFAULT_CHAIN_APIS, ChainApi } from '../src/constants/ws-constants';

import {
	url,
	accountId,
	accountName,
	contractId,
	ED_PRIVATE,
	WIF,
	transaction,
	transaction2,
	walletURL
} from './_test-data';
import { deepStrictEqual, ok } from 'assert';
import { shouldReject } from './_test-utils';
import { API_CONFIG, DYNAMIC_GLOBAL_OBJECT_ID } from '../src/constants';
import { EXPIRATION_SECONDS } from '../src/constants/api-config';

describe('WALLET API', () => {

	const shouldDoBroadcastToNetwork = false;
	const brainKey = 'some key12';
	const walletFilename = '';
	// const amount = 1;
	const transactionTypeHandle = 1;
	const operation = ['get_object'];

	before(async () => {
		await echo.connect(null, { wallet: walletURL });
		await echo.walletApi.setPassword('qwe');
		await echo.walletApi.unlock('qwe');
	});
	after(async () => {
		await echo.disconnect();
	});
	describe('#about()', () => {
		it('should get wallet compile time info and client and dependencies versions', async () => {
			try {
				const result = await echo.walletApi.about();
				expect(result)
					.to
					.be
					.an('object');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	// describe('#info()', () => {
	// 	it('should get wallet info', async () => {
	// 		try {
	// 			const result = await echo.walletApi.info();
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	describe('#help()', () => {
		it('should get a multi-line string', async () => {
			try {
				const result = await echo.walletApi.help();
				expect(result)
					.to
					.be
					.an('string');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#helpMethod()', () => {
		it('should get detailed help on a single API command', async () => {
			try {
				const method = 'get_account_count';
				const result = await echo.walletApi.helpMethod(method);
				expect(result)
					.to
					.be
					.an('string');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#networkAddNodes()', () => {
		it('should add new nodes to network', async () => {
			try {
				const nodes = ["0.0.0.0:6311", "0.0.0.0:6311"];
				const result = await echo.walletApi.networkAddNodes(nodes);
				expect(result)
					.to
					.be
					.an('null');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#networkGetConnectedPeers()', () => {
		it('should get a array of connected peers', async () => {
			try {
				const result = await echo.walletApi.networkGetConnectedPeers();
				expect(result)
					.to
					.be
					.an('array');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#isNew()', () => {
		it('should get state of the wallet is it new or no', async () => {
			try {
				const result = await echo.walletApi.isNew();
				expect(result)
					.to
					.be
					.an('boolean');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#isLocked()', () => {
		it('should checks state of the wallet locked or unlocked', async () => {
			try {
				const result = await echo.walletApi.isLocked();
				expect(result)
					.to
					.be
					.an('boolean');
				// ok(!result);
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#lock()', () => {
		it('should lock the wallet', async () => {
			try {
				const shouldBeUnlocked = await echo.walletApi.isLocked();
				ok(!shouldBeUnlocked);
				await echo.walletApi.lock();
				const shouldBeLocked = await echo.walletApi.isLocked();
				ok(shouldBeLocked);
				await echo.walletApi.unlock('qwe');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#unlock()', () => {
		it('should unlock the wallet', async () => {
			try {
				await echo.walletApi.lock();
				const shouldBeLocked = await echo.walletApi.isLocked();
				ok(shouldBeLocked);
				await echo.walletApi.unlock('qwe');
				const shouldBeUnlocked = await echo.walletApi.isLocked();
				ok(!shouldBeUnlocked);
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#setPassword()', () => {
		it('should set new password', async () => {
			try {
				await echo.walletApi.setPassword('qweqwe');
				const shouldBeLocked = await echo.walletApi.isLocked();
				ok(shouldBeLocked);
				await echo.walletApi.unlock('qweqwe');
				const shouldBeUnlocked = await echo.walletApi.isLocked();
				ok(!shouldBeUnlocked);
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#createEddsaKeypair()', () => {
		it('should create new EdDSA keypair encoded in base58', async () => {
			try {
				const result = await echo.walletApi.createEddsaKeypair();
				expect(result)
					.to
					.be
					.an('array').that.is.not.empty;
				expect(result[0])
					.to
					.be
					.an('string');
				expect(result[1])
					.to
					.be
					.a('string');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#dumpPrivateKeys()', () => {
		it('should dumps all private keys owned by the wallet', async () => {
			try {
				const result = await echo.walletApi.dumpPrivateKeys();
				expect(result)
					.to
					.be
					.an('array');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#oldKeyToWif()', () => {
		it('Should dumps private key from old b58 format to new WIF', async () => {
			try {
				const result = await echo.walletApi.oldKeyToWif(ED_PRIVATE);
				expect(result)
					.to
					.be
					.an('string');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	// describe('#importKey()', () => {
	// 	it('Should imports the private key for an existing account', async () => {
	// 		try {
	// 			const result = await echo.walletApi.importKey('1.2.11', '5JLi3M4H9qY3FMTyGW9TCC92ebbqNo36sUHwJqpKxvJMWN2XwbH');
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('array');
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#importAccounts()', () => {
	// 	it('Should imports accounts to chosen filename', async () => {
	// 		try {
	// 			const filename = 'filename';
	// 			const password = 'password';
	// 			const result = await echo.walletApi.importAccounts(filename, password);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('boolean');
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#importAccountKeys()', () => {
	// 	it('Should imports accounts keys to chosen filename', async () => {
	// 		try {
	// 			const filename = 'filename';
	// 			const password = 'password';
	// 			const result = await echo.walletApi.importAccountKeys(filename, password, accountId, accountId);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('boolean');
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#importBalance()', () => {
	// 	it('should construct transaction', async () => {
	// 		try {
	// 			const wifKeys = [WIF];
	// 			const result = await echo.walletApi.importBalance(accountId, shouldDoBroadcastToNetwork, wifKeys);
	// 			console.log('result', result);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	describe('#suggestBrainKey()', () => {
		it('should suggests a safe brain key', async () => {
			try {
				const result = await echo.walletApi.suggestBrainKey();
				expect(result)
					.to
					.be
					.an('object').that.is.not.empty;
				expect(result.brain_key)
					.to
					.be
					.a('string');
				expect(result.active_priv_key)
					.to
					.be
					.a('string');
				expect(result.active_pub_key)
					.to
					.be
					.a('string');
				expect(result.echorand_priv_key)
					.to
					.be
					.a('string');
				expect(result.echorand_pub_key)
					.to
					.be
					.a('string');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#deriveKeysFromBrainKey()', () => {
		it('should suggests a safe brain key', async () => {
			try {
				const numberOfDesiredKeys = 1;
				const result = await echo.walletApi.deriveKeysFromBrainKey(brainKey, numberOfDesiredKeys);
				expect(result)
					.to
					.be
					.an('array').that.is.not.empty;
				expect(result[0])
					.to
					.be
					.an('object').that.is.not.empty;
				expect(result[0].brain_key)
					.to
					.be
					.a('string');
				expect(result[0].active_priv_key)
					.to
					.be
					.a('string');
				expect(result[0].active_pub_key)
					.to
					.be
					.a('string');
				expect(result[0].echorand_priv_key)
					.to
					.be
					.a('string');
				expect(result[0].echorand_pub_key)
					.to
					.be
					.a('string');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#isPublicKeyRegistered()', () => {
		it('should determine is key linked to any registered account', async () => {
			try {
				const pubKey = 'ECHOBMZ6kgpeij9zWpAXxQHkRRrQzVf7DmKnX8rQJxBtcMrs';
				const result = await echo.walletApi.isPublicKeyRegistered(pubKey);
				expect(result)
					.to
					.be
					.an('boolean');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe.skip('#getTransactionId()', () => {
		it('should get transactin ID', async () => {
			try {
				const result = await echo.walletApi.getTransactionId(transaction);
				expect(result)
					.to
					.be
					.an('string');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	// describe('#getPrivateKey()', () => {
	// 	it('should get the WIF private key', async () => {
	// 		try {
	// 			const pubKey = 'ECHOGCNquQJ6PsbqWts9Hwdea6GdAsfyTfJDq2r6BZbkMcNo';
	// 			const result = await echo.walletApi.getPrivateKey(pubKey);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('string');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	describe('#loadWalletFile()', () => {
		it('should loads a specified wallet', async () => {
			try {
				const result = await echo.walletApi.loadWalletFile(walletFilename);
				expect(result)
					.to
					.be
					.an('boolean');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#normalizeBrainKey()', () => {
		it('should transforms a brain key', async () => {
			try {
				const result = await echo.walletApi.normalizeBrainKey(brainKey);
				expect(result)
					.to
					.be
					.an('string');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#saveWalletFile()', () => {
		it('should saves the current wallet to the given filename', async () => {
			try {
				const result = await echo.walletApi.saveWalletFile(walletFilename);
				expect(result)
					.to
					.be
					.an('null');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#listMyAccounts()', () => {
		it('should get lists all accounts controlled by this wallet', async () => {
			try {
				const result = await echo.walletApi.listMyAccounts();
				expect(result)
					.to
					.be
					.an('array');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#listAccounts()', () => {
		it('should get lists all accounts registered in the blockchain', async () => {
			try {
				const result = await echo.walletApi.listAccounts(
					accountName,
					constants.API_CONFIG.LIST_ACCOUNTS_DEFAULT_LIMIT
				);
				expect(result)
					.to
					.be
					.an('array').that.is.not.empty;
				expect(result[0])
					.to
					.be
					.an('array').that.is.not.empty;
				expect(result[0][0])
					.to
					.be
					.an('string').that.is.not.empty;
				expect(result[0][1])
					.to
					.be
					.an('string');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#listAccountBalances()', () => {
		it('should get list the balances of an account', async () => {
			try {
				const result = await echo.walletApi.listAccountBalances(accountId);
				expect(result)
					.to
					.be
					.an('array').that.is.not.empty;
				expect(result[0])
					.to
					.be
					.an('object').that.is.not.empty;
				expect(result[0].amount)
					.to
					.be
					.an('string');
				expect(result[0].asset_id)
					.to
					.be
					.an('string');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#listIdBalances()', () => {
		it('should get list the balances of an account', async () => {
			try {
				const result = await echo.walletApi.listIdBalances(accountId);
				expect(result)
					.to
					.be
					.an('array').that.is.not.empty;
				expect(result[0])
					.to
					.be
					.an('object').that.is.not.empty;
				expect(result[0].amount)
					.to
					.be
					.an('string');
				expect(result[0].asset_id)
					.to
					.be
					.an('string');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	// describe('#registerAccount()', () => {
	// 	it('should registers an account', async () => {
	// 		try {
	// 			const accountName = 'newName';
	// 			const activeKey = 'ECHOBcDxkvsGKsbRu2ZhaqXtKAGvoT32DH3XK6J2eYk8JMtC';
	// 			const result = await echo.walletApi.registerAccount(
	// 				accountName,
	// 				activeKey,
	// 				accountId,
	// 				shouldDoBroadcastToNetwork
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object').that.is.not.empty;
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#createAccountWithBrainKey()', () => {
	// 	it('should creates a new account and registers it', async () => {
	// 		try {
	// 			const accountName = 'testName';
	// 			const result = await echo.walletApi.createAccountWithBrainKey(
	// 				brainKey,
	// 				accountName,
	// 				accountId,
	// 				shouldDoBroadcastToNetwork
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object').that.is.not.empty;
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#createContract()', () => {
	// 	it('should creates a contract', async () => {
	// 		try {
	// 			const contractCode = 'contractCode';
	// 			const amount = 1;
	// 			const assetType = 'assetType';
	// 			const supportedAssetId = '';
	// 			const useEthereumAssetAccuracy = false;
	// 			const shouldSaveToWallet = false;
	//
	// 			const result = await echo.walletApi.createContract(
	// 				accountId,
	// 				contractCode,
	// 				amount,
	// 				assetType,
	// 				supportedAssetId,
	// 				useEthereumAssetAccuracy,
	// 				shouldSaveToWallet,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object').that.is.not.empty;
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#callContract()', () => {
	// 	it('should call a contract', async () => {
	// 		try {
	// 			const contractCode = 'contractCode';
	// 			const amount = 1;
	// 			const assetType = 'assetType';
	// 			const shouldSaveToWallet = false;
	//
	// 			const result = await echo.walletApi.callContract(
	// 				accountName,
	// 				contractId,
	// 				contractCode,
	// 				amount,
	// 				assetType,
	// 				shouldSaveToWallet,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object').that.is.not.empty;
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#contractFundFeePool()', () => {
	// 	it('should get fund fee pool of contract', async () => {
	// 		try {
	// 			const amount = 1;
	//
	// 			const result = await echo.walletApi.contractFundFeePool(
	// 				accountName,
	// 				contractId,
	// 				amount,
	// 				shouldDoBroadcastToNetwork,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object').that.is.not.empty;
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#getContractResult()', () => {
	// 	it('should get the result of contract execution', async () => {
	// 		try {
	// 			const result = await echo.walletApi.getContractResult(contractId);
	// 			console.log('------------result---------', result);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object').that.is.not.empty;
	// 		} catch (e) {
	// 			console.log(e);
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#transfer()', () => {
	// 	it('should do transfer an amount from one account to another', async () => {
	// 		try {
	// 			const amount = 1;
	//
	// 			const result = await echo.walletApi.transfer(
	// 				accountId,
	// 				accountId,
	// 				amount,
	// 				constants.ECHO_ASSET_ID,
	// 				shouldDoBroadcastToNetwork,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object').that.is.not.empty;
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#transfer2()', () => {
	// 	it('should do transfer an amount from one account to another', async () => {
	// 		try {
	// 			const amount = 1;
	//
	// 			const result = await echo.walletApi.transfer2(
	// 				accountId,
	// 				accountId,
	// 				amount,
	// 				constants.ECHO_ASSET_ID,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object').that.is.not.empty;
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#whitelistAccount()', () => {
	// 	it('should whitelist accounts, primarily for transacting in whitelisted assets', async () => {
	// 		try {
	// 			const newListingStatus = 'white_listed';
	//
	// 			const result = await echo.walletApi.whitelistAccount(
	// 				accountId,
	// 				accountId,
	// 				newListingStatus,
	// 				shouldDoBroadcastToNetwork,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object').that.is.not.empty;
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	describe('#getVestingBalances()', () => {
		it('Should get information about a vesting balance object', async () => {
			try {
				const result = await echo.walletApi.getVestingBalances(accountId);
				expect(result)
					.to
					.be
					.an('array');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	// describe('#withdrawVesting()', () => {
	// 	it('Should make withdraw a vesting balance', async () => {
	// 		try {
	// 			const assetSymbol = 'assetSymbol';
	// 			const result = await echo.walletApi.withdrawVesting(
	// 				accountId,
	// 				amount,
	// 				assetSymbol,
	// 				shouldDoBroadcastToNetwork,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#getAccount()', () => {
	// 	it('Should returns information about the given account', async () => {
	// 		try {
	// 			const result = await echo.walletApi.getAccount(accountId);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#getAccountId()', () => {
	// 	it('Should returns the id of a named account', async () => {
	// 		try {
	// 			const result = await echo.walletApi.getAccountId(accountName);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('string');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#getAccountHistory()', () => {
	// 	it('Should returns the most recent operations on the named account', async () => {
	// 		try {
	// 			const result = await echo.walletApi.getAccountHistory(
	// 				accountName,
	// 				constants.API_CONFIG.ACCOUNT_HISTORY_DEFAULT_LIMIT
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('array').that.is.not.empty;
	// 			expect(result[0])
	// 				.to
	// 				.be
	// 				.an('object').that.is.not.empty;
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#getRelativeAccountHistory()', () => {
	// 	it('Should returns the relative operations on the named account from start number', async () => {
	// 		try {
	// 			const stop = API_CONFIG.RELATIVE_ACCOUNT_HISTORY_STOP;
	// 			const limit = API_CONFIG.RELATIVE_ACCOUNT_HISTORY_DEFAULT_LIMIT;
	// 			const start = API_CONFIG.RELATIVE_ACCOUNT_HISTORY_START;
	// 			const result = await echo.walletApi.getRelativeAccountHistory(accountId, stop, limit, start);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('array').that.is.not.empty;
	// 			expect(result[0])
	// 				.to
	// 				.be
	// 				.an('object').that.is.not.empty;
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#getContractObject()', () => {
	// 	it('Should get the contract object by it\'s id', async () => {
	// 		try {
	// 			const result = await echo.walletApi.getContractObject(contractId);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#getContract()', () => {
	// 	it('Should get the contract information by the contract\'s id', async () => {
	// 		try {
	// 			const result = await echo.walletApi.getContract(contractId);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#whitelistContractPool()', () => {
	// 	it('Should whitelist or blacklist contract pool', async () => {
	// 		try {
	// 			const addToWhitelist = ['1.2.0', '1.2.1'];
	// 			const addToBlacklist = ['1.2.2', '1.2.3'];
	// 			const removeFromWhitelist = ['1.2.1'];
	// 			const removeFromBlacklist = ['1.2.3'];
	// 			const result = await echo.walletApi.whitelistContractPool(
	// 				accountId,
	// 				contractId,
	// 				addToWhitelist,
	// 				addToBlacklist,
	// 				removeFromWhitelist,
	// 				removeFromBlacklist,
	// 				shouldDoBroadcastToNetwork,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#callContractNoChangingState()', () => {
	// 	it('Should call contract but doesn\'t change the state', async () => {
	// 		try {
	// 			const assetType = 'assetType';
	// 			const codeOfTheContract = 'codeOfTheContract';
	// 			const result = await echo.walletApi.callContractNoChangingState(
	// 				contractId,
	// 				accountId,
	// 				assetType,
	// 				codeOfTheContract,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('string');
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#getContractPoolBalance()', () => {
	// 	it('Should get contract\'s fee pool balance', async () => {
	// 		try {
	// 			const result = await echo.walletApi.getContractPoolBalance(contractId);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#getContractPoolWhitelist()', () => {
	// 	it('Should get contract\'s whitelist and blacklist', async () => {
	// 		try {
	// 			const result = await echo.walletApi.getContractPoolWhitelist(contractId);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('array');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	describe('#getEthAddress()', () => {
		it('Should returns information about generated eth address', async () => {
			try {
				const result = await echo.walletApi.getEthAddress(accountId);
				// expect(result)
				// 	.to
				// 	.be
				// 	.an('object');
				// console.log('result', result);
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#getAccountDeposits()', () => {
		it('Should returns all approved deposits, for the given account id', async () => {
			try {
				const result = await echo.walletApi.getAccountDeposits(accountId);
				// expect(result)
				// 	.to
				// 	.be
				// 	.an('object');
				// console.log('result', result);
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	// describe('#registerErc20Token()', () => {
	// 	it('Should creates a transaction to register erc20_token', async () => {
	// 		try {
	// 			const ethereumTokenAddress = 'f7d2658685b4efa75976645374f2bc27f714ed03';
	// 			const tokenName = 'TradeForYou-S';
	// 			const tokenSymbol = 'TFYS';
	// 			const decimals = 0;
	// 			const result = await echo.walletApi.registerErc20Token(
	// 				accountId,
	// 				ethereumTokenAddress,
	// 				tokenName,
	// 				tokenSymbol,
	// 				decimals,
	// 				shouldDoBroadcastToNetwork,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	describe('#getErc20Token()', () => {
		it('Should returns information about erc20 token', async () => {
			try {
				const ethereumTokenAddress = '9a1348ebe10f1ae4461fcb885d8cba8260757957';
				const result = await echo.walletApi.getErc20Token(ethereumTokenAddress);
				// expect(result)
				// 	.to
				// 	.be
				// 	.an('object');
				// console.log('result', result);
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#getErc20AccountDeposits()', () => {
		it('Should returns all approved deposits, for the given account id', async () => {
			try {
				const result = await echo.walletApi.getErc20AccountDeposits(accountId);
				expect(result)
					.to
					.be
					.an('array');
				// expect(result[0])
				// 	.to
				// 	.be
				// 	.an('object');
				// console.log('result', result);
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#getErc20AccountWithdrawals()', () => {
		it('Should returns all approved withdrawals, for the given account id', async () => {
			try {
				const result = await echo.walletApi.getErc20AccountWithdrawals(accountId);
				expect(result)
					.to
					.be
					.an('array');
				// expect(result[0])
				// 	.to
				// 	.be
				// 	.an('object');
				// console.log('result', result);
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	// describe('#withdrawErc20Token()', () => {
	// 	it('Should creates a transaction to withdraw erc20_token', async () => {
	// 		try {
	// 			const toEthereumAddress = 'f54a5851e9372b87810a8e60cdd2e7cfd80b6e31';
	// 			const erc20TokenId = 'f7d2658685b4efa75976645374f2bc27f714ed03';
	// 			const withdrawAmount = '1';
	// 			const result = await echo.walletApi.withdrawErc20Token(
	// 				accountId,
	// 				toEthereumAddress,
	// 				erc20TokenId,
	// 				withdrawAmount,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#generateAccountAddress()', () => {
	// 	it('Should generate account address', async () => {
	// 		try {
	// 			const label = 'label';
	// 			const result = await echo.walletApi.generateAccountAddress(
	// 				accountId,
	// 				label,
	// 				shouldDoBroadcastToNetwork,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	describe('#getAccountAddresses()', () => {
		it('Should get addresses of current account', async () => {
			try {
				const start = 0;
				const limit = 10;
				const result = await echo.walletApi.getAccountAddresses(accountId, start, limit);
				expect(result)
					.to
					.be
					.an('array');
				// expect(result[0])
				// 	.to
				// 	.be
				// 	.an('object');
				// console.log('result', result);
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#getAccountByAddress()', () => {
		it('Should get owner of specified address', async () => {
			try {
				const address = 'f54a5851e9372b87810a8e60cdd2e7cfd80b6e31';
				const result = await echo.walletApi.getAccountByAddress(address);
				// expect(result)
				// 	.to
				// 	.be
				// 	.an('string');
				// console.log('result', result);
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#getAccountWithdrawals()', () => {
		it('Should returns all approved withdrawals, for the given account id', async () => {
			try {
				const result = await echo.walletApi.getAccountWithdrawals(accountId);
				expect(result)
					.to
					.be
					.an('array');
				// expect(result[0])
				// 	.to
				// 	.be
				// 	.an('object');
				// console.log('result', result);
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	// describe('#approveProposal()', () => {
	// 	it('Should approve a proposal', async () => {
	// 		try {
	// 			const proposalId = 'proposalId';
	// 			const delta = {};
	// 			const result = await echo.walletApi.approveProposal(
	// 				accountId,
	// 				proposalId,
	// 				delta,
	// 				shouldDoBroadcastToNetwork,
	// 				);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#generateEthAddress()', () => {
	// 	it('Should generate eth address', async () => {
	// 		try {
	// 			const result = await echo.walletApi.generateEthAddress(accountId, shouldDoBroadcastToNetwork);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#withdrawEth()', () => {
	// 	it('Should withdraw eth from address', async () => {
	// 		try {
	// 			const ethAddress = 'f54a5851e9372b87810a8e60cdd2e7cfd80b6e31';
	// 			const value = 1;
	// 			const result = await echo.walletApi.withdrawEth(
	// 				accountId,
	// 				ethAddress,
	// 				value,
	// 				shouldDoBroadcastToNetwork,
	// 				);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });
	//TODO: rm floodNetwork method
	describe.skip('#floodNetwork()', () => {
		it('What Should this do?', async () => {
			try {
				const prefix = 'prefix';
				const numberOfTransactions = 1;
				const result = await echo.walletApi.floodNetwork(prefix, numberOfTransactions);
				expect(result)
					.to
					.be
					.an('null');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#listAssets()', () => {
		it('Should get lists of all assets registered', async () => {
			try {
				const lowerBoundSymbol = 'TFYS';
				const result = await echo.walletApi.listAssets(
					lowerBoundSymbol,
					constants.API_CONFIG.LIST_ASSETS_MAX_LIMIT
				);
				expect(result)
					.to
					.be
					.an('array');
				// expect(result)
				// 	.to
				// 	.be
				// 	.an('object');
				// console.log('result', result);
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	// describe('#createAsset()', () => {
	// 	it('Should creates a new user-issued or market-issued asset', async () => {
	// 		try {
	// 			const symbol = 'TFYS';
	// 			const precision = 0;
	// 			const assetOption = {};
	// 			const bitassetOpts = {};
	// 			const result = await echo.walletApi.createAsset(
	// 				accountId,
	// 				symbol,
	// 				precision,
	// 				assetOption,
	// 				bitassetOpts,
	// 				shouldDoBroadcastToNetwork,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#updateAsset()', () => {
	// 	it('Should update the core options on an asset', async () => {
	// 		try {
	// 			const newOptions = {};
	// 			const result = await echo.walletApi.updateAsset(
	// 				constants.ECHO_ASSET_ID,
	// 				accountId,
	// 				newOptions,
	// 				shouldDoBroadcastToNetwork,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#updateBitasset()', () => {
	// 	it('Should update the options specific to a BitAsset', async () => {
	// 		try {
	// 			const newBitasset = {};
	// 			const result = await echo.walletApi.updateBitasset(
	// 				constants.ECHO_ASSET_ID,
	// 				accountId,
	// 				newBitasset,
	// 				shouldDoBroadcastToNetwork,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#updateAssetFeedProducers()', () => {
	// 	it('Should update the set of feed-producing accounts for a BitAsset', async () => {
	// 		try {
	// 			const newFeedProducers = ['newFeedProducers'];
	// 			const result = await echo.walletApi.updateAssetFeedProducers(
	// 				constants.ECHO_ASSET_ID,
	// 				newFeedProducers,
	// 				shouldDoBroadcastToNetwork,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#publishAssetFeed()', () => {
	// 	it('Should publishes a price feed for the named asset', async () => {
	// 		try {
	// 			const priceFeed = {};
	// 			const result = await echo.walletApi.publishAssetFeed(
	// 				accountId,
	// 				constants.ECHO_ASSET_ID,
	// 				priceFeed,
	// 				shouldDoBroadcastToNetwork,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#issueAsset()', () => {
	// 	it('Should do issue new shares of an asset', async () => {
	// 		try {
	// 			const amount = '1';
	// 			const assetTicker = 'assetTicker';
	// 			const result = await echo.walletApi.issueAsset(
	// 				accountId,
	// 				amount,
	// 				assetTicker,
	// 				shouldDoBroadcastToNetwork,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#getAsset()', () => {
	// 	it('Should returns information about the given asset', async () => {
	// 		try {
	// 			const result = await echo.walletApi.getAsset(constants.ECHO_ASSET_ID);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#getBitassetData()', () => {
	// 	it('Should returns the BitAsset-specific data for a given asset', async () => {
	// 		try {
	// 			const bitasset = '2.4.0';
	// 			const result = await echo.walletApi.getBitassetData(bitasset);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#fundAssetFeePool()', () => {
	// 	it('Should pay into the fee pool for the given asset', async () => {
	// 		try {
	// 			const amount = '1';
	// 			const result = await echo.walletApi.fundAssetFeePool(
	// 				accountId,
	// 				constants.ECHO_ASSET_ID,
	// 				amount,
	// 				shouldDoBroadcastToNetwork,
	// 				);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#reserveAsset()', () => {
	// 	it('Should burns the given user-issued asset', async () => {
	// 		try {
	// 			const amount = '1';
	// 			const result = await echo.walletApi.reserveAsset(
	// 				accountId,
	// 				amount,
	// 				constants.ECHO_ASSET_ID,
	// 				shouldDoBroadcastToNetwork,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#createCommitteeMember()', () => {
	// 	it('Should creates a committee_member object owned by the given account', async () => {
	// 		try {
	// 			const url = 'URL';
	// 			const result = await echo.walletApi.createCommitteeMember(
	// 				accountId,
	// 				url,
	// 				shouldDoBroadcastToNetwork,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#setDesiredCommitteeMemberCount()', () => {
	// 	it('Should set your vote for the number of committee_members', async () => {
	// 		try {
	// 			const desiredNumberOfCommitteeMembers = 2;
	// 			const result = await echo.walletApi.setDesiredCommitteeMemberCount(
	// 				accountId,
	// 				desiredNumberOfCommitteeMembers,
	// 				shouldDoBroadcastToNetwork,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#getCommitteeMember()', () => {
	// 	it('Should returns information about the given committee_member', async () => {
	// 		try {
	// 			const result = await echo.walletApi.getCommitteeMember(accountId);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#listCommitteeMembers()', () => {
	// 	it('Should returns lists all committee_members', async () => {
	// 		try {
	// 			const lowerBoundName = 'lowerBoundName';
	// 			const result = await echo.walletApi.listCommitteeMembers(
	// 				lowerBoundName,
	// 				constants.API_CONFIG.COMMITTEE_MEMBER_ACCOUNTS_DEFAULT_LIMIT,
	// 				);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('array').that.is.not.empty;
	// 			expect(result[0])
	// 				.to
	// 				.be
	// 				.an('object').that.is.not.empty;
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#voteForCommitteeMember()', () => {
	// 	it('Should vote for a given committee_member', async () => {
	// 		try {
	// 			const approveYourVote = true;
	// 			const result = await echo.walletApi.voteForCommitteeMember(
	// 				accountName,
	// 				accountId,
	// 				approveYourVote,
	// 				shouldDoBroadcastToNetwork,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object').that.is.not.empty;
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#setVotingProxy()', () => {
	// 	it('Should set the voting proxy for an account', async () => {
	// 		try {
	// 			const result = await echo.walletApi.setVotingProxy(
	// 				accountName,
	// 				accountId,
	// 				shouldDoBroadcastToNetwork,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object').that.is.not.empty;
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#proposeParameterChange()', () => {
	// 	it('Should creates a transaction to propose a parameter change', async () => {
	// 		try {
	// 			const date = new Date(2019,9,5);
	// 			const expirationTime = date.toString();
	// 			const javaScriptRelease = Date.parse('04 Dec 2019 00:12:00 GMT');
	// 			const changedValues = {};
	// 			console.log(javaScriptRelease);
	// 			const result = await echo.walletApi.proposeParameterChange(
	// 				accountId,
	// 				javaScriptRelease,
	// 				changedValues,
	// 				shouldDoBroadcastToNetwork,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object').that.is.not.empty;
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe.only('#proposeFeeChange()', () => {
	// 	it('Should propose a fee change', async () => {
	// 		try {
	//
	// 			const headBlockTimeSeconds = Math.ceil(new Date('2019-09-04T07:05:25').getTime() / 1000);
	// 			const expirationTime = Math.ceil((Date.now()  / 1000));
	// 			const expiration = headBlockTimeSeconds + EXPIRATION_SECONDS;
	// 			console.log(expiration);
	// 			const changedValues = {};
	// 			console.log(headBlockTimeSeconds + '       ' + expirationTime);
	// 			const result = await echo.walletApi.proposeFeeChange(
	// 				accountId,
	// 				expirationTime,
	// 				changedValues,
	// 				shouldDoBroadcastToNetwork,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object').that.is.not.empty;
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#changeSidechainConfig()', () => {
	// 	it('Should change sidechain config', async () => {
	// 		try {
	// 			const changedValues = {};
	// 			const result = await echo.walletApi.changeSidechainConfig(
	// 				accountId,
	// 				changedValues,
	// 				shouldDoBroadcastToNetwork,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object').that.is.not.empty;
	// 			console.log('result', result);
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe.only('#getBlock()', () => {
	// 	it('should get block by number', async () => {
	// 		try {
	// 			const blockNumber = 1;
	// 			const result = await echo.walletApi.getBlock(blockNumber);
	// 			console.log('------------result---------', result);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object').that.is.not.empty;
	// 		} catch (e) {
	// 			console.log(e);
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	describe('#getBlockVirtualOps()', () => {
		it('should get block virtual ops by number', async () => {
			try {
				const blockNumber = 1;
				const result = await echo.walletApi.getBlockVirtualOps(blockNumber);
				expect(result)
					.to
					.be
					.an('array')/*.that.is.not.empty;
				expect(result)
					.to
					.be
					.an('object').that.is.not.empty;*/
			} catch (e) {
				console.log(e);
				throw e;
			}
		}).timeout(5000);
	});

	describe('#getAccountCount()', () => {
		it('should returns the number of registered accounts', async () => {
			try {
				const result = await echo.walletApi.getAccountCount();
				expect(result)
					.to
					.be
					.an('number')
			} catch (e) {
				console.log(e);
				throw e;
			}
		}).timeout(5000);
	});

	// describe('#getGlobalProperties()', () => {
	// 	it('should returns the number of registered accounts', async () => {
	// 		try {
	// 			const result = await echo.walletApi.getGlobalProperties();
	// 			console.log('------------result---------', result);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object')
	// 		} catch (e) {
	// 			console.log(e);
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	describe('#getDynamicGlobalProperties()', () => {
		it('should returns the block chain\'s slowly-changing settings', async () => {
			try {
				const result = await echo.walletApi.getDynamicGlobalProperties();
				expect(result)
					.to
					.be
					.an('object').that.is.not.empty;
			} catch (e) {
				console.log(e);
				throw e;
			}
		}).timeout(5000);
	});

	describe('#getObject()', () => {
		it('should returns the blockchain object', async () => {
			try {
				const result = await echo.walletApi.getObject(accountId);
				expect(result)
					.to
					.be
					.an('array').that.is.not.empty;
				expect(result[0])
					.to
					.be
					.an('object').that.is.not.empty;
			} catch (e) {
				console.log(e);
				throw e;
			}
		}).timeout(5000);
	});

	describe('#beginBuilderTransaction()', () => {
		it('should returns number of built transaction', async () => {
			try {
				const result = await echo.walletApi.beginBuilderTransaction();
				expect(result)
					.to
					.be
					.an('number');
			} catch (e) {
				console.log(e);
				throw e;
			}
		}).timeout(5000);
	});

	// describe('#addOperationToBuilderTransaction()', () => {
	// 	it('should add operations to builder transaction', async () => {
	// 		try {
	// 			const result = await echo.walletApi.addOperationToBuilderTransaction(transactionTypeHandle, operation);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('null');
	// 		} catch (e) {
	// 			console.log(e);
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#replaceOperationInBuilderTransaction()', () => {
	// 	it('should replace operations in builder transaction', async () => {
	// 		try {
	// 			const unsignedOperation = 0;
	// 			const result = await echo.walletApi.replaceOperationInBuilderTransaction(
	// 				transactionTypeHandle,
	// 				unsignedOperation,
	// 				operation,
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('null');
	// 		} catch (e) {
	// 			console.log(e);
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#setFeesOnBuilderTransaction()', () => {
	// 	it('should set fees on builder transaction', async () => {
	// 		try {
	// 			const feeAsset = 'ECHO_SYMBOL';
	// 			const result = await echo.walletApi.setFeesOnBuilderTransaction(transactionTypeHandle, feeAsset);
	// 			console.log('------------result---------', result);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('null');
	// 		} catch (e) {
	// 			console.log(e);
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#previewBuilderTransaction()', () => {
	// 	it('should get preview of builder transaction', async () => {
	// 		try {
	// 			const result = await echo.walletApi.previewBuilderTransaction(transactionTypeHandle);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object').that.is.not.empty;
	// 		} catch (e) {
	// 			console.log(e);
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#signBuilderTransaction()', () => {
	// 	it('should get sing transaction', async () => {
	// 		try {
	// 			const result = await echo.walletApi.signBuilderTransaction(
	// 				transactionTypeHandle,
	// 				shouldDoBroadcastToNetwork
	// 			);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object').that.is.not.empty;
	// 		} catch (e) {
	// 			console.log(e);
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#proposeBuilderTransaction()', () => {
	// 	it('should get sing transaction', async () => {
	// 		try {
	// 			const date = new Date(2019,9,5);
	// 			const expirationTime = date.toString();
	// 			const javaScriptRelease = Date.parse('04 Dec 2019 00:12:00 GMT');
	// 			const changedValues = {};
	// 			const date1 = Date.now() + 60000;
	// 			const reviewPeriod = 60000;
	// 			console.log(date1);
	// 			const result = await echo.walletApi.proposeBuilderTransaction(
	// 				transactionTypeHandle,
	// 				date1,
	// 				reviewPeriod,
	// 				shouldDoBroadcastToNetwork,
	// 			);
	// 			console.log('------------result---------', result);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object').that.is.not.empty;
	// 		} catch (e) {
	// 			console.log(e);
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	// describe('#proposeBuilderTransaction2()', () => {
	// 	it('should get sing transaction', async () => {
	// 		try {
	// 			const date = new Date(2019,9,5);
	// 			const expirationTime = date.toString();
	// 			const javaScriptRelease = Date.parse('04 Dec 2019 00:12:00 GMT');
	// 			const changedValues = {};
	// 			const date1 = Date.now() + 60000;
	// 			const reviewPeriod = 60000;
	// 			console.log(date1);
	// 			const result = await echo.walletApi.proposeBuilderTransaction2(
	// 				transactionTypeHandle,
	// 				accountId,
	// 				date1,
	// 				reviewPeriod,
	// 				shouldDoBroadcastToNetwork,
	// 			);
	// 			console.log('------------result---------', result);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object').that.is.not.empty;
	// 		} catch (e) {
	// 			console.log(e);
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	describe('#removeBuilderTransaction()', () => {
		it('should get sing transaction', async () => {
			try {
				const result = await echo.walletApi.removeBuilderTransaction(transactionTypeHandle);
				expect(result)
					.to
					.be
					.an('null');
			} catch (e) {
				console.log(e);
				throw e;
			}
		}).timeout(5000);
	});

	describe.skip('#serializeTransaction()', () => {
		it('should get serialize transaction', async () => {
			try {
				const result = await echo.walletApi.serializeTransaction(transaction);
				expect(result)
					.to
					.be
					.an('string');
			} catch (e) {
				console.log(e);
				throw e;
			}
		}).timeout(5000);
	});

	// describe('#signTransaction()', () => {
	// 	it('should get sing transaction', async () => {
	// 		try {
	// 			const result = await echo.walletApi.signTransaction(transaction2/*{}*/, shouldDoBroadcastToNetwork);
	// 			expect(result)
	// 				.to
	// 				.be
	// 				.an('object');
	// 		} catch (e) {
	// 			console.log(e);
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

	describe('#getPrototypeOperation()', () => {
		it('should returns an uninitialized object representing a given blockchain operation', async () => {
			try {
				const operationType = 'transfer_operation';
				const result = await echo.walletApi.getPrototypeOperation(operationType);
				expect(result)
					.to
					.be
					.an('array').that.is.not.empty;
				expect(result[1])
					.to
					.be
					.an('object').that.is.not.empty;
				expect(result[1].fee)
					.to
					.be
					.an('object').that.is.not.empty;
				expect(result[1].from)
					.to
					.be
					.an('string');
				expect(result[1].to)
					.to
					.be
					.an('string');
				expect(result[1].amount)
					.to
					.be
					.an('object').that.is.not.empty;
				expect(result[1].extensions)
					.to
					.be
					.an('array');
			} catch (e) {
				console.log(e);
				throw e;
			}
		}).timeout(5000);
	});

	describe('#registerAccountWithProof()', () => {
		it('should create account without errors', async () => {
			try {
				const name = `cookiezi-${Date.now()}`;
				const pubKey = 'ECHOBMZ6kgpeij9zWpAXxQHkRRrQzVf7DmKnX8rQJxBtcMrs';

				await echo.walletApi.registerAccountWithProof(name, pubKey, pubKey);
			} catch(e) {
				console.log(e);
				throw e;
			}
		}).timeout(5000);
	});

	describe('#freezeBalance()', () => {
		it('should freeze balance', async () => {
			try {
				const amount = 1000;
				const asset = '1.3.0';
				const duration = 10000;
				const isBroadcast = false;

				const result = await echo.walletApi.freezeBalance(accountId, amount, asset, duration, isBroadcast);
				expect(result)
					.to
					.be
					.an('object').that.is.not.empty;	
			} catch (e) {
				console.log(e);
				throw e;
			}
		}).timeout(5000);
	});

	describe('#listFrozenBalances()', () => {
		it('should return list of frozen balances', async () => {
			try {
				const result = await echo.walletApi.listFrozenBalances(accountId);
				expect(result)
					.to
					.be
					.an('array').that.is.not.empty;
				expect(result[0])
					.to
					.be
					.an('object').that.is.not.empty;
				expect(result[0].id)
					.to
					.be
					.an('string').that.is.not.empty;
				expect(result[0].owner)
					.to
					.be
					.an('string');
				expect(result[0].balance)
					.to
					.be
					.an('object').that.is.not.empty;
				expect(result[0].multiplier)
					.to
					.be
					.an('number');
				expect(result[0].unfreeze_time)
					.to
					.be
					.an('string').that.is.not.empty;
				expect(result[0].extensions)
					.to
					.be
					.an('array');	
			} catch (e) {
				console.log(e);
				throw e;
			}
		}).timeout(5000);
	});



	// describe('#exit()', () => {
	// 	it('should exit from wallet', async () => {
	// 		try {
	// 			await echo.walletApi.exit();
	// 		} catch (e) {
	// 			throw e;
	// 		}
	// 	}).timeout(5000);
	// });

});
