import {
	isNumber,
	isArray,
	isObjectId,
	isBoolean,
	isAssetName,
	isAccountId,
	isAccountName,
	isString,
	isAssetId,
	isObject,
	isPublicKey,
	isVoteId,
	isCommitteeMemberId,
	isBitAssetId,
	isDynamicAssetDataId,
	isEchoRandKey,
	isOperationId,
	isDynamicGlobalObjectId,
	isUInt8,
	isUInt16,
	isUInt32,
	isUInt64,
	validateUrl,
	isContractId,
	validatePositiveSafeInteger,
} from '../../utils/validators';
import { API_CONFIG } from '../../constants';
import transaction, { signedTransaction } from '../../serializer/transaction-type';

class WalletAPI {

	/**
	 *  @constructor
	 *
	 *  @param {ReconnectionWebSocket} wsRpc
	 */
	constructor(wsRpc) {
		this.wsRpc = wsRpc;
	}

	/**
	 *  @method connect
	 *	@param {String} url - remote node address
	 *	@param {Object} options - connection params.
	 *  @returns {Promise}
	 */
	async connect(url, options) {
		await this.wsRpc.connect(url, options);
	}

	/**
	 *  @method exit
	 *
	 *  @returns {Promise<null>}
	 */
	exit() {
		return this.wsRpc.call([0, 'exit', []]);
	}

	/**
	 *  @method help
	 *
	 *  @returns {Promise<String>}
	 */
	help() {
		return this.wsRpc.call([0, 'help', []]);
	}

	/**
	 *  @method helpMethod
	 *	@param {Array<String>} method
	 *  @returns {Promise<String>}
	 */
	helpMethod(method) {
		if (!isString(method)) throw new Error('method should be a string');

		return this.wsRpc.call([0, 'help_method', [method]]);
	}

	// TODO not working
	/**
	 *  @method info
	 *
	 *  @returns {Promise}
	 */
	info() {
		return this.wsRpc.call([0, 'info', []]);
	}

	/**
	 *  @method about
	 *
	 *  @returns {Promise.<Object>}
	 */
	about() {
		return this.wsRpc.call([0, 'about', []]);
	}

	// TODO check for node need or no?
	/**
	 *  @method networkAddNodes
	 *	@param {Array<String>} nodes
	 *  @returns {Promise<null>}
	 */
	networkAddNodes(nodes) {
		if (!isArray(nodes)) return Promise.reject(new Error('nodes should be a array'));
		if (!nodes.every((node) => isString(node))) {
			return Promise.reject(new Error('nodes should be a string'));
		}

		return this.wsRpc.call([0, 'network_add_nodes', [nodes]]);
	}

	// TODO Promise<Array> of what (string, number?)
	/**
	 *  @method networkGetConnectedPeers
	 *
	 *  @returns {Promise<Array>}
	 */
	networkGetConnectedPeers() {
		return this.wsRpc.call([0, 'network_get_connected_peers', []]);
	}

	/**
	 *  @method isNew
	 *
	 *  @returns {Promise<Boolean>}
	 */
	isNew() {
		return this.wsRpc.call([0, 'is_new', []]);
	}

	/**
	 *  @method isLocked
	 *
	 *  @returns {Promise<Boolean>}
	 */
	isLocked() {
		return this.wsRpc.call([0, 'is_locked', []]);
	}

	/**
	 *  @method lock
	 *
	 *  @returns {Promise<null>}
	 */
	lock() {
		return this.wsRpc.call([0, 'lock', []]);
	}

	/**
	 *  @method unlock
	 *	@param {String} password
	 *  @returns {Promise<null>}
	 */
	unlock(password) {
		if (!isString(password)) throw new Error('password should be a string');

		return this.wsRpc.call([0, 'unlock', [password]]);
	}

	/**
	 *  @method setPassword
	 *	@param {String} password
	 *  @returns {Promise<null>}
	 */
	setPassword(password) {
		if (!isString(password)) throw new Error('password should be a string');

		return this.wsRpc.call([0, 'set_password', [password]]);
	}

	/**
	 *  @method createEddsaKeypair
	 *
	 *  @returns {Promise<Array.<String>>}
	 */
	createEddsaKeypair() {
		return this.wsRpc.call([0, 'create_eddsa_keypair', []]);
	}

	// TODO Promise<Array> of what (string, number?)
	/**
	 *  @method dumpPrivateKeys
	 *
	 *  @returns {Promise<Array.<String>>}
	 */
	dumpPrivateKeys() {
		return this.wsRpc.call([0, 'dump_private_keys', []]);
	}

	/**
	 *  @method oldKeyToWif
	 *	@param {String} privateKey
	 *  @returns {Promise<String>}
	 */
	oldKeyToWif(privateKey) {
		if (!isString(privateKey)) throw new Error('private key should be a string');

		return this.wsRpc.call([0, 'old_key_to_wif', [privateKey]]);
	}

	// TODO check validity and get positive result
	/**
	 *  @method importKey
	 *	@param {String} accountNameOrId
	 *	@param {String} privateKeyWif
	 *  @returns {Promise<Boolean>}
	 */
	importKey(accountNameOrId, privateKeyWif) {
		if (!isAccountId(accountNameOrId) || isAccountName(accountNameOrId)) {
			throw new Error('Accounts id or name should be string and valid');
		}
		if (!isString(privateKeyWif)) throw new Error('private key should be a string');

		return this.wsRpc.call([0, 'import_key', [accountNameOrId, privateKeyWif]]);
	}

	//TODO check validity and get positive result
	/**
	 *  @method importAccounts
	 *	@param {String} filename
	 *	@param {String} password
	 *  @returns {Promise<Boolean>}
	 */
	importAccounts(filename, password) {
		if (!isString(filename)) throw new Error('filename should be a string');
		if (!isString(password)) throw new Error('password should be a string');

		return this.wsRpc.call([0, 'import_accounts', [filename, password]]);
	}

	//TODO check validity and get positive result
	/**
	 *  @method importAccountKeys
	 *	@param {String} filename
	 *	@param {String} password
	 *	@param {String} srcAccountName
	 *	@param {String} destAccountName
	 *  @returns {Promise<Boolean>}
	 */
	importAccountKeys(filename, password, srcAccountName, destAccountName) {
		if (!isString(filename)) throw new Error('filename should be a string');
		if (!isString(password)) throw new Error('password should be a string');
		if (!isAccountName(srcAccountName)) {
			throw new Error('Accounts id or name should be string and valid');
		}
		if (!isAccountName(destAccountName)) {
			throw new Error('Accounts id or name should be string and valid');
		}

		return this.wsRpc.call([0, 'import_account_keys', [filename, password, srcAccountName, destAccountName]]);
	}

