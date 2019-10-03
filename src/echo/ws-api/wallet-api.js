import * as serializers from '../../serializers';
import { API_CONFIG } from '../../constants';
import ReconnectionWebSocket from '../ws/reconnection-websocket';

const { ethAddress } = serializers.protocol;
const { vector, optional } = serializers.collections;
const { privateKey, publicKey, ripemd160 } = serializers.chain;
const { options, bitassetOptions } = serializers.protocol.asset;
const { priceFeed } = serializers.protocol;
const { config } = serializers.plugins.echorand;
const { anyObjectId } = serializers.chain.ids;

const {
	uint64,
	uint32,
	int64,
	uint16,
	uint8,
} = serializers.basic.integers;

const {
	timePointSec,
	variantObject,
	string,
	bool,
} = serializers.basic;

const {
	operation,
	wallet,
	signedTransaction,
	transaction,
} = serializers;

const {
	accountId,
	contractId,
	erc20TokenId,
	proposalId,
	assetId,
} = serializers.chain.ids.protocol;

const { accountListing } = serializers.protocol;

/**
 * @typedef {typeof import("../../serializers/transaction")['signedTransactionSerializer']} SignedTransactionSerializer
 */

/** @typedef {SignedTransactionSerializer['__TOutput__']} SignedTransaction */
/** @typedef {typeof import("../../serializers/chain")['ripemd160']['__TOutput__']} TransactionIdType */
/** @typedef {typeof import("../../serializers/chain")['asset']['__TOutput__']} Asset */
/** @typedef {typeof import("../../serializers/transaction")['default']} TransactionSerializer */
/** @typedef {TransactionSerializer['__TOutput__']} Transaction */
/** @typedef {typeof import("../../serializers")['operation']['__TOutput__']} Operation */


class WalletAPI {

	/**
	 * @constructor
	 */
	constructor() {
		this.wsRpc = new ReconnectionWebSocket();
	}

	/**
	 * @method connect
	 * @param {String} url - remote node address
	 * @param {Parameters<ReconnectionWebSocket['connect']>[1]} connectionOptions - connection params.
	 * @returns {Promise<void>}
	 */
	async connect(url, connectionOptions) {
		await this.wsRpc.connect(url, connectionOptions);
	}

	/**
	 * @method exit
	 *
	 * @returns {Promise<never>}
	 */
	exit() {
		return this.wsRpc.call([0, 'exit', []]);
	}

	/**
	 * @method help
	 *
	 * @returns {Promise<String>}
	 */
	help() {
		return this.wsRpc.call([0, 'help', []]);
	}

	/**
	 * @method helpMethod
	 * @param {Array<String>} method
	 * @returns {Promise<String>}
	 */
	helpMethod(method) {
		return this.wsRpc.call([0, 'help_method', [string.toRaw(method)]]);
	}

	/**
	 * @method info
	 *
	 * @returns {Promise<Object>}
	 */
	info() {
		return this.wsRpc.call([0, 'info', []]);
	}

	/**
	 * @method about
	 *
	 * @returns {Promise<Object>}
	 */
	about() {
		return this.wsRpc.call([0, 'about', []]);
	}

	/**
	 * @method networkAddNodes
	 * @param {Array<String>} nodes
	 * @returns {Promise<void>}
	 */
	networkAddNodes(nodes) {
		return this.wsRpc.call([0, 'network_add_nodes', [vector(string).toRaw(nodes)]]);
	}

	/**
	 * @method networkGetConnectedPeers
	 *
	 * @returns {Promise<any[]>}
	 */
	networkGetConnectedPeers() {
		return this.wsRpc.call([0, 'network_get_connected_peers', []]);
	}

	/**
	 * @method isNew
	 *
	 * @returns {Promise<Boolean>}
	 */
	isNew() {
		return this.wsRpc.call([0, 'is_new', []]);
	}

	/**
	 * @method isLocked
	 *
	 * @returns {Promise<Boolean>}
	 */
	isLocked() {
		return this.wsRpc.call([0, 'is_locked', []]);
	}

	/**
	 * @method lock
	 *
	 * @returns {Promise<void>}
	 */
	lock() {
		return this.wsRpc.call([0, 'lock', []]);
	}

	/**
	 * @method unlock
	 * @param {String} password
	 * @returns {Promise<void>}
	 */
	unlock(password) {
		return this.wsRpc.call([0, 'unlock', [string.toRaw(password)]]);
	}

	/**
	 * @method setPassword
	 * @param {String} password
	 * @returns {Promise<void>}
	 */
	setPassword(password) {
		return this.wsRpc.call([0, 'set_password', [string.toRaw(password)]]);
	}

	/**
	 * @method createEddsaKeypair
	 *
	 * @returns {Promise<[string, string]>}
	 */
	createEddsaKeypair() {
		return this.wsRpc.call([0, 'create_eddsa_keypair', []]);
	}

	/**
	 * @method dumpPrivateKeys
	 *
	 * @returns {Promise<[string, string][]>}
	 */
	dumpPrivateKeys() {
		return this.wsRpc.call([0, 'dump_private_keys', []]);
	}

