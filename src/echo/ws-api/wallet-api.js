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

	// TODO
	/**
	 *  @method networkAddNodes
	 *	@param {String} nodes
	 *  @returns {Promise<Array>}
	 */
	networkAddNodes(nodes) {
		return this.wsRpc.call([0, 'network_add_nodes', [nodes]]);
	}

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
		return this.wsRpc.call([0, 'unlock', [password]]);
	}

	/**
	 *  @method setPassword
	 *	@param {String} password
	 *  @returns {Promise<null>}
	 */
	setPassword(password) {
		return this.wsRpc.call([0, 'set_password', [password]]);
	}

	/**
	 *  @method dumpPrivateKeys
	 *
	 *  @returns {Promise<Array>}
	 */
	dumpPrivateKeys() {
		return this.wsRpc.call([0, 'dump_private_keys', []]);
	}

	// TODO
	/**
	 *  @method importKey
	 *	@param {String} accountNameOrId
	 *	@param {String} privateKeyWif
	 *  @returns {Promise<Boolean>}
	 */
	importKey(accountNameOrId, privateKeyWif) {
		return this.wsRpc.call([0, 'import_key', [accountNameOrId, privateKeyWif]]);
	}

	// TODO
	/**
	 *  @method importAccounts
	 *	@param {String} filename
	 *	@param {String} password
	 *  @returns {Promise<Boolean>}
	 */
	importAccounts(filename, password) {
		return this.wsRpc.call([0, 'import_accounts', [filename, password]]);
	}

	// TODO
	/**
	 *  @method importAccountKeys
	 *	@param {String} filename
	 *	@param {String} password
	 *	@param {String} srcAccountName
	 *	@param {String} destAccountName
	 *  @returns {Promise<Boolean>}
	 */
	importAccountKeys(filename, password, srcAccountName, destAccountName) {
		return this.wsRpc.call([0, 'import_account_keys', [filename, password, srcAccountName, destAccountName]]);
	}

	// TODO
	/**
	 *  @method importBalance
	 *	@param {String} accountNameOrId
	 *	@param {String} wifKeys
	 *	@param {String} shouldDoBroadcast
	 *  @returns {Promise<Boolean>}
	 */
	importBalance(accountNameOrId, wifKeys, shouldDoBroadcast) {
		return this.wsRpc.call([0, 'import_balance', [accountNameOrId, wifKeys, shouldDoBroadcast]]);
	}

	/**
	 *  @method suggestBrainKey
	 *
	 *  @returns {Promise<String>}
	 */
	suggestBrainKey() {
		return this.wsRpc.call([0, 'suggest_brain_key', []]);
	}

	// TODO
	/**
	 *  @method getTransactionId
	 *	@param {String} signedTransaction
	 *  @returns {Promise<String>}
	 */
	getTransactionId(signedTransaction) {
		return this.wsRpc.call([0, 'get_transaction_id', [signedTransaction]]);
	}

	// TODO
	/**
	 *  @method getPrivateKey
	 *	@param {String} publicKey
	 *  @returns {Promise<String>}
	 */
	getPrivateKey(publicKey) {
		return this.wsRpc.call([0, 'get_private_key', [publicKey]]);
	}

	/**
	 *  @method loadWalletFile
	 *	@param {String} walletFilename
	 *  @returns {Promise<Boolean>}
	 */
	loadWalletFile(walletFilename) {
		return this.wsRpc.call([0, 'load_wallet_file', [walletFilename]]);
	}

	/**
	 *  @method normalizeBrainKey
	 *	@param {String} brainKey
	 *  @returns {Promise<String>}
	 */
	normalizeBrainKey(brainKey) {
		return this.wsRpc.call([0, 'normalize_brain_key', [brainKey]]);
	}

	/**
	 *  @method saveWalletFile
	 *	@param {String} walletFilename
	 *  @returns {Promise<null>}
	 */
	saveWalletFile(walletFilename) {
		return this.wsRpc.call([0, 'save_wallet_file', [walletFilename]]);
	}

	//ACCOUNT CALLS

	/**
	 *  @method listMyAccounts
	 *
	 *  @returns {Promise<Array>}
	 */
	listMyAccounts() {
		return this.wsRpc.call([0, 'list_my_accounts', []]);
	}

	/**
	 *  @method listAccounts
	 *	@param {String} accountName
	 *	@param {Number} limit
	 *  @returns {Promise<Array>}
	 */
	listAccounts(accountName, limit) {
		return this.wsRpc.call([0, 'list_accounts', [accountName, limit]]);
	}

	/**
	 *  @method listAccountBalances
	 *	@param {String} accountId
	 *  @returns {Promise<Array>}
	 */
	listAccountBalances(accountId) {
		return this.wsRpc.call([0, 'list_account_balances', [accountId]]);
	}

	// /** ALREADY EXIST
	//  *  @method registerAccount
	//  *	@param {String} accountId
	//  *  @returns {Promise<Array>}
	//  */
	// registerAccount(accountId) {
	// 	return this.wsRpc.call([0, 'register_account', [accountId]]);
	// }

	// TODO
	/**
	 *  @method createAccountWithBrainKey
	 *	@param {String} brainKey
	 *	@param {String} accountName
	 *	@param {String} registrarAccount
	 *	@param {String} referrerAccount
	 *	@param {Boolean} broadcast
	 *  @returns {Promise<Array>}
	 */
	createAccountWithBrainKey(brainKey, accountName, registrarAccount, referrerAccount, broadcast) {
		return this.wsRpc.call([
			0, 'create_account_with_brain_key', [
				brainKey, accountName, registrarAccount, referrerAccount, broadcast],
		]);
	}

	// TODO
	/**
	 *  @method transfer
	 *	@param {String} fromAccount
	 *	@param {String} toAccount
	 *	@param {String} amount
	 *	@param {String} assetSymbol
	 *	@param {String} memo
	 *	@param {Boolean} broadcast
	 *  @returns {Promise<Object>}
	 */
	transfer(fromAccount, toAccount, amount, assetSymbol, memo, broadcast) {
		return this.wsRpc.call([0, 'transfer', [fromAccount, toAccount, amount, assetSymbol, memo, broadcast]]);
	}

	// TODO
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

	// TODO
	/**
	 *  @method whitelistAccount
	 *	@param {String} authorizingAccount
	 *	@param {String} accountToList
	 *	@param {String} newListingStatus
	 *	@param {String} broadcast
	 *  @returns {Promise<Object>}
	 */
	whitelistAccount(authorizingAccount, accountToList, newListingStatus, broadcast) {
		return this.wsRpc.call([0, 'whitelist_account',
			[authorizingAccount, accountToList, newListingStatus, broadcast],
		]);
	}

	/**
	 *  @method getVestingBalances
	 *	@param {String} accountId
	 *  @returns {Promise<Array>}
	 */
	getVestingBalances(accountId) {
		return this.wsRpc.call([0, 'get_vesting_balances', [accountId]]);
	}

	// TODO
	/**
	 *  @method withdrawVesting
	 *	@param {String} witnessName
	 *	@param {String} amount
	 *	@param {String} assetSymbol
	 *	@param {String} broadcast
	 *  @returns {Promise<Array>}
	 */
	withdrawVesting(witnessName, amount, assetSymbol, broadcast) {
		return this.wsRpc.call([0, 'withdraw_vesting', [witnessName, amount, assetSymbol, broadcast]]);
	}

	// TODO
	/**
	 *  @method getAccount
	 *	@param {String} accountIdOrName
	 *  @returns {Promise<Object>}
	 */
	getAccount(accountIdOrName) {
		return this.wsRpc.call([0, 'get_account', [accountIdOrName]]);
	}

	// TODO
	/**
	 *  @method getAccountId
	 *	@param {String} accountIdOrName
	 *  @returns {Promise<String>}
	 */
	getAccountId(accountIdOrName) {
		return this.wsRpc.call([0, 'get_account_id', [accountIdOrName]]);
	}

	// TODO
	/**
	 *  @method getAccountHistory
	 *	@param {String} accountIdOrName
	 *	@param {Number} limit
	 *  @returns {Promise<Array>}
	 */
	getAccountHistory(accountIdOrName, limit) {
		return this.wsRpc.call([0, 'get_account_history', [accountIdOrName, limit]]);
	}

	// TODO
	/**
	 *  @method approveProposal
	 *	@param {String} feePayingAccount
	 *	@param {String} proposalId
	 *	@param {String} delta
	 *	@param {String} broadcast
	 *  @returns {Promise<Object>}
	 */
	approveProposal(feePayingAccount, proposalId, delta, broadcast) {
		return this.wsRpc.call([0, 'approve_proposal', [feePayingAccount, proposalId, delta, broadcast]]);
	}

	//TRADING CALLS

	//ASSET CALLS

	// TODO
	/**
	 *  @method createAsset
	 *	@param {String} accountId
	 *	@param {String} symbol
	 *	@param {Number} precision
	 *	@param {String} assetOption
	 *	@param {Object} bitassetOpts
	 *	@param {String} broadcast
	 *  @returns {Promise<Object>}
	 */
	createAsset(accountId, symbol, precision, assetOption, bitassetOpts, broadcast) {
		return this.wsRpc.call([0, 'create_asset', [accountId, symbol, precision, bitassetOpts, broadcast]]);
	}

	// TODO
	/**
	 *  @method updateAsset
	 *	@param {String} accountId
	 *	@param {String} newIssuerId
	 *	@param {Object} newOptions
	 *	@param {String} broadcast
	 *  @returns {Promise<Object>}
	 */
	updateAsset(accountId, newIssuerId, newOptions, broadcast) {
		return this.wsRpc.call([0, 'update_asset', [accountId, newIssuerId, newOptions, broadcast]]);
	}

	// TODO
	/**
	 *  @method updateBitasset
	 *	@param {String} assetId
	 *	@param {Object} newBitasset
	 *	@param {Boolean} broadcast
	 *  @returns {Promise<Object>}
	 */
	updateBitasset(assetId, newBitasset, broadcast) {
		return this.wsRpc.call([0, 'update_bitasset', [assetId, newBitasset, broadcast]]);
	}

	// TODO
	/**
	 *  @method updateAssetFeedProducers
	 *	@param {String} assetId
	 *	@param {Array} newFeedProducers
	 *	@param {Boolean} broadcast
	 *  @returns {Promise<Object>}
	 */
	updateAssetFeedProducers(assetId, newFeedProducers, broadcast) {
		return this.wsRpc.call([0, 'update_asset_feed_producers', [assetId, newFeedProducers, broadcast]]);
	}

	// TODO
	/**
	 *  @method publishAssetFeed
	 *	@param {String} accountId
	 *	@param {String} assetId
	 *	@param {Object} priceFeed
	 *	@param {Boolean} broadcast
	 *  @returns {Promise<Object>}
	 */
	publishAssetFeed(accountId, assetId, priceFeed, broadcast) {
		return this.wsRpc.call([0, 'publish_asset_feed', [accountId, assetId, priceFeed, broadcast]]);
	}

	// TODO
	/**
	 *  @method issueAsset
	 *	@param {String} accountId
	 *	@param {String} amount
	 *	@param {String} assetTicker
	 *	@param {String} memo
	 *	@param {Boolean} broadcast
	 *  @returns {Promise<Object>}
	 */
	issueAsset(accountId, amount, assetTicker, memo, broadcast) {
		return this.wsRpc.call([0, 'issue_asset', [accountId, amount, assetTicker, memo, broadcast]]);
	}

	// TODO
	/**
	 *  @method getAsset
	 *	@param {String} assetId
	 *  @returns {Promise<Object>}
	 */
	getAsset(assetId) {
		return this.wsRpc.call([0, 'get_asset', [assetId]]);
	}

	// TODO
	/**
	 *  @method getBitassetData
	 *	@param {String} bitAssetId
	 *  @returns {Promise<Object>}
	 */
	getBitassetData(bitAssetId) {
		return this.wsRpc.call([0, 'get_bitasset_data', [bitAssetId]]);
	}

	// TODO
	/**
	 *  @method fundAssetFeePool
	 *	@param {String} fromAccountId
	 *	@param {String} assetId
	 *	@param {String} amount
	 *	@param {Boolean} broadcast
	 *  @returns {Promise<Object>}
	 */
	fundAssetFeePool(fromAccountId, assetId, amount, broadcast) {
		return this.wsRpc.call([0, 'fund_asset_fee_pool', [fromAccountId, assetId, amount, broadcast]]);
	}

	// TODO
	/**
	 *  @method reserveAsset
	 *	@param {String} accountId
	 *	@param {String} amount
	 *	@param {String} assetId
	 *	@param {Boolean} broadcast
	 *  @returns {Promise<Object>}
	 */
	reserveAsset(accountId, amount, assetId, broadcast) {
		return this.wsRpc.call([0, 'reserve_asset', [accountId, amount, assetId, broadcast]]);
	}

	// GOVERNANCE

	// TODO
	/**
	 *  @method createCommitteeMember
	 *	@param {String} accountId
	 *	@param {String} url
	 *	@param {Boolean} broadcast
	 *  @returns {Promise<Object>}
	 */
	createCommitteeMember(accountId, url, broadcast) {
		return this.wsRpc.call([0, 'create_committee_member', [accountId, url, broadcast]]);
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
	 *	@param {Boolean} broadcast
	 *  @returns {Promise<Object>}
	 */
	voteForCommitteeMember(votingAccountId, committeeMemberId, approve, broadcast) {
		return this.wsRpc.call([0, 'vote_for_committee_member',
			[votingAccountId, committeeMemberId, approve, broadcast],
		]);
	}

	// TODO
	/**
	 *  @method setVotingProxy
	 *	@param {String} accountIdToUpdate
	 *	@param {Number} votingAccountId
	 *	@param {Boolean} broadcast
	 *  @returns {Promise<Object>}
	 */
	setVotingProxy(accountIdToUpdate, votingAccountId, broadcast) {
		return this.wsRpc.call([0, 'set_voting_proxy', [accountIdToUpdate, votingAccountId, broadcast]]);
	}

	// TODO
	/**
	 *  @method proposeParameterChange
	 *	@param {String} accountId
	 *	@param {Number} expirationTime
	 *	@param {Object} changedValues
	 *	@param {Boolean} broadcast
	 *  @returns {Promise<Object>}
	 */
	proposeParameterChange(accountId, expirationTime, changedValues, broadcast) {
		return this.wsRpc.call([0, 'propose_parameter_change', [accountId, expirationTime, changedValues, broadcast]]);
	}

	// TODO
	/**
	 *  @method proposeFeeChange
	 *	@param {String} accountId
	 *	@param {Number} expirationTime
	 *	@param {Object} changedValues
	 *	@param {Boolean} broadcast
	 *  @returns {Promise<Object>}
	 */
	proposeFeeChange(accountId, expirationTime, changedValues, broadcast) {
		return this.wsRpc.call([0, 'propose_fee_change', [accountId, expirationTime, changedValues, broadcast]]);
	}

	//PRIVACY MODE

	//Blockchain Inspection

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
	 *  @returns {Promise<Object>}
	 */
	beginBuilderTransaction() {
		return this.wsRpc.call([0, 'begin_builder_transaction', []]);
	}

	/**
	 *  @method beginBuilderTransaction
	 *
	 *  @returns {Promise<Object>}
	 */
	beginBuilderTransaction() {
		return this.wsRpc.call([0, 'begin_builder_transaction', []]);
	}

}

export default WalletAPI;