	// TODO check args, result and return
	/**
	 *  @method importBalance
	 *	@param {String} accountNameOrId
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *	@param {Array<String>} wifKeys
	 *  @returns {Promise<Boolean>}
	 */
	importBalance(accountNameOrId, shouldDoBroadcastToNetwork, wifKeys) {
		if (!isAccountId(accountNameOrId) || isAccountName(accountNameOrId)) {
			throw new Error('Accounts id or name should be string and valid');
		}
		if (!isArray(wifKeys)) return Promise.reject(new Error('wifKeys should be an array'));
		if (!wifKeys.every((key) => isString(key))) {
			return Promise.reject(new Error('wif key should be a string'));
		}

		return this.wsRpc.call([0, 'import_balance', [accountNameOrId, shouldDoBroadcastToNetwork, wifKeys]]);
	}

	/**
	 *  @method suggestBrainKey
	 *
	 *  @returns {Promise<Object>}
	 */
	suggestBrainKey() {
		return this.wsRpc.call([0, 'suggest_brain_key', []]);
	}

	/**
	 *  @method deriveKeysFromBrainKey
	 *	@param {String} brainKey
	 *	@param {String} numberOfDesiredKeys
	 *  @returns {Promise<Array.<Object>>}
	 */
	deriveKeysFromBrainKey(brainKey, numberOfDesiredKeys) {
		if (!isString(brainKey)) throw new Error('password should be a string');
		validatePositiveSafeInteger(numberOfDesiredKeys);

		return this.wsRpc.call([0, 'derive_keys_from_brain_key', [brainKey, numberOfDesiredKeys]]);
	}

	/**
	 *  @method isPublicKeyRegistered
	 *	@param {String} publicKey
	 *  @returns {Promise<Boolean>}
	 */
	isPublicKeyRegistered(publicKey) {
		if (!isPublicKey(publicKey)) throw new Error('Public key is invalid');

		return this.wsRpc.call([0, 'is_public_key_registered', [publicKey]]);
	}

	// TODO signedTransaction or Unsigned?
	/**
	 *  @method getTransactionId
	 *	@param {String} signedTx
	 *  @returns {Promise<String>}
	 */
	getTransactionId(signedTx) {
		signedTransaction.validate(signedTx);

		return this.wsRpc.call([0, 'get_transaction_id', [signedTx]]);
	}

	// TODO check positive result
	/**
	 *  @method getPrivateKey
	 *	@param {String} publicKey
	 *  @returns {Promise<String>}
	 */
	getPrivateKey(publicKey) {
		if (!isPublicKey(publicKey)) throw new Error('Active public key is invalid');

		return this.wsRpc.call([0, 'get_private_key', [publicKey]]);
	}

	// TODO check positive result (true)
	/**
	 *  @method loadWalletFile
	 *	@param {String} walletFilename
	 *  @returns {Promise<Boolean>}
	 */
	loadWalletFile(walletFilename) {
		if (!isString(walletFilename)) throw new Error('wallet filename should be a string');

		return this.wsRpc.call([0, 'load_wallet_file', [walletFilename]]);
	}

	/**
	 *  @method normalizeBrainKey
	 *	@param {String} brainKey
	 *  @returns {Promise<String>}
	 */
	normalizeBrainKey(brainKey) {
		if (!isString(brainKey)) throw new Error('brain key should be a string');

		return this.wsRpc.call([0, 'normalize_brain_key', [brainKey]]);
	}

	// TODO check not empty file
	/**
	 *  @method saveWalletFile
	 *	@param {String} walletFilename
	 *  @returns {Promise<null>}
	 */
	saveWalletFile(walletFilename) {
		if (!isString(walletFilename)) throw new Error('brain key should be a string');

		return this.wsRpc.call([0, 'save_wallet_file', [walletFilename]]);
	}

	// ACCOUNT CALLS

	/**
	 *  @method listMyAccounts
	 *
	 *  @returns {Promise<Array.<Object>>}
	 */
	listMyAccounts() {
		return this.wsRpc.call([0, 'list_my_accounts', []]);
	}

	/**
	 *  @method listAccounts
	 *	@param {String} accountName
	 *	@param {Number} limit
	 *  @returns {Promise<Array.<Array.<String>>>}
	 */
	listAccounts(accountName, limit = API_CONFIG.LIST_ACCOUNTS_DEFAULT_LIMIT) {
		if (!isString(accountName)) throw new Error('account name should be a string');
		if (!isUInt32(limit) || limit > API_CONFIG.LIST_ACCOUNTS_MAX_LIMIT) {
			throw new Error(`Limit should be a integer and must not exceed ${API_CONFIG.LOOKUP_ACCOUNTS_MAX_LIMIT}`);
		}

		return this.wsRpc.call([0, 'list_accounts', [accountName, limit]]);
	}

	/**
	 *  @method listAccountBalances
	 *	@param {String} accountId
	 *  @returns {Promise<Array.<Object>>}
	 */
	listAccountBalances(accountId) {
		if (!isAccountId(accountId)) throw new Error('account Id is invalid');

		return this.wsRpc.call([0, 'list_account_balances', [accountId]]);
	}

	/**
	 *  @method listIdBalances
	 *	@param {String} accountId
	 *  @returns {Promise<Array.<Object>>}
	 */
	listIdBalances(accountId) {
		if (!isAccountId(accountId)) throw new Error('account Id is invalid');

		return this.wsRpc.call([0, 'list_id_balances', [accountId]]);
	}

	// TODO check result
	/**
	 *  @method registerAccount
	 *
	 *  @param  {String} name
	 * 	@param  {String} activeKey
     * 	@param  {String} registrarAccountId
     * 	@param  {Boolean} shouldDoBroadcastToNetwork
	 *
	 *  @returns {Promise<Object>}
	 */
	registerAccount(name, activeKey, registrarAccountId, shouldDoBroadcastToNetwork) {
		if (!isString(name)) throw new Error('Name should be a string');
		if (!isPublicKey(activeKey)) throw new Error('Active public key is invalid');
		if (!isAccountId(registrarAccountId)) throw new Error('Registrar accountId Id is invalid');

		return this.wsRpc.call([0, 'register_account',
			[name, activeKey, registrarAccountId, shouldDoBroadcastToNetwork],
		]);
	}