	/**
	 * @method oldKeyToWif
	 * @param {String} accountPrivateKey
	 * @returns {Promise<String>}
	 */
	oldKeyToWif(accountPrivateKey) {
		return this.wsRpc.call([0, 'old_key_to_wif', [string.toRaw(accountPrivateKey)]]);
	}

	/**
	 * @method importKey
	 * @param {String} accountNameOrId
	 * @param {String} privateKeyWif
	 * @returns {Promise<Boolean>}
	 */
	importKey(accountNameOrId, privateKeyWif) {
		return this.wsRpc.call([0, 'import_key', [string.toRaw(accountNameOrId), privateKey.toRaw(privateKeyWif)]]);
	}

	/**
	 * @method importAccounts
	 * @param {String} filename
	 * @param {String} password
	 * @returns {<[string, boolean][]>}
	 */
	importAccounts(filename, password) {
		return this.wsRpc.call([0, 'import_accounts', [string.toRaw(filename), string.toRaw(password)]]);
	}

	/**
	 * @method importAccountKeys
	 * @param {String} filename
	 * @param {String} password
	 * @param {String} srcAccountName
	 * @param {String} destAccountName
	 * @returns {Promise<Boolean>}
	 */
	importAccountKeys(filename, password, srcAccountName, destAccountName) {
		return this.wsRpc.call([
			0,
			'import_account_keys',
			[filename, password, srcAccountName, destAccountName].map((argument) => string.toRaw(argument)),
		]);
	}

	/**
	 * @method importBalance
	 * @param {String} accountNameOrId
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @param {Array<String>} wifKeys
	 * @returns {Promise<SignedTransaction>}
	 */
	importBalance(accountNameOrId, shouldDoBroadcastToNetwork, wifKeys) {
		return this.wsRpc.call([0, 'import_balance', [
			string.toRaw(accountNameOrId),
			bool.toRaw(shouldDoBroadcastToNetwork),
			vector(privateKey).toRaw(wifKeys),
		]]);
	}

	/**
	 * @method suggestBrainKey
	 * @returns {Promise<Object>}
	 */
	suggestBrainKey() {
		return this.wsRpc.call([0, 'suggest_brain_key', []]);
	}

	/**
	 * @method deriveKeysFromBrainKey
	 * @param {String} brainKey
	 * @param {Number} numberOfDesiredKeys
	 * @returns {Promise<Object[]>}
	 */
	deriveKeysFromBrainKey(brainKey, numberOfDesiredKeys) {
		return this.wsRpc.call([0, 'derive_keys_from_brain_key', [
			string.toRaw(brainKey),
			int64.toRaw(numberOfDesiredKeys),
		]]);
	}

	/**
	 * @method isPublicKeyRegistered
	 * @param {String} accountPublicKey
	 * @returns {Promise<Boolean>}
	 */
	isPublicKeyRegistered(accountPublicKey) {
		return this.wsRpc.call([0, 'is_public_key_registered', [publicKey.toRaw(accountPublicKey)]]);
	}

	/**
	 * @method getTransactionId
	 * @param {String} tr
	 * @returns {Promise<TransactionIdType>}
	 */
	getTransactionId(tr) {
		return this.wsRpc.call([0, 'get_transaction_id', [signedTransaction.toRaw(tr)]]);
	}

	/**
	 * @method getPrivateKey
	 * @param {String} accountPublicKey
	 * @returns {Promise<String>}
	 */
	getPrivateKey(accountPublicKey) {
		return this.wsRpc.call([0, 'get_private_key', [publicKey.toRaw(accountPublicKey)]]);
	}

	/**
	 * @method loadWalletFile
	 * @param {String} walletFilename
	 * @returns {Promise<Boolean>}
	 */
	loadWalletFile(walletFilename) {
		return this.wsRpc.call([0, 'load_wallet_file', [string.toRaw(walletFilename)]]);
	}

	/**
	 * @method normalizeBrainKey
	 * @param {String} brainKey
	 * @returns {Promise<String>}
	 */
	normalizeBrainKey(brainKey) {
		return this.wsRpc.call([0, 'normalize_brain_key', [string.toRaw(brainKey)]]);
	}

	/**
	 * @method saveWalletFile
	 * @param {String} walletFilename
	 * @returns {Promise<void>}
	 */
	saveWalletFile(walletFilename) {
		return this.wsRpc.call([0, 'save_wallet_file', [string.toRaw(walletFilename)]]);
	}

	/**
	 * @method listMyAccounts
	 *
	 * @returns {Promise<Object[]>}
	 */
	listMyAccounts() {
		return this.wsRpc.call([0, 'list_my_accounts', []]);
	}

	/**
	 * @method listAccounts
	 * @param {String} accountName
	 * @param {Number} limit
	 * @returns {Promise<[string, string][]>}
	 */
	listAccounts(accountName, limit = API_CONFIG.LIST_ACCOUNTS_DEFAULT_LIMIT) {
		if (limit > API_CONFIG.LIST_ACCOUNTS_MAX_LIMIT) {
			throw new Error(`field 'limit' should be less than or equals to ${API_CONFIG.LIST_ACCOUNTS_MAX_LIMIT}`);
		}
		return this.wsRpc.call([0, 'list_accounts', [string.toRaw(accountName), uint32.toRaw(limit)]]);
	}

