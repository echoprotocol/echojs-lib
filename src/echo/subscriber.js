import EventEmitter from 'events';
import { Map, Set, fromJS } from 'immutable';

import { STATUS, CHAIN_API } from '../constants/ws-constants';

import {
	isFunction,
	isObjectId,
	isAccountBalanceId,
	isAccountStatisticsId,
	isTransactionId,
	isBlockSummaryId,
	isAccountTransactionHistoryId,
	isOperationHistoryId,
	isCommitteeMemberId,
	isDynamicGlobalObjectId,
	isAccountId,
	isAssetId,
	isDynamicAssetDataId,
	isBitAssetId,
	isProposalId,
	isArray,
	isContractId,
	isContractHistoryId,
	isAccountAddressId,
	isEthAddressId,
	isBtcAddressId,
	isContractPoolId,
} from '../utils/validators';

import {
	CACHE_MAPS,
	CANCEL_LIMIT_ORDER,
	CLOSE_CALL_ORDER,
	BITASSET_UPDATE,
} from '../constants';

import { handleConnectionClosedError } from '../utils/helpers';
import { IMPLEMENTATION_OBJECT_TYPE_ID } from '../constants/chain-types';
import { ConnectionType } from './providers';
import { toRawContractLogsFilterOptions } from '../utils/converters';

/** @typedef {import("./engine").default} EchoApiEngine */

/** @typedef {import("../../types/interfaces/vm/types").Log} Log */

class Subscriber extends EventEmitter {

	/**
	 *  @constructor
	 */
	constructor() {
		super();

		this.subscriptions = {
			account: false,
			echorand: false,
			block: false,
			transaction: false,
		};

		this._clearSubscribers();
	}

	/**
	 *  @method init
	 *  @param {Cache} cache
	 *  @param {EchoApiEngine} engine
	 *  @param {API} api
	 *
	 *  @return {Promise.<undefined>}
	 */
	async init(cache, engine, api) {

		this._engine = engine;
		if (engine.provider.connectionType !== ConnectionType.WS) {
			throw new Error('Subscriber can only be created for ws connection');
		}
		this._engine.provider.on(STATUS.CLOSE, () => this.callCbOnDisconnect());

		this.cache = cache;
		this._wsApi = engine;
		this._api = api;

		const databaseApiAvailable = this._engine.apis.includes(CHAIN_API.DATABASE_API);
		if (databaseApiAvailable) await this._wsApi.database.setSubscribeCallback(this._onRespond.bind(this), true);
		this.callCbOnConnect();
		if (!databaseApiAvailable) {
			console.warn('unable to start subscriber cause database api is not available');
			return;
		}

		if (this.subscriptions.echorand) {
			await this._setEchorandMessageCallback();
		}

		if (this.subscriptions.block) {
			await this._setBlockApplyCallback();
		}

		if (this.subscribers.account.length !== 0) {
			await this._setAccountSubscribe();
		}

		if (this.subscriptions.transaction) {
			await this._setPendingTransactionCallback();
		}

		if (this.subscribers.contract.length !== 0) {
			const contracts = this.subscribers.contract.reduce((arr, c) => [...arr, ...c.contracts], []);
			this._setContractSubscribe(contracts);
		}

		await this._subscribeCache();
	}

	/**
	 *  @method reset
	 *
	 *  @return {undefined}
	 */
	reset() {
		this.subscriptions = {
			account: false,
			echorand: false,
			block: false,
			transaction: false,
		};

		this.subscribers.connect.forEach((cb) => {
			this._engine.provider.removeListener(STATUS.OPEN, cb);
		});

		this.subscribers.disconnect.forEach((cb) => {
			this._engine.provider.removeListener(STATUS.CLOSE, cb);
		});

		this._clearSubscribers();
	}

	_clearSubscribers() {
		this.subscribers = {
			global: [], // "global" means all updates from setSubscribeCallback
			account: [], // { ids: [], callback: () => {} }
			committeeMember: [], // { ids: [], callback: () => {} }
			echorand: [],
			block: [],
			transaction: [],
			logs: {},	// [contractId]: []
			contract: [],
			connect: [],
			disconnect: [],
		};
	}