	// TODO problems with args check result
	/**
	 *  @method createAccountWithBrainKey
	 *	@param {String} brainKey
	 *	@param {String} accountName
	 *	@param {String} registrarAccountId
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	createAccountWithBrainKey(brainKey, accountName, registrarAccountId, shouldDoBroadcastToNetwork) {
		if (!isAccountId(registrarAccountId)) {
			throw new Error('Accounts id should be string and valid');
		}

		return this.wsRpc.call([
			0, 'create_account_with_brain_key', [
				brainKey, accountName, registrarAccountId, shouldDoBroadcastToNetwork],
		]);
	}

	// TODO problems with args check result
	/**
	 *  @method createContract
	 *	@param {String} registrarAccountName
	 *	@param {String} contractCode
	 *	@param {Number} amount
	 *	@param {String} assetType
	 *	@param {String} supportedAssetId
	 *	@param {Boolean} useEthereumAssetAccuracy
	 *	@param {Boolean} shouldSaveToWallet
	 *  @returns {Promise<Object>}
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
		if (!isAccountName(registrarAccountName)) {
			throw new Error('Accounts name should be string and valid');
		}
		if (!isUInt64(amount)) return Promise.reject(new Error('amount should be a non negative integer'));
		if (!isAssetId(supportedAssetId)) throw new Error('Asset id is invalid');

		return this.wsRpc.call([
			0, 'create_contract', [
				registrarAccountName,
				contractCode,
				amount,
				assetType,
				supportedAssetId,
				useEthereumAssetAccuracy,
				shouldSaveToWallet],
		]);
	}

	// TODO problems with args check result
	/**
	 *  @method callContract
	 *	@param {String} registrarAccountName
	 *	@param {String} contractId
	 *	@param {String} contractCode
	 *	@param {Number} amount
	 *	@param {String} assetType
	 *	@param {Boolean} shouldSaveToWallet
	 *  @returns {Promise<Object>}
	 */
	callContract(
		registrarAccountName,
		contractId,
		contractCode,
		amount,
		assetType,
		shouldSaveToWallet,
	) {
		if (!isAccountName(registrarAccountName)) {
			throw new Error('Accounts name should be string and valid');
		}
		if (!isContractId(contractId)) throw new Error('ContractId is invalid');
		if (!isUInt64(amount)) return Promise.reject(new Error('amount should be a non negative integer'));

		return this.wsRpc.call([
			0, 'call_contract', [
				registrarAccountName,
				contractCode,
				amount,
				assetType,
				shouldSaveToWallet],
		]);
	}

	// TODO problems with args check result
	/**
	 *  @method contractFundFeePool
	 *	@param {String} registrarAccountName
	 *	@param {String} contractId
	 *	@param {Number} amount
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	contractFundFeePool(registrarAccountName, contractId, amount, shouldDoBroadcastToNetwork) {
		if (!isAccountName(registrarAccountName)) {
			throw new Error('Accounts id or name should be string and valid');
		}
		if (!isContractId(contractId)) throw new Error('ContractId is invalid');
		if (!isUInt64(amount)) return Promise.reject(new Error('amount should be a non negative integer'));

		return this.wsRpc.call([0, 'contract_fund_fee_pool',
			[registrarAccountName, contractId, amount, shouldDoBroadcastToNetwork],
		]);
	}

	// TODO  check result
	/**
	 *  @method getContractResult
	 *	@param {String} contractId
	 *  @returns {Promise<Object>}
	 */
	getContractResult(contractId) {
		if (!isContractId(contractId)) throw new Error('Contract id is invalid');

		return this.wsRpc.call([0, 'get_contract_result',
			[contractId],
		]);
	}

	// TODO problems with args
	/**
	 *  @method transfer
	 *	@param {String} fromAccountNameOrId
	 *	@param {String} toAccountNameOrId
	 *	@param {String} amount
	 *	@param {String} assetIdOrName
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	transfer(fromAccountNameOrId, toAccountNameOrId, amount, assetIdOrName, shouldDoBroadcastToNetwork) {
		if (!isAccountId(fromAccountNameOrId) || isAccountName(fromAccountNameOrId)) {
			throw new Error('Accounts id or name should be string and valid');
		}
		if (!isAccountId(toAccountNameOrId) || isAccountName(toAccountNameOrId)) {
			throw new Error('Accounts id or name should be string and valid');
		}
		if (!isAssetId(assetIdOrName) || isAssetName(assetIdOrName)) throw new Error('Asset id or name is invalid');

		return this.wsRpc.call([0, 'transfer',
			[fromAccountNameOrId, toAccountNameOrId, amount, assetIdOrName, shouldDoBroadcastToNetwork],
		]);
	}

	// TODO problems with args
	/**
	 *  @method transfer2
	 *	@param {String} fromAccountNameOrId
	 *	@param {String} toAccountNameOrId
	 *	@param {String} amount
	 *	@param {String} assetIdOrName
	 *  @returns {Promise<Object>}
	 */
	transfer2(fromAccountNameOrId, toAccountNameOrId, amount, assetIdOrName) {
		if (!isAccountId(fromAccountNameOrId) || isAccountName(fromAccountNameOrId)) {
			throw new Error('Accounts id or name should be string and valid');
		}
		if (!isAccountId(toAccountNameOrId) || isAccountName(toAccountNameOrId)) {
			throw new Error('Accounts id or name should be string and valid');
		}
		if (!isAssetId(assetIdOrName) || isAssetName(assetIdOrName)) throw new Error('Asset id or name is invalid');

		return this.wsRpc.call([0, 'transfer2', [fromAccountNameOrId, toAccountNameOrId, amount, assetIdOrName]]);
	}

	// TODO problems with args
	/**
	 *  @method whitelistAccount
	 *	@param {String} authorizingAccount
	 *	@param {String} accountToList
	 *	@param {String} newListingStatus
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	//["1.2.11", "1.2.10", "white_listed", false]
	whitelistAccount(authorizingAccount, accountToList, newListingStatus, shouldDoBroadcastToNetwork) {
		if (!isAccountId(authorizingAccount)) return Promise.reject(new Error('Account id is invalid'));
		if (!isAccountId(accountToList)) return Promise.reject(new Error('Account id is invalid'));

		return this.wsRpc.call([0, 'whitelist_account',
			[authorizingAccount, accountToList, newListingStatus, shouldDoBroadcastToNetwork],
		]);
	}

	/**
	 *  @method getVestingBalances
	 *	@param {String} accountNameOrId
	 *  @returns {Promise<Array>}
	 */
	getVestingBalances(accountNameOrId) {
		if (!(isAccountName(accountNameOrId) || isAccountId(accountNameOrId))) {
			throw new Error('Account name or id is invalid');
		}

		return this.wsRpc.call([0, 'get_vesting_balances', [accountNameOrId]]);
	}

	// TODO problems with args
	/**
	 *  @method withdrawVesting
	 *	@param {String} witnessAccountNameOrId
	 *	@param {String} amount
	 *	@param {String} assetSymbol
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Array>}
	 */
	withdrawVesting(witnessAccountNameOrId, amount, assetSymbol, shouldDoBroadcastToNetwork) {
		if (!(isAccountName(witnessAccountNameOrId) || isAccountId(witnessAccountNameOrId))) {
			throw new Error('Account name or id is invalid');
		}

		return this.wsRpc.call([0, 'withdraw_vesting',
			[witnessAccountNameOrId, amount, assetSymbol, shouldDoBroadcastToNetwork],
		]);
	}

	// TODO check positive result
	/**
	 *  @method getAccount
	 *	@param {String} accountNameOrId
	 *  @returns {Promise<Object>}
	 */
	getAccount(accountNameOrId) {
		if (!(isAccountName(accountNameOrId) || isAccountId(accountNameOrId))) {
			throw new Error('Account name or id is invalid');
		}

		return this.wsRpc.call([0, 'get_account', [accountNameOrId]]);
	}