	/**
	 * @method listAccountBalances
	 * @param {String} idOfAccount
	 * @returns {Promise<Asset[]>}
	 */
	listAccountBalances(idOfAccount) {
		return this.wsRpc.call([0, 'list_account_balances', [accountId.toRaw(idOfAccount)]]);
	}

	/**
	 * @method listIdBalances
	 * @param {String} idOfAccount
	 * @returns {Promise<Asset[]>}
	 */
	listIdBalances(idOfAccount) {
		return this.wsRpc.call([0, 'list_id_balances', [accountId.toRaw(idOfAccount)]]);
	}

	/**
	 * @method registerAccount
	 * @param  {String} name
	 * @param  {String} activeKey
	 * @param  {String} registrarAccountId
	 * @param  {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	registerAccount(name, activeKey, registrarAccountId, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'register_account', [
			string.toRaw(name),
			publicKey.toRaw(activeKey),
			accountId.toRaw(registrarAccountId),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method createAccountWithBrainKey
	 * @param {String} brainKey
	 * @param {String} accountName
	 * @param {String} registrarAccountId
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	createAccountWithBrainKey(brainKey, accountName, registrarAccountId, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'create_account_with_brain_key', [
			string.toRaw(brainKey),
			string.toRaw(accountName),
			accountId.toRaw(registrarAccountId),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method createContract
	 * @param {String} registrarAccountName
	 * @param {String} contractCode
	 * @param {Number} amount
	 * @param {String} assetType
	 * @param {String} supportedAssetId
	 * @param {Boolean} useEthereumAssetAccuracy
	 * @param {Boolean} shouldSaveToWallet
	 * @returns {Promise<Object>}
	 */
	createContract(
		registrarAccountName,
		contractCode,
		amount,
		assetType,
		supportedAssetId,
		useEthereumAssetAccuracy,
		shouldSaveToWallet,
	) {
		return this.wsRpc.call([0, 'create_contract', [
			string.toRaw(registrarAccountName),
			string.toRaw(contractCode),
			uint64.toRaw(amount),
			string.toRaw(assetType),
			assetId.toRaw(supportedAssetId),
			bool.toRaw(useEthereumAssetAccuracy),
			bool.toRaw(shouldSaveToWallet),
		]]);
	}

	/**
	 * @method callContract
	 * @param {String} registrarAccountName
	 * @param {String} idOfContract
	 * @param {String} contractCode
	 * @param {Number} amount
	 * @param {String} assetType
	 * @param {Boolean} shouldSaveToWallet
	 * @returns {Promise<Object>}
	 */
	callContract(
		registrarAccountName,
		idOfContract,
		contractCode,
		amount,
		assetType,
		shouldSaveToWallet,
	) {
		return this.wsRpc.call([0, 'call_contract', [
			string.toRaw(registrarAccountName),
			contractId.toRaw(idOfContract),
			string.toRaw(contractCode),
			uint64.toRaw(amount),
			string.toRaw(assetType),
			bool.toRaw(shouldSaveToWallet),
		]]);
	}

	/**
	 * @method contractFundFeePool
	 * @param {String} registrarAccountName
	 * @param {String} idOfContract
	 * @param {Number} amount
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	contractFundFeePool(registrarAccountName, idOfContract, amount, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'contract_fund_fee_pool', [
			string.toRaw(registrarAccountName),
			contractId.toRaw(idOfContract),
			uint64.toRaw(amount),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method getContractResult
	 * @param {String} contractResultId
	 * @returns {Promise<Object>}
	 */
	getContractResult(contractResultId) {
		return this.wsRpc.call([0, 'get_contract_result', [string.toRaw(contractResultId)]]);
	}

	/**
	 * @method transfer
	 * @param {String} fromAccountNameOrId
	 * @param {String} toAccountNameOrId
	 * @param {String} amount
	 * @param {String} assetIdOrName
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	transfer(fromAccountNameOrId, toAccountNameOrId, amount, assetIdOrName, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'transfer', [
			string.toRaw(fromAccountNameOrId),
			string.toRaw(toAccountNameOrId),
			string.toRaw(amount),
			string.toRaw(assetIdOrName),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method transfer2
	 * @param {String} fromAccountNameOrId
	 * @param {String} toAccountNameOrId
	 * @param {String} amount
	 * @param {String} assetIdOrName
	 * @returns {Promise<Array>}
	 */
	transfer2(fromAccountNameOrId, toAccountNameOrId, amount, assetIdOrName) {
		return this.wsRpc.call([0, 'transfer2', [
			string.toRaw(fromAccountNameOrId),
			string.toRaw(toAccountNameOrId),
			string.toRaw(amount),
			string.toRaw(assetIdOrName),
		]]);
	}