	/**
	 *  @method callCbOnConnect
	 *
	 *  @return {undefined}
	 */
	callCbOnConnect() {
		if (this.subscribers.connect.length) {
			this.subscribers.connect.forEach((cb) => cb());
		}
	}

	/**
	 *  @method callCbOnDisconnect
	 *
	 *  @return {undefined}
	 */
	callCbOnDisconnect() {
		if (this.subscribers.disconnect.length) {
			this.subscribers.disconnect.forEach((cb) => cb());
		}
	}

	/**
	 *  @method cancelAllSubscribers
	 *
	 *  @return {undefined}
	 */
	cancelAllSubscribers() {
		this.reset();
	}

	/**
	 *  @method _updateObject
	 *
	 *  @param  {Object} object
	 *
	 *  @return {null}
	 */
	_updateObject(object) {
		// transaction.js is id param exists -> if no - transaction.js settle order params
		if (!object.id) {
			if (object.balance && object.owner && object.settlement_date) {
				this.emit('settle-order-update', object);
			}
			return null;
		}

		const subscribedAccounts = this.subscribers.account.reduce(
			(arr, { accounts }) => arr.concat(accounts),
			[],
		).concat(this.cache.fullAccounts.reduce(
			(arr, value, key) => ([...arr, key]),
			[],
		));

		const subscribedCommitteeMembers = this.subscribers.committeeMember.reduce(
			(arr, { ids }) => arr.concat(ids),
			[],
		);

		// transaction.js interested by id type
		if (isTransactionId(object.id)) {
			return null;
		}

		if (isAccountTransactionHistoryId(object.id) && !subscribedAccounts.includes(object.account)) {
			return null;
		}

		if (
			isAccountBalanceId(object.id)
			&& !subscribedAccounts.includes(object.owner)
			&& !this.cache.fullAccounts.has(object.owner)
		) {
			return null;
		}

		if (isOperationHistoryId(object.id)) {
			const contractId = object.op[1].callee;
			const history = this.cache.contractHistoryByContractId.get(contractId) || [];

			if (history.find((h) => h.get('id') === object.id)) {
				return null;
			}

			history.unshift(fromJS(object));

			this.cache.setInMap(CACHE_MAPS.CONTRACT_HISTORY_BY_CONTRACT_ID, contractId, history);
			return null;
		}

		if (isAccountAddressId(object.id)) {
			let addressesList = this.cache.accountAddressesByAccountId.get(object.owner);

			if (!addressesList) {
				return null;
			}
			addressesList = addressesList.push(fromJS(object));

			this.cache.setInMap(CACHE_MAPS.ACCOUNT_ADDRESSES_BY_ACCOUNT_ID, object.owner, addressesList);
			return null;
		}

		if (isEthAddressId(object.id)) {

			const ethAddress = this.cache.accountEthAddressByAccountId.get(object.account);

			if (!ethAddress) {
				return null;
			}

			this.cache.setInMap(CACHE_MAPS.ACCOUNT_ETH_ADDRESS_BY_ACCOUNT_ID, object.account, fromJS(object));
			return null;
		}

		if (isBtcAddressId(object.id)) {
			const btcAddress = this.cache.accountBtcAddressByAccountId.get(object.account);

			if (!btcAddress) {
				return null;
			}

			this.cache.setInMap(CACHE_MAPS.ACCOUNT_BTC_ADDRESS_BY_ACCOUNT_ID, object.account, fromJS(object));
		}

		if (isBlockSummaryId(object.id)) {
			return null;
		}

		if (isAccountStatisticsId(object.id) && !subscribedAccounts.includes(object.owner)) {
			return null;
		}


		if (isCommitteeMemberId(object.id) && !subscribedCommitteeMembers.includes(object.id)) {
			return null;
		}

		if (/^0\.0\.[1-9]\d*$/.test(object.id) || /^5\.1\.[1-9]\d*$/.test(object.id)) {
			return null;
		}

		// transaction.js if dynamic global object
		if (isDynamicGlobalObjectId(object.id)) {
			const dynamicGlobalObject = new Map(object);

			this.cache.set(CACHE_MAPS.DYNAMIC_GLOBAL_PROPERTIES, dynamicGlobalObject)
				.setInMap(CACHE_MAPS.OBJECTS_BY_ID, object.id, dynamicGlobalObject);
		}

		// get object from cache by id
		let obj = this.cache.objectsById.get(object.id);
		const previous = obj || new Map();
		obj = obj ? obj.mergeDeep(fromJS(object)) : fromJS(object);

		// update dependencies by id type
		if (isAccountBalanceId(object.id)) {
			let owner = this.cache.fullAccounts.get(object.owner);
			if (!owner) {
				return null;
			}

			const balances = owner.get('balances');

			if (!balances) {
				owner = owner.set('balances', new Map());
			}

			owner = owner.setIn(['balances', object.asset_type], object.id);
			this.cache.setInMap(CACHE_MAPS.FULL_ACCOUNTS, object.owner, owner)
				.setInMap(CACHE_MAPS.OBJECTS_BY_ID, object.id, fromJS(object));

			this._notifyAccountSubscribers(owner);
		}

		if (isAccountStatisticsId(object.id)) {
			try {
				const accountTransactionHistoryId = `2.${IMPLEMENTATION_OBJECT_TYPE_ID.ACCOUNT_TRANSACTION_HISTORY}.0`;
				const previousMostRecentOp = previous.get('most_recent_op', accountTransactionHistoryId);

				if (previousMostRecentOp !== object.most_recent_op) {
					this._api.getFullAccounts([object.owner], true, true).catch(handleConnectionClosedError);
				}
			} catch (err) {
				//
			}
		}

		if (isCommitteeMemberId(object.id)) {
			this.cache
				.setInMap(CACHE_MAPS.COMMITTEE_MEMBERS_BY_ACCOUNT_ID, object.committee_member_account, obj)
				.setInMap(CACHE_MAPS.COMMITTEE_MEMBERS_BY_COMMITTEE_MEMBER_ID, object.id, obj)
				.setInMap(CACHE_MAPS.OBJECTS_BY_ID, object.id, obj)
				.setInMap(CACHE_MAPS.OBJECTS_BY_VOTE_ID, object.vote_id, obj);
		}

		if (isAccountId(object.id)) {
			obj = obj.set('active', fromJS(object.active));
			obj = obj.set('owner', fromJS(object.owner));
			obj = obj.set('options', fromJS(object.options));
			obj = obj.set('whitelisting_accounts', fromJS(object.whitelisting_accounts));
			obj = obj.set('blacklisting_accounts', fromJS(object.blacklisting_accounts));
			obj = obj.set('whitelisted_accounts', fromJS(object.whitelisted_accounts));
			obj = obj.set('blacklisted_accounts', fromJS(object.blacklisted_accounts));

			if (this.cache.objectsById.get(object.id)) {

				const mutableObj = obj.withMutations((map) => {
					const fieldsToDelete = [
						'statistics', 'registrar_name', 'referrer_name',
						'votes', 'balances', 'vesting_balances',
						'proposals', 'assets',
					];

					fieldsToDelete.forEach((field) => {
						map.delete(field);
					});
				});

				this.cache.setInMap(CACHE_MAPS.OBJECTS_BY_ID, object.id, mutableObj)
					.setInMap(CACHE_MAPS.ACCOUNTS_BY_ID, object.id, mutableObj);
			}

			if (this.cache.fullAccounts.has(object.id)) {
				const mutableObj = this.cache.fullAccounts.get(object.id).mergeDeep(obj);
				this.cache.setInMap(CACHE_MAPS.FULL_ACCOUNTS, object.id, mutableObj);
			}

			this._notifyAccountSubscribers(obj);
		}

		if (isAssetId(object.id)) {
			const dynamic = obj.get('dynamic');
			if (!dynamic) {
				let dad = this.cache.objectsById.get(object.dynamic_asset_data_id);

				if (!dad) {
					dad = new Map();
				}

				if (!dad.get('asset_id')) {
					dad = dad.set('asset_id', object.id);
				}

				this.cache.setInMap(CACHE_MAPS.OBJECTS_BY_ID, object.dynamic_asset_data_id, dad)
					.setInMap(
						CACHE_MAPS.DYNAMIC_ASSET_DATA_BY_DYNAMIC_ASSET_DATA_ID,
						object.dynamic_asset_data_id,
						dad,
					);

				obj = obj.set('dynamic', dad);
			}

			const bitasset = obj.get('bitasset');
			if (!bitasset && object.bitasset_data_id) {
				let bad = this.cache.objectsById.get(object.bitasset_data_id);

				if (!bad) {
					bad = new Map();
				}

				if (!bad.get('asset_id')) {
					bad = bad.set('asset_id', object.id);
				}

				this.cache.setInMap(CACHE_MAPS.OBJECTS_BY_ID, object.bitasset_data_id, bad)
					.setInMap(CACHE_MAPS.BIT_ASSETS_BY_BIT_ASSET_ID, object.bitasset_data_id, bad);

				obj = obj.set('bitasset', bad);
			}

			this.cache.setInMap(CACHE_MAPS.OBJECTS_BY_ID, object.id, obj)
				.setInMap(CACHE_MAPS.ASSET_BY_ASSET_ID, object.id, obj)
				.setInMap(CACHE_MAPS.ASSET_BY_SYMBOL, object.symbol, obj);
		}

		if (isDynamicAssetDataId(object.id)) {
			const assetId = this.cache.dynamicIdToAssetId.get(object.id);
			if (assetId) {
				let asset = this.cache.objectsById.get(assetId);
				if (asset && asset.set) {
					asset = asset.set('dynamic', obj);

					this.cache.setInMap(CACHE_MAPS.OBJECTS_BY_ID, assetId, asset)
						.setInMap(CACHE_MAPS.ASSET_BY_ASSET_ID, assetId, asset)
						.setInMap(CACHE_MAPS.ASSET_BY_SYMBOL, asset.get('symbol'), asset);
				}
			}

			this.cache.setInMap(CACHE_MAPS.OBJECTS_BY_ID, object.id, obj)
				.setInMap(CACHE_MAPS.DYNAMIC_ASSET_DATA_BY_DYNAMIC_ASSET_DATA_ID, object.id, obj);

		}

		if (isBitAssetId(object.id)) {
			const assetId = this.cache.bitAssetIdToAssetId.get(object.id);

			if (assetId) {
				let asset = this.cache.objectsById.get(assetId);
				if (asset) {
					asset = asset.set('bitasset', obj);
					this.emit(BITASSET_UPDATE, asset);

					this.cache.setInMap(CACHE_MAPS.OBJECTS_BY_ID, assetId, asset)
						.setInMap(CACHE_MAPS.ASSET_BY_ASSET_ID, assetId, asset)
						.setInMap(CACHE_MAPS.ASSET_BY_SYMBOL, asset.get('symbol'), asset);
				}
			}

			this.cache.setInMap(CACHE_MAPS.OBJECTS_BY_ID, object.id, obj)
				.setInMap(CACHE_MAPS.BIT_ASSETS_BY_BIT_ASSET_ID, object.id, obj);
		}

		if (isProposalId(object.id) && object.required_active_approvals) {
			object.required_active_approvals.concat(object.required_owner_approvals).forEach((id) => {
				let impactedAccount = this.cache.fullAccounts.get(id);
				if (impactedAccount) {
					let proposals = impactedAccount.get('proposals', new Set());

					if (!proposals.includes(object.id)) {
						proposals = proposals.add(object.id);
						impactedAccount = impactedAccount.set('proposals', proposals);

						this.cache.setInMap(CACHE_MAPS.FULL_ACCOUNTS, impactedAccount.get('id'), impactedAccount);
						this._updateObject(impactedAccount.toJS());
						this._notifyAccountSubscribers(impactedAccount);
					}
				}
			});
		}

		if (isContractHistoryId(object.id) || isContractPoolId(object.id)) {
			this._notifyContractSubscribers(obj);
			this._api.getFullContract(object.contract, true).catch(handleConnectionClosedError);
		}

		return null;
	}