	// TODO check positive result
	/**
	 *  @method getAccountId
	 *	@param {String} accountName
	 *  @returns {Promise<String>}
	 */
	getAccountId(accountName) {
		if (!(isAccountName(accountName))) {
			throw new Error('Account name or id is invalid');
		}
		return this.wsRpc.call([0, 'get_account_id', [accountName]]);
	}

	// TODO check positive result
	/**
	 *  @method getAccountHistory
	 *	@param {String} accountIdOrName
	 *	@param {Number} limit
	 *  @returns {Promise<Array.<Object>>}
	 */
	getAccountHistory(accountIdOrName, limit) {
		if (!(isAccountName(accountIdOrName) || isAccountId(accountIdOrName))) {
			throw new Error('Account name or id is invalid');
		}
		if (!isUInt64(limit) || limit > API_CONFIG.ACCOUNT_HISTORY_MAX_LIMIT) {
			throw new Error(`Limit should be capped at ${API_CONFIG.ACCOUNT_HISTORY_MAX_LIMIT}`);
		}

		return this.wsRpc.call([0, 'get_account_history', [accountIdOrName, limit]]);
	}

	// TODO check positive result
	/**
	 *  @method getRelativeAccountHistory
	 *  Get operations relevant to the specified account referenced
	 *  by an event numbering specific to the account.
	 *
	 *  @param {String} accountId
	 *  @param {Number} stop [Sequence number of earliest operation]
	 *  @param {Number} limit     [count operations (max 100)]
	 *  @param {Number} start [Sequence number of the most recent operation to retrieve]
	 *
	 *  @return {
	 *  	Promise.<Array.<AccountHistory>>
	 *  }
	 */
	async getRelativeAccountHistory(
		accountId,
		stop = API_CONFIG.RELATIVE_ACCOUNT_HISTORY_STOP,
		limit = API_CONFIG.RELATIVE_ACCOUNT_HISTORY_DEFAULT_LIMIT,
		start = API_CONFIG.RELATIVE_ACCOUNT_HISTORY_START,
	) {
		if (!isAccountId(accountId)) throw new Error('Account is invalid');
		if (!isUInt64(stop)) throw new Error('Stop parameter should be non negative number');
		if (!isUInt64(limit) || limit > API_CONFIG.RELATIVE_ACCOUNT_HISTORY_MAX_LIMIT) {
			throw new Error(`Limit should be capped at ${API_CONFIG.RELATIVE_ACCOUNT_HISTORY_MAX_LIMIT}`);
		}
		if (!isUInt64(start)) throw new Error('Start parameter should be non negative number');

		return this.wsRpc.call([0, 'get_relative_account_history', [accountId, stop, limit, start]]);
	}

	// TODO check positive result
	/**
	 *  @method getContractObject
	 *	@param {String} contractId
	 *  @returns {Promise<Object>}
	 */
	getContractObject(contractId) {
		if (!isContractId(contractId)) throw new Error('Contract id is invalid');

		return this.wsRpc.call([0, 'get_contract_object', [contractId]]);
	}

	// TODO check positive result
	/**
	 *  @method getContract
	 *	@param {String} contractId
	 *  @returns {Promise<Object>}
	 */
	getContract(contractId) {
		if (!isContractId(contractId)) throw new Error('Contract id is invalid');

		return this.wsRpc.call([0, 'get_contract', [contractId]]);
	}

	// TODO check positive result and DOC
	/**
	 *  @method whitelistContractPool
	 *	@param {String} registrarAccountId
	 *	@param {String} contractId
	 *	@param {Array<String>} addToWhitelist
	 *	@param {Array<String>} addToBlacklist
	 *	@param {Array<String>} removeFromWhitelist
	 *	@param {Array<String>} removeFromBlacklist
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	whitelistContractPool(
		registrarAccountId,
		contractId,
		addToWhitelist,
		addToBlacklist,
		removeFromWhitelist,
		removeFromBlacklist,
		shouldDoBroadcastToNetwork,
	) {
		if (!isAccountId(registrarAccountId)) throw new Error('Account id is invalid');
		if (!isContractId(contractId)) throw new Error('Contract id is invalid');

		return this.wsRpc.call([0, 'whitelist_contract_pool',
			[
				registrarAccountId,
				contractId,
				addToWhitelist,
				addToBlacklist,
				removeFromWhitelist,
				removeFromBlacklist,
				shouldDoBroadcastToNetwork,
			],
		]);
	}

	// TODO check positive result
	/**
	 *  @method callContractNoChangingState
	 *	@param {String} contractId
	 *	@param {String} registrarAccountId
	 *	@param {String} assetType
	 *	@param {String} codeOfTheContract
	 *  @returns {Promise<String>}
	 */
	callContractNoChangingState(contractId, registrarAccountId, assetType, codeOfTheContract) {
		if (!isContractId(contractId)) throw new Error('Contract id is invalid');
		if (!isAccountId(registrarAccountId)) throw new Error('Account id is invalid');

		return this.wsRpc.call([0, 'call_contract_no_changing_state',
			[contractId, registrarAccountId, assetType, codeOfTheContract],
		]);
	}

	// TODO check positive result and return
	/**
	 *  @method getContractPoolBalance
	 *	@param {String} contractId
	 *  @returns {Promise<String>}
	 */
	getContractPoolBalance(contractId) {
		if (!isContractId(contractId)) throw new Error('Contract id is invalid');

		return this.wsRpc.call([0, 'get_contract_pool_balance', [contractId]]);
	}

	// TODO check positive result and return
	/**
	 *  @method getContractPoolWhitelist
	 *	@param {String} contractId
	 *  @returns {Promise<String>}
	 */
	getContractPoolWhitelist(contractId) {
		if (!isContractId(contractId)) throw new Error('Contract id is invalid');

		return this.wsRpc.call([0, 'get_contract_pool_whitelist', [contractId]]);
	}

	// TODO check positive result (null or object)?
	/**
	 *  @method getEthAddress
	 *	@param {String} accountId
	 *  @returns {Promise<Object>}
	 */
	getEthAddress(accountId) {
		if (!isAccountId(accountId)) throw new Error('Account id is invalid');

		return this.wsRpc.call([0, 'get_eth_address', [accountId]]);
	}

	// TODO check positive result (array of object)?
	/**
	 *  @method getAccountDeposits
	 *	@param {String} accountId
	 *  @returns {Promise<Array.<Object>>}
	 */
	getAccountDeposits(accountId) {
		if (!isAccountId(accountId)) throw new Error('Account id is invalid');

		return this.wsRpc.call([0, 'get_account_deposits', [accountId]]);
	}