	/**
	 * @method whitelistAccount
	 * @param {String} authorizingAccount
	 * @param {String} accountToList
	 * @param {Number} newListingStatus
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	whitelistAccount(authorizingAccount, accountToList, newListingStatus, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'whitelist_account', [
			string.toRaw(authorizingAccount),
			string.toRaw(accountToList),
			accountListing.toRaw(newListingStatus),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method getVestingBalances
	 * @param {String} accountNameOrId
	 * @returns {Promise<Object[]>}
	 */
	getVestingBalances(accountNameOrId) {
		return this.wsRpc.call([0, 'get_vesting_balances', [string.toRaw(accountNameOrId)]]);
	}

	/**
	 * @method withdrawVesting
	 * @param {String} witnessAccountNameOrId
	 * @param {String} amount
	 * @param {String} assetSymbol
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	withdrawVesting(witnessAccountNameOrId, amount, assetSymbol, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'withdraw_vesting', [
			string.toRaw(witnessAccountNameOrId),
			string.toRaw(amount),
			string.toRaw(assetSymbol),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method getAccount
	 * @param {String} accountNameOrId
	 * @returns {Promise<Object>}
	 */
	getAccount(accountNameOrId) {
		return this.wsRpc.call([0, 'get_account', [string.toRaw(accountNameOrId)]]);
	}

	/**
	 * @method getAccountId
	 * @param {String} accountName
	 * @returns {Promise<String>}
	 */
	getAccountId(accountName) {
		return this.wsRpc.call([0, 'get_account_id', [string.toRaw(accountName)]]);
	}

	/**
	 * @method getAccountHistory
	 * @param {String} accountIdOrName
	 * @param {Number} limit
	 * @returns {Promise<Object[]>}
	 */
	getAccountHistory(accountIdOrName, limit = API_CONFIG.ACCOUNT_HISTORY_DEFAULT_LIMIT) {
		if (limit > API_CONFIG.ACCOUNT_HISTORY_MAX_LIMIT) {
			throw new Error(`field 'limit' should be less than or equals to ${API_CONFIG.ACCOUNT_HISTORY_MAX_LIMIT}`);
		}

		return this.wsRpc.call([0, 'get_account_history', [string.toRaw(accountIdOrName), int64.toRaw(limit)]]);
	}

	/**
	 * @method getRelativeAccountHistory
	 * Get operations relevant to the specified account referenced by an event numbering specific to the account.
	 *
	 * @param {String} accountIdOrName
	 * @param {Number} stop [Sequence number of earliest operation]
	 * @param {Number} limit [count operations (max 100)]
	 * @param {Number} start [Sequence number of the most recent operation to retrieve]
	 * @returns {Promise<Object[]>}
	 */
	async getRelativeAccountHistory(
		accountIdOrName,
		stop = API_CONFIG.RELATIVE_ACCOUNT_HISTORY_STOP,
		limit = API_CONFIG.RELATIVE_ACCOUNT_HISTORY_DEFAULT_LIMIT,
		start = API_CONFIG.RELATIVE_ACCOUNT_HISTORY_START,
	) {
		const maxLimitValue = API_CONFIG.RELATIVE_ACCOUNT_HISTORY_MAX_LIMIT;
		if (limit > maxLimitValue) {
			throw new Error(`field 'limit' should be less than or equals to ${maxLimitValue}`);
		}
		return this.wsRpc.call([0, 'get_relative_account_history', [
			string.toRaw(accountIdOrName),
			uint64.toRaw(stop),
			int64.toRaw(limit),
			uint64.toRaw(start),
		]]);
	}

	/**
	 * @method getContractObject
	 * @param {String} idOfContract
	 * @returns {Promise<Object>}
	 */
	getContractObject(idOfContract) {
		return this.wsRpc.call([0, 'get_contract_object', [contractId.toRaw(idOfContract)]]);
	}

	/**
	 * @method getContract
	 * @param {String} idOfContract
	 * @returns {Promise<Object>}
	 */
	getContract(idOfContract) {
		return this.wsRpc.call([0, 'get_contract', [contractId.toRaw(idOfContract)]]);
	}

	/**
	 * @method whitelistContractPool
	 * @param {String} registrarAccountId
	 * @param {String} idOfContract
	 * @param {Array<String>} addToWhitelist
	 * @param {Array<String>} addToBlacklist
	 * @param {Array<String>} removeFromWhitelist
	 * @param {Array<String>} removeFromBlacklist
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	whitelistContractPool(
		registrarAccountId,
		idOfContract,
		addToWhitelist,
		addToBlacklist,
		removeFromWhitelist,
		removeFromBlacklist,
		shouldDoBroadcastToNetwork,
	) {
		return this.wsRpc.call([0, 'whitelist_contract_pool', [
			accountId.toRaw(registrarAccountId),
			contractId.toRaw(idOfContract),
			vector(string).toRaw(addToWhitelist),
			vector(string).toRaw(addToBlacklist),
			vector(string).toRaw(removeFromWhitelist),
			vector(string).toRaw(removeFromBlacklist),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method callContractNoChangingState
	 * @param {String} idOfContract
	 * @param {String} registrarAccountId
	 * @param {String} assetType
	 * @param {String} codeOfTheContract
	 * @returns {Promise<String>}
	 */
	callContractNoChangingState(idOfContract, registrarAccountId, assetType, codeOfTheContract) {
		return this.wsRpc.call([0, 'call_contract_no_changing_state', [
			contractId.toRaw(idOfContract),
			accountId.toRaw(registrarAccountId),
			string.toRaw(assetType),
			string.toRaw(codeOfTheContract),
		]]);
	}

