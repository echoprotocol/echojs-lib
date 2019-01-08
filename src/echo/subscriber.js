import EventEmitter from 'events';
import { Map, Set, fromJS } from 'immutable';

import {
	isFunction,
	isObjectId,
	isLimitOrderId,
	isCallOrderId,
	isAccountBalanceId,
	isAccountStatisticsId,
	isTransactionId,
	isBlockSummaryId,
	isAccountTransactionHistoryId,
	isOperationHistoryId,
	isWitnessId,
	isCommitteeMemberId,
	isDynamicGlobalObjectId,
	isAccountId,
	isAssetId,
	isDynamicAssetDataId,
	isWorkerId,
	isBitAssetId,
	isProposalId,
} from '../utils/validator';

import {
	CANCEL_LIMIT_ORDER,
	UPDATE_CALL_ORDER,
	CLOSE_CALL_ORDER,
	BITASSET_UPDATE,
} from '../constants';

class Subscriber extends EventEmitter {

	/**
	 *  @constructor
	 *
	 *  @param {Cache} cache
	 *  @param {WSAPI} wsApi
	 */
	constructor(cache, wsApi) {
		super();

		this.cache = cache;
		this._wsApi = wsApi;

		this.subscriptions = {
			all: false,
			account: false,
			echorand: false,
			block: false,
			connect: false,
			disconnect: false,
		};

		this.subscribers = {
			all: [], // "all" means all updates from setSubscribeCallback
			account: [], // { ids: [], callback: () => {} }
			witness: [], // { ids: [], callback: () => {} }
			committeeMember: [], // { ids: [], callback: () => {} }
			echorand: [],
			block: [],
			connect: [],
			disconnect: [],
		};

	}

	/**
	 *  @method init
	 *
	 *  @return {Promise.<undefined>}
	 */
	async init() {
		await this._wsApi.database.setSubscribeCallback(this._onRespond.bind(this), true);

		if (this.subscriptions.echorand) {
			await this._setConsensusMessageCallback();
		}
	}

	_updateObject(object) {
		console.log('object', object);

		// check is id param exists -> if no - check settle order params
		if (!object.id) {
			if (object.balance && object.owner && object.settlement_date) {
				this.emit('settle-order-update', object);
			}
			return null;
		}

		const subscribedAccounts = this.subscribers.account.reduce(
			(arr, { ids }) => arr.concat(ids),
			[],
		);
		const subscribedWitnesses = this.subscribers.witness.reduce(
			(arr, { ids }) => arr.concat(ids),
			[],
		);
		const subscribedCommitteeMembers = this.subscribers.committeeMember.reduce(
			(arr, { ids }) => arr.concat(ids),
			[],
		);

		// check interested by id type
		if (isTransactionId(object.id)) {
			return null;
		}

		if (isAccountTransactionHistoryId(object.id) && !subscribedAccounts.includes(object.account)) {
			return null;
		}

		if (isLimitOrderId(object.id) && !subscribedAccounts.includes(object.seller)) {
			return null;
		}

		if (isCallOrderId(object.id) && !subscribedAccounts.includes(object.borrower)) {
			return null;
		}

		if (isAccountBalanceId(object.id) && !subscribedAccounts.includes(object.owner)) {
			return null;
		}

		if (isOperationHistoryId(object.id)) {
			return null;
		}

		if (isBlockSummaryId(object.id)) {
			return null;
		}

		if (isAccountStatisticsId(object.id) && !subscribedAccounts.includes(object.owner)) {
			return null;
		}

		if (isWitnessId(object.id) && !subscribedWitnesses.includes(object.id)) {
			return null;
		}

		if (isCommitteeMemberId(object.id) && !subscribedCommitteeMembers.includes(object.id)) {
			return null;
		}

		if (/^0\.0\.[1-9]\d*$/.test(object.id) || /^5\.1\.[1-9]\d*$/.test(object.id)) {
			return null;
		}

		// check if dynamic global object
		if (isDynamicGlobalObjectId(object.id)) {
			this.cache.set('dynamicGlobalProperties', new Map(object));
		}

		// get object from cache by id -> update or create
		let obj = this.cache.objectsById.get(object.id);
		const previous = obj || new Map();
		obj = obj ? obj.mergeDeep(new Map(object)) : new Map(object);
		this.cache.setInMap('objectsById', object.id, obj);

		// update dependencies by id type
		if (isAccountBalanceId(object.id)) {
			let owner = this.cache.objectsById.get(object.owner);
			if (!owner) {
				return null;
			}

			const balances = owner.get('balances');
			if (!balances) {
				owner = owner.set('balances', new Map());
			}
			owner = owner.setIn(['balances', object.asset_type], object.id);
			this.cache.setInMap('objectsById', object.owner, owner);
		}

		if (isAccountStatisticsId(object.id)) {
			// TODO not update if account not exists in cache
			try {
				const previousMostRecentOp = previous.get('most_recent_op', '2.9.0');

				if (previousMostRecentOp !== object.most_recent_op) {
					// fetchFullAccounts([object.owner], true, true);
				}
			} catch (err) {
				//
			}
		}

		if (isWitnessId(object.id)) {
			this.cache.setInMap('witnessByAccountId', object.witness_account, object.id);
			this.cache.setInMap('objectsByVoteId', object.vote_id, object.id);
		}

		if (isCommitteeMemberId(object.id)) {
			this.cache.setInMap('committeeMembersByAccount', object.committee_member_account, object.id);
			this.cache.setInMap('objectsByVoteId', object.vote_id, object.id);
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
				this.cache.setInMap('objectsById', object.id, obj);
			}

			if (this.cache.accountsByName.get(object.name)) {
				this.cache.setInMap('accountsByName', object.name, object.id);
			}
		}