	// TODO check positive result and args
	/**
	 *  @method registerErc20Token
	 *	@param {String} accountId
	 *	@param {String} ethereumTokenAddress
	 *	@param {String} tokenName
	 *	@param {String} tokenSymbol
	 *	@param {Number} decimals
	 *	@param {String} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	registerErc20Token(accountId, ethereumTokenAddress, tokenName, tokenSymbol, decimals, shouldDoBroadcastToNetwork) {
		if (!isAccountId(accountId)) throw new Error('Account id is invalid');
		if (!isUInt8(decimals)) throw new Error('Precision should be a non negative integer');

		return this.wsRpc.call([0, 'register_erc20_token',
			[accountId, ethereumTokenAddress, tokenName, tokenSymbol, decimals, shouldDoBroadcastToNetwork],
		]);
	}

	//TODO check positive result (array of object)?
	/**
	 *  @method getErc20Token
	 *	@param {String} ethereumTokenAddress
	 *  @returns {Promise<Object>}
	 */
	getErc20Token(ethereumTokenAddress) {
		return this.wsRpc.call([0, 'get_erc20_token', [ethereumTokenAddress]]);
	}

	//TODO check positive result //method not exist
	/**
	 *  @method checkErc20Token
	 *	@param {String} accountId
	 *  @returns {Promise<Boolean>}
	 */
	checkErc20Token(accountId) {
		if (!isAccountId(accountId)) throw new Error('Account id is invalid');

		return this.wsRpc.call([0, 'check_erc20_token', [accountId]]);
	}

	// TODO check positive result
	/**
	 *  @method getErc20AccountDeposits
	 *	@param {String} accountId
	 *  @returns {Promise<Array.<Object>>}
	 */
	getErc20AccountDeposits(accountId) {
		if (!isAccountId(accountId)) throw new Error('Account id is invalid');

		return this.wsRpc.call([0, 'get_erc20_account_deposits', [accountId]]);
	}

	// TODO check positive result
	/**
	 *  @method getErc20AccountWithdrawals
	 *	@param {String} accountId
	 *  @returns {Promise<Array.<Object>>}
	 */
	getErc20AccountWithdrawals(accountId) {
		if (!isAccountId(accountId)) throw new Error('Account id is invalid');

		return this.wsRpc.call([0, 'get_erc20_account_withdrawals', [accountId]]);
	}

	// TODO check positive result (array of object)?
	/**
	 *  @method withdrawErc20Token
	 *	@param {String} accountId
	 *	@param {String} toEthereumAddress
	 *	@param {String} erc20TokenId
	 *	@param {String} withdrawAmount
	 *	@param {String} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	withdrawErc20Token(accountId, toEthereumAddress, erc20TokenId, withdrawAmount, shouldDoBroadcastToNetwork) {
		if (!isAccountId(accountId)) throw new Error('Account id is invalid');

		return this.wsRpc.call([0, 'withdraw_erc20_token',
			[accountId, toEthereumAddress, erc20TokenId, withdrawAmount, shouldDoBroadcastToNetwork],
		]);
	}

	// TODO check positive result
	/**
	 *  @method generateAccountAddress
	 *	@param {String} accountId
	 *	@param {String} label
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	generateAccountAddress(accountId, label, shouldDoBroadcastToNetwork) {
		if (!isAccountId(accountId)) throw new Error('Account id is invalid');

		return this.wsRpc.call([0, 'generate_account_address', [accountId, label, shouldDoBroadcastToNetwork]]);
	}

	//TODO check positive result?
	/**
	 *  @method getAccountAddresses
	 *	@param {String} accountId
	 *	@param {Number} startFrom
	 *	@param {Number} limit
	 *  @returns {Promise<Array.<Object>>}
	 */
	getAccountAddresses(accountId, startFrom, limit) {
		if (!isAccountId(accountId)) throw new Error('Account id is invalid');
		if (!isUInt64(startFrom)) throw new Error('Start from parameter should be non negative number');
		if (!isNumber(limit)) throw new Error('Limit should be non negative integer');

		return this.wsRpc.call([0, 'get_account_addresses', [accountId, startFrom, limit]]);
	}

	//TODO check positive result
	/**
	 *  @method getAccountByAddress
	 *	@param {String} address
	 *  @returns {Promise<String>}
	 */
	getAccountByAddress(address) {
		return this.wsRpc.call([0, 'get_account_by_address', [address]]);
	}

	// TODO check positive result (array of object)?
	/**
	 *  @method getAccountWithdrawals
	 *	@param {String} accountId
	 *  @returns {Promise<Array.<Object>>}
	 */
	getAccountWithdrawals(accountId) {
		if (!isAccountId(accountId)) throw new Error('Account id is invalid');

		return this.wsRpc.call([0, 'get_account_withdrawals', [accountId]]);
	}

	// TODO pr-ms with args
	/**
	 *  @method approveProposal
	 *	@param {String} feePayingAccountId
	 *	@param {String} proposalId
	 *	@param {Object} delta
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	approveProposal(feePayingAccountId, proposalId, delta, shouldDoBroadcastToNetwork) {
		if (!isAccountId(feePayingAccountId)) {
			throw new Error('Account id is invalid');
		}
		if (!isString(proposalId)) throw new Error('proposal Id should be a string');
		if (!isObject(delta)) throw new Error('delta should be a object');

		return this.wsRpc.call([0, 'approve_proposal',
			[feePayingAccountId, proposalId, delta, shouldDoBroadcastToNetwork],
		]);
	}

	// TODO check positive result (array of object)?
	/**
	 *  @method generateEthAddress
	 *	@param {String} accountId
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	generateEthAddress(accountId, shouldDoBroadcastToNetwork) {
		if (!isAccountId(accountId)) throw new Error('Account id is invalid');

		return this.wsRpc.call([0, 'generate_eth_address', [accountId, shouldDoBroadcastToNetwork]]);
	}

	// TODO check positive result (array of object)?
	/**
	 *  @method withdrawEth
	 *	@param {String} accountId
	 *	@param {String} ethAddress
	 *	@param {String} value
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	withdrawEth(accountId, ethAddress, value, shouldDoBroadcastToNetwork) {
		if (!isAccountId(accountId)) throw new Error('Account id is invalid');
		if (!isUInt64(value)) return Promise.reject(new Error('Value should be a non negative integer'));

		return this.wsRpc.call([0, 'withdraw_eth', [accountId, ethAddress, value, shouldDoBroadcastToNetwork]]);
	}

	// TODO check positive result
	/**
	 *  @method floodNetwork
	 *	@param {String} prefix
	 *	@param {String} numberOfTransactions
	 *  @returns {Promise<Object>}
	 */
	floodNetwork(prefix, numberOfTransactions) {
		if (!isString(prefix)) throw new Error('Prefix should be a string');
		if (!isUInt32(numberOfTransactions)) return Promise.reject(new Error('Value should be a non negative integer'));

		return this.wsRpc.call([0, 'flood_network', [prefix, numberOfTransactions]]);
	}

	// TRADING CALLS

	// ASSET CALLS