	/**
	 * @method getContractPoolBalance
	 * @param {String} idOfContract
	 * @returns {Promise<Asset>}
	 */
	getContractPoolBalance(idOfContract) {
		return this.wsRpc.call([0, 'get_contract_pool_balance', [contractId.toRaw(idOfContract)]]);
	}

	/**
	 * @method getContractPoolWhitelist
	 * @param {String} idOfContract
	 * @returns {Promise<Object>}
	 */
	getContractPoolWhitelist(idOfContract) {
		return this.wsRpc.call([0, 'get_contract_pool_whitelist', [contractId.toRaw(idOfContract)]]);
	}

	/**
	 * @method getEthAddress
	 * @param {String} idOfAccount
	 * @returns {Promise<string | undefined>}
	 */
	getEthAddress(idOfAccount) {
		return this.wsRpc.call([0, 'get_eth_address', [accountId.toRaw(idOfAccount)]]);
	}

	/**
	 * @method getAccountDeposits
	 * @param {String} idOfAccount
	 * @returns {Promise<Object[]>}
	 */
	getAccountDeposits(idOfAccount) {
		return this.wsRpc.call([0, 'get_account_deposits', [accountId.toRaw(idOfAccount)]]);
	}

	/**
	 * @method registerErc20Token
	 * @param {String} idOfAccount
	 * @param {String} ethereumTokenAddress
	 * @param {String} tokenName
	 * @param {String} tokenSymbol
	 * @param {Number} decimals
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	registerErc20Token(
		idOfAccount,
		ethereumTokenAddress,
		tokenName,
		tokenSymbol,
		decimals,
		shouldDoBroadcastToNetwork,
	) {
		return this.wsRpc.call([0, 'register_erc20_token', [
			accountId.toRaw(idOfAccount),
			string.toRaw(ethereumTokenAddress),
			string.toRaw(tokenName),
			string.toRaw(tokenSymbol),
			uint8.toRaw(decimals),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method getErc20Token
	 * @param {String} ethereumTokenAddress
	 * @returns {Promise<Object | undefined>}
	 */
	getErc20Token(ethereumTokenAddress) {
		return this.wsRpc.call([0, 'get_erc20_token', [ethAddress.toRaw(ethereumTokenAddress)]]);
	}

	/**
	 * @method getErc20Token
	 * @param {String} idOfContract
	 * @returns {Promise<Boolean>}
	 */
	checkErc20Token(idOfContract) {
		return this.wsRpc.call([0, 'check_erc20_token', [contractId.toRaw(idOfContract)]]);
	}

	/**
	 * @method getErc20AccountDeposits
	 * @param {String} idOfAccount
	 * @returns {Promise<Object[]>}
	 */
	getErc20AccountDeposits(idOfAccount) {
		return this.wsRpc.call([0, 'get_erc20_account_deposits', [accountId.toRaw(idOfAccount)]]);
	}

	/**
	 * @method getErc20AccountWithdrawals
	 * @param {String} idOfAccount
	 * @returns {Promise<Object[]>}
	 */
	getErc20AccountWithdrawals(idOfAccount) {
		return this.wsRpc.call([0, 'get_erc20_account_withdrawals', [accountId.toRaw(idOfAccount)]]);
	}

	/**
	 * @method withdrawErc20Token
	 * @param {String} idOfAccount
	 * @param {String} toEthereumAddress
	 * @param {String} idOferc20Token
	 * @param {String} withdrawAmount
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	withdrawErc20Token(idOfAccount, toEthereumAddress, idOferc20Token, withdrawAmount, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'withdraw_erc20_token', [
			accountId.toRaw(idOfAccount),
			string.toRaw(toEthereumAddress),
			erc20TokenId.toRaw(idOferc20Token),
			string.toRaw(withdrawAmount),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method generateAccountAddress
	 * @param {String} idOfAccount
	 * @param {String} label
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	generateAccountAddress(idOfAccount, label, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'generate_account_address', [
			accountId.toRaw(idOfAccount),
			string.toRaw(label),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method getAccountAddresses
	 * @param {String} idOfAccount
	 * @param {Number} startFrom
	 * @param {Number} limit
	 * @returns {Promise<Object[]>}
	 */
	getAccountAddresses(idOfAccount, startFrom, limit) {
		return this.wsRpc.call([0, 'get_account_addresses', [
			accountId.toRaw(idOfAccount),
			uint64.toRaw(startFrom),
			uint64.toRaw(limit),
		]]);
	}

	/**
	 * @method getAccountByAddress
	 * @param {String} address
	 * @returns {Promise<string | undefined>}
	 */
	getAccountByAddress(address) {
		return this.wsRpc.call([0, 'get_account_by_address', [ripemd160.toRaw(address)]]);
	}

