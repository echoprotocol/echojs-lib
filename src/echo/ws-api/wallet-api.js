import {
	isNumber,
	isArray,
	isObjectId,
	isBoolean,
	isAssetName,
	isAccountId,
	isUInt64,
	isAccountName,
	isString,
	isAssetId,
	isObject,
	isBalanceId,
	isContractId,
	isOperationHistoryId,
	isContractResultId,
	isBytecode,
	isRipemd160,
	isPublicKey,
	isVoteId,
	isCommitteeMemberId,
	isBitAssetId,
	isDynamicAssetDataId,
	isEchoRandKey,
	isOperationId,
	isDynamicGlobalObjectId,
	isUInt32,
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
	 *  @method help
	 *
	 *  @returns {Promise<String>}
	 */
	help() {
		return this.wsRpc.call([0, 'help', []]);
	}

	// not working
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

	//Wallet Calls

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

	// TODO Promise<Array> of what (string, number?)
	/**
	 *  @method dumpPrivateKeys
	 *
	 *  @returns {Promise<Array>}
	 */
	dumpPrivateKeys() {
		return this.wsRpc.call([0, 'dump_private_keys', []]);
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

	// TODO check validity and get positive result
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

	// TODO check validity and get positive result
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
		if (!isString(srcAccountName)) throw new Error('srcAccountName should be a string');
		if (!isString(destAccountName)) throw new Error('destAccountName should be a string');

		return this.wsRpc.call([0, 'import_account_keys', [filename, password, srcAccountName, destAccountName]]);
	}

	// TODO don't understand order and valid state of args (accountNameOrId, shouldDoBroadcastToNetwork, wifKeys)
	/**
	 *  @method importBalance
	 *	@param {String} accountNameOrId
	 *	@param {String} wifKeys
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Boolean>}
	 */
	importBalance(accountNameOrId, wifKeys, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'import_balance', [accountNameOrId, wifKeys, shouldDoBroadcastToNetwork]]);
	}

	/**
	 *  @method suggestBrainKey
	 *
	 *  @returns {Promise<Object>}
	 */
	suggestBrainKey() {
		return this.wsRpc.call([0, 'suggest_brain_key', []]);
	}

	// TODO check right result
	/**
	 *  @method getTransactionId
	 *	@param {String} signedTx
	 *  @returns {Promise<String>}
	 */
	getTransactionId(signedTx) {
		if (!isObject(signedTx)) throw new Error('transaction should be a object');
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

	//ACCOUNT CALLS

	/**
	 *  @method listMyAccounts
	 *
	 *  @returns {Promise<Array.<Object>>}
	 */
	listMyAccounts() {
		return this.wsRpc.call([0, 'list_my_accounts', []]);
	}

	// TODO check RETURN in DOC
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

	//TODO problems with args
	/**
	 *  @method registerAccount
	 *
	 *  @param  {Function} callback
	 *  @param  {String} name
	 * 	@param  {String} activeKey
	 * 	@param  {String} echoRandKey
	 *
	 *  @returns {Promise<Object>}
	 */
	registerAccount(callback, name, activeKey, echoRandKey) {
		if (!isAccountName(name)) throw new Error('Name is invalid');
		if (!isPublicKey(activeKey)) throw new Error('Active public key is invalid');
		if (!isEchoRandKey(echoRandKey)) throw new Error('Echo rand key is invalid');
		return this.wsRpc.call([0, 'register_account', [callback, name, activeKey, echoRandKey]]);
	}

	// TODO problems with args
	/**
	 *  @method createAccountWithBrainKey
	 *	@param {String} brainKey
	 *	@param {String} accountName
	 *	@param {String} registrarAccount
	 *	@param {String} referrerAccount
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Array>}
	 */
	createAccountWithBrainKey(brainKey, accountName, registrarAccount, referrerAccount, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([
			0, 'create_account_with_brain_key', [
				brainKey, accountName, registrarAccount, referrerAccount, shouldDoBroadcastToNetwork],
		]);
	}

	// TODO problems with args
	/**
	 *  @method transfer
	 *	@param {String} fromAccount
	 *	@param {String} toAccount
	 *	@param {String} amount
	 *	@param {String} assetSymbol
	 *	@param {String} memo
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	transfer(fromAccount, toAccount, amount, assetSymbol, memo, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'transfer', [fromAccount, toAccount, amount, assetSymbol, memo, shouldDoBroadcastToNetwork]]);
	}

	// TODO problems with args
	/**
	 *  @method transfer2
	 *	@param {String} fromAccount
	 *	@param {String} toAccount
	 *	@param {String} amount
	 *	@param {String} assetSymbol
	 *	@param {String} memo
	 *  @returns {Promise<String>}
	 */
	transfer2(fromAccount, toAccount, amount, assetSymbol, memo) {
		return this.wsRpc.call([0, 'transfer2', [fromAccount, toAccount, amount, assetSymbol, memo]]);
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
		return this.wsRpc.call([0, 'whitelist_account',
			[authorizingAccount, accountToList, newListingStatus, shouldDoBroadcastToNetwork],
		]);
	}

	/**
	 *  @method getVestingBalances
	 *	@param {String} accountId
	 *  @returns {Promise<Array>}
	 */
	getVestingBalances(accountId) {
		if (!isAccountId(accountId)) return Promise.reject(new Error('Account id is invalid'));

		return this.wsRpc.call([0, 'get_vesting_balances', [accountId]]);
	}

	// TODO problems with args
	/**
	 *  @method withdrawVesting
	 *	@param {String} witnessName
	 *	@param {String} amount
	 *	@param {String} assetSymbol
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Array>}
	 */
	withdrawVesting(witnessName, amount, assetSymbol, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'withdraw_vesting', [witnessName, amount, assetSymbol, shouldDoBroadcastToNetwork]]);
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
	 *  @returns {Promise<Array>}
	 */
	getAccountHistory(accountIdOrName, limit) {
		if (!(isAccountName(accountIdOrName) || isAccountId(accountIdOrName))) {
			throw new Error('Account name or id is invalid');
		}
		// if (!isOperationHistoryId(stop)) throw new Error('Stop parameter is invalid');
		if (!isUInt64(limit) || limit > API_CONFIG.ACCOUNT_HISTORY_MAX_LIMIT) {
			throw new Error(`Limit should be capped at ${API_CONFIG.ACCOUNT_HISTORY_MAX_LIMIT}`);
		}
		// if (!isOperationHistoryId(start)) throw new Error('Start parameter is invalid');
		return this.wsRpc.call([0, 'get_account_history', [accountIdOrName, limit]]);
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
			throw new Error('Account name or id is invalid');
		}
		if (!isString(proposalId)) throw new Error('proposal Id should be a string');
		if (!isObject(delta)) throw new Error('delta should be a object');

		return this.wsRpc.call([0, 'approve_proposal', [feePayingAccountId, proposalId, delta, shouldDoBroadcastToNetwork]]);
	}

	//TRADING CALLS

	//ASSET CALLS

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

	// TODO need help args
	/**
	 *  @method createAsset
	 *	@param {String} accountIdOrName
	 *	@param {String} symbol
	 *	@param {Number} precision
	 *	@param {String} assetOption
	 *	@param {Object} bitassetOpts
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	createAsset(accountIdOrName, symbol, precision, assetOption, bitassetOpts, shouldDoBroadcastToNetwork) {
		if (!isAccountId(accountIdOrName) || isAccountName(accountIdOrName)) {
			throw new Error('Accounts id or name should be string and valid');
		}
		return this.wsRpc.call([0, 'create_asset', [accountIdOrName, symbol, precision, bitassetOpts, shouldDoBroadcastToNetwork]]);
	}

	// TODO need help args
	/**
	 *  @method updateAsset
	 *	@param {String} assetIdOrName
	 *	@param {String} newIssuerId
	 *	@param {Object} newOptions
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	updateAsset(assetIdOrName, newIssuerId, newOptions, shouldDoBroadcastToNetwork) {
		if (!isAssetId(assetIdOrName) || isAssetName(assetIdOrName)) throw new Error('Asset id or name is invalid');

		return this.wsRpc.call([0, 'update_asset',
			[assetIdOrName, newIssuerId, newOptions, shouldDoBroadcastToNetwork],
		]);
	}

	// TODO need help args
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

	// TODO need help args
	/**
	 *  @method updateAssetFeedProducers
	 *	@param {String} assetIdOrName
	 *	@param {Array<String>} newFeedProducers
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	updateAssetFeedProducers(assetIdOrName, newFeedProducers, shouldDoBroadcastToNetwork) {
		if (!isAssetId(assetIdOrName) || isAssetName(assetIdOrName)) throw new Error('Asset id or name is invalid');
		return this.wsRpc.call([0, 'update_asset_feed_producers', [assetIdOrName, newFeedProducers, shouldDoBroadcastToNetwork]]);
	}

	// TODO need help args
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

	// TODO need help args
	/**
	 *  @method issueAsset
	 *	@param {String} accountIdOrName
	 *	@param {String} amount
	 *	@param {String} assetTicker
	 *	@param {String} memo
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	issueAsset(accountIdOrName, amount, assetTicker, memo, shouldDoBroadcastToNetwork) {
		if (!isAccountId(accountIdOrName) || isAccountName(accountIdOrName)) {
			throw new Error('Accounts id or name should be string and valid');
		}

		return this.wsRpc.call([0, 'issue_asset',
			[accountIdOrName, amount, assetTicker, memo, shouldDoBroadcastToNetwork],
		]);
	}

	// TODO need help args
	/**
	 *  @method getAsset
	 *	@param {String} assetId
	 *  @returns {Promise<Object>}
	 */
	getAsset(assetId) {
		if (!isAssetId(assetId)) throw new Error('Asset id or name is invalid');

		return this.wsRpc.call([0, 'get_asset', [assetId]]);
	}

	// TODO need help args
	/**
	 *  @method getBitassetData
	 *	@param {String} bitAssetId
	 *  @returns {Promise<Object>}
	 */
	getBitassetData(bitAssetId) {
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

	// TODO
	/**
	 *  @method createCommitteeMember
	 *	@param {String} accountId
	 *	@param {String} url
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	createCommitteeMember(accountId, url, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'create_committee_member', [accountId, url, shouldDoBroadcastToNetwork]]);
	}

	// TODO
	/**
	 *  @method getCommitteeMember
	 *	@param {String} accountId
	 *  @returns {Promise<Object>}
	 */
	getCommitteeMember(accountId) {
		return this.wsRpc.call([0, 'get_committee_member', [accountId]]);
	}

	// TODO
	/**
	 *  @method listCommitteeMembers
	 *	@param {String} committeeMemberName
	 *	@param {Number} limit
	 *  @returns {Promise<Object>}
	 */
	listCommitteeMembers(committeeMemberName, limit) {
		return this.wsRpc.call([0, 'list_committee_members', [committeeMemberName, limit]]);
	}

	// TODO
	/**
	 *  @method voteForCommitteeMember
	 *	@param {String} votingAccountId
	 *	@param {Number} committeeMemberId
	 *	@param {Boolean} approve
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	voteForCommitteeMember(votingAccountId, committeeMemberId, approve, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'vote_for_committee_member',
			[votingAccountId, committeeMemberId, approve, shouldDoBroadcastToNetwork],
		]);
	}

	// TODO
	/**
	 *  @method setVotingProxy
	 *	@param {String} accountIdToUpdate
	 *	@param {Number} votingAccountId
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	setVotingProxy(accountIdToUpdate, votingAccountId, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'set_voting_proxy', [accountIdToUpdate, votingAccountId, shouldDoBroadcastToNetwork]]);
	}

	// TODO
	/**
	 *  @method proposeParameterChange
	 *	@param {String} accountId
	 *	@param {Number} expirationTime
	 *	@param {Object} changedValues
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	proposeParameterChange(accountId, expirationTime, changedValues, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'propose_parameter_change', [accountId, expirationTime, changedValues, shouldDoBroadcastToNetwork]]);
	}

	// TODO
	/**
	 *  @method proposeFeeChange
	 *	@param {String} accountId
	 *	@param {Number} expirationTime
	 *	@param {Object} changedValues
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	proposeFeeChange(accountId, expirationTime, changedValues, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'propose_fee_change', [accountId, expirationTime, changedValues, shouldDoBroadcastToNetwork]]);
	}

	//PRIVACY MODE (there are not working methods)

	//Blockchain Inspection

	/**
	 *  @method getBlock
	 *  @param  {Number} blockNum
	 *
	 *  @return {
	 *  	Promise.<Block>
	 *  }
	 */
	getBlock(blockNum) {
		if (!isUInt64(blockNum)) return Promise.reject(new Error('BlockNumber should be a non negative integer'));

		return this.wsRpc.call([0, 'get_block', [blockNum]]);
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
		return this.wsRpc.call([0, 'get_object', [objectId]]);
	}

	//Transaction Builder

	/**
	 *  @method beginBuilderTransaction
	 *
	 *  @returns {Promise<Number>}
	 */
	beginBuilderTransaction() {
		return this.wsRpc.call([0, 'begin_builder_transaction', []]);
	}

	// TODO
	/**
	 *  @method addOperationToBuilderTransaction
	 *	@param {String|Number} transactionTypeHandle
	 *	@param {Array<String>} operation
	 *  @returns {Promise<null>}
	 */
	addOperationToBuilderTransaction(transactionTypeHandle, operation) {
		return this.wsRpc.call([0, 'add_operation_to_builder_transaction', [transactionTypeHandle, operation]]);
	}

	// TODO
	/**
	 *  @method replaceOperationInBuilderTransaction
	 *	@param {String|Number} transactionTypeHandle
	 *	@param {Number} unsignedOperation
	 *	@param {Array<String>} operation
	 *  @returns {Promise<null>}
	 */
	replaceOperationInBuilderTransaction(transactionTypeHandle, unsignedOperation, operation) {
		return this.wsRpc.call([0, 'replace_operation_in_builder_transaction',
			[transactionTypeHandle, unsignedOperation, operation],
		]);
	}

	// TODO
	/**
	 *  @method setFeesOnBuilderTransaction
	 *	@param {String|Number} transactionTypeHandle
	 *	@param {String} feeAsset
	 *  @returns {Promise<Object>}
	 */
	setFeesOnBuilderTransaction(transactionTypeHandle, feeAsset) {
		return this.wsRpc.call([0, 'set_fees_on_builder_transaction', [transactionTypeHandle, feeAsset]]);
	}

	// TODO
	/**
	 *  @method previewBuilderTransaction
	 *	@param {String|Number} transactionTypeHandle
	 *  @returns {Promise<Object>}
	 */
	previewBuilderTransaction(transactionTypeHandle) {
		return this.wsRpc.call([0, 'preview_builder_transaction', [transactionTypeHandle]]);
	}

	// TODO
	/**
	 *  @method signBuilderTransaction
	 *	@param {String|Number} transactionTypeHandle
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	signBuilderTransaction(transactionTypeHandle, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'sign_builder_transaction', [transactionTypeHandle, shouldDoBroadcastToNetwork]]);
	}

	// TODO
	/**
	 *  @method proposeBuilderTransaction
	 *	@param {String|Number} transactionTypeHandle
	 *	@param {String} expirationTime
	 *	@param {Number} reviewPeriod
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	proposeBuilderTransaction(transactionTypeHandle, expirationTime, reviewPeriod, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'propose_builder_transaction',
			[transactionTypeHandle, expirationTime, reviewPeriod, shouldDoBroadcastToNetwork],
		]);
	}

	// TODO
	/**
	 *  @method proposeBuilderTransaction2
	 *	@param {String} accountId
	 *	@param {String|Number} transactionTypeHandle
	 *	@param {String} expirationTime
	 *	@param {Number} reviewPeriod
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	proposeBuilderTransaction2(transactionTypeHandle, accountId, expirationTime, reviewPeriod, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'propose_builder_transaction2',
			[transactionTypeHandle, accountId, expirationTime, reviewPeriod, shouldDoBroadcastToNetwork],
		]);
	}

	// TODO
	/**
	 *  @method removeBuilderTransaction
	 *	@param {String|Number} transactionTypeHandle
	 *  @returns {Promise<null>}
	 */
	removeBuilderTransaction(transactionTypeHandle) {
		return this.wsRpc.call([0, 'remove_builder_transaction', [transactionTypeHandle]]);
	}

	// TODO
	/**
	 *  @method serializeTransaction
	 *	@param {Object} signedTransaction
	 *  @returns {Promise<String>}
	 */
	serializeTransaction(signedTransaction) {
		return this.wsRpc.call([0, 'serialize_transaction', [signedTransaction]]);
	}

	// TODO
	/**
	 *  @method signTransaction
	 *	@param {Object} unsignedTransaction
	 *	@param {Boolean} shouldDoBroadcastToNetwork
	 *  @returns {Promise<Object>}
	 */
	signTransaction(signedTransaction, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'sign_transaction', [signedTransaction, shouldDoBroadcastToNetwork]]);
	}

	// TODO
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