	/**
	 *  @method _onRespond
	 *
	 *  @param  {Object} [messages]
	 *
	 *  @return {undefined}
	 */
	_onRespond([messages]) {
		const orders = [];

		const updates = messages.filter((msg) => {
			// transaction.js is object id
			if (isObjectId(msg)) {
				return false;
			}

			this._updateObject(msg);
			return true;
		});

		// emit orders
		this.emit(CANCEL_LIMIT_ORDER, orders.filter(({ type }) => type === CANCEL_LIMIT_ORDER));
		this.emit(CLOSE_CALL_ORDER, orders.filter(({ type }) => type === CLOSE_CALL_ORDER));

		// inform external subscribers
		this.subscribers.global.forEach((callback) => {
			callback(updates);
		});
	}

	/**
	 *  @method setOptions
	 *
	 *  @param {Object} options
	 *
	 *  @return {undefined}
	 */
	setOptions(options) {
		this.options = options;
	}

	onAllUpdates() {}

	onAccountUpdate() {}

	/**
	 *  @method _echorandUpdate
	 *
	 *  @param  {Array} result
	 *
	 *  @return {undefined}
	 */
	_echorandUpdate(result) {
		this.subscribers.echorand.forEach((callback) => {
			callback(result);
		});
	}

	/**
	 *  @method _setEchorandMessageCallback
	 *
	 *  @return {Promise.<undefined>}
	 */
	async _setEchorandMessageCallback() {
		await this._wsApi.echorand.setEchorandMessageCallback(this._echorandUpdate.bind(this));
		this.subscriptions.echorand = true;
	}