	/**
	 * @method getAccountWithdrawals
	 * @param {String} idOfAccount
	 * @returns {Promise<Object[]>}
	 */
	getAccountWithdrawals(idOfAccount) {
		return this.wsRpc.call([0, 'get_account_withdrawals', [accountId.toRaw(idOfAccount)]]);
	}

	/**
	 * @method approveProposal
	 * @param {String} feePayingAccountId
	 * @param {String} idOfProposal
	 * @param {Object} delta
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	approveProposal(feePayingAccountId, idOfProposal, delta, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'approve_proposal', [
			accountId.toRaw(feePayingAccountId),
			proposalId.toRaw(idOfProposal),
			wallet.toRaw(delta),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method generateEthAddress
	 * @param {String} accountIdOrName
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	generateEthAddress(accountIdOrName, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'generate_eth_address', [
			string.toRaw(accountIdOrName),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method withdrawEth
	 * @param {String} accountIdOrName
	 * @param {String} ethOfAddress
	 * @param {Number} value
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	withdrawEth(accountIdOrName, ethOfAddress, value, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'withdraw_eth', [
			string.toRaw(accountIdOrName),
			string.toRaw(ethOfAddress),
			uint64.toRaw(value),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method floodNetwork
	 * @param {String} prefix
	 * @param {String} numberOfTransactions
	 * @returns {Promise<void>}
	 */
	floodNetwork(prefix, numberOfTransactions) {
		return this.wsRpc.call([0, 'flood_network', [string.toRaw(prefix), uint32.toRaw(numberOfTransactions)]]);
	}

	/**
	 * @method listAssets
	 * @param {String} lowerBoundSymbol
	 * @param {Number} limit
	 * @return {Promise<Asset[]>}
	 */
	listAssets(lowerBoundSymbol, limit = API_CONFIG.LIST_ASSETS_DEFAULT_LIMIT) {
		if (limit > API_CONFIG.LIST_ASSETS_MAX_LIMIT) {
			throw new Error(`field 'limit' should be less than or equals to ${API_CONFIG.LIST_ASSETS_MAX_LIMIT}`);
		}
		return this.wsRpc.call([0, 'list_assets', [string.toRaw(lowerBoundSymbol), uint32.toRaw(limit)]]);
	}

	/**
	 * @method createAsset
	 * @param {String} accountIdOrName
	 * @param {String} symbol
	 * @param {Number} precision
	 * @param {Object} assetOption
	 * @param {Object} bitassetOpts
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	createAsset(accountIdOrName, symbol, precision, assetOption, bitassetOpts, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'create_asset', [
			string.toRaw(accountIdOrName),
			string.toRaw(symbol),
			uint8.toRaw(precision),
			options.toRaw(assetOption),
			optional(bitassetOptions).toRaw(bitassetOpts),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method updateAsset
	 * @param {String} assetIdOrName
	 * @param {String} newIssuerIdOrName
	 * @param {Object} newOptions
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	updateAsset(assetIdOrName, newIssuerIdOrName, newOptions, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'update_asset', [
			string.toRaw(assetIdOrName),
			string.toRaw(newIssuerIdOrName),
			options.toRaw(newOptions),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method updateBitasset
	 * @param {String} assetIdOrName
	 * @param {Object} newBitasset
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	updateBitasset(assetIdOrName, newBitasset, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'update_bitasset', [
			string.toRaw(assetIdOrName),
			bitassetOptions.toRaw(newBitasset),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method updateAssetFeedProducers
	 * @param {String} assetIdOrName
	 * @param {Array<String>} newFeedProducers
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	updateAssetFeedProducers(assetIdOrName, newFeedProducers, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'update_asset_feed_producers', [
			string.toRaw(assetIdOrName),
			vector(string).toRaw(newFeedProducers),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method publishAssetFeed
	 * @param {String} idOfAccount
	 * @param {String} assetIdOrName
	 * @param {Object} priceOfFeed
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	publishAssetFeed(idOfAccount, assetIdOrName, priceOfFeed, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'publish_asset_feed', [
			accountId.toRaw(idOfAccount),
			string.toRaw(assetIdOrName),
			priceFeed.toRaw(priceOfFeed),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method issueAsset
	 * @param {String} accountIdOrName
	 * @param {String} amount
	 * @param {String} assetTicker
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	issueAsset(accountIdOrName, amount, assetTicker, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'issue_asset', [
			string.toRaw(accountIdOrName),
			string.toRaw(amount),
			string.toRaw(assetTicker),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method getAsset
	 * @param {String} assetIdOrName
	 * @returns {Promise<Object>}
	 */
	getAsset(assetIdOrName) { return this.wsRpc.call([0, 'get_asset', [string.toRaw(assetIdOrName)]]); }

	/**
	 * @method getBitassetData
	 * @param {String} bitassetIdOrName
	 * @returns {Promise<Object>}
	 */
	getBitassetData(bitassetIdOrName) {
		return this.wsRpc.call([0, 'get_bitasset_data', [string.toRaw(bitassetIdOrName)]]);
	}