		if (isAssetId(object.id)) {
			this.cache.setInMap('assetBySymbol', object.symbol, object.id);

			const dynamic = obj.get('dynamic');
			if (!dynamic) {
				let dad = this.cache.objectsById.get(object.dynamic_asset_data_id);

				if (!dad) {
					dad = new Map();
				}

				if (!dad.get('asset_id')) {
					dad = dad.set('asset_id', object.id);
				}

				this.cache.setInMap('objectsById', object.dynamic_asset_data_id, dad);

				obj = obj.set('dynamic', dad);
				this.cache.setInMap('objectsById', object.id, obj);
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
				this.cache.setInMap('objectsById', object.bitasset_data_id, bad);

				obj = obj.set('bitasset', bad);
				this.cache.setInMap('objectsById', object.id, obj);
			}
		}

		if (isDynamicAssetDataId(object.id)) {
			const assetId = obj.get('asset_id');
			if (assetId) {
				let asset = this.cache.objectsById.get(assetId);
				if (asset && asset.set) {
					asset = asset.set('dynamic', obj);
					this.cache.setInMap('objectsById', assetId, asset);
				}
			}
		}

		if (isWorkerId(object.id)) {
			this.cache.setInMap('objectsByVoteId', object.vote_for, object.id);
			this.cache.setInMap('objectsByVoteId', object.vote_against, object.id);
		}

		if (isBitAssetId(object.id)) {
			const assetId = obj.get('asset_id');

			if (assetId) {
				let asset = this.cache.objectsById.get(assetId);
				if (asset) {
					asset = asset.set('bitasset', obj);
					this.emit(BITASSET_UPDATE, asset);
					this.cache.setInMap('objectsById', assetId, asset);
				}
			}
		}

		if (isCallOrderId(object.id)) {
			this.emit(UPDATE_CALL_ORDER, object);

			let account = this.cache.objectsById.get(object.borrower);

			if (account) {
				if (!account.has('call_orders')) {
					account = account.set('call_orders', new Set());
				}
				const callOrders = account.get('call_orders');
				if (!callOrders.has(object.id)) {
					account = account.set('call_orders', callOrders.add(object.id));
					this.cache.setInMap('objectsById', account.get('id'), account);
					// Force subscription to the object in the witness node by calling get_objects
					// Apis.instance().dbApi().exec('get_objects', [[object.id]]);
				}
			}
		}