	/**
	 *  @method setEchorandSubscribe
	 *
	 *  @param  {Function} callback
	 *
	 *  @return {Promise.<undefined>}
	 */
	async setEchorandSubscribe(callback) {
		if (!isFunction(callback)) {
			throw new Error('Callback is not a function');
		}

		this.subscribers.echorand.push(callback);

		if (!this.subscriptions.echorand) {
			await this._setEchorandMessageCallback();
		}
	}

	/**
	 *  @method removeEchorandSubscribe
	 *
	 *  @param  {Function} callback
	 *
	 *  @return {undefined}
	 */
	removeEchorandSubscribe(callback) {
		this.subscribers.echorand = this.subscribers.echorand.filter((c) => c !== callback);
	}

	/**
	 *  @method setGlobalSubscribe
	 *
	 *  @param  {Function} callback
	 *
	 *  @return {Promise.<undefined>}
	 */
	setGlobalSubscribe(callback) {
		if (!isFunction(callback)) {
			throw new Error('Callback is not a function');
		}

		this.subscribers.global.push(callback);
	}

	/**
	 *  @method removeGlobalSubscribe
	 *
	 *  @param  {Function} callback
	 *
	 *  @return {undefined}
	 */
	removeGlobalSubscribe(callback) {
		this.subscribers.global = this.subscribers.global.filter((c) => c !== callback);
	}