	/**
	 * @method fundAssetFeePool
	 * @param {String} fromAccountIdOrName
	 * @param {String} assetIdOrName
	 * @param {String} amount
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	fundAssetFeePool(fromAccountIdOrName, assetIdOrName, amount, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'fund_asset_fee_pool', [
			string.toRaw(fromAccountIdOrName),
			string.toRaw(assetIdOrName),
			string.toRaw(amount),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method reserveAsset
	 * @param {String} accountIdOrName
	 * @param {String} amount
	 * @param {String} assetIdOrName
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	reserveAsset(accountIdOrName, amount, assetIdOrName, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'reserve_asset', [
			string.toRaw(accountIdOrName),
			string.toRaw(amount),
			string.toRaw(assetIdOrName),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method createCommitteeMember
	 * @param {String} accountIdOrName
	 * @param {String} url
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	createCommitteeMember(accountIdOrName, url, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'create_committee_member', [
			string.toRaw(accountIdOrName),
			string.toRaw(url),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method setDesiredCommitteeMemberCount
	 * @param {String} accountIdOrName
	 * @param {Number} desiredNumberOfCommitteeMembers
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	setDesiredCommitteeMemberCount(accountIdOrName, desiredNumberOfCommitteeMembers, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'set_desired_committee_member_count', [
			string.toRaw(accountIdOrName),
			uint16.toRaw(desiredNumberOfCommitteeMembers),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method getCommitteeMember
	 * @param {String} accountIdOrName
	 * @returns {Promise<Object>}
	 */
	getCommitteeMember(accountIdOrName) {
		return this.wsRpc.call([0, 'get_committee_member', [string.toRaw(accountIdOrName)]]);
	}

	/**
	 * @method listCommitteeMembers
	 * @param {String} lowerBoundName
	 * @param {Number} limit
	 * @returns {Promise<[string, string][]>}
	 */
	listCommitteeMembers(lowerBoundName, limit = API_CONFIG.COMMITTEE_MEMBER_ACCOUNTS_DEFAULT_LIMIT) {
		const maxLimitValue = API_CONFIG.COMMITTEE_MEMBER_ACCOUNTS_MAX_LIMIT;
		if (limit > maxLimitValue) {
			throw new Error(`field 'limit' should be less than or equals to ${maxLimitValue}`);
		}
		return this.wsRpc.call([0, 'list_committee_members', [string.toRaw(lowerBoundName), uint64.toRaw(limit)]]);
	}

	/**
	 * @method voteForCommitteeMember
	 * @param {String} votingAccountIdOrName
	 * @param {String} ownerOfCommitteeMember
	 * @param {Boolean} approveYourVote
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	voteForCommitteeMember(votingAccountIdOrName, ownerOfCommitteeMember, approveYourVote, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'vote_for_committee_member', [
			string.toRaw(votingAccountIdOrName),
			string.toRaw(ownerOfCommitteeMember),
			bool.toRaw(approveYourVote),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method setVotingProxy
	 * @param {String} accountIdOrNameToUpdate
	 * @param {String} votingAccountIdOrName
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	setVotingProxy(accountIdOrNameToUpdate, votingAccountIdOrName, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'set_voting_proxy', [
			string.toRaw(accountIdOrNameToUpdate),
			string.toRaw(votingAccountIdOrName),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method proposeParameterChange
	 * @param {String} idOfAccount
	 * @param {Number} expirationTime
	 * @param {Object} changedValues
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	proposeParameterChange(idOfAccount, expirationTime, changedValues, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'propose_parameter_change', [
			accountId.toRaw(idOfAccount),
			timePointSec.toRaw(expirationTime),
			variantObject.toRaw(changedValues),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method proposeFeeChange
	 * @param {String} idOfAccount
	 * @param {Number} expirationTime
	 * @param {Object} changedValues
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	proposeFeeChange(idOfAccount, expirationTime, changedValues, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'propose_fee_change', [
			accountId.toRaw(idOfAccount),
			timePointSec.toRaw(expirationTime),
			variantObject.toRaw(changedValues),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method changeSidechainConfig
	 * @param {String} registrarAccountId
	 * @param {Object} changedValues
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	changeSidechainConfig(registrarAccountId, changedValues, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'change_sidechain_config', [
			accountId.toRaw(registrarAccountId),
			config.toRaw(changedValues),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method getBlock
	 * @param {Number} blockNum
	 * @return {Promise<Object | undefined>}
	 */
	getBlock(blockNum) { return this.wsRpc.call([0, 'get_block', [uint32.toRaw(blockNum)]]); }

	/**
	 * @method getBlockVirtualOps
	 * @param {Number} blockNum
	 * @return {Promise<Object[]>}
	 */
	getBlockVirtualOps(blockNum) { return this.wsRpc.call([0, 'get_block_virtual_ops', [uint32.toRaw(blockNum)]]); }

	/**
	 * @method getAccountCount
	 * @return {Promise<number | string>}
	 */
	getAccountCount() { return this.wsRpc.call([0, 'get_account_count', []]); }

