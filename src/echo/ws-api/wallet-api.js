import {
	isArray,
	isObjectId,
	isBoolean,
	isAssetName,
	isAccountId,
	isAccountName,
	isString,
	isAssetId,
	isObject,
	isCommitteeMemberId,
	isBitAssetId,
	isRipemd160,
	isUInt32,
	isUInt64,
	validateUrl,
} from '../../utils/validators';
import * as serializers from '../../serializers';
import { API_CONFIG } from '../../constants';

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
		return this.wsRpc.call([0, 'help_method', [serializers.basic.string.toRaw(method)]]);
	}

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

	/**
	 *  @method networkAddNodes
	 *	@param {Array<String>} nodes
	 *  @returns {Promise<null>}
	 */
	// TODO
	networkAddNodes(nodes) {
		return this.wsRpc.call([0, 'network_add_nodes', [serializers.basic.string.toRaw(nodes)]]);
	}

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
		return this.wsRpc.call([0, 'unlock',
			[serializers.basic.string.toRaw(password)],
		]);
	}

	/**
	 *  @method setPassword
	 *	@param {String} password
	 *  @returns {Promise<null>}
	 */
	setPassword(password) {
		return this.wsRpc.call([0, 'set_password', [serializers.basic.string.toRaw(password)]]);
	}

	/**
	 *  @method createEddsaKeypair
	 *
	 *  @returns {Promise<Array.<String>>}
	 */
	createEddsaKeypair() {
		return this.wsRpc.call([0, 'create_eddsa_keypair', []]);
	}

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

	/**
	 *  @method importKey
	 *	@param {String} accountNameOrId
	 *	@param {String} privateKeyWif
	 *  @returns {Promise<Boolean>}
	 */
	importKey(accountNameOrId, privateKeyWif) {
		if (!isString(privateKeyWif)) throw new Error('private key should be a string');

		return this.wsRpc.call([0, 'import_key',
			[
				serializers.basic.string.toRaw(accountNameOrId),
				privateKeyWif,
			],
		]);
	}

	/**
	 *  @method importAccounts
	 *	@param {String} filename
	 *	@param {String} password
	 *  @returns {Promise<Boolean>}
	 */
	importAccounts(filename, password) {
		return this.wsRpc.call([0, 'import_accounts',
			[
				serializers.basic.string.toRaw(filename),
				serializers.basic.string.toRaw(password),
			],
		]);
	}

	/**
	 *  @method importAccountKeys
	 *	@param {String} filename
	 *	@param {String} password
	 *	@param {String} srcAccountName
	 *	@param {String} destAccountName
	 *  @returns {Promise<Boolean>}
	 */
	importAccountKeys(filename, password, srcAccountName, destAccountName) {
		if (!isAccountName(srcAccountName)) {
			throw new Error('Accounts id or name should be string and valid');
		}
		if (!isAccountName(destAccountName)) {
			throw new Error('Accounts id or name should be string and valid');
		}

		return this.wsRpc.call([0, 'import_account_keys',
			[
				serializers.basic.string.toRaw(filename),
				serializers.basic.string.toRaw(password),
				srcAccountName,
				destAccountName,
			],
		]);
	}

	/**
	 *  @method importBalance
	 *	@param {String} accountNameOrId
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *	@param {Array<String>} wifKeys
	 *  @returns {Promise<Boolean>}
	 */
	importBalance(accountNameOrId, shouldDoBroadcastToNetwork, wifKeys) {
		if (!isArray(wifKeys)) return Promise.reject(new Error('wifKeys should be an array'));
		if (!wifKeys.every((key) => isString(key))) {
			return Promise.reject(new Error('wif key should be a string'));
		}

		return this.wsRpc.call([0, 'import_balance',
			[
				serializers.basic.string.toRaw(accountNameOrId),
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
				wifKeys,
			],
		]);
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
	 *	@param {Number} numberOfDesiredKeys
	 *  @returns {Promise<Array.<Object>>}
	 */
	deriveKeysFromBrainKey(brainKey, numberOfDesiredKeys) {
		return this.wsRpc.call([0, 'derive_keys_from_brain_key',
			[
				serializers.basic.string.toRaw(brainKey),
				serializers.basic.integers.int64.toRaw(numberOfDesiredKeys),
			],
		]);
	}

	/**
	 *  @method isPublicKeyRegistered
	 *	@param {String} publicKey
	 *  @returns {Promise<Boolean>}
	 */
	isPublicKeyRegistered(publicKey) {
		return this.wsRpc.call([0, 'is_public_key_registered',
			[serializers.chain.publicKey.toRaw(publicKey)],
		]);
	}

	/**
	 *  @method getTransactionId
	 *	@param {String} tr
	 *  @returns {Promise<String>}
	 */
	getTransactionId(tr) {
		if (!tr) {
			return Promise.reject(new Error('Transaction is required'));
		}

		if (!tr.ref_block_num || !tr.ref_block_prefix || !tr.operations || !tr.signatures) {
			return Promise.reject(new Error('Invalid transaction'));
		}

		return this.wsRpc.call([0, 'get_transaction_id', [tr]]);
	}

	/**
	 *  @method getPrivateKey
	 *	@param {String} publicKey
	 *  @returns {Promise<String>}
	 */
	getPrivateKey(publicKey) {
		return this.wsRpc.call([0, 'get_private_key', [serializers.chain.publicKey.toRaw(publicKey)]]);
	}

	/**
	 *  @method loadWalletFile
	 *	@param {String} walletFilename
	 *  @returns {Promise<Boolean>}
	 */
	loadWalletFile(walletFilename) {
		return this.wsRpc.call([0, 'load_wallet_file', [serializers.basic.string.toRaw(walletFilename)]]);
	}

	/**
	 *  @method normalizeBrainKey
	 *	@param {String} brainKey
	 *  @returns {Promise<String>}
	 */
	normalizeBrainKey(brainKey) {
		return this.wsRpc.call([0, 'normalize_brain_key', [serializers.basic.string.toRaw(brainKey)]]);
	}

	/**
	 *  @method saveWalletFile
	 *	@param {String} walletFilename
	 *  @returns {Promise<null>}
	 */
	saveWalletFile(walletFilename) {
		return this.wsRpc.call([0, 'save_wallet_file', [serializers.basic.string.toRaw(walletFilename)]]);
	}

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
		if (!limit > API_CONFIG.LIST_ACCOUNTS_MAX_LIMIT) {
			throw new Error(`Limit should be capped at ${API_CONFIG.LIST_ACCOUNTS_MAX_LIMIT}`);
		}

		return this.wsRpc.call([0, 'list_accounts',
			[
				accountName,
				serializers.basic.integers.uint32.toRaw(limit),
			],
		]);
	}

	/**
	 *  @method listAccountBalances
	 *	@param {String} accountId
	 *  @returns {Promise<Array.<Object>>}
	 */
	listAccountBalances(accountId) {
		return this.wsRpc.call([0, 'list_account_balances', [
			serializers.chain.ids.protocol.accountId.toRaw(accountId),
		]]);
	}

	/**
	 *  @method listIdBalances
	 *	@param {String} accountId
	 *  @returns {Promise<Array.<Object>>}
	 */
	listIdBalances(accountId) {
		return this.wsRpc.call([0, 'list_id_balances', [
			serializers.chain.ids.protocol.accountId.toRaw(accountId),
		]]);
	}

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

		return this.wsRpc.call([0, 'register_account',
			[
				name,
				serializers.chain.publicKey.toRaw(activeKey),
				serializers.chain.ids.protocol.accountId.toRaw(registrarAccountId),
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

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
			0, 'create_account_with_brain_key',
			[
				serializers.basic.string.toRaw(brainKey),
				accountName,
				serializers.chain.ids.protocol.accountId.toRaw(registrarAccountId),
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

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

		return this.wsRpc.call([
			0, 'create_contract',
			[
				registrarAccountName,
				serializers.basic.string.toRaw(contractCode),
				serializers.basic.integers.uint64.toRaw(amount),
				serializers.basic.string.toRaw(assetType),
				serializers.chain.ids.protocol.assetId.toRaw(supportedAssetId),
				serializers.basic.bool.toRaw(useEthereumAssetAccuracy),
				serializers.basic.bool.toRaw(shouldSaveToWallet),
			],
		]);
	}

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

		return this.wsRpc.call([0, 'call_contract',
			[
				registrarAccountName,
				serializers.chain.ids.protocol.contractId.toRaw(contractId),
				serializers.basic.string.toRaw(contractCode),
				serializers.basic.integers.uint64.toRaw(amount),
				serializers.basic.string.toRaw(assetType),
				serializers.basic.bool.toRaw(shouldSaveToWallet),
			],
		]);
	}

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

		return this.wsRpc.call([0, 'contract_fund_fee_pool',
			[
				registrarAccountName,
				serializers.chain.ids.protocol.contractId.toRaw(contractId),
				serializers.basic.integers.uint64.toRaw(amount),
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 *  @method getContractResult
	 *	@param {String} contractId
	 *  @returns {Promise<Object>}
	 */
	getContractResult(contractId) {
		return this.wsRpc.call([0, 'get_contract_result',
			[serializers.chain.ids.protocol.contractId.toRaw(contractId)],
		]);
	}

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
		return this.wsRpc.call([0, 'transfer',
			[
				serializers.basic.string.toRaw(fromAccountNameOrId),
				serializers.basic.string.toRaw(toAccountNameOrId),
				serializers.basic.string.toRaw(amount),
				serializers.basic.string.toRaw(assetIdOrName),
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 *  @method transfer2
	 *	@param {String} fromAccountNameOrId
	 *	@param {String} toAccountNameOrId
	 *	@param {String} amount
	 *	@param {String} assetIdOrName
	 *  @returns {Promise<Object>}
	 */
	transfer2(fromAccountNameOrId, toAccountNameOrId, amount, assetIdOrName) {
		return this.wsRpc.call([0, 'transfer2',
			[
				serializers.basic.string.toRaw(fromAccountNameOrId),
				serializers.basic.string.toRaw(toAccountNameOrId),
				serializers.basic.string.toRaw(amount),
				serializers.basic.string.toRaw(assetIdOrName),
			],
		]);
	}

	/**
	 *  @method whitelistAccount
	 *	@param {String} authorizingAccount
	 *	@param {String} accountToList
	 *	@param {String} newListingStatus
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	// TODO newListingStatus
	whitelistAccount(authorizingAccount, accountToList, newListingStatus, shouldDoBroadcastToNetwork) {
		if (!isAccountId(authorizingAccount)) return Promise.reject(new Error('Account id is invalid'));
		if (!isAccountId(accountToList)) return Promise.reject(new Error('Account id is invalid'));

		return this.wsRpc.call([0, 'whitelist_account',
			[
				serializers.basic.string.toRaw(authorizingAccount),
				serializers.basic.string.toRaw(accountToList),
				newListingStatus,
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 *  @method getVestingBalances
	 *	@param {String} accountNameOrId
	 *  @returns {Promise<Array.<Object>>}
	 */
	getVestingBalances(accountNameOrId) {
		return this.wsRpc.call([0, 'get_vesting_balances', [serializers.basic.string.toRaw(accountNameOrId)]]);
	}

	/**
	 *  @method withdrawVesting
	 *	@param {String} witnessAccountNameOrId
	 *	@param {String} amount
	 *	@param {String} assetSymbol
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Array>}
	 */
	withdrawVesting(witnessAccountNameOrId, amount, assetSymbol, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'withdraw_vesting',
			[
				serializers.basic.string.toRaw(witnessAccountNameOrId),
				serializers.basic.string.toRaw(amount),
				serializers.basic.string.toRaw(assetSymbol),
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 *  @method getAccount
	 *	@param {String} accountNameOrId
	 *  @returns {Promise<Object>}
	 */
	getAccount(accountNameOrId) {
		return this.wsRpc.call([0, 'get_account', [serializers.basic.string.toRaw(accountNameOrId)]]);
	}

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

	/**
	 *  @method getAccountHistory
	 *	@param {String} accountIdOrName
	 *	@param {Number} limit
	 *  @returns {Promise<Array.<Object>>}
	 */
	getAccountHistory(accountIdOrName, limit = API_CONFIG.ACCOUNT_HISTORY_DEFAULT_LIMIT) {
		if (!limit > API_CONFIG.ACCOUNT_HISTORY_MAX_LIMIT) {
			throw new Error(`Limit should be capped at ${API_CONFIG.ACCOUNT_HISTORY_MAX_LIMIT}`);
		}

		return this.wsRpc.call([0, 'get_account_history',
			[
				serializers.basic.string.toRaw(accountIdOrName),
				serializers.basic.integers.int64.toRaw(limit),
			],
		]);
	}

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
		if (!limit > API_CONFIG.RELATIVE_ACCOUNT_HISTORY_MAX_LIMIT) {
			throw new Error(`Limit should be capped at ${API_CONFIG.RELATIVE_ACCOUNT_HISTORY_MAX_LIMIT}`);
		}

		return this.wsRpc.call([0, 'get_relative_account_history',
			[
				serializers.chain.ids.protocol.accountId.toRaw(accountId),
				serializers.basic.integers.uint64.toRaw(stop),
				serializers.basic.integers.int64.toRaw(limit),
				serializers.basic.integers.uint64.toRaw(start),
			],
		]);
	}

	/**
	 *  @method getContractObject
	 *	@param {String} contractId
	 *  @returns {Promise<Object>}
	 */
	getContractObject(contractId) {
		return this.wsRpc.call([0, 'get_contract_object',
			[serializers.chain.ids.protocol.contractId.toRaw(contractId)],
		]);
	}

	/**
	 *  @method getContract
	 *	@param {String} contractId
	 *  @returns {Promise<Object>}
	 */
	getContract(contractId) {
		return this.wsRpc.call([0, 'get_contract',
			[serializers.chain.ids.protocol.contractId.toRaw(contractId)],
		]);
	}

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
	// TODO
	whitelistContractPool(
		registrarAccountId,
		contractId,
		addToWhitelist,
		addToBlacklist,
		removeFromWhitelist,
		removeFromBlacklist,
		shouldDoBroadcastToNetwork,
	) {
		return this.wsRpc.call([0, 'whitelist_contract_pool',
			[
				serializers.chain.ids.protocol.accountId.toRaw(registrarAccountId),
				serializers.chain.ids.protocol.contractId.toRaw(contractId),
				serializers.basic.string.toRaw(addToWhitelist),
				serializers.basic.string.toRaw(addToBlacklist),
				serializers.basic.string.toRaw(removeFromWhitelist),
				serializers.basic.string.toRaw(removeFromBlacklist),
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 *  @method callContractNoChangingState
	 *	@param {String} contractId
	 *	@param {String} registrarAccountId
	 *	@param {String} assetType
	 *	@param {String} codeOfTheContract
	 *  @returns {Promise<String>}
	 */
	callContractNoChangingState(contractId, registrarAccountId, assetType, codeOfTheContract) {
		if (!isAccountId(registrarAccountId)) throw new Error('Account id is invalid');

		return this.wsRpc.call([0, 'call_contract_no_changing_state',
			[
				serializers.chain.ids.protocol.contractId.toRaw(contractId),
				serializers.chain.ids.protocol.accountId.toRaw(registrarAccountId),
				serializers.basic.string.toRaw(assetType),
				serializers.basic.string.toRaw(codeOfTheContract),
			],
		]);
	}

	/**
	 *  @method getContractPoolBalance
	 *	@param {String} contractId
	 *  @returns {Promise<Object>}
	 */
	getContractPoolBalance(contractId) {
		return this.wsRpc.call([0, 'get_contract_pool_balance',
			[serializers.chain.ids.protocol.contractId.toRaw(contractId)],
		]);
	}

	/**
	 *  @method getContractPoolWhitelist
	 *	@param {String} contractId
	 *  @returns {Promise<Array.<Object>>}
	 */
	getContractPoolWhitelist(contractId) {
		return this.wsRpc.call([0, 'get_contract_pool_whitelist',
			[serializers.chain.ids.protocol.contractId.toRaw(contractId)],
		]);
	}

	/**
	 *  @method getEthAddress
	 *	@param {String} accountId
	 *  @returns {Promise<Object>}
	 */
	getEthAddress(accountId) {
		return this.wsRpc.call([0, 'get_eth_address',
			[serializers.chain.ids.protocol.accountId.toRaw(accountId)],
		]);
	}

	/**
	 *  @method getAccountDeposits
	 *	@param {String} accountId
	 *  @returns {Promise<Array.<Object>>}
	 */
	getAccountDeposits(accountId) {
		return this.wsRpc.call([0, 'get_account_deposits',
			[serializers.chain.ids.protocol.accountId.toRaw(accountId)],
		]);
	}

	/**
	 *  @method registerErc20Token
	 *	@param {String} accountId
	 *	@param {String} ethereumTokenAddress
	 *	@param {String} tokenName
	 *	@param {String} tokenSymbol
	 *	@param {Number} decimals
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	// TODO tokenName
	registerErc20Token(accountId, ethereumTokenAddress, tokenName, tokenSymbol, decimals, shouldDoBroadcastToNetwork) {

		return this.wsRpc.call([0, 'register_erc20_token',
			[serializers.chain.ids.protocol.accountId.toRaw(accountId),
				serializers.basic.string.toRaw(ethereumTokenAddress),
				tokenName,
				serializers.basic.string.toRaw(tokenSymbol),
				serializers.basic.integers.uint8.toRaw(decimals),
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 *  @method getErc20Token
	 *	@param {String} ethereumTokenAddress
	 *  @returns {Promise<Object>}
	 */
	// TODO ethereumTokenAddress
	getErc20Token(ethereumTokenAddress) {
		if (!isRipemd160(ethereumTokenAddress)) throw new Error('Token address id should be a 20 bytes hex string');

		return this.wsRpc.call([0, 'get_erc20_token', [serializers.basic.string.toRaw(ethereumTokenAddress)]]);
	}

	/**
	 *  @method getErc20AccountDeposits
	 *	@param {String} accountId
	 *  @returns {Promise<Array.<Object>>}
	 */
	getErc20AccountDeposits(accountId) {
		return this.wsRpc.call([0, 'get_erc20_account_deposits',
			[serializers.chain.ids.protocol.accountId.toRaw(accountId)],
		]);
	}

	/**
	 *  @method getErc20AccountWithdrawals
	 *	@param {String} accountId
	 *  @returns {Promise<Array.<Object>>}
	 */
	getErc20AccountWithdrawals(accountId) {
		return this.wsRpc.call([0, 'get_erc20_account_withdrawals',
			[serializers.chain.ids.protocol.accountId.toRaw(accountId)],
		]);
	}

	/**
	 *  @method withdrawErc20Token
	 *	@param {String} accountId
	 *	@param {String} toEthereumAddress
	 *	@param {String} erc20TokenId
	 *	@param {String} withdrawAmount
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	withdrawErc20Token(accountId, toEthereumAddress, erc20TokenId, withdrawAmount, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'withdraw_erc20_token',
			[
				serializers.chain.ids.protocol.accountId.toRaw(accountId),
				serializers.basic.string.toRaw(toEthereumAddress),
				serializers.chain.ids.protocol.erc20TokenId.toRaw(erc20TokenId),
				serializers.basic.string.toRaw(withdrawAmount),
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 *  @method generateAccountAddress
	 *	@param {String} accountId
	 *	@param {String} label
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	generateAccountAddress(accountId, label, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'generate_account_address',
			[
				serializers.chain.ids.protocol.accountId.toRaw(accountId),
				serializers.basic.string.toRaw(label),
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 *  @method getAccountAddresses
	 *	@param {String} accountId
	 *	@param {Number} startFrom
	 *	@param {Number} limit
	 *  @returns {Promise<Array.<Object>>}
	 */
	// TODO max limit
	getAccountAddresses(accountId, startFrom, limit) {
		if (!limit > API_CONFIG.CONTRACT_HISTORY_MAX_LIMIT) {
			throw new Error(`Limit should be capped at ${API_CONFIG.CONTRACT_HISTORY_MAX_LIMIT}`);
		}

		return this.wsRpc.call([0, 'get_account_addresses',
			[
				serializers.chain.ids.protocol.accountId.toRaw(accountId),
				serializers.basic.integers.uint64.toRaw(startFrom),
				serializers.basic.integers.uint64.toRaw(limit),
			],
		]);
	}

	/**
	 *  @method getAccountByAddress
	 *	@param {String} address
	 *  @returns {Promise<String>}
	 */
	// TODO address
	getAccountByAddress(address) {
		if (!isRipemd160(address)) throw new Error('Address id should be a 20 bytes hex string');

		return this.wsRpc.call([0, 'get_account_by_address', [address]]);
	}

	/**
	 *  @method getAccountWithdrawals
	 *	@param {String} accountId
	 *  @returns {Promise<Array.<Object>>}
	 */
	getAccountWithdrawals(accountId) {
		return this.wsRpc.call([0, 'get_account_withdrawals',
			[serializers.chain.ids.protocol.accountId.toRaw(accountId)],
		]);
	}

	/**
	 *  @method approveProposal
	 *	@param {String} feePayingAccountId
	 *	@param {String} proposalId
	 *	@param {Object} delta
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	approveProposal(feePayingAccountId, proposalId, delta, shouldDoBroadcastToNetwork) {
		if (!isObject(delta)) throw new Error('delta should be a object');

		return this.wsRpc.call([0, 'approve_proposal',
			[
				serializers.chain.ids.protocol.accountId.toRaw(feePayingAccountId),
				serializers.chain.ids.protocol.proposalId.toRaw(proposalId),
				delta,
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 *  @method generateEthAddress
	 *	@param {String} accountId
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	generateEthAddress(accountId, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'generate_eth_address',
			[
				serializers.chain.ids.protocol.accountId.toRaw(accountId),
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 *  @method withdrawEth
	 *	@param {String} accountId
	 *	@param {String} ethAddress
	 *	@param {Number} value
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	withdrawEth(accountId, ethAddress, value, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'withdraw_eth',
			[
				serializers.chain.ids.protocol.accountId.toRaw(accountId),
				serializers.basic.string.toRaw(ethAddress),
				serializers.basic.integers.uint64.toRaw(value),
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 *  @method floodNetwork
	 *	@param {String} prefix
	 *	@param {String} numberOfTransactions
	 *  @returns {Promise<Object>}
	 */
	floodNetwork(prefix, numberOfTransactions) {
		return this.wsRpc.call([0, 'flood_network',
			[
				serializers.basic.string.toRaw(prefix),
				serializers.basic.integers.uint32.toRaw(numberOfTransactions),
			],
		]);
	}

	/**
	 *  @method listAssets
	 *  @param  {String} lowerBoundSymbol
	 *  @param  {Number} limit
	 *
	 *  @return {Promise.<Array.<Asset>>}
	 */
	listAssets(lowerBoundSymbol, limit = API_CONFIG.LIST_ASSETS_DEFAULT_LIMIT) {
		if (!limit > API_CONFIG.LIST_ASSETS_MAX_LIMIT) {
			throw new Error(`Limit should be capped at ${API_CONFIG.LIST_ASSETS_MAX_LIMIT}`);
		}

		return this.wsRpc.call([0, 'list_assets',
			[
				serializers.basic.string.toRaw(lowerBoundSymbol),
				serializers.basic.integers.uint32.toRaw(limit),
			],
		]);
	}

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
	// TODO bitassetOpts, assetOption
	createAsset(accountIdOrName, symbol, precision, assetOption, bitassetOpts, shouldDoBroadcastToNetwork) {
		if (!isAccountId(accountIdOrName) || isAccountName(accountIdOrName)) {
			throw new Error('Accounts id or name should be string and valid');
		}

		return this.wsRpc.call([0, 'create_asset',
			[
				serializers.basic.string.toRaw(accountIdOrName),
				serializers.basic.string.toRaw(symbol),
				serializers.basic.integers.uint8.toRaw(precision),
				bitassetOpts,
				assetOption,
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

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
			[
				serializers.basic.string.toRaw(assetIdOrName),
				serializers.basic.string.toRaw(newIssuerIdOrName),
				newOptions,
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 *  @method updateBitasset
	 *	@param {String} assetIdOrName
	 *	@param {Object} newBitasset
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	// TODO newBitasset
	updateBitasset(assetIdOrName, newBitasset, shouldDoBroadcastToNetwork) {
		if (!isAssetId(assetIdOrName) || isAssetName(assetIdOrName)) throw new Error('Asset id or name is invalid');

		return this.wsRpc.call([0, 'update_bitasset',
			[
				serializers.basic.string.toRaw(assetIdOrName),
				newBitasset,
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

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
			[
				assetIdOrName,
				newFeedProducers,
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 *  @method publishAssetFeed
	 *	@param {String} accountId
	 *	@param {String} assetIdOrName
	 *	@param {Object} priceFeed
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	publishAssetFeed(accountId, assetIdOrName, priceFeed, shouldDoBroadcastToNetwork) {
		if (!isAssetId(assetIdOrName) || isAssetName(assetIdOrName)) throw new Error('Asset id or name is invalid');

		return this.wsRpc.call([0, 'publish_asset_feed',
			[
				serializers.chain.ids.protocol.accountId.toRaw(accountId),
				assetIdOrName,
				priceFeed,
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

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
			[
				accountIdOrName,
				amount,
				assetTicker,
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 *  @method getAsset
	 *	@param {String} assetIdOrName
	 *  @returns {Promise<Object>}
	 */
	getAsset(assetIdOrName) {
		if (!isAssetId(assetIdOrName) || isAssetName(assetIdOrName)) throw new Error('Asset id or name is invalid');

		return this.wsRpc.call([0, 'get_asset', [assetIdOrName]]);
	}

	/**
	 *  @method getBitassetData
	 *	@param {String} bitAssetId
	 *  @returns {Promise<Object>}
	 */
	getBitassetData(bitAssetId) {
		if (!isBitAssetId(bitAssetId)) return Promise.reject(new Error('Bit asset id is invalid'));

		return this.wsRpc.call([0, 'get_bitasset_data', [bitAssetId]]);
	}

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
			[
				fromAccountIdOrName,
				assetIdOrName,
				amount,
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 *  @method reserveAsset
	 *	@param {String} accountId
	 *	@param {String} amount
	 *	@param {String} assetIdOrName
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	reserveAsset(accountId, amount, assetIdOrName, shouldDoBroadcastToNetwork) {
		if (!isAssetId(assetIdOrName) || isAssetName(assetIdOrName)) throw new Error('Asset id or name is invalid');

		return this.wsRpc.call([0, 'reserve_asset',
			[
				serializers.chain.ids.protocol.accountId.toRaw(accountId),
				amount,
				assetIdOrName,
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

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

		return this.wsRpc.call([0, 'create_committee_member',
			[
				accountIdOrName,
				url,
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 *  @method setDesiredCommitteeMemberCount
	 *	@param {String} accountIdOrName
	 *	@param {Number} desiredNumberOfCommitteeMembers
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	setDesiredCommitteeMemberCount(accountIdOrName, desiredNumberOfCommitteeMembers, shouldDoBroadcastToNetwork) {
		if (!isAccountId(accountIdOrName) || isAccountName(accountIdOrName)) {
			throw new Error('Accounts id or name should be string and valid');
		}

		return this.wsRpc.call([0, 'set_desired_committee_member_count',
			[
				accountIdOrName,
				serializers.basic.integers.uint16.toRaw(desiredNumberOfCommitteeMembers),
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 *  @method getCommitteeMember
	 *	@param {String} accountIdOrName
	 *  @returns {Promise<Object>}
	 */
	getCommitteeMember(accountIdOrName) {
		if (!isAccountId(accountIdOrName) || isAccountName(accountIdOrName) || isCommitteeMemberId(accountIdOrName)) {
			throw new Error('Accounts id, name or committee member Id should be string and valid');
		}

		return this.wsRpc.call([0, 'get_committee_member', [accountIdOrName]]);
	}

	/**
	 *  @method listCommitteeMembers
	 *	@param {String} lowerBoundName
	 *	@param {Number} limit
	 *  @returns {Promise<Array.<Object>>}
	 */
	listCommitteeMembers(lowerBoundName, limit = API_CONFIG.COMMITTEE_MEMBER_ACCOUNTS_DEFAULT_LIMIT) {
		if (!isString(lowerBoundName)) throw new Error('LowerBoundName should be string');
		if (!limit > API_CONFIG.COMMITTEE_MEMBER_ACCOUNTS_MAX_LIMIT) {
			throw new Error(`Limit should be capped at ${API_CONFIG.COMMITTEE_MEMBER_ACCOUNTS_MAX_LIMIT}`);
		}

		return this.wsRpc.call([0, 'list_committee_members',
			[
				lowerBoundName,
				serializers.basic.integers.uint64.toRaw(limit),
			],
		]);
	}

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
			[
				votingAccountIdOrName,
				ownerOfCommitteeMember,
				serializers.basic.bool.toRaw(approveYourVote),
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

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
			[
				accountIdOrNameToUpdate,
				votingAccountIdOrName,
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 *  @method proposeParameterChange
	 *	@param {String} accountId
	 *	@param {Number} expirationTime
	 *	@param {Object} changedValues
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	proposeParameterChange(accountId, expirationTime, changedValues, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'propose_parameter_change',
			[
				serializers.chain.ids.protocol.accountId.toRaw(accountId),
				expirationTime,
				changedValues,
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 *  @method proposeFeeChange
	 *	@param {String} accountId
	 *	@param {Number} expirationTime
	 *	@param {Object} changedValues
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	proposeFeeChange(accountId, expirationTime, changedValues, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'propose_fee_change',
			[
				serializers.chain.ids.protocol.accountId.toRaw(accountId),
				expirationTime,
				changedValues,
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 *  @method changeSidechainConfig
	 *	@param {String} registrarAccountId
	 *	@param {Object} changedValues
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	changeSidechainConfig(registrarAccountId, changedValues, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'change_sidechain_config',
			[
				serializers.chain.ids.protocol.accountId.toRaw(registrarAccountId),
				changedValues,
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 *  @method getBlock
	 *  @param  {Number} blockNum
	 *
	 *  @return {
	 *  	Promise.<Block>
	 *  }
	 */
	getBlock(blockNum) {
		return this.wsRpc.call([0, 'get_block', [serializers.basic.integers.uint32.toRaw(blockNum)]]);
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
		return this.wsRpc.call([0, 'get_block_virtual_ops', [serializers.basic.integers.uint32.toRaw(blockNum)]]);
	}

	/**
	 *  @method getAccountCount
	 *
	 *  @return {Promise<Number>}
	 */
	getAccountCount() {
		return this.wsRpc.call([0, 'get_account_count', []]);
	}

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

	/**
	 *  @method beginBuilderTransaction
	 *
	 *  @returns {Promise<Number>}
	 */
	beginBuilderTransaction() {
		return this.wsRpc.call([0, 'begin_builder_transaction', []]);
	}

	/**
	 *  @method addOperationToBuilderTransaction
	 *	@param {String|Number} transactionTypeHandle
	 *	@param {Array<String>} operation
	 *  @returns {Promise<null>}
	 */
	addOperationToBuilderTransaction(transactionTypeHandle, operation) {
		return this.wsRpc.call([0, 'add_operation_to_builder_transaction', [transactionTypeHandle, operation]]);
	}

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

	/**
	 *  @method setFeesOnBuilderTransaction
	 *	@param {String|Number} transactionTypeHandle
	 *	@param {String} feeAsset
	 *  @returns {Promise<Object>}
	 */
	setFeesOnBuilderTransaction(transactionTypeHandle, feeAsset) {
		return this.wsRpc.call([0, 'set_fees_on_builder_transaction', [transactionTypeHandle, feeAsset]]);
	}

	/**
	 *  @method previewBuilderTransaction
	 *	@param {String|Number} transactionTypeHandle
	 *  @returns {Promise<Object>}
	 */
	previewBuilderTransaction(transactionTypeHandle) {
		return this.wsRpc.call([0, 'preview_builder_transaction', [transactionTypeHandle]]);
	}

	/**
	 *  @method signBuilderTransaction
	 *	@param {String|Number} transactionTypeHandle
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	signBuilderTransaction(transactionTypeHandle, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'sign_builder_transaction',
			[
				transactionTypeHandle,
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

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
			[
				transactionTypeHandle,
				expirationTime,
				reviewPeriod,
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

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
			[
				transactionTypeHandle,
				accountIdOrName,
				expirationTime,
				reviewPeriod,
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 *  @method removeBuilderTransaction
	 *	@param {String|Number} transactionTypeHandle
	 *  @returns {Promise<null>}
	 */
	removeBuilderTransaction(transactionTypeHandle) {
		return this.wsRpc.call([0, 'remove_builder_transaction', [transactionTypeHandle]]);
	}

	/**
	 *  @method serializeTransaction
	 *	@param {Object} tr
	 *  @returns {Promise<String>}
	 */
	serializeTransaction(tr) {
		if (!tr) {
			return Promise.reject(new Error('Transaction is required'));
		}

		if (!tr.ref_block_num || !tr.ref_block_prefix || !tr.operations || !tr.signatures) {
			return Promise.reject(new Error('Invalid transaction'));
		}

		return this.wsRpc.call([0, 'serialize_transaction', [tr]]);
	}

	/**
	 *  @method signTransaction
	 *	@param {Object} tr
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	signTransaction(tr, shouldDoBroadcastToNetwork) {
		if (!tr) {
			return Promise.reject(new Error('Transaction is required'));
		}

		if (!tr.ref_block_num || !tr.ref_block_prefix || !tr.operations) {
			return Promise.reject(new Error('Invalid transaction'));
		}

		return this.wsRpc.call([0, 'sign_transaction',
			[
				tr,
				serializers.basic.bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

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