	/**
	 *  @method _pendingTransactionUpdate
	 *
	 *  @param  {Array} result
	 *
	 *  @return {undefined}
	 */
	_pendingTransactionUpdate(result) {
		this.subscribers.transaction.forEach((callback) => {
			callback(result);
		});
	}

	/**
	 *  @method _setPendingTransactionCallback
	 *
	 *  @return {Promise.<undefined>}
	 */
	async _setPendingTransactionCallback() {
		await this._wsApi.database
			.setPendingTransactionCallback(this._pendingTransactionUpdate.bind(this));
		this.subscriptions.transaction = true;
	}

	/**
	 *  @method setPendingTransactionSubscribe
	 *
	 *  @param  {Function} callback
	 *
	 *  @return {Promise.<undefined>}
	 */
	async setPendingTransactionSubscribe(callback) {
		if (!isFunction(callback)) {
			throw new Error('Callback is not a function');
		}

		this.subscribers.transaction.push(callback);

		if (!this.subscriptions.transaction) {
			await this._setPendingTransactionCallback();
		}
	}

	/**
	 *  @method removePendingTransactionSubscribe
	 *
	 *  @param  {Function} callback
	 *
	 *  @return {undefined}
	 */
	removePendingTransactionSubscribe(callback) {
		this.subscribers.transaction = this.subscribers.transaction.filter((c) => c !== callback);
	}