	/**
	 * @method getGlobalProperties
	 * @return {Promise<Object>}
	 */
	getGlobalProperties() { return this.wsRpc.call([0, 'get_global_properties', []]); }

	/**
	 * @method getDynamicGlobalProperties
	 *
	 * @return {Promise<Object>}
	 */
	getDynamicGlobalProperties() { return this.wsRpc.call([0, 'get_dynamic_global_properties', []]); }

	/**
	 * @method getObject
	 * @param {String} objectId
	 * @returns {Promise<any>}
	 */
	getObject(objectId) { return this.wsRpc.call([0, 'get_object', [anyObjectId.toRaw(objectId)]]); }

	/**
	 * @method beginBuilderTransaction
	 *
	 * @returns {Promise<Number>}
	 */
	beginBuilderTransaction() { return this.wsRpc.call([0, 'begin_builder_transaction', []]); }

	/**
	 * @method addOperationToBuilderTransaction
	 * @param {Number} transactionTypeHandle
	 * @param {Array<String>} newOperation
	 * @returns {Promise<void>}
	 */
	addOperationToBuilderTransaction(transactionTypeHandle, newOperation) {
		return this.wsRpc.call([0, 'add_operation_to_builder_transaction', [
			uint16.toRaw(transactionTypeHandle),
			operation.toRaw(newOperation),
		]]);
	}

	/**
	 * @method replaceOperationInBuilderTransaction
	 * @param {Number} transactionTypeHandle
	 * @param {Number} unsignedOperation
	 * @param {Array<String>} newOperation
	 * @returns {Promise<void>}
	 */
	replaceOperationInBuilderTransaction(transactionTypeHandle, unsignedOperation, newOperation) {
		return this.wsRpc.call([0, 'replace_operation_in_builder_transaction', [
			uint16.toRaw(transactionTypeHandle),
			uint64.toRaw(unsignedOperation),
			operation.toRaw(newOperation),
		]]);
	}

	/**
	 * @method setFeesOnBuilderTransaction
	 * @param {Number} transactionTypeHandle
	 * @param {String} feeAsset
	 * @returns {Promise<Asset>}
	 */
	setFeesOnBuilderTransaction(transactionTypeHandle, feeAsset) {
		return this.wsRpc.call([0, 'set_fees_on_builder_transaction', [
			uint16.toRaw(transactionTypeHandle),
			string.toRaw(feeAsset),
		]]);
	}

	/**
	 * @method previewBuilderTransaction
	 * @param {Number} transactionTypeHandle
	 * @returns {Promise<Object>}
	 */
	previewBuilderTransaction(transactionTypeHandle) {
		return this.wsRpc.call([0, 'preview_builder_transaction', [uint64.toRaw(transactionTypeHandle)]]);
	}

	/**
	 * @method signBuilderTransaction
	 * @param {Number} transactionTypeHandle
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	signBuilderTransaction(transactionTypeHandle, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'sign_builder_transaction', [
			uint16.toRaw(transactionTypeHandle),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method proposeBuilderTransaction
	 * @param {Number} transactionTypeHandle
	 * @param {String} expirationTime
	 * @param {Number} reviewPeriod
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	proposeBuilderTransaction(transactionTypeHandle, expirationTime, reviewPeriod, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'propose_builder_transaction', [
			uint16.toRaw(transactionTypeHandle),
			timePointSec.toRaw(expirationTime),
			uint32.toRaw(reviewPeriod),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method proposeBuilderTransaction2
	 * @param {Number} transactionTypeHandle
	 * @param {String} accountIdOrName
	 * @param {String} expirationTime
	 * @param {Number} reviewPeriod
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<Object>}
	 */
	proposeBuilderTransaction2(
		transactionTypeHandle,
		accountIdOrName,
		expirationTime,
		reviewPeriod,
		shouldDoBroadcastToNetwork,
	) {
		return this.wsRpc.call([0, 'propose_builder_transaction2', [
			uint16.toRaw(transactionTypeHandle),
			string.toRaw(accountIdOrName),
			timePointSec.toRaw(expirationTime),
			uint32.toRaw(reviewPeriod),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method removeBuilderTransaction
	 * @param {Number} transactionTypeHandle
	 * @returns {Promise<void>}
	 */
	removeBuilderTransaction(transactionTypeHandle) {
		return this.wsRpc.call([0, 'remove_builder_transaction', [uint16.toRaw(transactionTypeHandle)]]);
	}

	/**
	 * @method serializeTransaction
	 * @param {Object} tr
	 * @returns {Promise<String>}
	 */
	serializeTransaction(tr) { return this.wsRpc.call([0, 'serialize_transaction', [signedTransaction.toRaw(tr)]]); }

	/**
	 * @method signTransaction
	 * @param {Object} tr
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	signTransaction(tr, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'sign_transaction', [
			transaction.toRaw(tr),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * @method getPrototypeOperation
	 * @param {String} operationType
	 * @returns {Promise<Operation>}
	 */
	getPrototypeOperation(operationType) {
		return this.wsRpc.call([0, 'get_prototype_operation', [string.toRaw(operationType)]]);
	}

}

export default WalletAPI;
