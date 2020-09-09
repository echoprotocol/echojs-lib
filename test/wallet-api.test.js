import { inspect, promisify } from "util";
import { expect } from 'chai';

import echo, { constants } from '../src';

import {
	url,
	accountId,
	accountName,
	contractId,
	ED_PRIVATE,
	WIF,
	walletURL,
} from './_test-data';
import { ACCOUNT, ASSET, COMMITTEE_MEMBER} from '../src/constants/object-types';
import { ok } from 'assert';
import { API_CONFIG } from '../src/constants';
import { TRANSFER } from '../src/constants/operations-ids';
import PrivateKey from '../src/crypto/private-key';
import { bytecode } from './operations/_contract.test';

describe('WALLET API', () => {

	const shouldDoBroadcastToNetwork = false;
	const brainKey = 'some key12';
	let contractResultId;

	const assetOption = {
		max_supply: 1,
		issuer_permissions: 1,
		flags: 1,
		core_exchange_rate: {
			base: {
				amount: 1,
				asset_id: '1.3.0',
			},
			quote: {
				amount: 1,
				asset_id: '1.3.1',
			},
		},
		whitelist_authorities: [],
		blacklist_authorities: [],
		description: 'description',
		extensions: [],
	};

	const bitassetOpts = {
		feed_lifetime_sec: 1,
		minimum_feeds: 2,
		short_backing_asset: '1.3.0',
		extensions: [],
	};

	before(async () => {
		await echo.connect(url,
			{
				connectionTimeout: 1000,
                apis: constants.WS_CONSTANTS.CHAIN_APIS,
				wallet: walletURL,
			}
		);
		await echo.walletApi.setPassword('qwe');
		await echo.walletApi.unlock('qwe');
	});
	after(async () => {
		await echo.disconnect();
	});

	describe('#about()', () => {
		it('should get wallet compile time info and client and dependencies versions', async () => {
			const result = await echo.walletApi.about();
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#info()', () => {
		it('should get wallet info', async () => {
			const result = await echo.walletApi.info();
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#help()', () => {
		it('should get a multi-line string', async () => {
			const result = await echo.walletApi.help();
			expect(result)
				.to
				.be
				.an('string');
		}).timeout(5000);
	});

	describe('#networkAddNodes()', () => {
		it('should add new nodes to network', async () => {
			const nodes = ["0.0.0.0:6311", "0.0.0.0:6310"];
			const result = await echo.walletApi.networkAddNodes(nodes);
			expect(result)
				.to
				.be
				.an('null');
		}).timeout(5000);
	});

	describe('#networkGetConnectedPeers()', () => {
		it('should get a array of connected peers', async () => {
			const result = await echo.walletApi.networkGetConnectedPeers();
			expect(result)
				.to
				.be
				.an('array');
		}).timeout(5000);
	});

	describe('#isNew()', () => {
		it('should get state of the wallet is it new or no', async () => {
			const result = await echo.walletApi.isNew();
            ok(!result);
		}).timeout(5000);
	});

	describe('#isLocked()', () => {
		it('should checks state of the wallet locked or unlocked', async () => {
			const result = await echo.walletApi.isLocked();
            ok(!result);
		}).timeout(5000);
	});

	describe('#lock()', () => {
		it('should lock the wallet', async () => {
			const shouldBeUnlocked = await echo.walletApi.isLocked();
			ok(!shouldBeUnlocked);
			await echo.walletApi.lock();
			const shouldBeLocked = await echo.walletApi.isLocked();
			ok(shouldBeLocked);
			await echo.walletApi.unlock('qwe');
		}).timeout(5000);
	});

	describe('#unlock()', () => {
		it('should unlock the wallet', async () => {
			await echo.walletApi.lock();
			const shouldBeLocked = await echo.walletApi.isLocked();
			ok(shouldBeLocked);
			await echo.walletApi.unlock('qwe');
			const shouldBeUnlocked = await echo.walletApi.isLocked();
			ok(!shouldBeUnlocked);
		}).timeout(5000);
	});

	describe('#setPassword()', () => {
		it('should set new password', async () => {
			await echo.walletApi.setPassword('qweqwe');
			const shouldBeLocked = await echo.walletApi.isLocked();
			ok(shouldBeLocked);
			await echo.walletApi.unlock('qweqwe');
			const shouldBeUnlocked = await echo.walletApi.isLocked();
			ok(!shouldBeUnlocked);
		}).timeout(5000);
	});

	describe('#createEddsaKeypair()', () => {
		it('should create new EdDSA keypair encoded in base58', async () => {
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
		}).timeout(5000);
	});

	describe('#dumpPrivateKeys()', () => {
		it('should dumps all private keys owned by the wallet', async () => {
			const result = await echo.walletApi.dumpPrivateKeys();
			expect(result)
				.to
				.be
				.an('array');
		}).timeout(5000);
	});

	describe('#importKey()', () => {
		it('Should imports the private key for an existing account', async () => {
			const result = await echo.walletApi.importKey('1.2.11', '5KkYp8qdQBaRmLqLz8WVrGjzkt7E13qVcr7cpdLowgJ1mjRyDx2');
            ok(result);
		}).timeout(5000);
	});

	describe.skip('#importAccounts()', () => {
		it('Should imports accounts to chosen filename', async () => {
			try {
				const filename = 'wallet.cpp';
				const password = 'password';
				const result = await echo.walletApi.importAccounts(filename, password);
				// expect(result)
				// 	.to
				// 	.be
				// 	.an('boolean');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe.skip('#importAccountKeys()', () => {
		it('Should imports accounts keys to chosen filename', async () => {
			try {
				const filename = '';
				const password = 'password';
				const result = await echo.walletApi.importAccountKeys(filename, password, accountId, accountId);
				expect(result)
					.to
					.be
					.an('boolean');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#importBalance()', () => {
		it('should construct transaction', async () => {
			const wifKeys = [WIF];
			const result = await echo.walletApi.importBalance(accountId, shouldDoBroadcastToNetwork, wifKeys);
			expect(result)
				.to
				.be
				.an('array');
		}).timeout(5000);
	});

	describe('#suggestBrainKey()', () => {
		it('should suggests a safe brain key', async () => {
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
		}).timeout(5000);
	});

	describe('#deriveKeysFromBrainKey()', () => {
		it('Derive any number of possible owner keys from a given brain key', async () => {
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
		}).timeout(5000);
	});

	describe.skip('#isPublicKeyRegistered()', () => {
		it('should determine is key linked to any registered account', async () => {
			const pubKey = 'ECHOBMZ6kgpeij9zWpAXxQHkRRrQzVf7DmKnX8rQJxBtcMrs';
			const result = await echo.walletApi.isPublicKeyRegistered(pubKey);
			ok(!result)
		}).timeout(5000);
	});

	describe('#getTransactionId()', () => {
		it('should get transactin ID', async () => {
			const pk = '5KkYp8qdQBaRmLqLz8WVrGjzkt7E13qVcr7cpdLowgJ1mjRyDx2';
			const unsignedTr = echo.createTransaction();
			unsignedTr.addOperation(TRANSFER, {
				from: accountId,
				to: `1.${ACCOUNT}.7`,
				amount: {
					asset_id: constants.ECHO_ASSET_ID,
					amount: 1000
				},
			});
			await unsignedTr.sign(PrivateKey.fromWif(pk));
			const transaction = unsignedTr.transactionObject;
			const result = await echo.walletApi.getTransactionId(transaction);
			expect(result)
				.to
				.be
				.an('string');
		}).timeout(10000);
	});

	describe('#getPrivateKey()', () => {
		it('should get the WIF private key', async () => {
			const pubKey = 'ECHOGCNquQJ6PsbqWts9Hwdea6GdAsfyTfJDq2r6BZbkMcNo';
			const result = await echo.walletApi.getPrivateKey(pubKey);
			expect(result)
				.to
				.be
				.an('string');
		}).timeout(5000);
	});

	describe('#loadWalletFile()', () => {
		it('should loads a specified wallet', async () => {
			const walletFilename = '';
			const result = await echo.walletApi.loadWalletFile(walletFilename);
			ok(!result);
		}).timeout(5000);
	});

	describe('#normalizeBrainKey()', () => {
		it('should transforms a brain key', async () => {
			const result = await echo.walletApi.normalizeBrainKey(brainKey);
			expect(result)
				.to
				.be
				.an('string');
		}).timeout(5000);
	});

	describe('#saveWalletFile()', () => {
		it('should saves the current wallet to the given filename', async () => {
			const walletFilename = '';
			const result = await echo.walletApi.saveWalletFile(walletFilename);
			expect(result)
				.to
				.be
				.an('null');
		}).timeout(5000);
	});

	describe('#listMyAccounts()', () => {
		it('should get lists all accounts controlled by this wallet', async () => {
			const result = await echo.walletApi.listMyAccounts();
			expect(result)
				.to
				.be
				.an('array').that.is.not.empty;
			expect(result[0])
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#listAccounts()', () => {
		it('should get lists all accounts registered in the blockchain', async () => {
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
		}).timeout(5000);
	});

	describe('#listAccountBalances()', () => {
		it('should get list the balances of an account', async () => {
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
		}).timeout(5000);
	});

	describe('#listIdBalances()', () => {
		it('should get list the balances of an account', async () => {
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
		}).timeout(5000);
	});

	describe.skip('#registerAccount()', () => {
		it('should registers an account', async () => {
			try {
				const accountName = 'qweasdety';
				const privateKey = PrivateKey.fromSeed(Math.random().toString());
				const activeKey = privateKey.toPublicKey();
				const result = await echo.walletApi.registerAccount(
					accountName,
					activeKey,
					accountId,
					shouldDoBroadcastToNetwork
				);
				console.log('---------result---------', result);
				expect(result)
					.to
					.be
					.an('object').that.is.not.empty;
				expect(result.name).equal(accountName);
				expect(result.registrar).equal(accountId);
				expect(result.key_auths[0][0]).equal(activeKey);
			} catch (e) {
				console.error(inspect(e, false, null, true));
				throw e;
			}
		}).timeout(5000);
	});

	describe('#createAccountWithBrainKey()', () => {
		it('should creates a new account and registers it', async () => {
			const isLockedWallet = await echo.walletApi.isLocked();
			if (isLockedWallet) {
				const newPassword = 'new_password';
				await echo.walletApi.setPassword(newPassword);
				await echo.walletApi.unlock(newPassword);
			}

			const newAccountName = `lozita${Date.now()}`;
			const result = await echo.walletApi.createAccountWithBrainKey(
				brainKey,
				newAccountName,
				accountName,
				{ evmAddress: null, broadcast: shouldDoBroadcastToNetwork },
			);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe.skip('#createContract()', () => {
		it('should creates a contract', async () => {
			const amount = 0;
			const useEthereumAssetAccuracy = true;
			const shouldSaveToWallet = true;
			const result = await echo.walletApi.createContract(
				accountId,
				bytecode,
				amount,
				constants.ECHO_ASSET_ID,
				constants.ECHO_ASSET_ID,
				useEthereumAssetAccuracy,
				shouldSaveToWallet,
			);

			contractResultId = result.operation_results[0][1];
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(10000);
	});

	describe.skip('#callContract()', () => {
		it('should call a contract', async () => {
			try {
				const contractCode = '86be3f80' + '0000000000000000000000000000000000000000000000000000000000000001';
				const amount = 1;
				const shouldSaveToWallet = true;
				const result = await echo.walletApi.callContract(
					accountName,
					contractId,
					contractCode,
					amount,
					constants.ECHO_ASSET_ID,
					shouldSaveToWallet,
				);
				expect(result)
					.to
					.be
					.an('object').that.is.not.empty;
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#contractFundFeePool()', () => {
		it('should get fund fee pool of contract', async () => {
			const amount = 1;
			const result = await echo.walletApi.contractFundFeePool(
				accountName,
				contractId,
				amount,
				shouldDoBroadcastToNetwork,
			);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe.skip('#getContractResult()', () => {
		it('should get the result of contract execution', async () => {
			const result = await echo.walletApi.getContractResult(contractResultId);
			expect(result)
				.to
				.be
				.an('array').that.is.not.empty;
			expect(result[1])
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#transfer()', () => {
		it('should do transfer an amount from one account to another', async () => {
			const amount = '12.01';
			const toAccountId = '1.2.1';
			const result = await echo.walletApi.transfer(
				accountId,
				toAccountId,
				amount,
				constants.ECHO_ASSET_ID,
				shouldDoBroadcastToNetwork,
			);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe.skip('#transfer2()', () => {
		it('should do transfer an amount from one account to another', async () => {
			const amount = '1';
			const toAccountId = '1.2.2';
			const result = await echo.walletApi.transfer2(
				accountId,
				toAccountId,
				amount,
				constants.ECHO_ASSET_ID,
			);
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
				.an('object').that.is.not.empty;
		}).timeout(10000);
	});

	describe('#whitelistAccount()', () => {
		it('should whitelist accounts, primarily for transacting in whitelisted assets', async () => {
			const newListingStatus = 1;
			const result = await echo.walletApi.whitelistAccount(
				accountId,
				accountName,
				newListingStatus,
				shouldDoBroadcastToNetwork,
			);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(10000);
	});

	describe('#getVestingBalances()', () => {
		it('Should get information about a vesting balance object', async () => {
			const result = await echo.walletApi.getVestingBalances(accountId);
			expect(result)
				.to
				.be
				.an('array');
		}).timeout(10000);
	});

	describe.skip('#withdrawVesting()', () => {
		it('Should make withdraw a vesting balance', async () => {
			try {
				const amount = '1';
				const result = await echo.walletApi.withdrawVesting(
					accountId,
					amount,
					constants.ECHO_ASSET_ID,
					shouldDoBroadcastToNetwork,
				);
				expect(result)
					.to
					.be
					.an('object');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#getAccount()', () => {
		it('Should returns information about the given account', async () => {
			const result = await echo.walletApi.getAccount(accountId);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
			expect(result.id).equal(accountId);
		}).timeout(5000);
	});

	describe('#getAccountId()', () => {
		it('Should returns the id of a named account', async () => {
			const result = await echo.walletApi.getAccountId(accountName);
			expect(result).equal('1.2.11');
		}).timeout(5000);
	});

	describe('#getAccountHistory()', () => {
		it('Should returns the most recent operations on the named account', async () => {
			const result = await echo.walletApi.getAccountHistory(
				accountName,
				constants.API_CONFIG.ACCOUNT_HISTORY_DEFAULT_LIMIT
			);
			expect(result)
				.to
				.be
				.an('array');
		}).timeout(5000);
	});

	describe('#getRelativeAccountHistory()', () => {
		it('Should returns the relative operations on the named account from start number', async () => {
			const stop = API_CONFIG.RELATIVE_ACCOUNT_HISTORY_STOP;
			const limit = API_CONFIG.RELATIVE_ACCOUNT_HISTORY_DEFAULT_LIMIT;
			const start = API_CONFIG.RELATIVE_ACCOUNT_HISTORY_START;
			const result = await echo.walletApi.getRelativeAccountHistory(accountId, stop, limit, start);
			expect(result)
				.to
				.be
				.an('array').that.is.not.empty;
			expect(result[0])
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#getContractObject()', () => {
		it('Should get the contract object by it\'s id', async () => {
			const result = await echo.walletApi.getContractObject(contractId);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#getContract()', () => {
		it('Should get the contract information by the contract\'s id', async () => {
			const result = await echo.walletApi.getContract(contractId);
			expect(result)
				.to
				.be
				.an('array');
			expect(result[1])
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#whitelistContractPool()', () => {
		it('Should whitelist or blacklist contract pool', async () => {
			const addToWhitelist = ['1.2.0'];
			const addToBlacklist = ['1.2.2'];
			const removeFromWhitelist = ['1.2.1'];
			const removeFromBlacklist = ['1.2.3'];
			const result = await echo.walletApi.whitelistContractPool(
				accountId,
				contractId,
				addToWhitelist,
				addToBlacklist,
				removeFromWhitelist,
				removeFromBlacklist,
				shouldDoBroadcastToNetwork,
			);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#callContractNoChangingState()', () => {
		it('Should call contract but doesn\'t change the state', async () => {
			try {
			const result = await echo.walletApi.callContractNoChangingState(
				contractId,
				accountId,
				'0',
				constants.ECHO_ASSET_ID,
				bytecode,
			);
			expect(result)
				.to
				.be
				.an('string');
			} catch (erro) {
				console.log(JSON.stringify(erro));
				throw erro;
			}
		}).timeout(5000);
	});

	describe('#getContractPoolBalance()', () => {
		it('Should get contract\'s fee pool balance', async () => {
			const result = await echo.walletApi.getContractPoolBalance(contractId);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe.skip('#getContractPoolWhitelist()', () => {
		it('Should get contract\'s whitelist and blacklist', async () => {
			const result = await echo.walletApi.getContractPoolWhitelist(contractId);
			console.log('result', result);
			expect(result)
				.to
				.be
				.an('array');
		}).timeout(5000);
	});

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
			const result = await echo.walletApi.getAccountDeposits(accountId, '');
			expect(result)
				.to
				.be
				.an('array');
		}).timeout(5000);
	});

	describe('#registerErc20Token()', () => {
		it('Should creates a transaction to register erc20_token', async () => {
			const ethereumTokenAddress = 'f7d2658685b4efa75976645374f2bc27f714ed03';
			const tokenName = 'TradeForYou-S';
			const tokenSymbol = 'TFYS';
			const decimals = 0;
			const result = await echo.walletApi.registerErc20Token(
				accountId,
				ethereumTokenAddress,
				tokenName,
				tokenSymbol,
				decimals,
				shouldDoBroadcastToNetwork,
			);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#getErc20Token()', () => {
		it('Should returns information about erc20 token', async () => {
			const ethereumTokenAddress = '9a1348ebe10f1ae4461fcb885d8cba8260757957';
			const result = await echo.walletApi.getErc20Token(ethereumTokenAddress);
			// expect(result)
			// 	.to
			// 	.be
			// 	.an('object');
			// console.log('result', result);
		}).timeout(5000);
	});

	describe('#checkErc20Token()', () => {
		it('Check on exist erc20 token should return true or false', async () => {
			const result = await echo.walletApi.checkErc20Token(contractId);
			ok(!result);
		}).timeout(5000);
	});

	describe('#getErc20AccountDeposits()', () => {
		it('Should returns all approved deposits, for the given account id', async () => {
			const result = await echo.walletApi.getErc20AccountDeposits(accountId);
			expect(result)
				.to
				.be
				.an('array');
		}).timeout(5000);
	});

	describe('#getErc20AccountWithdrawals()', () => {
		it('Should returns all approved withdrawals, for the given account id', async () => {
			const result = await echo.walletApi.getErc20AccountWithdrawals(accountId);
			expect(result)
				.to
				.be
				.an('array');
		}).timeout(5000);
	});

	describe.skip('#withdrawErc20Token()', () => {
		it('Should creates a transaction to withdraw erc20_token', async () => {
			const toEthereumAddress = 'F7D2658685B4eFa75976645374F2bc27f714ED03';
			const erc20TokenId = '1.15.0';
			const withdrawAmount = 1;
			const result = await echo.walletApi.withdrawErc20Token(
				accountId,
				toEthereumAddress,
				erc20TokenId,
				withdrawAmount,
				shouldDoBroadcastToNetwork,
			);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#generateAccountAddress()', () => {
		it('Should generate account address', async () => {
				const label = 'label';
				const result = await echo.walletApi.generateAccountAddress(
					accountId,
					label,
					shouldDoBroadcastToNetwork,
				);
				expect(result)
					.to
					.be
					.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#getAccountAddresses()', () => {
		it('Should get addresses of current account', async () => {
			const start = 0;
			const limit = 10;
			const result = await echo.walletApi.getAccountAddresses(accountId, start, limit);
			expect(result)
				.to
				.be
				.an('array');
		}).timeout(5000);
	});

	describe('#getAccountByAddress()', () => {
		it('Should get owner of specified address', async () => {
			const address = 'f54a5851e9372b87810a8e60cdd2e7cfd80b6e31';
			const result = await echo.walletApi.getAccountByAddress(address);
			// expect(result)
			// 	.to
			// 	.be
			// 	.an('string');
			// console.log('result', result);
		}).timeout(5000);
	});

	describe('#getAccountWithdrawals()', () => {
		it('Should returns all approved withdrawals, for the given account id', async () => {
			const result = await echo.walletApi.getAccountWithdrawals(accountId);
			expect(result)
				.to
				.be
				.an('array');
		}).timeout(5000);
	});

	describe.skip('#approveProposal()', () => {
		it('Should approve a proposal', async () => {
			try {
				const proposalId = '1.5.0';
				const delta = {
					"active_approvals_to_add": ['1','1'],
					"active_approvals_to_remove": ['1','1'],
					"owner_approvals_to_add": ['1','1'],
					"owner_approvals_to_remove": ['1','1'],
					"key_approvals_to_add": ['1','1'],
					"key_approvals_to_remove": ['1','1'],
				};
				const result = await echo.walletApi.approveProposal(
					accountId,
					proposalId,
					delta,
					shouldDoBroadcastToNetwork,
					);
				expect(result)
					.to
					.be
					.an('object');
				console.log('result', result);
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#createEthAddress()', () => {
		it('Should generate eth address', async () => {
			const result = await echo.walletApi.createEthAddress(accountId, shouldDoBroadcastToNetwork);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#withdrawEth()', () => {
		it('Should withdraw eth from address', async () => {
			const ethAddress = 'f54a5851e9372b87810a8e60cdd2e7cfd80b6e31';
			const value = 1;
			const result = await echo.walletApi.withdrawEth(
				accountId,
				ethAddress,
				value,
				shouldDoBroadcastToNetwork,
				);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe.skip('#floodNetwork()', () => {
		it('Flood network', async () => {
			const prefix = 'prefix';
			const numberOfTransactions = 1;
			const result = await echo.walletApi.floodNetwork(prefix, numberOfTransactions);
			expect(result)
				.to
				.be
				.an('null');
		}).timeout(5000);
	});


	describe('#listAssets()', () => {
		it('Should get lists of all assets registered', async () => {
			const result = await echo.walletApi.listAssets(
				constants.ECHO_ASSET_ID,
				constants.API_CONFIG.LIST_ASSETS_MAX_LIMIT
				);
				expect(result)
					.to
					.be
					.an('array').that.is.not.empty;
				expect(result[0])
		}).timeout(5000);
	});

	describe('#listAssets()', () => {
		it('Should get lists of all assets registered', async () => {
			const result = await echo.walletApi.listAssets(
				constants.ECHO_ASSET_ID,
				constants.API_CONFIG.LIST_ASSETS_MAX_LIMIT
			);
			expect(result)
				.to
				.be
				.an('array').that.is.not.empty;
			expect(result[0])
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#createAsset()', () => {
		it('Should creates a new user-issued or market-issued asset', async () => {
			const symbol = 'TFYS';
			const precision = 0;
			const result = await echo.walletApi.createAsset(
				accountId,
				symbol,
				precision,
				assetOption,
				bitassetOpts,
				shouldDoBroadcastToNetwork,
			);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe.skip('#updateAsset()', () => {
		it('Should update the core options on an asset', async () => {
			try {
				const assetOption = {
					"max_supply": 1,
					"issuer_permissions": 0,
					"flags": 0,
					"core_exchange_rate": {
						"base": {
							"amount": 1,
							"asset_id": '1.3.0',
						},
						"quote": {
							"amount": 1,
							"asset_id": '1.3.1',
						},
					},
					"whitelist_authorities": [],
					"blacklist_authorities": [],
					"description": 'description',
					"extensions": [],
				};
				const result = await echo.walletApi.updateAsset(
					constants.ECHO_ASSET_ID,
					accountId,
					assetOption,
					shouldDoBroadcastToNetwork,
				);
				console.log('result', result);
				expect(result)
					.to
					.be
					.an('object');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe.skip('#updateBitasset()', () => {
		it('Should update the options specific to a BitAsset', async () => {
			const bitassetOpts = {
					feed_lifetime_sec: 1,
					minimum_feeds: 2,
					short_backing_asset: '1.3.0',
					extensions: [],
				};
			const result = await echo.walletApi.updateBitasset(
				constants.ECHO_ASSET_ID,
				bitassetOpts,
				shouldDoBroadcastToNetwork,
			);
			expect(result)
				.to
				.be
				.an('array').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#updateAssetFeedProducers()', () => {
		it('Should update the set of feed-producing accounts for a BitAsset', async () => {
			const newFeedProducers = ['1.2.1', '1.2.2'];
			const result = await echo.walletApi.updateAssetFeedProducers(
				constants.ECHO_ASSET_ID,
				newFeedProducers,
				shouldDoBroadcastToNetwork,
			);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#createAsset()', () => {
		it('Should creates a new user-issued or market-issued asset', async () => {
			const symbol = 'TFYS';
			const precision = 0;
			const result = await echo.walletApi.createAsset(
				accountId,
				symbol,
				precision,
				assetOption,
				bitassetOpts,
				shouldDoBroadcastToNetwork,
				);
				expect(result)
					.to
					.be
					.an('object').that.is.not.empty;
			}).timeout(5000);
		});

	describe('#publishAssetFeed()', () => {
		it('Should publishes a price feed for the named asset', async () => {
			const core_exchange_rate = {
				"base": {
					"amount": 1,
					"asset_id": '1.3.0',
				},
				"quote": {
					"amount": 1,
					"asset_id": '1.3.1',
				},
			};
			const result = await echo.walletApi.publishAssetFeed(
				accountId,
				constants.ECHO_ASSET_ID,
				core_exchange_rate,
				shouldDoBroadcastToNetwork,
			);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe.skip('#updateAsset()', () => {
		it('Should update the core options on an asset', async () => {
			try {
				const assetOption = {
					"max_supply": 1,
					"issuer_permissions": 0,
					"flags": 0,
					"core_exchange_rate": {
						"base": {
							"amount": 1,
							"asset_id": '1.3.0',
						},
						"quote": {
							"amount": 1,
							"asset_id": '1.3.1',
						},
					},
					"whitelist_authorities": [],
					"blacklist_authorities": [],
					"description": 'description',
					"extensions": [],
				};
				const result = await echo.walletApi.updateAsset(
					constants.ECHO_ASSET_ID,
					accountId,
					assetOption,
					shouldDoBroadcastToNetwork,
					);
					console.log('result', result);
					expect(result)
						.to
						.be
						.an('object');
				} catch (e) {
					throw e;
				}
			}).timeout(5000);
		});

	describe.skip('#issueAsset()', () => {
		it('Should do issue new shares of an asset', async () => {
			try {
				const amount = '1';
				const assetTicker = 'TSYS';
				const result = await echo.walletApi.issueAsset(
					accountId,
					amount,
					assetTicker,
					shouldDoBroadcastToNetwork,
				);
				console.log('result', result);
				expect(result)
					.to
					.be
					.an('object');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#updateBitasset()', () => {
		it('Should update the options specific to a BitAsset', async () => {
			const bitassetOpts = {
					feed_lifetime_sec: 1,
					minimum_feeds: 2,
					short_backing_asset: '1.3.0',
					extensions: [],
				};
			const result = await echo.walletApi.updateBitasset(
				constants.ECHO_ASSET_ID,
				bitassetOpts,
				shouldDoBroadcastToNetwork,
			);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#updateAssetFeedProducers()', () => {
		it('Should update the set of feed-producing accounts for a BitAsset', async () => {
			const newFeedProducers = ['1.2.1', '1.2.2'];
			const result = await echo.walletApi.updateAssetFeedProducers(
				constants.ECHO_ASSET_ID,
				newFeedProducers,
				shouldDoBroadcastToNetwork,
			);
			expect(result)
			.to
			.be
			.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#getAsset()', () => {
		it('Should returns information about the given asset', async () => {
			const result = await echo.walletApi.getAsset(constants.ECHO_ASSET_ID);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#publishAssetFeed()', () => {
		it('Should publishes a price feed for the named asset', async () => {
			const core_exchange_rate = {
				"base": {
					"amount": 1,
					"asset_id": '1.3.0',
				},
				"quote": {
					"amount": 1,
					"asset_id": '1.3.1',
				},
			};
			const result = await echo.walletApi.publishAssetFeed(
				accountId,
				constants.ECHO_ASSET_ID,
				core_exchange_rate,
				shouldDoBroadcastToNetwork,
			);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe.skip('#issueAsset()', () => {
		it('Should do issue new shares of an asset', async () => {
			try {
				const amount = '1';
				const assetTicker = 'TSYS';
				const result = await echo.walletApi.issueAsset(
					accountId,
					amount,
					assetTicker,
					shouldDoBroadcastToNetwork,
				);
				expect(result)
				.to
				.be
				.an('object');
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe.skip('#getBitassetData()', () => {
		it('Should returns the BitAsset-specific data for a given asset', async () => {
			try {
				const symbol = 'TFYS';
				const precision = 0;
				const check = await echo.walletApi.createAsset(
					accountId,
					symbol,
					precision,
					assetOption,
					bitassetOpts,
					shouldDoBroadcastToNetwork,
				);
				console.log('transaction.js.js', check.operations[0][1]);
				const bitasset = '1.3.0';
				const result = await echo.walletApi.getBitassetData(bitasset);
				expect(result)
					.to
					.be
					.an('object');
				console.log('result', result);
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#fundAssetFeePool()', () => {
		it('Should pay into the fee pool for the given asset', async () => {
			const amount = '1';
			const result = await echo.walletApi.fundAssetFeePool(
				accountId,
				constants.ECHO_ASSET_ID,
				amount,
				shouldDoBroadcastToNetwork,
				);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#reserveAsset()', () => {
		it('Should burns the given user-issued asset', async () => {
			const amount = '1';
			const result = await echo.walletApi.reserveAsset(
				accountId,
				amount,
				constants.ECHO_ASSET_ID,
				shouldDoBroadcastToNetwork,
			);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#getCommitteeMember()', () => {
		it('Should returns information about the given committee_member', async () => {
			const result = await echo.walletApi.getCommitteeMember(accountId);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
			expect(result.committee_member_account).equal(accountId);
		}).timeout(5000);
	});

	describe('#listCommitteeMembers()', () => {
		it('Should returns lists all committee_members', async () => {
			const lowerBoundName = '';
			const result = await echo.walletApi.listCommitteeMembers(
				lowerBoundName,
				constants.API_CONFIG.COMMITTEE_MEMBER_ACCOUNTS_DEFAULT_LIMIT,
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
				.an('string');
		}).timeout(5000);
	});

	describe('#reserveAsset()', () => {
		it('Should burns the given user-issued asset', async () => {
			const amount = '1';
			const result = await echo.walletApi.reserveAsset(
				accountId,
				amount,
				constants.ECHO_ASSET_ID,
				shouldDoBroadcastToNetwork,
			);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe.skip('#createCommitteeMember()', () => {
		it('Should creates a committee_member object owned by the given account', async () => {
			const newAccountId = '1.2.0';
			const url = '';
			const amount = '1';
			const ethereumAddress = '7234F8149411B8F275373DC470011e18126489B6';
			const btcPublicKey = '02c16e97132e72738c9c0163656348cd1be03521de17efeb07e496e742ac84512e';
			const result = await echo.walletApi.createCommitteeMember(
				newAccountId,
				url,
				amount,
				ethereumAddress,
				btcPublicKey,
				shouldDoBroadcastToNetwork,
				);
				expect(result)
					.to
					.be
					.an('object').that.is.not.empty;
			}).timeout(5000);
	});

	describe.skip('#setDesiredCommitteeMemberCount()', () => {
		it('Should set your vote for the number of committee_members', async () => {
			try {
			const accountName = 'bruno';
			const newAccount = await echo.walletApi.createAccountWithBrainKey(
				brainKey,
				accountName,
				accountId,
				shouldDoBroadcastToNetwork
			);
				// console.log('---------voting_account---------', newAccount.operations[0][1].options.voting_account);
				const desiredNumberOfCommitteeMembers = 0;
				const result = await echo.walletApi.setDesiredCommitteeMemberCount(
					newAccount.operations[0][1].options.voting_account,
					desiredNumberOfCommitteeMembers,
					shouldDoBroadcastToNetwork,
				);
				expect(result)
				.to
				.be
				.an('object');
			console.log('result', result);
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe.skip('#proposeParameterChange()', () => {
		it('Should creates a transaction to propose a parameter change', async () => {
			try {
				const date = new Date(2020, 12, 10);
				const changedValues = {};
				const result = await echo.walletApi.proposeParameterChange(
					accountId,
					date,
					changedValues,
					shouldDoBroadcastToNetwork,
				);
				// console.log('result', result);
			expect(result)
				.to
				.be
				.an('object');
			console.log('result', result);
			} catch (e) {
				throw e;
			}
		}).timeout(5000);
	});

	describe('#getCommitteeMember()', () => {
		it('Should returns information about the given committee_member', async () => {
			const result = await echo.walletApi.getCommitteeMember(accountId);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
			expect(result.committee_member_account).equal(accountId);
		}).timeout(5000);
	});

	describe('#listCommitteeMembers()', () => {
		it('Should returns lists all committee_members', async () => {
			const lowerBoundName = '';
			const result = await echo.walletApi.listCommitteeMembers(
				lowerBoundName,
				constants.API_CONFIG.COMMITTEE_MEMBER_ACCOUNTS_DEFAULT_LIMIT,
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
				.an('string');
		}).timeout(5000);
	});

	describe('#committeeFreezeBalance()', () => {
		it('should freeze commitee balance', async () => {

			const result = await echo.walletApi.committeeFreezeBalance('1.2.10', '1', true);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#committeeFreezeBalance()', () => {
		it('should freeze commitee balance', async () => {

			const result = await echo.walletApi.committeeFreezeBalance('1.2.10', '1', true);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#getCommitteeFrozenBalance()', () => {
		it('should returns the 0 for ECHO asset', async () => {
			const result = await echo.walletApi.getCommitteeFrozenBalance('1.2.10');
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
			expect(result.amount)
				.to
				.be
				.equal(0);
			expect(result.asset_id)
				.to
				.be
				.equal('1.3.0');
		}).timeout(5000);

	});


	describe('#committeeWithdrawBalance()', () => {
		it('should returns the 0 for ECHO asset', async () => {
			const result = await echo.walletApi.committeeWithdrawBalance('1.2.10', '1');
			expect(result)
			.to
			.be
			.an('object').that.is.not.empty;
		}).timeout(5000);

	});

	describe.skip('#proposeParameterChange()', () => {
		it('Should creates a transaction to propose a parameter change', async () => {
			try {
				const date = new Date(2020, 12, 10);
				const changedValues = {};
				const result = await echo.walletApi.proposeParameterChange(
					accountId,
					date,
					changedValues,
					shouldDoBroadcastToNetwork,
				);
				expect(result)
					.to
					.be
					.an('object').that.is.not.empty;
				console.log('result', result);
			} catch (e) {
				throw e;
			}
		}).timeout(10000);
	});


	describe.skip('#proposeFeeChange()', () => {
		it('Should propose a fee change', async () => {
			try {
				const date = new Date(2020, 12, 10);
				const changedValues = {};
				const result = await echo.walletApi.proposeFeeChange(
					accountId,
					date,
					changedValues,
					shouldDoBroadcastToNetwork,
				);
				expect(result)
					.to
					.be
					.an('object').that.is.not.empty;
				console.log('result', result);
			} catch (e) {
				throw e;
			}
		}).timeout(10000);
	});



	describe.skip('#changeSidechainConfig()', () => {
		it('Should change sidechain config', async () => {
			const changedValues = {
				"_time_net_1mb": 1,
				"_time_net_256b": 1,
				"_creator_count": 1,
				"_verifier_count": 1,
				"_ok_threshold": 1,
				"_max_bba_steps": 1,
				"_gc1_delay": 1,
			};
			const result = await echo.walletApi.changeSidechainConfig(
				accountId,
				changedValues,
				shouldDoBroadcastToNetwork,
			);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(15000);
	});

	describe('#getBlock()', () => {
		it('should get block by number', async () => {
			const blockNumber = 1;
			const result = await echo.walletApi.getBlock(blockNumber);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
			expect(result.round).equal(blockNumber);
		}).timeout(5000);
	});

	describe.skip('#proposeFeeChange()', () => {
		it('Should propose a fee change', async () => {
			try {
				const date = new Date(2020, 12, 10);
				const changedValues = {};
				const result = await echo.walletApi.proposeFeeChange(
					accountId,
					date,
					changedValues,
					shouldDoBroadcastToNetwork,
				);
				expect(result)
					.to
					.be
					.an('object').that.is.not.empty;
				console.log('result', result);
			} catch (e) {
				throw e;
			}
		}).timeout(10000);
	});

	describe.skip('#changeSidechainConfig()', () => {
		it('Should change sidechain config', async () => {
			const changedValues = {
				"_time_net_1mb": 1,
				"_time_net_256b": 1,
				"_creator_count": 1,
				"_verifier_count": 1,
				"_ok_threshold": 1,
				"_max_bba_steps": 1,
				"_gc1_delay": 1,
			};
			const result = await echo.walletApi.changeSidechainConfig(
				accountId,
				changedValues,
				shouldDoBroadcastToNetwork,
			);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(15000);
	});

	describe('#getBlock()', () => {
		it('should get block by number', async () => {
			const blockNumber = 1;
			const result = await echo.walletApi.getBlock(blockNumber);
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
			expect(result.round).equal(blockNumber);
		}).timeout(5000);
	});

	describe('#getBlockVirtualOps()', () => {
		it('should get block virtual ops by number', async () => {
			const blockNumber = 1;
			const result = await echo.walletApi.getBlockVirtualOps(blockNumber);
			expect(result)
				.to
				.be
				.an('array');
		}).timeout(5000);
	});

	describe('#getAccountCount()', () => {
		it('should returns the number of registered accounts', async () => {
			const result = await echo.walletApi.getAccountCount();
			expect(result)
				.to
				.be
				.an('number');
		}).timeout(5000);
	});

	describe('#getGlobalProperties()', () => {
		it('should returns the number of registered accounts', async () => {
			const result = await echo.walletApi.getGlobalProperties();
            expect(result)
                .to
                .be
                .an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#getDynamicGlobalProperties()', () => {
		it('should returns the block chain\'s slowly-changing settings', async () => {
			const result = await echo.walletApi.getDynamicGlobalProperties();
			expect(result)
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});

	describe('#getObject()', () => {
		it('should returns the blockchain object', async () => {
			const result = await echo.walletApi.getObject(accountId);
			expect(result)
				.to
				.be
				.an('array').that.is.not.empty;
			expect(result[0])
				.to
				.be
				.an('object').that.is.not.empty;
		}).timeout(5000);
	});


	describe('TRANSACTION BUILDER', () => {

		beforeEach(async () => await echo.walletApi.beginBuilderTransaction());

		describe('#beginBuilderTransaction()', () => {
			it('should returns number of built transaction', async () => {
				const result = await echo.walletApi.beginBuilderTransaction();
				expect(result)
					.to
					.be
					.an('number');
			}).timeout(5000);
		});

		describe.skip('#addOperationToBuilderTransaction()', () => {
			it('should add operations to builder transaction', async () => {
				const transactionTypeHandle = 1;
				const operation = [4,
					{
						fee: {
							amount: 1,
							asset_id: '1.3.0',
						},
						account_id: accountId,
						new_owner: '1.2.1',
						extensions: [],
					}
				];
				const result = await echo.walletApi.addOperationToBuilderTransaction(transactionTypeHandle, operation);
				expect(result)
					.to
					.be
					.an('null');
			}).timeout(5000);
		});

		describe.skip('#replaceOperationInBuilderTransaction()', () => {
			it('should replace operations in builder transaction', async () => {
				try {
					const transactionTypeHandle = 2;
					const operation = [4,
						{
							fee: {
								amount: 1,
								asset_id: '1.3.0',
							},
							account_id: accountId,
							new_owner: '1.2.1',
							extensions: [],
						}
					];
					const unsignedOperation = 4;
					const result = await echo.walletApi.replaceOperationInBuilderTransaction(
						transactionTypeHandle,
						unsignedOperation,
						operation,
					);
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

		describe.skip('#setFeesOnBuilderTransaction()', () => {
			it('should set fees on builder transaction', async () => {
				const transactionTypeHandle = 3;
				const feeAsset = '1.3.0';
				const result = await echo.walletApi.setFeesOnBuilderTransaction(transactionTypeHandle, feeAsset);
				expect(result)
					.to
					.be
					.an('object').that.is.not.empty;
			}).timeout(5000);
		});

		describe.skip('#previewBuilderTransaction()', () => {
			it('should get preview of builder transaction', async () => {
				const transactionTypeHandle = 4;
				const result = await echo.walletApi.previewBuilderTransaction(transactionTypeHandle);
				expect(result)
					.to
					.be
					.an('object').that.is.not.empty;
			}).timeout(5000);
		});

		describe.skip('#signBuilderTransaction()', () => {
			it('should get sing transaction', async () => {
				const transactionTypeHandle = 5;
				const result = await echo.walletApi.signBuilderTransaction(
					transactionTypeHandle,
					shouldDoBroadcastToNetwork
				);
				expect(result)
					.to
					.be
					.an('object').that.is.not.empty;
			}).timeout(5000);
		});

		describe.skip('#proposeBuilderTransaction()', () => {
			it('should get sing transaction', async () => {
				const transactionTypeHandle = 6;
				const date = new Date(2020,9,5);
				const reviewPeriod = 60000;
				const result = await echo.walletApi.proposeBuilderTransaction(
					transactionTypeHandle,
					date,
					reviewPeriod,
					shouldDoBroadcastToNetwork,
				);
				expect(result)
					.to
					.be
					.an('object').that.is.not.empty;
			}).timeout(5000);
		});

		describe.skip('#proposeBuilderTransaction2()', () => {
			it('should get sing transaction', async () => {
				const transactionTypeHandle = 7;
				const date = new Date(2020, 9, 5);
				const reviewPeriod = 60000;
				const result = await echo.walletApi.proposeBuilderTransaction2(
					transactionTypeHandle,
					accountId,
					date,
					reviewPeriod,
					shouldDoBroadcastToNetwork,
				);
				expect(result)
					.to
					.be
					.an('object').that.is.not.empty;
			}).timeout(5000);
		});

		describe('#removeBuilderTransaction()', () => {
			it('should get sing transaction', async () => {
				const transactionTypeHandle = 8;
				const result = await echo.walletApi.removeBuilderTransaction(transactionTypeHandle);
				expect(result)
					.to
					.be
					.an('null');
			}).timeout(5000);
		});

		describe('#signTransaction()', () => {
			it('should get sing transaction', async () => {
				const pk = '5KkYp8qdQBaRmLqLz8WVrGjzkt7E13qVcr7cpdLowgJ1mjRyDx2';
				const tr = echo.createTransaction();
				tr.addOperation(TRANSFER, {
					from: accountId,
					to: `1.${ACCOUNT}.1`,
					amount: { asset_id: `1.${ASSET}.0`, amount: 10 },
				});
				await tr.sign(PrivateKey.fromWif(pk));
				const trx = tr.transactionObject;
				const result = await echo.walletApi.signTransaction(trx, shouldDoBroadcastToNetwork);
				expect(result)
					.to
					.be
					.an('object').that.is.not.empty;
			}).timeout(5000);
		});


		describe('#signTransaction()', () => {
			it('should get sing transaction', async () => {
				const pk = '5KkYp8qdQBaRmLqLz8WVrGjzkt7E13qVcr7cpdLowgJ1mjRyDx2';
				const tr = echo.createTransaction();
				tr.addOperation(TRANSFER, {
					from: accountId,
					to: `1.${ACCOUNT}.1`,
					amount: { asset_id: `1.${ASSET}.0`, amount: 10 },
				});
				await tr.sign(PrivateKey.fromWif(pk));
				const trx = tr.transactionObject;
				const result = await echo.walletApi.signTransaction(trx, shouldDoBroadcastToNetwork);
				expect(result)
					.to
					.be
					.an('object').that.is.not.empty;
			}).timeout(5000);
		});

		describe.skip('#getPrototypeOperation()', () => {
			it('should returns an uninitialized object representing a given blockchain operation', async () => {
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
				}).timeout(5000);
			});


		describe('#registerAccountWithApi()', () => {
			it('should create account without errors', async () => {
				try {
					const name = `cookiezi-${Date.now()}`;
					const pubKey = 'ECHOBMZ6kgpeij9zWpAXxQHkRRrQzVf7DmKnX8rQJxBtcMrs';

					await echo.walletApi.registerAccountWithApi(name, pubKey, pubKey, null);
				} catch(e) {
					console.log(e);
					throw e;
				}
			}).timeout(10e3);
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

		describe('#serializeTransaction()', () => {
			it('should get serialize transaction', async () => {
				const pk = '5KkYp8qdQBaRmLqLz8WVrGjzkt7E13qVcr7cpdLowgJ1mjRyDx2';
				const transaction = echo.createTransaction();
				transaction.addOperation(TRANSFER, {
					from: accountId,
					to: `1.${ACCOUNT}.7`,
					amount: {
						asset_id: constants.ECHO_ASSET_ID,
						amount: 1000
					},
				});
				await transaction.sign(PrivateKey.fromWif(pk));
				const trx = transaction.transactionObject;
				const result = await echo.walletApi.serializeTransaction(trx);
				expect(result)
				.to
				.be
				.an('string');
			}).timeout(5000);
		});

		describe.skip('#listFrozenBalances()', () => {
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

		describe('#updateCommitteeMember()', () => {
			it('should update committee member', async () => {
				try {
					const result = await echo.walletApi.updateCommitteeMember(
						accountId,
						'',
						'7234F8149411B8F275373DC470011e18126489B6',
						'02c16e97132e72738c9c0163656348cd1be03521de17efeb07e496e742ac84512e',
					);
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
	});

	// describe('#exit()', () => {
	// 	it('should exit from wallet', async () => {
	// 		const expectedError = 'timeout';
	// 		await Promise.all([
	// 			echo.walletApi.exit().then(() => {throw new Error('should not return')}),
	// 			promisify((cb) => setTimeout(() => cb(), 1e3))().then(async () => {
	// 				await echo.walletApi.info();
	// 				throw new Error('should not return');
	// 			}),
	// 			promisify((cb) => setTimeout(() => cb(), 3e3))().then(() => {
	// 				throw new Error(expectedError);
	// 			})
	// 		]).catch(((err) => {
	// 			if (err.message === expectedError) return;
	// 			throw err;
	// 		}));
	// 	}).timeout(5000);
	// });

});