	/**
	 *  @method _blockApplyUpdate
	 *
	 *  @param  {Array} result
	 *
	 *  @return {undefined}
	 */
	_blockApplyUpdate(result) {
		this.subscribers.block.forEach((callback) => {
			callback(result);
		});
	}


	/**
	 *  @method _setBlockApplyCallback
	 *
	 *  @return {Promise.<undefined>}
	 */
	async _setBlockApplyCallback() {
		await this._wsApi.database.setBlockAppliedCallback(this._blockApplyUpdate.bind(this));
		this.subscriptions.block = true;
	}

	/**
	 *  @method setBlockApplySubscribe
	 *
	 *  @param  {Function} callback
	 *
	 *  @return {Promise.<undefined>}
	 */
	async setBlockApplySubscribe(callback) {
		if (!isFunction(callback)) {
			throw new Error('Callback is not a function');
		}

		this.subscribers.block.push(callback);

		if (!this.subscriptions.block) {
			await this._setBlockApplyCallback();
		}
	}

	/**
	 *  @method removeBlockApplySubscribe
	 *
	 *  @param  {Function} callback
	 *
	 *  @return {undefined}
	 */
	removeBlockApplySubscribe(callback) {
		this.subscribers.block = this.subscribers.block.filter((c) => c !== callback);
	}

	/**
	 *  @method _setAccountSubscribe
	 *
	 *  @return {Promise.<undefined>}
	 */
	async _setAccountSubscribe() {

		const array = this.subscribers.account.reduce((accum, { accounts }) => {
			accum.push(...accounts);
			return accum;
		}, []);

		const result = new Set(array);

		if (result.size === 0) {
			return;
		}

		await this._api.getFullAccounts(result.toArray());
	}

	/**
	 *  @method setAccountSubscribe
	 *
	 *  @param  {Function} callback
	 *  @param  {Array.<String>} accounts
	 *
	 *  @return {Promise.<undefined>}
	 */
	async setAccountSubscribe(callback, accounts) {
		if (!isFunction(callback)) {
			throw new Error('Callback is not a function');
		}

		if (!isArray(accounts)) throw new Error('Accounts should be an array');
		if (accounts.length < 1) throw new Error('Accounts length should be more then 0');
		if (!accounts.every((id) => isAccountId(id))) throw new Error('Accounts should contain valid account ids');

		await this._api.getFullAccounts(accounts);

		this.subscribers.account.push({ callback, accounts });
	}

	/**
	 *  @method removeAccountSubscribe
	 *
	 *  @param  {Function} callback
	 *
	 *  @return {undefined}
	 */
	removeAccountSubscribe(callback) {
		this.subscribers.account = this.subscribers.account
			.filter(({ callback: innerCallback }) => innerCallback !== callback);
	}

	/**
	 *
	 * @param {Map} obj
	 * @private
	 */
	_notifyAccountSubscribers(obj) {
		const { length } = this.subscribers.account;

		for (let i = 0; i < length; i += 1) {
			if (this.subscribers.account[i].accounts.includes(obj.get('id'))) {
				this.subscribers.account[i].callback(obj.toJS());
			}
		}
	}

	/**
	 *  @method setStatusSubscribe
	 *
	 *  @param  {String} status from enum ['connect', 'disconnect']
	 *  @param  {Function} callback
	 *
	 *  @return {undefined}
	 */
	setStatusSubscribe(status, callback) {
		if (!['connect', 'disconnect'].includes(status)) {
			throw new Error('Invalid status');
		}

		if (!isFunction(callback)) {
			throw new Error('Callback is not a function');
		}

		if (status === 'connect') {
			this.subscribers.connect.push(callback);
		} else {
			this.subscribers.disconnect.push(callback);
		}

	}

