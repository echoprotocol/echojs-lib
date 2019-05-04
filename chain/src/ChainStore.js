/* eslint-disable consistent-return */
const Immutable = require('immutable');
const { Apis } = require('echojs-ws');
const BigInteger = require('bigi');

const ChainTypes = require('./ChainTypes');
const ChainValidation = require('./ChainValidation');
const ee = require('./EmitterInstance');

const { object_type: objectType, impl_object_type: implObjectType } = ChainTypes;
const emitter = ee();

const orderPrefix = `1.${parseInt(objectType.limit_order, 10)}.`;
const callOrderPrefix = `1.${parseInt(objectType.call_order, 10)}.`;
const proposalPrefix = `1.${parseInt(objectType.proposal, 10)}.`;
const operationHistoryPrefix = `1.${parseInt(objectType.operation_history, 10)}.`;
const committeePrefix = `1.${parseInt(objectType.committee_member, 10)}.`;
const accountPrefix = `1.${parseInt(objectType.account, 10)}.`;
const assetPrefix = `1.${parseInt(objectType.asset, 10)}.`;
// let vestingBalancePrefix = '1.' + vesting_balance_type + '.';
// const contractPrefix = `1.${parseInt(objectType.contract, 10)}.`;

const balancePrefix = `2.${parseInt(implObjectType.account_balance, 10)}.`;
const accountStatsPrefix = `2.${parseInt(implObjectType.account_statistics, 10)}.`;
const transactionPrefix = `2.${parseInt(implObjectType.transaction, 10)}.`;
const accountTxHistoryPrefix = `2.${parseInt(implObjectType.account_transaction_history, 10)}.`;
const assetDynamicDataPrefix = `2.${parseInt(implObjectType.asset_dynamic_data, 10)}.`;
const bitassetDataPrefix = `2.${parseInt(implObjectType.asset_bitasset_data, 10)}.`;
const blockSummaryPrefix = `2.${parseInt(implObjectType.block_summary, 10)}.`;


const { DEBUG } = process.env;

function timeStringToDate(timeString) {
	if (!timeString) {
		return new Date('1970-01-01T00:00:00.000Z');
	}

	if (!/Z$/.test(timeString)) {
		//	does not end in Z
		//	https://github.com/cryptonomex/graphene/issues/368
		timeString += 'Z';
	}

	return new Date(timeString);
}

/**
 *  @brief maintains a local cache of blockchain state
 *  The ChainStore maintains a local cache of blockchain state and exposes
 *  an API that makes it easy to query objects and receive updates when
 *  objects are available.
 */