		if (isLimitOrderId(object.id)) {
			let account = this.cache.objectsById.get(object.seller);

			if (account) {

				if (!account.has('orders')) {
					account = account.set('orders', new Set());
				}
				const limitOrders = account.get('orders');

				if (!limitOrders.has(object.id)) {
					account = account.set('orders', limitOrders.add(object.id));
					this.cache.setInMap('objectsById', account.get('id'), account);

					// Force subscription to the object in the witness node by calling get_objects
					// Apis.instance().dbApi().exec('get_objects', [[object.id]]);
				}
			}
		}

		if (isProposalId(object.id)) {
			object.required_active_approvals.concat(object.required_owner_approvals).forEach((id) => {
				let impactedAccount = this.cache.objectsById.get(id);
				if (impactedAccount) {
					let proposals = impactedAccount.get('proposals', new Set());

					if (!proposals.includes(object.id)) {
						proposals = proposals.add(object.id);
						impactedAccount = impactedAccount.set('proposals', proposals);
						this._updateObject(impactedAccount.toJS());
					}
				}
			});
		}

		return null;
	}

	_updateOrder(id) {
		let type = null;
		const obj = this.cache.objectsById.get(id);

		if (!obj) {
			return type;
		}

		if (isLimitOrderId(id)) {
			// get account from objects by seller param
			let account = this.cache.objectsById.get(obj.get('seller'));
			// if account get orders, delete this order
			if (account && account.has('orders') && account.get('orders').has(obj)) {
				const limitOrders = account.get('orders');
				account = account.set('orders', limitOrders.delete(obj));
				this.cache.setInMap('objectsById', account.get('id'), account);
			}

			type = CANCEL_LIMIT_ORDER;
		}

		if (isCallOrderId(id)) {
			// get account from objects by borrower param
			let account = this.cache.objectsById.get(obj.get('borrower'));
			// if account get call_orders, delete this order
			if (account && account.has('call_orders') && account.get('call_orders').has(obj)) {
				const callOrders = account.get('call_orders');
				account = account.set('call_orders', callOrders.delete(obj));
				this.cache.setInMap('objectsById', account.get('id'), account);
			}

			type = CLOSE_CALL_ORDER;
		}

		// delete from objects
		this.cache.setInMap('objectsById', id, null);

		// return type
		return type;
	}

	_onRespond([messages]) {
		console.log('messages', messages);

		const orders = [];
		const response = [];

		messages.forEach((msg) => {
			// check is object id
			if (isObjectId(msg)) {
				// _updateOrder -> return order type - push to orders = { type, order }
				const type = this._updateOrder(msg);

				if (type) {
					orders.push({ type, id: msg });
				}

			} else {
				// TODO _updateObject -> push to response
				this._updateObject(msg);
			}
		});

		// emit orders
		this.emit(CANCEL_LIMIT_ORDER, orders.filter(({ type }) => type === CANCEL_LIMIT_ORDER));
		this.emit(CLOSE_CALL_ORDER, orders.filter(({ type }) => type === CLOSE_CALL_ORDER));

		// inform external subscribers
		this.subscribers.all.forEach((callback) => {
			callback(response);
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

	/**
	 *  @method reset
	 *
	 *  @return {undefined}
	 */
	reset() {
		this.subscriptions = {
			all: false,
			account: false,
			echorand: false,
			block: false,
			connect: false,
			disconnect: false,
		};

		this.subscribers = {
			all: [],
			account: [],
			echorand: [],
			block: [],
			connect: [],
			disconnect: [],
		};
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
	*  @method _setConsensusMessageCallback
	*
	*  @return {Promise.<undefined>}
	*/
	async _setConsensusMessageCallback() {
		await this._wsApi.networkNode.setConsensusMessageCallback(this._echorandUpdate.bind(this));
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
			await this._setConsensusMessageCallback();
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

	onBlockApply() {}

	onConnect() {}

	onDisconnect() {}

}

export default Subscriber;