	/**
	 *  @method removeStatusSubscribe
	 *
	 *  @param  {String} status from enum ['connect', 'disconnect']
	 *  @param  {Function} callback
	 *
	 *  @return {undefined}
	 */
	removeStatusSubscribe(status, callback) {
		if (!['connect', 'disconnect'].includes(status)) {
			throw new Error('Invalid status');
		}

		if (!isFunction(callback)) {
			throw new Error('Callback is not a function');
		}

		if (status === 'connect') {
			if (this._engine.provider.connectionType === ConnectionType.WS) {
				this._engine.provider.removeListener(STATUS.OPEN, callback);
			}
			this.subscribers.connect = this.subscribers.connect.filter((c) => c !== callback);
		} else {
			if (this._engine.provider.connectionType === ConnectionType.WS) {
				this._engine.provider.removeListener(STATUS.CLOSE, callback);
			}
			this.subscribers.disconnect = this.subscribers.disconnect.filter((c) => c !== callback);
		}

	}

	/**
	 *  @method _subscribeContract
	 *
	 *  @param  {Array<String>} contractIds
	 *
	 *  @return {undefined}
	 */
	async _setContractSubscribe(contractIds) {
		await this._wsApi.database.subscribeContracts(contractIds);
	}

	/**
	 *  @method setContractSubscribe
	 *
	 *  @param  {Array<String>} contracts
	 *  @param  {Function} callback
	 *
	 *  @return {undefined}
	 */
	async setContractSubscribe(contracts, callback) {
		if (!isFunction(callback)) {
			throw new Error('Callback is not a function');
		}

		if (!isArray(contracts)) throw new Error('Contracts should be an array');
		if (contracts.length < 1) throw new Error('Contracts length should be more then 0');
		if (!contracts.every((id) => isContractId(id))) throw new Error('Contracts should contain valid contract ids');

		await this._setContractSubscribe(contracts);

		this.subscribers.contract.push({ callback, contracts });
	}

	/**
	 *  @method removeContractSubscribe
	 *
	 *  @param  {Function} callback
	 *
	 *  @return {undefined}
	 */
	removeContractSubscribe(callback) {
		this.subscribers.contract = this.subscribers.contract
			.filter(({ callback: innerCallback }) => innerCallback !== callback);
	}

	/**
	 *
	 * @param {Map} obj
	 * @private
	 */
	_notifyContractSubscribers(obj) {
		this.subscribers.contract.forEach(({ contracts, callback }) => {
			if (contracts.includes(obj.get('contract'))) {
				callback(obj.toJS());
			}
		});
	}

	/**
	 * @method setContractLogsSubscribe
	 * @param {(result: Log[]) => any} callback
	 * @param {import('./api').ContractLogsFilterOptions_t} [options]
	 * @return {Promise<number|string>}
	 */
	async setContractLogsSubscribe(callback, options = {}) {
		return this._wsApi.database.subscribeContractLogs(callback, toRawContractLogsFilterOptions(options));
	}

	/**
	 *  @method _subscribeCache
	 *
	 *  @return {undefined}
	 */
	async _subscribeCache() {
		const [...objectIds] = this.cache.objectsById.keys();
		const [...fullAccountIds] = this.cache.fullAccounts.keys();
		const [...fullContractIds] = this.cache.fullContractsByContractId.keys();


		const objectByIdsPromise = this._api.getObjects(objectIds, true);
		const fullAccountsPromise = this._api.getFullAccounts(fullAccountIds, true, true);
		const fullContractPromises = fullContractIds.map((id) => this._api.getFullContract(id, true));

		try {
			await Promise.all([
				objectByIdsPromise,
				fullAccountsPromise,
				...fullContractPromises,
			]);
		} catch (_) {
			console.error('[Subscriber] >---- error ----> Couldn\'t resubscribe cache');
		}
	}

}

export default Subscriber;