	// TODO check positive result
	/**
	 *  @method listAssets
	 *  @param  {String} lowerBoundSymbol
	 *  @param  {Number} limit
	 *
	 *  @return {Promise.<Array.<Asset>>}
	 */
	listAssets(lowerBoundSymbol, limit = API_CONFIG.LIST_ASSETS_DEFAULT_LIMIT) {
		if (!isString(lowerBoundSymbol)) throw new Error('Lower bound symbol is invalid');
		if (!isUInt64(limit) || limit > API_CONFIG.LIST_ASSETS_MAX_LIMIT) {
			throw new Error(`Limit should be a integer and must not exceed ${API_CONFIG.LIST_ASSETS_MAX_LIMIT}`);
		}

		return this.wsRpc.call([0, 'list_assets', [lowerBoundSymbol, limit]]);
	}

	// TODO need help args check positive result
	/**
	 *  @method createAsset
	 *	@param {String} accountIdOrName
	 *	@param {String} symbol
	 *	@param {Number} precision
	 *	@param {Object} assetOption
	 *	@param {Object} bitassetOpts
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	createAsset(accountIdOrName, symbol, precision, assetOption, bitassetOpts, shouldDoBroadcastToNetwork) {
		if (!isAccountId(accountIdOrName) || isAccountName(accountIdOrName)) {
			throw new Error('Accounts id or name should be string and valid');
		}
		if (!isUInt8(precision)) throw new Error('Precision should be a non negative integer');

		return this.wsRpc.call([0, 'create_asset',
			[accountIdOrName, symbol, precision, bitassetOpts, shouldDoBroadcastToNetwork],
		]);
	}

	// TODO need help args check positive result
	/**
	 *  @method updateAsset
	 *	@param {String} assetIdOrName
	 *	@param {String} newIssuerIdOrName
	 *	@param {Object} newOptions
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	updateAsset(assetIdOrName, newIssuerIdOrName, newOptions, shouldDoBroadcastToNetwork) {
		if (!isAssetId(assetIdOrName) || isAssetName(assetIdOrName)) throw new Error('Asset id or name is invalid');
		if (!isAccountId(newIssuerIdOrName) || isAccountName(newIssuerIdOrName)) {
			throw new Error('Accounts id or name should be string and valid');
		}

		return this.wsRpc.call([0, 'update_asset',
			[assetIdOrName, newIssuerIdOrName, newOptions, shouldDoBroadcastToNetwork],
		]);
	}

	// TODO need help args check positive result
	/**
	 *  @method updateBitasset
	 *	@param {String} assetIdOrName
	 *	@param {Object} newBitasset
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	updateBitasset(assetIdOrName, newBitasset, shouldDoBroadcastToNetwork) {
		if (!isAssetId(assetIdOrName) || isAssetName(assetIdOrName)) throw new Error('Asset id or name is invalid');

		return this.wsRpc.call([0, 'update_bitasset', [assetIdOrName, newBitasset, shouldDoBroadcastToNetwork]]);
	}

	// TODO need help args check positive result
	/**
	 *  @method updateAssetFeedProducers
	 *	@param {String} assetIdOrName
	 *	@param {Array<String>} newFeedProducers
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	updateAssetFeedProducers(assetIdOrName, newFeedProducers, shouldDoBroadcastToNetwork) {
		if (!isAssetId(assetIdOrName) || isAssetName(assetIdOrName)) throw new Error('Asset id or name is invalid');

		return this.wsRpc.call([0, 'update_asset_feed_producers',
			[assetIdOrName, newFeedProducers, shouldDoBroadcastToNetwork],
		]);
	}

	// TODO need help args check positive result
	/**
	 *  @method publishAssetFeed
	 *	@param {String} accountId
	 *	@param {String} assetIdOrName
	 *	@param {Object} priceFeed
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	publishAssetFeed(accountId, assetIdOrName, priceFeed, shouldDoBroadcastToNetwork) {
		if (!isAccountId(accountId)) {
			throw new Error('Accounts id or name should be string and valid');
		}
		if (!isAssetId(assetIdOrName) || isAssetName(assetIdOrName)) throw new Error('Asset id or name is invalid');

		return this.wsRpc.call([0, 'publish_asset_feed',
			[accountId, assetIdOrName, priceFeed, shouldDoBroadcastToNetwork],
		]);
	}

	//TODO need help args check positive result
	/**
	 *  @method issueAsset
	 *	@param {String} accountIdOrName
	 *	@param {String} amount
	 *	@param {String} assetTicker
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	issueAsset(accountIdOrName, amount, assetTicker, shouldDoBroadcastToNetwork) {
		if (!isAccountId(accountIdOrName) || isAccountName(accountIdOrName)) {
			throw new Error('Accounts id or name should be string and valid');
		}

		return this.wsRpc.call([0, 'issue_asset',
			[accountIdOrName, amount, assetTicker, shouldDoBroadcastToNetwork],
		]);
	}

	// TODO need help args
	/**
	 *  @method getAsset
	 *	@param {String} assetIdOrName
	 *  @returns {Promise<Object>}
	 */
	getAsset(assetIdOrName) {
		if (!isAssetId(assetIdOrName) || isAssetName(assetIdOrName)) throw new Error('Asset id or name is invalid');

		return this.wsRpc.call([0, 'get_asset', [assetIdOrName]]);
	}

	// TODO need help args
	/**
	 *  @method getBitassetData
	 *	@param {String} bitAssetId
	 *  @returns {Promise<Object>}
	 */
	getBitassetData(bitAssetId) {
		if (!isBitAssetId(bitAssetId)) return Promise.reject(new Error('Bit asset id is invalid'));

		return this.wsRpc.call([0, 'get_bitasset_data', [bitAssetId]]);
	}

