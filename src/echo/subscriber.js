import EventEmitter from 'events';
import { Map } from 'immutable';

import {
	isObjectId,
	isLimitOrderId,
	isCallOrderId,
	// isAssetDynamicDataId,
	// isBitassetDataId,
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
} from '../utils/validator';

import { CANCEL_LIMIT_ORDER, CLOSE_CALL_ORDER } from '../constants';

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
			echorand: [],
			block: [],
			connect: [],
			disconnect: [],
		};

		this._init();
	}

	_init() {
		this._wsApi.database.setSubscribeCallback(this._onRespond.bind(this), true);
	}

	// [ [ { id: '2.9.149095',
	//   account: '1.2.401',
	//   operation_id: '1.11.144030',
	//   sequence: 1,
	//   next: '2.9.0' },
	// { id: '2.7.6372',
	//   trx: [Object],
	//   trx_id: '1376b9009ddd9746a0c28f8f5a1bb7687cbb0eeb' },
	// { id: '1.2.401',
	//   membership_expiration_date: '1970-01-01T00:00:00',
	//   registrar: '1.2.17',
	//   referrer: '1.2.17',
	//   lifetime_referrer: '1.2.17',
	//   network_fee_percentage: 2000,
	//   lifetime_referrer_fee_percentage: 3000,
	//   referrer_rewards_percentage: 0,
	//   name: 'test-n4',
	//   owner: [Object],
	//   active: [Object],
	//   options: [Object],
	//   statistics: '2.6.401',
	//   whitelisting_accounts: [],
	//   blacklisting_accounts: [],
	//   whitelisted_accounts: [],
	//   blacklisted_accounts: [],
	//   owner_special_authority: [Array],
	//   active_special_authority: [Array],
	//   top_n_control_flags: 0 },
	// { id: '1.18.727216', results_id: [] },
	// { id: '2.6.401',
	//   owner: '1.2.401',
	//   most_recent_op: '2.9.149095',
	//   total_ops: 1,
	//   removed_ops: 0,
	//   total_core_in_orders: 0,
	//   lifetime_fees_paid: 0,
	//   pending_fees: 0,
	//   pending_vested_fees: 0 },
	// { id: '1.11.144030',
	//   op: [Array],
	//   result: [Array],
	//   block_num: 727217,
	//   trx_in_block: 0,
	//   op_in_trx: 0,
	//   virtual_op: 7888 },
	// { id: '2.9.149094',
	//   account: '1.2.17',
	//   operation_id: '1.11.144030',
	//   sequence: 771,
	//   next: '2.9.149084' } ] ]

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

		// check interested by id type
		// 	-	transaction
		if (isTransactionId(object.id)) {
			return null;
		}

		// 	-	accountTransactionHistory - object.account (subs on account)
		if (isAccountTransactionHistoryId(object.id) && !subscribedAccounts.includes(object.account)) {
			return null;
		}

		// 	-	limitOrder - object.seller (subs on account)
		if (isLimitOrderId(object.id) && !subscribedAccounts.includes(object.seller)) {
			return null;
		}

		// 	-	callOrder - object.borrower (subs on account)
		if (isCallOrderId(object.id) && !subscribedAccounts.includes(object.borrower)) {
			return null;
		}

		// -		accountBalance - object.owner (subs on account)
		if (isAccountBalanceId(object.id) && !subscribedAccounts.includes(object.owner)) {
			return null;
		}

		// -		operationHistory
		if (isOperationHistoryId(object.id)) {
			return null;
		}

		// -		blockSummary
		if (isBlockSummaryId(object.id)) {
			return null;
		}

		// -		accountStatistics - object.owner (subs on account)
		if (isAccountStatisticsId(object.id) && !subscribedAccounts.includes(object.owner)) {
			return null;
		}

		// -		witness - object.id (subs on witnesses)
		if (isWitnessId(object.id) && !subscribedWitnesses.includes(object.id)) {
			return null;
		}

		// 		committee - !previously! object.id (subs on committee)
		if (isCommitteeMemberId(object.id)) {
			return null;
		}

		// 		'0.0.' or '5.1.'
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

		// TODO update dependencies by id type
		//		balancePrefix
		//		accountStatsPrefix
		// 		witnessPrefix
		//		committeePrefix
		//		accountPrefix
		//		assetPrefix
		//		assetDynamicDataPrefix
		// 		workerPrefix
		// 		bitassetDataPrefix
		// 		callOrderPrefix
		// 		orderPrefix
		// 		proposalPrefix

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
					// ChainStore.fetchRecentHistory(object.owner);
				}
			} catch (err) {
				//
			}
		}

		if (isWitnessId(object.id)) {
			this.cache.setInMap('witnessByAccountId', object.witness_account, object.id);
			this.cache.setInMap('objectsByVoteId', object.vote_id, object.id);
		}

		if (isAccountId(object.id)) {
			//
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
	 *  @return {Void}
	 */
	setOptions(options) {
		this.options = options;
	}

	/**
	 *  @method reset
	 *
	 *  @return {Void}
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
	 *  @return {Void}
	 */
	_echorandUpdate(result) {
		this.subscribers.echorand.forEach((callback) => {
			callback(result);
		});
	}

	/**
	 *  @method setEchorandSubscribe
	 *
	 *  @param  {Function} callback
	 *
	 *  @return {Promise.<Number>}
	 */
	async setEchorandSubscribe(callback) {
		const index = this.subscribers.echorand.push(callback) - 1;

		if (!this.subscriptions.echorand) {
			await this._wsApi.networkNode.setConsensusMessageCallback(this._echorandUpdate.bind(this));
			this.subscriptions.echorand = true;
		}

		return index;
	}

	/**
	 *  @method removeEchorandSubscribe
	 *
	 *  @param  {Number} index
	 *
	 *  @return {Void}
	 */
	removeEchorandSubscribe(index) {
		this.subscribers.echorand = this.subscribers.echorand.filter((c, i) => i !== index);
	}

	onBlockApply() {}

	onConnect() {}

	onDisconnect() {}

}

export default Subscriber;