const ChainStore = {

	start() {
		/** tracks everyone who wants to receive updates when the cache changes */
		ChainStore.subscribers = new Set();
		ChainStore.subscribed = false;
		ChainStore.clearCache();
		// ChainStore.progress = 0;
		// ChainStore.chain_time_offset is used to estimate the blockchain time
		ChainStore.chain_time_offset = [];
		ChainStore.dispatchFrequency = 40;
	},

	/**
	 *  Clears all cached state. This should be called any time the network connection is reset.
	 */
	clearCache() {
		ChainStore.subbed_accounts = new Set();
		ChainStore.subbed_committee = new Set();

		ChainStore.objects_by_id = new Map();
		ChainStore.accounts_by_name = new Map();
		ChainStore.assets_by_symbol = new Map();
		ChainStore.account_ids_by_key = Immutable.Map();
		ChainStore.account_ids_by_account = Immutable.Map();

		ChainStore.balance_objects_by_address = new Map();
		ChainStore.get_account_refs_of_keys_calls = new Set();
		ChainStore.get_account_refs_of_accounts_calls = new Set();
		ChainStore.account_history_requests = new Map(); //	/< tracks pending history requests
		ChainStore.committee_by_account_id = new Map();
		ChainStore.objects_by_vote_id = new Map();
		ChainStore.fetching_get_full_accounts = new Map();
		ChainStore.get_full_accounts_subscriptions = new Map();
		ChainStore.block_requests = new Map();
		clearTimeout(ChainStore.timeout);
		ChainStore.dispatched = false;
	},

	resetCache() {
		ChainStore.subscribed = false;
		ChainStore.subError = null;
		ChainStore.clearCache();
		ChainStore.head_block_time_string = null;
		// return ChainStore.init();
		// .catch((err) => {
		// 	console.log('resetCache init error:', err);
		// });
	},

	setDispatchFrequency(freq) {
		ChainStore.dispatchFrequency = freq;
	},

	init() {
		let reconnectCounter = 0;
		const _init = (resolve, reject) => {
			if (ChainStore.subscribed) {
				return resolve();
			}
			const dbApi = Apis.instance().dbApi();
			if (!dbApi) {
				return reject(new Error('Api not found, please initialize the api instance before calling the ChainStore'));
			}
			return dbApi.exec('get_objects', [['2.1.0']]).then((optionalObjects) => {
				if (DEBUG) {
					// console.log('... optionalObjects', optionalObjects ? optionalObjects[0].id : null);
				}

				for (let i = 0; i < optionalObjects.length; i += 1) {
					const optionalObject = optionalObjects[i];
					if (optionalObject) {

						/**
						 *  Because 2.1.0 gets fetched here before the set_subscribe_callback,
						 *  the new subscription model makes it so we
						 *  never get subscribed to that object, therefore
						 *  ChainStore._updateObject is commented out here
						 */
						// ChainStore._updateObject( optionalObject, true );

						const headTime = new Date(`${optionalObject.time}+00:00`).getTime();
						ChainStore.head_block_time_string = optionalObject.time;
						const now = new Date().getTime();
						ChainStore.chain_time_offset
							.push(now - timeStringToDate(optionalObject.time).getTime());
						const delta = (now - headTime) / 1000;
						// let start = Date.parse('Sep 1, 2015');
						// let progress_delta = headTime - start;
						// ChainStore.progress = progress_delta / (now-start);

						if (delta < 60) {
							Apis.instance().dbApi().exec('set_subscribe_callback', [ChainStore.onUpdate.bind(this), true])
								.then(() => {
									if (DEBUG) {
										// console.log('synced and subscribed, chainstore ready');
									}
									ChainStore.subscribed = true;
									ChainStore.subError = null;
									ChainStore.notifySubscribers();
									resolve();
								})
								.catch((err) => {
									ChainStore.subscribed = false;
									ChainStore.subError = err;
									ChainStore.notifySubscribers();
									reject(err);
									// console.log('Error: ', err);
								});
						} else {
							// console.log('not yet synced, retrying in 1s');
							ChainStore.subscribed = false;
							reconnectCounter += 1;
							ChainStore.notifySubscribers();
							if (reconnectCounter > 5) {
								ChainStore.subError = new Error('ChainStore sync error, please check your system clock');
								return reject(ChainStore.subError);
							}

							setTimeout(_init.bind(this, resolve, reject), 1000);
						}
					} else {
						setTimeout(_init.bind(this, resolve, reject), 1000);
					}
				}

				return resolve();
			}).catch((err) => { // in the event of an error clear the pending state for id
				// console.log('!!! Chain API error', err);
				ChainStore.objects_by_id.delete('2.1.0');
				reject(err);
			});
		};

		return new Promise((resolve, reject) => _init(resolve, reject));
	},

	_subTo(type, id) {
		const key = `subbed_${type}`;
		if (!ChainStore[key].has(id)) {
			ChainStore[key].add(id);
		}
	},

	unSubFrom(type, id) {
		const key = `subbed_${type}`;
		ChainStore[key].delete(id);
		ChainStore.objects_by_id.delete(id);
	},

	_isSubbedTo(type, id) {
		const key = `subbed_${type}`;
		return ChainStore[key].has(id);
	},

	onUpdate(updatedObjects) { // map = require(account id to objects
		const cancelledOrders = [];
		const closedCallOrders = [];

		for (let a = 0; a < updatedObjects.length; a += 1) {
			for (let i = 0; i < updatedObjects[a].length; i += 1) {
				const obj = updatedObjects[a][i];
				if (ChainValidation.is_object_id(obj)) {
					// An entry containing only an object ID means that object was removed
					// console.log('removed obj', obj);
					// Check if the object exists in the ChainStore
					const oldObj = ChainStore.objects_by_id.get(obj);


					if (obj.search(orderPrefix) === 0) {
						// Limit orders

						cancelledOrders.push(obj);
						if (oldObj) {
							let account = ChainStore.objects_by_id.get(oldObj.get('seller'));
							if (account && account.has('orders')) {
								const limitOrders = account.get('orders');
								if (account.get('orders').has(obj)) {
									account = account.set('orders', limitOrders.delete(obj));
									ChainStore.objects_by_id.set(account.get('id'), account);
								}
							}
						}
					}

					if (obj.search(callOrderPrefix) === 0) {
						// Call orders
						closedCallOrders.push(obj);
						if (oldObj) {
							let account = ChainStore.objects_by_id.get(oldObj.get('borrower'));
							if (account && account.has('call_orders')) {
								const callOrders = account.get('call_orders');
								if (account.get('call_orders').has(obj)) {
									account = account.set('call_orders', callOrders.delete(obj));
									ChainStore.objects_by_id.set(account.get('id'), account);
								}
							}
						}
					}

					// Remove the object (if it already exists), set to null to indicate it does not exist
					if (oldObj) {
						ChainStore.objects_by_id.set(obj, null);
					}
				} else {
					ChainStore._updateObject(obj);
				}
			}
		}

		// Cancelled limit order(s), emit event for any listeners to update their state
		if (cancelledOrders.length) {
			emitter.emit('cancel-order', cancelledOrders);
		}
		// Closed call order, emit event for any listeners to update their state
		if (closedCallOrders.length) {
			emitter.emit('close-call', closedCallOrders);
		}

		// let count = updatedObjects[0].reduce((final, o) => {
		// 	if (o && o.id) {
		// 		final.changed.push(o.id);
		// 	} else {
		// 		final.removed.push(o);
		// 	}
		// 	return final;
		// }, {changed: [], removed: []});
		// console.log('objects in store count:', ChainStore.objects_by_id.size, count);
		ChainStore.notifySubscribers();
	},

	notifySubscribers() {
		// Dispatch at most only once every x milliseconds
		if (!ChainStore.dispatched) {
			ChainStore.dispatched = true;
			ChainStore.timeout = setTimeout(() => {
				ChainStore.dispatched = false;
				ChainStore.subscribers.forEach((callback) => {
					callback();
				});
			}, ChainStore.dispatchFrequency);
		}
	},

	/**
	 *  Add a callback that will be called anytime any object in the cache is updated
	 */
	subscribe(callback) {
		if (ChainStore.subscribers.has(callback)) {
			throw new Error('Subscribe callback already exists', callback);
			// return console.error('Subscribe callback already exists', callback);
		}

		return ChainStore.subscribers.add(callback);
	},

	/**
	 *  Remove a callback that was previously added via subscribe
	 */
	unsubscribe(callback) {
		if (!ChainStore.subscribers.has(callback)) {
			throw new Error('Unsubscribe callback does not exists', callback);
			// return console.error('Unsubscribe callback does not exists', callback);
		}

		return ChainStore.subscribers.delete(callback);
	},

	/**
	 *  Clear an object = require(the cache to force it to be fetched again. This may
	 *  be useful if a query failed the first time and the wallet has reason to believe
	 *  it may succeede the second time.
	 */
	clearObjectCache(id) {
		ChainStore.objects_by_id.delete(id);
	},

	/**
	 *  There are three states an object id could be in:
	 *
	 *  1. undefined	   - returned if a query is pending
	 *  3. defined		 - return an object
	 *  4. null			- query return null
	 *
	 */
	getObject(id, force = false, autosubscribe = true) {
		if (!ChainValidation.is_object_id(id)) {
			throw new Error(`argument is not an object id: ${JSON.stringify(id)}`);
		}

		const result = ChainStore.objects_by_id.get(id);
		const fullAccountSub = ChainStore.get_full_accounts_subscriptions.get(id, false);
		const isAccount = id.substring(0, accountPrefix.length) === accountPrefix;
		const subChange = isAccount && !fullAccountSub && autosubscribe;

		if (result === undefined || force || subChange) {
			return ChainStore.fetchObject(id, force, autosubscribe);
		}

		if (result === true) {
			return undefined;
		}

		return result;
	},

	/**
	 *  @return undefined if a query is pending
	 *  @return null if idOrSymbol has been queired and does not exist
	 *  @return object if the idOrSymbol exists
	 */
	getAsset(idOrSymbol) {
		if (!idOrSymbol) {
			return null;
		}

		if (ChainValidation.is_object_id(idOrSymbol)) {
			const asset = ChainStore.getObject(idOrSymbol);

			if (asset && (asset.get('bitasset') && !asset.getIn(['bitasset', 'current_feed']))) {
				return undefined;
			}
			return asset;
		}

		// TODO: verify idOrSymbol is a valid symbol name

		const assetId = ChainStore.assets_by_symbol.get(idOrSymbol);

		if (ChainValidation.is_object_id(assetId)) {
			const asset = ChainStore.getObject(assetId);

			if (asset && (asset.get('bitasset') && !asset.getIn(['bitasset', 'current_feed']))) {
				return undefined;
			}
			return asset;
		}

		if (assetId === null) {
			return null;
		}

		if (assetId === true) {
			return undefined;
		}

		Apis.instance().dbApi().exec('lookup_asset_symbols', [[idOrSymbol]])
			.then((assetObjects) => {
				// console.log( 'lookup symbol ', idOrSymbol )
				if (assetObjects.length && assetObjects[0]) {
					ChainStore._updateObject(assetObjects[0], true);
				} else {
					ChainStore.assets_by_symbol.set(idOrSymbol, null);
					ChainStore.notifySubscribers();
				}
			})
			.catch(() => {
				// console.log('Error: ', err);
				ChainStore.assets_by_symbol.delete(idOrSymbol);
			});

		return undefined;
	},

	/**
	 *  @param the public key to find accounts that reference it
	 *  @return Set of account ids that reference the given key
	 *  @return a empty Set if no items are found
	 *  @return undefined if the result is unknown
	 *
	 *  If this method returns undefined, then it will send a request to
	 *  the server for the current set of accounts after which the
	 *  server will notify us of any accounts that reference these keys
	 */
	getAccountRefsOfKey(key) {
		if (ChainStore.get_account_refs_of_keys_calls.has(key)) {
			return ChainStore.account_ids_by_key.get(key);
		}

		ChainStore.get_account_refs_of_keys_calls.add(key);

		Apis.instance().dbApi().exec('get_key_references', [[key]])
			.then(([vecAccountId]) => {
				let refs = Immutable.Set();
				refs = refs.withMutations((r) => {
					for (let i = 0; i < vecAccountId.length; i += 1) {
						r.add(vecAccountId[i]);
					}
				});
				ChainStore.account_ids_by_key = ChainStore.account_ids_by_key.set(key, refs);
				ChainStore.notifySubscribers();
			})
			.catch(() => {
				// console.error('get_key_references', err);
				ChainStore.account_ids_by_key = ChainStore.account_ids_by_key.delete(key);
				ChainStore.get_account_refs_of_keys_calls.delete(key);
			});

		return undefined;
	},

	/**
	 *  @param the account id to find accounts that reference it
	 *  @return Set of account ids that reference the given key
	 *  @return a empty Set if no items are found
	 *  @return undefined if the result is unknown
	 *  If this method returns undefined, then it will send a request to
	 *  the server for the current set of accounts after which the
	 *  server will notify us of any accounts that reference these keys
	 */
	getAccountRefsOfAccount(accountId) {
		if (ChainStore.get_account_refs_of_accounts_calls.has(accountId)) {
			return ChainStore.account_ids_by_account.get(accountId);
		}

		ChainStore.get_account_refs_of_accounts_calls.add(accountId);

		Apis.instance().dbApi().exec('get_account_references', [accountId])
			.then((vecAccountId) => {
				let refs = Immutable.Set();
				refs = refs.withMutations((r) => {
					for (let i = 0; i < vecAccountId.length; i += 1) {
						r.add(vecAccountId[i]);
					}
				});
				ChainStore.account_ids_by_account = ChainStore.account_ids_by_account.set(accountId, refs);
				ChainStore.notifySubscribers();
			})
			.catch(() => {
				// console.error('get_account_references', err);
				ChainStore.account_ids_by_account = ChainStore.account_ids_by_account.delete(accountId);
				ChainStore.get_account_refs_of_accounts_calls.delete(accountId);
			});
		return undefined;
	},

	/**
	 *  @return a Set of balance ids that are claimable with the given address
	 *  @return undefined if a query is pending and the set is not known at this time
	 *  @return a empty Set if no items are found
	 *
	 *  If this method returns undefined, then it will send a request to the server for
	 *  the current state after which it will be subscribed to changes to this set.
	 */
	getBalanceObjects(address) {
		const current = ChainStore.balance_objects_by_address.get(address);
		if (current === undefined) {
			/**
			 *  because balance objects are simply part of the genesis state,
			 *  there is no need to worry about having to update them /
			 *  merge them or index them in updateObject.
			 */
			ChainStore.balance_objects_by_address.set(address, Immutable.Set());
			Apis.instance().dbApi().exec('get_balance_objects', [[address]])
				.then(
					(balanceObjects) => {
						const set = new Set();
						for (let i = 0; i < balanceObjects.length; i += 1) {
							ChainStore._updateObject(balanceObjects[i]);
							set.add(balanceObjects[i].id);
						}
						ChainStore.balance_objects_by_address.set(address, Immutable.Set(set));
						ChainStore.notifySubscribers();
					},
					() => {
						ChainStore.balance_objects_by_address.delete(address);
					},
				);
		}
		return ChainStore.balance_objects_by_address.get(address);
	},


	/**
	 *  If there is not already a pending request to fetch this object, a new
	 *  request will be made.
	 *
	 *  @return null if the object does not exist,
	 *  @return undefined if the object might exist but is not in cache
	 *  @return the object if it does exist and is in our cache
	 */
	fetchObject(id, force = false, autosubscribe = true) {
		if (typeof id !== 'string') {
			const result = [];
			for (let i = 0; i < id.length; i += 1) {
				result.push(ChainStore.fetchObject(id[i], force, autosubscribe));
			}
			return result;
		}

		if (!ChainStore.subscribed && !force) {
			return undefined;
		}

		if (DEBUG) {
			// console.log('maybe fetch object: ', id);
		}

		if (!ChainValidation.is_object_id(id)) {
			throw new Error(`'argument is not an object id: ${id}`);
		}

		if (id.search('1.2.') === 0) {
			return ChainStore.fetchFullAccount(id, autosubscribe);
		}

		if (id.search(committeePrefix) === 0) {
			ChainStore._subTo('committee', id);
		}

		const result = ChainStore.objects_by_id.get(id);
		if (result === undefined) {
			// the fetch
			if (DEBUG) {
				// console.log('fetching object: ', id);
			}

			ChainStore.objects_by_id.set(id, true);

			if (!Apis.instance().dbApi()) {
				return null;
			}

			Apis.instance().dbApi().exec('get_objects', [[id]])
				.then((optionalObjects) => {
					if (DEBUG) {
						// console.log('... optionalObjects', optionalObjects ? optionalObjects[0].id : null);
					}

					for (let i = 0; i < optionalObjects.length; i += 1) {
						const optionalObject = optionalObjects[i];
						if (optionalObject) {
							ChainStore._updateObject(optionalObject, true);
						} else {
							ChainStore.objects_by_id.set(id, null);
							ChainStore.notifySubscribers();
						}
					}
				})
				.catch(() => {
					// in the event of an error clear the pending state for id
					// console.log('!!! Chain API error', err);
					ChainStore.objects_by_id.delete(id);
				});
		} else if (result === true) {
			// then we are waiting a response
			return undefined;
		}

		return result; // we have a response, return it
	},

	/**
	 *  @return null if no such account exists
	 *  @return undefined if such an account may exist,
	 *  and fetch the the full account if not already pending
	 *  @return the account object if it does exist
	 */
	getAccount(nameOrId, autosubscribe = true) {

		if (!nameOrId) {
			return null;
		}

		if (typeof nameOrId === 'object') {
			if (nameOrId.id) {
				return ChainStore.getAccount(nameOrId.id, autosubscribe);
			}

			if (nameOrId.get) {
				return ChainStore.getAccount(nameOrId.get('id'), autosubscribe);
			}

			return undefined;
		}

		if (ChainValidation.is_object_id(nameOrId)) {
			const account = ChainStore.getObject(nameOrId, false, autosubscribe);
			if (account === null) {
				return null;
			}
			/* If sub status changes = require(false to true, force full fetch */
			const currentSub = ChainStore.get_full_accounts_subscriptions.get(nameOrId, false);
			if ((!currentSub && autosubscribe) || account === undefined || account.get('name') === undefined) {
				return ChainStore.fetchFullAccount(nameOrId, autosubscribe);
			}
			return account;
		} else if (ChainValidation.is_account_name(nameOrId, true)) {
			const accountId = ChainStore.accounts_by_name.get(nameOrId);
			if (accountId === null) {
				return null;
			} // already fetched and it wasn't found
			if (accountId === undefined) {
			// then no query, fetch it
				return ChainStore.fetchFullAccount(nameOrId, autosubscribe);
			}

			return ChainStore.getObject(accountId, false, autosubscribe); // return it
		}

		throw new Error(`Argument is not an account name or id: ${nameOrId}`);
	},

	/**
	 *  This method will attempt to lookup committee member by accountId.
	 *  If committee member doesn't exist it will return null,
	 *  if committee member is found it will return committee member object,
	 *  if it's not fetched yet it will return undefined.
	 *  @param accountId - account id
	 */
	getCommitteeMemberById(accountId) {
		const cmId = ChainStore.committee_by_account_id.get(accountId);
		if (cmId === undefined) {
			ChainStore.fetchCommitteeMemberByAccount(accountId);
			return undefined;
		} else if (cmId) {
			ChainStore._subTo('committee', cmId);
		}
		return cmId ? ChainStore.getObject(cmId) : null;
	},

	/**
	 *
	 *  @return a promise with the committee member object
	 */
	fetchCommitteeMemberByAccount(accountId) {
		return new Promise((resolve, reject) => {
			Apis.instance().dbApi().exec('get_committee_member_by_account', [accountId])
				.then((optionalCommitteeObject) => {
					if (optionalCommitteeObject) {
						ChainStore._subTo('committee', optionalCommitteeObject.id);

						ChainStore.committee_by_account_id = ChainStore.committee_by_account_id.set(
							optionalCommitteeObject.committee_member_account,
							optionalCommitteeObject.id,
						);

						resolve(ChainStore._updateObject(optionalCommitteeObject, true));
					} else {
						ChainStore.committee_by_account_id
							= ChainStore.committee_by_account_id.set(accountId, null);
						ChainStore.notifySubscribers();
						resolve(null);
					}
				}, reject);
		});
	},


	/**
	 *  Fetches an account and all of its associated data in a single query
	 *  @param an account name or account id
	 *  @return undefined if the account in question is in the process of being fetched
	 *  @return the object if it has already been fetched
	 *  @return null if the object has been queried and was not found
	 */
	fetchFullAccount(nameOrId, autosubscribe = true) {
		if (DEBUG) {
			// console.log('Fetch full account: ', nameOrId);
		}

		let fetchAccount = false;
		const subChanged = ChainStore.get_full_accounts_subscriptions.has(nameOrId) &&
		(ChainStore.get_full_accounts_subscriptions.get(nameOrId) === false && autosubscribe);

		if (ChainValidation.is_object_id(nameOrId) && !subChanged) {
			const current = ChainStore.objects_by_id.get(nameOrId);
			fetchAccount = current === undefined;
			if (!fetchAccount && (current && current.get('name'))) {
				return current;
			}
		} else if (!subChanged) {
			if (!ChainValidation.is_account_name(nameOrId, true)) {
				throw new Error(`Argument is not an account name: ${nameOrId}`);
			}

			const accountId = ChainStore.accounts_by_name.get(nameOrId);
			if (ChainValidation.is_object_id(accountId)) {
				return ChainStore.getAccount(accountId, autosubscribe);
			}
		}

		// only fetch once every 5 seconds if it wasn't found,
		// or if the subscribe status changed to true
		const isFetchingTime
			= (Date.now() - ChainStore.fetching_get_full_accounts.get(nameOrId)) <= 5000;

		if (subChanged || !ChainStore.fetching_get_full_accounts.has(nameOrId) || !isFetchingTime) {
			ChainStore.fetching_get_full_accounts.set(nameOrId, Date.now());
			// console.log( 'FETCHING FULL ACCOUNT: ', nameOrId, autosubscribe );
			Apis.instance().dbApi().exec('get_full_accounts', [[nameOrId], autosubscribe])
				.then(
					(results) => {
						if (results.length === 0) {
							if (ChainValidation.is_object_id(nameOrId)) {
								ChainStore.objects_by_id.set(nameOrId, null);
								ChainStore.notifySubscribers();
							}
							return;
						}
						const fullAccount = results[0][1];
						ChainStore.get_full_accounts_subscriptions.set(fullAccount.account.name, autosubscribe);
						ChainStore.get_full_accounts_subscriptions.set(fullAccount.account.id, autosubscribe);
						if (DEBUG) {
							// console.log('fullAccount: ', fullAccount);
						}
						/* Add this account to list of subbed accounts */
						ChainStore._subTo('accounts', fullAccount.account.id);
						const {
							vesting_balances: vestingBalances,
							call_orders: callOrders,
							limit_orders: limitOrders,
							referrer_name: referrerName,
							registrar_name: registrarName,
							lifetime_referrer_name: lifetimeReferrerName,
							account,
							assets,
							statistics,
							votes,
							proposals,
						} = fullAccount;

						ChainStore.accounts_by_name.set(account.name, account.id);
						account.assets = new Immutable.List(assets || []);
						account.referrer_name = referrerName;
						account.lifetime_referrer_name = lifetimeReferrerName;
						account.registrar_name = registrarName;
						account.orders = new Immutable.Set();
						account.vesting_balances = new Immutable.Set();
						account.balances = new Immutable.Map();
						account.call_orders = new Immutable.Set();
						account.proposals = new Immutable.Set();
						account.vesting_balances = account.vesting_balances.withMutations((set) => {
							vestingBalances.forEach((vb) => {
								ChainStore._updateObject(vb);
								set.add(vb.id);
							});
						});

						const subToObjects = [];

						votes.forEach((v) => ChainStore._updateObject(v));

						account.balances = account.balances.withMutations((map) => {
							fullAccount.balances.forEach((b) => {
								ChainStore._updateObject(b);
								map.set(b.asset_type, b.id);
								subToObjects.push(b.id);
							});
						});
						account.orders = account.orders.withMutations((set) => {
							limitOrders.forEach((order) => {
								ChainStore._updateObject(order);
								set.add(order.id);
								subToObjects.push(order.id);
							});
						});
						account.call_orders = account.call_orders.withMutations((set) => {
							callOrders.forEach((co) => {
								ChainStore._updateObject(co);
								set.add(co.id);
								subToObjects.push(co.id);
							});
						});

						account.proposals = account.proposals.withMutations((set) => {
							proposals.forEach((p) => {
								ChainStore._updateObject(p);
								set.add(p.id);
								subToObjects.push(p.id);
							});
						});

						if (subToObjects.length) {
							Apis.instance().dbApi().exec('get_objects', [subToObjects]);
						}

						ChainStore._updateObject(statistics);
						ChainStore.fetchRecentHistory(ChainStore._updateObject(account));
						ChainStore.notifySubscribers();
					},
					() => {
						// console.log('Error: ', err);
						if (ChainValidation.is_object_id(nameOrId)) {
							ChainStore.objects_by_id.delete(nameOrId);
						} else {
							ChainStore.accounts_by_name.delete(nameOrId);
						}
					},
				);
		}

		return undefined;
	},

	getAccountMemberStatus(account) {
		if (account === undefined) {
			return undefined;
		}

		if (account === null) {
			return 'unknown';
		}

		if (account.get('lifetime_referrer') === account.get('id')) {
			return 'lifetime';
		}

		const exp = new Date(account.get('membership_expiration_date')).getTime();
		const now = new Date().getTime();

		if (exp < now) {
			return 'basic';
		}
		return 'annual';
	},

	getAccountBalance(account, assetType) {
		const balances = account.get('balances');
		if (!balances) {
			return 0;
		}

		const balanceObjId = balances.get(assetType);
		if (balanceObjId) {
			const balanceObj = ChainStore.objects_by_id.get(balanceObjId);
			if (balanceObj) {
				return balanceObj.get('balance');
			}
		}
		return 0;
	},

	/**
	 *  There are two ways to extend the account history, add new more
	 *  recent history, and extend historic hstory. This method will fetch
	 *  the most recent account history and prepend it to the list of
	 *  historic operations.
	 *
	 *  @param account immutable account object
	 *  @return a promise with the account history
	 */
	fetchRecentHistory(account, limit = 100) {
		// console.log( 'get account history: ', account )
		// TODO: make sure we do not submit a query if there is already one
		// in flight...
		let accountId = account;
		if (!ChainValidation.is_object_id(accountId) && account.toJS) {
			accountId = account.get('id');
		}

		if (!ChainValidation.is_object_id(accountId)) {
			return;
		}

		account = ChainStore.objects_by_id.get(accountId);
		if (!account) {
			return;
		}


		let pendingRequest = ChainStore.account_history_requests.get(accountId);
		if (pendingRequest) {
			pendingRequest.requests += 1;
			return pendingRequest.promise;
		}

		pendingRequest = { requests: 0 };


		// starting at 0 means start at NOW, set this to something other than 0
		// to skip recent transactions and fetch the tail
		const start = `1.${parseInt(objectType.operation_history, 10)}.0`;
		let mostRecent = start;
		const history = account.get('history');

		if (history && history.size) {
			mostRecent = history.first().get('id');
		}

		pendingRequest.promise = new Promise((resolve, reject) => {
			Apis.instance().historyApi()
				.exec('get_account_history', [accountId, mostRecent, limit, start])
				.then((operations) => {
					const currentAccount = ChainStore.objects_by_id.get(accountId);

					if (!currentAccount) { return; }

					let currentHistory = currentAccount.get('history');

					if (!currentHistory) {
						currentHistory = Immutable.List();
					}

					let updatedHistory = Immutable.fromJS(operations);
					updatedHistory = updatedHistory.withMutations((list) => {
						for (let i = 0; i < currentHistory.size; i += 1) {
							list.push(currentHistory.get(i));
						}
					});

					const updatedAccount = currentAccount.set('history', updatedHistory);
					ChainStore.objects_by_id.set(accountId, updatedAccount);

					//	if( currentHistory != updatedHistory )
					//   ChainStore._notifyAccountSubscribers( accountId )

					const pendingAccountHistory = ChainStore.account_history_requests.get(accountId);
					ChainStore.account_history_requests.delete(accountId);
					if (pendingAccountHistory.requests > 0) {
						// it looks like some more history may have come in while we were
						// waiting on the result, lets fetch anything new before we resolve
						// this query.
						ChainStore.fetchRecentHistory(updatedAccount, limit).then(resolve, reject);
					} else {
						resolve(updatedAccount);
					}
				}); // end then
		});

		ChainStore.account_history_requests.set(accountId, pendingRequest);
		return pendingRequest.promise;
	},

	// _notifyAccountSubscribers( accountId )
	// {
	//   let sub = ChainStore.subscriptions_by_account.get( accountId )
	//   let acnt = ChainStore.objects_by_id.get(accountId)
	//   if( !sub ) return
	//   for( let item of sub.subscriptions )
	// 	  item( acnt )
	// },

	/**
	 *  Callback that receives notification of objects that have been
	 *  added, remove, or changed and are relevant to accountId
	 *  This method updates or removes objects = require(the main index and
	 *  then updates the account object with relevant meta-info depending
	 *  upon the type of account
	 */
	// _updateAccount( accountId, payload )
	// {
	// 	let updates = payload[0]
	//
	// 	for( let i = 0; i < updates.length; ++i )
	// 	{
	// 	   let update = updates[i]
	// 	   if( typeof update  == 'string' )
	// 	   {
	// 		  let old_obj = ChainStore._removeObject( update )
	//
	// 		  if( update.search( orderPrefix ) == 0 )
	// 		  {
	// 				acnt = acnt.setIn( ['orders'], set => set.delete(update) )
	// 		  }
	// 		  else if( update.search( vesting_balancePrefix ) == 0 )
	// 		  {
	// 				acnt = acnt.setIn( ['vesting_balances'], set => set.delete(update) )
	// 		  }
	// 	   }
	// 	   else
	// 	   {
	// 		  let updated_obj = ChainStore._updateObject( update )
	// 		  if( update.id.search( balancePrefix ) == 0 )
	// 		  {
	// 			 if( update.owner == accountId )
	// 				acnt = acnt.setIn( ['balances'], map => map.set(update.asset_type,update.id) )
	// 		  }
	// 		  else if( update.id.search( orderPrefix ) == 0 )
	// 		  {
	// 			 if( update.owner == accountId )
	// 				acnt = acnt.setIn( ['orders'], set => set.add(update.id) )
	// 		  }
	// 		  else if( update.id.search( vesting_balancePrefix ) == 0 )
	// 		  {
	// 			 if( update.owner == accountId )
	// 				acnt = acnt.setIn( ['vesting_balances'], set => set.add(update.id) )
	// 		  }
	//
	// 		  ChainStore.objects_by_id.set( acnt.id, acnt )
	// 	   }
	// 	}
	// 	ChainStore.fetchRecentHistory( acnt )
	// },


	/**
	 *  Updates the object in place by only merging the set
	 *  properties of object.
	 *  This method will create an immutable object with the given ID if
	 *  it does not already exist.
	 *  This is a 'private' method called when data is received = require(the
	 *  server and should not be used by others.
	 *  @pre object.id must be a valid object ID
	 *  @return an Immutable constructed = require(object and deep merged with the current state
	 */
	_updateObject(object, notifySubscribers = false, emit = true) {
		if (!('id' in object)) {
			// console.log('object with no id:', object);
			/* Settle order updates look different and need special handling */
			if ('balance' in object && 'owner' in object && 'settlement_date' in object) {
				// Settle order object
				emitter.emit('settle-order-update', object);
			}
			return null;
		}

		/**
		 *  A lot of objects get spammed by the API that we don't care about, filter these out here
		 */
		// Transaction object
		if (object.id.substring(0, transactionPrefix.length) === transactionPrefix) {
			return null; // console.log('not interested in transaction:', object);
		} else if (object.id.substring(0, accountTxHistoryPrefix.length) === accountTxHistoryPrefix) {
			// transaction_history object
			if (!ChainStore._isSubbedTo('accounts', object.account)) {
				return null; // console.log('not interested in transaction_history of', object.account);
			}
		} else if (object.id.substring(0, orderPrefix.length) === orderPrefix) {
			// limit_order object
			if (!ChainStore._isSubbedTo('accounts', object.seller)) {
				return null; // console.log('not interested in limit_orders of', object.seller);
			}
		} else if (object.id.substring(0, callOrderPrefix.length) === callOrderPrefix) {
			// call_order object
			if (!ChainStore._isSubbedTo('accounts', object.borrower)) {
				return null; // console.log('not interested in call_orders of', object.borrower);
			}
		} else if (object.id.substring(0, balancePrefix.length) === balancePrefix) {
			// balance object
			if (!ChainStore._isSubbedTo('accounts', object.owner)) {
				return null; // console.log('not interested in balance_object of', object.owner);
			}
		} else if (object.id.substring(0, operationHistoryPrefix.length) === operationHistoryPrefix) {
			// operation_history object
			return null; // console.log('not interested in operation_history', object);
		} else if (object.id.substring(0, blockSummaryPrefix.length) === blockSummaryPrefix) {
			// block_summary object
			return null; // console.log('not interested in blockSummaryPrefix', object);
		} else if (object.id.substring(0, accountStatsPrefix.length) === accountStatsPrefix) {
			// account_stats object
			if (!ChainStore._isSubbedTo('accounts', object.owner)) {
				return null; // console.log('not interested in stats of', object.owner);
			}
		} else if (object.id.substring(0, committeePrefix.length) === committeePrefix) {
			// committee_member object
			if (!ChainStore._isSubbedTo('committee', object.id)) {
				return null;
			}
		} else if (object.id.substring(0, 4) === '0.0.' || object.id.substring(0, 4) === '5.1.') {
			/**
			 *  The node spams these random objects related to markets,
			 *  they are never needed by the GUI and thus only fill up the memory,
			 *  so we ignore them
			 */
			return null;
		}

		// DYNAMIC GLOBAL OBJECT
		if (object.id === '2.1.0') {
			object.participation = 100 * (BigInteger(object.recent_slots_filled).bitCount() / 128.0);
			ChainStore.head_block_time_string = object.time;
			ChainStore.chain_time_offset.push(Date.now() - timeStringToDate(object.time).getTime());
			if (ChainStore.chain_time_offset.length > 10) {
				ChainStore.chain_time_offset.shift();
			} // remove first
		}

		let current = ChainStore.objects_by_id.get(object.id);
		if (!current) {
			// console.log('add object:', object.id);
			current = Immutable.Map();
		}
		const prior = current;
		if (current === undefined || current === true) {
			ChainStore.objects_by_id.set(object.id, current = Immutable.fromJS(object));
		} else {
			ChainStore.objects_by_id
				.set(object.id, current = current.mergeDeep(Immutable.fromJS(object)));
		}


		// BALANCE OBJECT
		if (object.id.substring(0, balancePrefix.length) === balancePrefix) {
			let owner = ChainStore.objects_by_id.get(object.owner);
			if (owner === undefined || owner === null) {
				return null;

				// owner = {id:object.owner, balances:{ } }
				// owner.balances[object.asset_type] = object.id
				// owner = Immutable.fromJS( owner )

			}

			const balances = owner.get('balances');
			if (!balances) {
				owner = owner.set('balances', Immutable.Map());
			}
			owner = owner.setIn(['balances', object.asset_type], object.id);

			ChainStore.objects_by_id.set(object.owner, owner);
		} else if (object.id.substring(0, accountStatsPrefix.length) === accountStatsPrefix) {
			// ACCOUNT STATS OBJECT
			try {
				const priorMostRecentOp = prior.get('most_recent_op', '2.9.0');

				if (priorMostRecentOp !== object.most_recent_op) {
					ChainStore.fetchRecentHistory(object.owner);
				}
			} catch (err) {
				// console.log('prior error:', 'object:', object, 'prior', prior, 'err:', err);
			}
		} else if (object.id.substring(0, committeePrefix.length) === committeePrefix) {
			// COMMITTEE MEMBER OBJECT
			if (ChainStore._isSubbedTo('committee', object.id)) {
				ChainStore.committee_by_account_id.set(object.committee_member_account, object.id);
				ChainStore.objects_by_vote_id.set(object.vote_id, object.id);
			} else {
				return null;
			}
		} else if (object.id.substring(0, accountPrefix.length) === accountPrefix) {
			// ACCOUNT OBJECT
			current = current.set('active', Immutable.fromJS(object.active));
			current = current.set('options', Immutable.fromJS(object.options));
			current = current.set('whitelisting_accounts', Immutable.fromJS(object.whitelisting_accounts));
			current = current.set('blacklisting_accounts', Immutable.fromJS(object.blacklisting_accounts));
			current = current.set('whitelisted_accounts', Immutable.fromJS(object.whitelisted_accounts));
			current = current.set('blacklisted_accounts', Immutable.fromJS(object.blacklisted_accounts));

			if (ChainStore.objects_by_id.get(object.id)) {
				ChainStore.objects_by_id.set(object.id, current);
			}

			if (ChainStore.accounts_by_name.get(object.name)) {
				ChainStore.accounts_by_name.set(object.name, object.id);
			}

		} else if (object.id.substring(0, assetPrefix.length) === assetPrefix) {
			// ASSET OBJECT
			ChainStore.assets_by_symbol.set(object.symbol, object.id);
			const dynamic = current.get('dynamic');
			if (!dynamic) {
				let dad = ChainStore.getObject(object.dynamic_asset_data_id, true);
				if (!dad) {
					dad = Immutable.Map();
				}
				if (!dad.get('asset_id')) {
					dad = dad.set('asset_id', object.id);
				}
				ChainStore.objects_by_id.set(object.dynamic_asset_data_id, dad);

				current = current.set('dynamic', dad);
				ChainStore.objects_by_id.set(object.id, current);
			}

			const bitasset = current.get('bitasset');
			if (!bitasset && object.bitasset_data_id) {
				let bad = ChainStore.getObject(object.bitasset_data_id, true);
				if (!bad) {
					bad = Immutable.Map();
				}

				if (!bad.get('asset_id')) {
					bad = bad.set('asset_id', object.id);
				}
				ChainStore.objects_by_id.set(object.bitasset_data_id, bad);

				current = current.set('bitasset', bad);
				ChainStore.objects_by_id.set(object.id, current);
			}
		} else if (object.id.substring(0, assetDynamicDataPrefix.length) === assetDynamicDataPrefix) {
			// ASSET DYNAMIC DATA OBJECT
			// let asset_id = assetPrefix + object.id.substring( assetDynamicDataPrefix.length )
			const assetId = current.get('asset_id');
			if (assetId) {
				let assetObj = ChainStore.getObject(assetId);
				if (assetObj && assetObj.set) {
					assetObj = assetObj.set('dynamic', current);
					ChainStore.objects_by_id.set(assetId, assetObj);
				}
			}

		} else if (object.id.substring(0, bitassetDataPrefix.length) === bitassetDataPrefix) {
			// BITASSET DATA OBJECT
			const assetId = current.get('asset_id');
			if (assetId) {
				let asset = ChainStore.getObject(assetId);
				if (asset) {
					asset = asset.set('bitasset', current);
					emitter.emit('bitasset-update', asset);
					ChainStore.objects_by_id.set(assetId, asset);
				}
			}
		} else if (object.id.substring(0, callOrderPrefix.length) === callOrderPrefix) {
			// CALL ORDER OBJECT
			// Update nested call_orders inside account object
			if (emit) {
				emitter.emit('call-order-update', object);
			}

			let account = ChainStore.objects_by_id.get(object.borrower);
			if (account) {
				if (!account.has('call_orders')) {
					account = account.set('call_orders', new Immutable.Set());
				}
				const callOrders = account.get('call_orders');
				if (!callOrders.has(object.id)) {
					account = account.set('call_orders', callOrders.add(object.id));
					ChainStore.objects_by_id.set(account.get('id'), account);
					Apis.instance().dbApi().exec('get_objects', [[object.id]]); // Force subscription to the object in the node by calling get_objects
				}
			}
		} else if (object.id.substring(0, orderPrefix.length) === orderPrefix) {
			// LIMIT ORDER OBJECT
			let account = ChainStore.objects_by_id.get(object.seller);
			if (account) {
				if (!account.has('orders')) {
					account = account.set('orders', new Immutable.Set());
				}
				const limitOrders = account.get('orders');
				if (!limitOrders.has(object.id)) {
					account = account.set('orders', limitOrders.add(object.id));
					ChainStore.objects_by_id.set(account.get('id'), account);
					Apis.instance().dbApi().exec('get_objects', [[object.id]]); // Force subscription to the object in the node by calling get_objects
				}
			}
		} else if (object.id.substring(0, proposalPrefix.length) === proposalPrefix) {
			// PROPOSAL OBJECT
			ChainStore.addProposalData(object.required_active_approvals, object.id);
			ChainStore.addProposalData(object.required_owner_approvals, object.id);
		}


		if (notifySubscribers) {
			ChainStore.notifySubscribers();
		}

		return current;
	},

	getObjectsByVoteIds(voteIds) {
		const result = [];
		const missing = [];
		for (let i = 0; i < voteIds.length; i += 1) {
			const obj = ChainStore.objects_by_vote_id.get(voteIds[i]);
			if (obj) {
				result.push(ChainStore.getObject(obj));
			} else {
				result.push(null);
				missing.push(voteIds[i]);
			}
		}

		if (missing.length) {
			// we may need to fetch some objects
			Apis.instance().dbApi().exec('lookup_vote_ids', [missing])
				.then(
					(voteObjArray) => {
						// console.log('missing ===========> ', missing);
						// console.log('vote objects ===========> ', voteObjArray);
						for (let i = 0; i < voteObjArray.length; i += 1) {
							if (voteObjArray[i]) {
								ChainStore._subTo('committee', voteObjArray[i].id);
								ChainStore._updateObject(voteObjArray[i]);
							}
						}
					},
					() => {
						// console.log('Error looking up vote ids: ', err);
					},
				);
		}
		return result;
	},

	getObjectByVoteID(voteId) {
		const objId = ChainStore.objects_by_vote_id.get(voteId);
		if (objId) {
			return ChainStore.getObject(objId);
		}
		return undefined;
	},

	getHeadBlockDate() {
		return timeStringToDate(ChainStore.head_block_time_string);
	},

	getEstimatedChainTimeOffset() {
		if (ChainStore.chain_time_offset.length === 0) {
			return 0;
		}
		// Immutable is fast, sorts numbers correctly, and leaves the original unmodified
		// This will fix itself if the user changes their clock
		const medianOffset = Immutable.List(ChainStore.chain_time_offset)
			.sort().get(Math.floor((ChainStore.chain_time_offset.length - 1) / 2));
		// console.log('medianOffset', medianOffset)
		return medianOffset;
	},

	addProposalData(approvals, objectId) {
		approvals.forEach((id) => {
			let impactedAccount = ChainStore.objects_by_id.get(id);
			if (impactedAccount) {
				let proposals = impactedAccount.get('proposals', Immutable.Set());

				if (!proposals.includes(objectId)) {
					proposals = proposals.add(objectId);
					impactedAccount = impactedAccount.set('proposals', proposals);
					ChainStore._updateObject(impactedAccount.toJS());
				}
			}
		});
	},

	getBlock(number) {
		number = parseInt(number, 10);

		let pendingBlock = ChainStore.block_requests.get(number);

		if (pendingBlock) {
			pendingBlock.requests += 1;
			return pendingBlock.promise;
		}

		pendingBlock = { requests: 0 };

		pendingBlock.promise = Apis.instance().dbApi()
			.exec('get_block', [number]).then((block) => {
				ChainStore.block_requests.delete(number);
				return block;
			});

		ChainStore.block_requests.set(number, pendingBlock);
		return pendingBlock.promise;
	},

	FetchChainObjects(method, objectIds, timeout, subMap) {
		const getObject = method.bind(this);

		return new Promise((resolve, reject) => {

			let timeoutHandle = null;

			function onUpdate(notSubscribedYet = false) {
				const res = objectIds.map((id) => {
					if (method.name === 'getAccount') {
						return getObject(id, subMap[id]);
					}
					if (method.name === 'getObject') {
						return getObject(id, false, subMap[id]);
					}
					return getObject(id);
				});
				if (res.findIndex((o) => o === undefined) === -1) {
					if (timeoutHandle) {
						clearTimeout(timeoutHandle);
					}
					if (!notSubscribedYet) {
						ChainStore.unsubscribe(onUpdate);
					}
					resolve(res);
					return true;
				}
				return false;
			}

			const resolved = onUpdate(true);
			if (!resolved) {
				ChainStore.subscribe(onUpdate);
			}

			if (timeout && !resolved) {
				timeoutHandle = setTimeout(() => {
					ChainStore.unsubscribe(onUpdate);
					reject(new Error('timeout'));
				}, timeout);
			}

		});

	},

	FetchChain(methodName, objectIds, timeout = 1900, subMap = {}) {

		const method = ChainStore[methodName];
		if (!method) {
			throw new Error(`ChainStore does not have method ${methodName}`);
		}

		const arrayIn = Array.isArray(objectIds);
		if (!arrayIn) {
			objectIds = [objectIds];
		}

		return ChainStore.FetchChainObjects(method, Immutable.List(objectIds), timeout, subMap)
			.then((res) => (arrayIn ? res : res.get(0)));
	},

};

ChainStore.start();

module.exports = ChainStore;