	// TODO need help args
	/**
	 *  @method fundAssetFeePool
	 *	@param {String} fromAccountIdOrName
	 *	@param {String} assetIdOrName
	 *	@param {String} amount
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	fundAssetFeePool(fromAccountIdOrName, assetIdOrName, amount, shouldDoBroadcastToNetwork) {
		if (!isAccountId(fromAccountIdOrName) || isAccountName(fromAccountIdOrName)) {
			throw new Error('Accounts id or name should be string and valid');
		}
		if (!isAssetId(assetIdOrName) || isAssetName(assetIdOrName)) throw new Error('Asset id or name is invalid');

		return this.wsRpc.call([0, 'fund_asset_fee_pool',
			[fromAccountIdOrName, assetIdOrName, amount, shouldDoBroadcastToNetwork],
		]);
	}

	// TODO need help args
	/**
	 *  @method reserveAsset
	 *	@param {String} accountId
	 *	@param {String} amount
	 *	@param {String} assetIdOrName
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	reserveAsset(accountId, amount, assetIdOrName, shouldDoBroadcastToNetwork) {
		if (!isAccountId(accountId)) {
			throw new Error('Accounts id should be string and valid');
		}
		if (!isAssetId(assetIdOrName) || isAssetName(assetIdOrName)) throw new Error('Asset id or name is invalid');

		return this.wsRpc.call([0, 'reserve_asset', [accountId, amount, assetIdOrName, shouldDoBroadcastToNetwork]]);
	}

	// GOVERNANCE

	// TODO check args and result
	/**
	 *  @method createCommitteeMember
	 *	@param {String} accountIdOrName
	 *	@param {String} url
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	createCommitteeMember(accountIdOrName, url, shouldDoBroadcastToNetwork) {
		if (!isAccountId(accountIdOrName) || isAccountName(accountIdOrName)) {
			throw new Error('Accounts id or name should be string and valid');
		}
		if (!validateUrl(url)) throw new Error(`Invalid address ${url}`);

		return this.wsRpc.call([0, 'create_committee_member', [accountIdOrName, url, shouldDoBroadcastToNetwork]]);
	}

	// TODO check result Array of what
	/**
	 *  @method setDesiredCommitteeMemberCount
	 *	@param {String} accountIdOrName
	 *	@param {Number} desiredNumberOfCommitteeMembers
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Array.<Object>>}
	 */
	setDesiredCommitteeMemberCount(accountIdOrName, desiredNumberOfCommitteeMembers, shouldDoBroadcastToNetwork) {
		if (!isAccountId(accountIdOrName) || isAccountName(accountIdOrName)) {
			throw new Error('Accounts id or name should be string and valid');
		}
		if (!isUInt16(desiredNumberOfCommitteeMembers)) {
			throw new Error('Desired number of committee members should be positive integer');
		}

		return this.wsRpc.call([0, 'set_desired_committee_member_count',
			[accountIdOrName, desiredNumberOfCommitteeMembers, shouldDoBroadcastToNetwork],
		]);
	}

	// TODO check result
	/**
	 *  @method getCommitteeMember
	 *	@param {String} accountIdOrName
	 *  @returns {Promise<Object>}
	 */
	getCommitteeMember(accountIdOrName) {
		if (!isAccountId(accountIdOrName) || isAccountName(accountIdOrName)) {
			throw new Error('Accounts id or name should be string and valid');
		}
		if (!isCommitteeMemberId(accountIdOrName)) {
			return Promise.reject(new Error('Committee Member Id should contain valid committee id'));
		}

		return this.wsRpc.call([0, 'get_committee_member', [accountIdOrName]]);
	}

	// TODO check result Array of what
	/**
	 *  @method listCommitteeMembers
	 *	@param {String} lowerBoundName
	 *	@param {Number} limit
	 *  @returns {Promise<Array.<Object>>}
	 */
	listCommitteeMembers(lowerBoundName, limit = API_CONFIG.COMMITTEE_MEMBER_ACCOUNTS_DEFAULT_LIMIT,) {
		if (!isString(lowerBoundName)) throw new Error('LowerBoundName should be string');
		if (!isUInt64(limit) || limit > API_CONFIG.COMMITTEE_MEMBER_ACCOUNTS_MAX_LIMIT) {
			throw new Error(`Limit should be capped at ${API_CONFIG.COMMITTEE_MEMBER_ACCOUNTS_MAX_LIMIT}`);
		}

		return this.wsRpc.call([0, 'list_committee_members', [lowerBoundName, limit]]);
	}

	// TODO check result
	/**
	 *  @method voteForCommitteeMember
	 *	@param {String} votingAccountIdOrName
	 *	@param {String} ownerOfCommitteeMember
	 *	@param {Boolean} approveYourVote
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	voteForCommitteeMember(votingAccountIdOrName, ownerOfCommitteeMember, approveYourVote, shouldDoBroadcastToNetwork) {
		if (!isAccountId(votingAccountIdOrName) || isAccountName(votingAccountIdOrName)) {
			throw new Error('Voting accounts id or name should be string and valid');
		}
		if (!isAccountId(ownerOfCommitteeMember) || isAccountName(ownerOfCommitteeMember)) {
			throw new Error('Owner of committee member accounts id or name should be string and valid');
		}

		return this.wsRpc.call([0, 'vote_for_committee_member',
			[votingAccountIdOrName, ownerOfCommitteeMember, approveYourVote, shouldDoBroadcastToNetwork],
		]);
	}

	// TODO check result
	/**
	 *  @method setVotingProxy
	 *	@param {String} accountIdOrNameToUpdate
	 *	@param {String} votingAccountIdOrName
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	setVotingProxy(accountIdOrNameToUpdate, votingAccountIdOrName, shouldDoBroadcastToNetwork) {
		if (!isAccountId(accountIdOrNameToUpdate) || isAccountName(accountIdOrNameToUpdate)) {
			throw new Error('Accounts id or name should be string and valid');
		}
		if (!isAccountId(votingAccountIdOrName) || isAccountName(votingAccountIdOrName)) {
			throw new Error('Voting accounts id or name should be string and valid');
		}

		return this.wsRpc.call([0, 'set_voting_proxy',
			[accountIdOrNameToUpdate, votingAccountIdOrName, shouldDoBroadcastToNetwork],
		]);
	}

	//TODO check result and args
	/**
	 *  @method proposeParameterChange
	 *	@param {String} accountId
	 *	@param {Number} expirationTime
	 *	@param {Object} changedValues
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	proposeParameterChange(accountId, expirationTime, changedValues, shouldDoBroadcastToNetwork) {
		if (!isAccountId(accountId)) {
			throw new Error('Accounts id should be string and valid');
		}

		return this.wsRpc.call([0, 'propose_parameter_change',
			[accountId, expirationTime, changedValues, shouldDoBroadcastToNetwork],
		]);
	}

	//TODO check result and args
	/**
	 *  @method proposeFeeChange
	 *	@param {String} accountId
	 *	@param {Number} expirationTime
	 *	@param {Object} changedValues
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	proposeFeeChange(accountId, expirationTime, changedValues, shouldDoBroadcastToNetwork) {
		if (!isAccountId(accountId)) {
			throw new Error('Accounts id should be string and valid');
		}

		return this.wsRpc.call([0, 'propose_fee_change',
			[accountId, expirationTime, changedValues, shouldDoBroadcastToNetwork],
		]);
	}

	// TODO check result and args
	/**
	 *  @method changeSidechainConfig
	 *	@param {String} registrarAccountId
	 *	@param {Object} changedValues
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	changeSidechainConfig(registrarAccountId, changedValues, shouldDoBroadcastToNetwork) {
		if (!isAccountId(registrarAccountId)) {
			throw new Error('Accounts id should be string and valid');
		}

		return this.wsRpc.call([0, 'change_sidechain_config',
			[registrarAccountId, changedValues, shouldDoBroadcastToNetwork],
		]);
	}

	// PRIVACY MODE (there are not working methods)

	// Blockchain Inspection

	//TODO check result
	/**
	 *  @method getBlock
	 *  @param  {Number} blockNum
	 *
	 *  @return {
	 *  	Promise.<Block>
	 *  }
	 */
	getBlock(blockNum) {
		if (!isUInt32(blockNum)) return Promise.reject(new Error('Block number should be a non negative integer'));

		return this.wsRpc.call([0, 'get_block', [blockNum]]);
	}

	/**
	 *  @method getBlockVirtualOps
	 *  @param  {Number} blockNum
	 *
	 *  @return {
	 *  	Promise.<Block>
	 *  }
	 */
	getBlockVirtualOps(blockNum) {
		if (!isUInt32(blockNum)) return Promise.reject(new Error('Block number should be a non negative integer'));

		return this.wsRpc.call([0, 'get_block_virtual_ops', [blockNum]]);
	}

	/**
	 *  @method getAccountCount
	 *
	 *  @return {Promise<Number>}
	 */
	getAccountCount() {
		return this.wsRpc.call([0, 'get_account_count', []]);
	}

	// TODO check result
	/**
	 *  @method getGlobalProperties
	 *
	 *  @return {
	 *  	Promise.<GlobalProperties>
	 *  }
	 */
	getGlobalProperties() {
		return this.wsRpc.call([0, 'get_global_properties', []]);
	}

	/**
	 *  @method getDynamicGlobalProperties
	 *
	 *  @return {
	 *  	Promise.<DynamicGlobalProperties>
	 *  }
	 */
	getDynamicGlobalProperties() {
		return this.wsRpc.call([0, 'get_dynamic_global_properties', []]);
	}

	/**
	 *  @method getObject
	 *	@param {String} objectId
	 *  @returns {Promise<Object>}
	 */
	getObject(objectId) {
		if (!isObjectId(objectId)) return Promise.reject(new Error('ObjectId should be an object id'));

		return this.wsRpc.call([0, 'get_object', [objectId]]);
	}

	// Transaction Builder

	/**
	 *  @method beginBuilderTransaction
	 *
	 *  @returns {Promise<Number>}
	 */
	beginBuilderTransaction() {
		return this.wsRpc.call([0, 'begin_builder_transaction', []]);
	}

	// TODO add validators
	/**
	 *  @method addOperationToBuilderTransaction
	 *	@param {String|Number} transactionTypeHandle
	 *	@param {Array<String>} operation
	 *  @returns {Promise<null>}
	 */
	addOperationToBuilderTransaction(transactionTypeHandle, operation) {
		return this.wsRpc.call([0, 'add_operation_to_builder_transaction', [transactionTypeHandle, operation]]);
	}

	// TODO add validators
	/**
	 *  @method replaceOperationInBuilderTransaction
	 *	@param {String|Number} transactionTypeHandle
	 *	@param {String|Number} unsignedOperation
	 *	@param {Array<String>} operation
	 *  @returns {Promise<null>}
	 */
	replaceOperationInBuilderTransaction(transactionTypeHandle, unsignedOperation, operation) {
		return this.wsRpc.call([0, 'replace_operation_in_builder_transaction',
			[transactionTypeHandle, unsignedOperation, operation],
		]);
	}

	//TODO what is feeAsset shoould be?
	/**
	 *  @method setFeesOnBuilderTransaction
	 *	@param {String|Number} transactionTypeHandle
	 *	@param {String} feeAsset
	 *  @returns {Promise<Object>}
	 */
	setFeesOnBuilderTransaction(transactionTypeHandle, feeAsset) {
		return this.wsRpc.call([0, 'set_fees_on_builder_transaction', [transactionTypeHandle, feeAsset]]);
	}

	// TODO add validators
	/**
	 *  @method previewBuilderTransaction
	 *	@param {String|Number} transactionTypeHandle
	 *  @returns {Promise<Object>}
	 */
	previewBuilderTransaction(transactionTypeHandle) {
		return this.wsRpc.call([0, 'preview_builder_transaction', [transactionTypeHandle]]);
	}

	// TODO add validators
	/**
	 *  @method signBuilderTransaction
	 *	@param {String|Number} transactionTypeHandle
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	signBuilderTransaction(transactionTypeHandle, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'sign_builder_transaction', [transactionTypeHandle, shouldDoBroadcastToNetwork]]);
	}

	//TODO check args and get positive result
	/**
	 *  @method proposeBuilderTransaction
	 *	@param {String|Number} transactionTypeHandle
	 *	@param {String} expirationTime
	 *	@param {Number} reviewPeriod
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	proposeBuilderTransaction(transactionTypeHandle, expirationTime, reviewPeriod, shouldDoBroadcastToNetwork) {
		if (!isUInt32(reviewPeriod)) return Promise.reject(new Error('Review period should be a non negative integer'));

		return this.wsRpc.call([0, 'propose_builder_transaction',
			[transactionTypeHandle, expirationTime, reviewPeriod, shouldDoBroadcastToNetwork],
		]);
	}

	//TODO check args and get positive result
	/**
	 *  @method proposeBuilderTransaction2
	 *	@param {String|Number} transactionTypeHandle
     *	@param {String} accountIdOrName
	 *	@param {String} expirationTime
	 *	@param {Number} reviewPeriod
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	proposeBuilderTransaction2(
		transactionTypeHandle,
		accountIdOrName,
		expirationTime,
		reviewPeriod,
		shouldDoBroadcastToNetwork,
	) {
		if (!isUInt32(reviewPeriod)) return Promise.reject(new Error('Review period should be a non negative integer'));
		if (!isAccountId(accountIdOrName) || isAccountName(accountIdOrName)) {
			throw new Error('Accounts id or name should be string and valid');
		}

		return this.wsRpc.call([0, 'propose_builder_transaction2',
			[transactionTypeHandle, accountIdOrName, expirationTime, reviewPeriod, shouldDoBroadcastToNetwork],
		]);
	}

	// TODO add validators
	/**
	 *  @method removeBuilderTransaction
	 *	@param {String|Number} transactionTypeHandle
	 *  @returns {Promise<null>}
	 */
	removeBuilderTransaction(transactionTypeHandle) {
		return this.wsRpc.call([0, 'remove_builder_transaction', [transactionTypeHandle]]);
	}

	// TODO signedTX?
	/**
	 *  @method serializeTransaction
	 *	@param {Object} signedTx
	 *  @returns {Promise<String>}
	 */
	serializeTransaction(signedTx) {
		signedTransaction.validate(signedTx);

		return this.wsRpc.call([0, 'serialize_transaction', [signedTx]]);
	}

	/**
	 *  @method signTransaction
	 *	@param {Object} unsignedTx
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	signTransaction(unsignedTx, shouldDoBroadcastToNetwork) {
		transaction.validate(unsignedTx);

		return this.wsRpc.call([0, 'sign_transaction', [unsignedTx, shouldDoBroadcastToNetwork]]);
	}

	//TODO args and result
	/**
	 *  @method getPrototypeOperation
	 *	@param {String} operationType
	 *  @returns {Promise<String>}
	 */
	getPrototypeOperation(operationType) {
		return this.wsRpc.call([0, 'get_prototype_operation', [operationType]]);
	}

}

export default WalletAPI;
