/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
import Immutable from 'immutable';
import { Apis } from 'echojs-ws';
import BigInteger from 'bigi';

import ChainTypes from './ChainTypes';
import ChainValidation from './ChainValidation';
import ee from './EmitterInstance';

const { object_type: objectType, impl_object_type: implObjectType } = ChainTypes;
const emitter = ee();

const orderPrefix = `1.${parseInt(objectType.limit_order, 10)}.`;
const callOrderPrefix = `1.${parseInt(objectType.call_order, 10)}.`;
const proposalPrefix = `1.${parseInt(objectType.proposal, 10)}.`;
const operationHistoryPrefix = `1.${parseInt(objectType.operation_history, 10)}.`;
const witnessPrefix = `1.${parseInt(objectType.witness, 10)}.`;
const workerPrefix = `1.${parseInt(objectType.worker, 10)}.`;
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
class ChainStore {

	constructor() {
		/** tracks everyone who wants to receive updates when the cache changes */
		this.subscribers = new Set();
		this.subscribed = false;
		this.clearCache();
		// this.progress = 0;
		// this.chain_time_offset is used to estimate the blockchain time
		this.chain_time_offset = [];
		this.dispatchFrequency = 40;
	}

	/**
	 *  Clears all cached state. This should be called any time the network connection is reset.
	 */
	clearCache() {
		/**
		 *  Tracks specific objects such as accounts that can trigger additional
		 *  fetching that should only happen if we're actually interested in the account
		 */
		this.subbed_accounts = new Set();
		this.subbed_witnesses = new Set();
		this.subbed_committee = new Set();

		this.objects_by_id = new Map();
		this.accounts_by_name = new Map();
		this.assets_by_symbol = new Map();
		this.account_ids_by_key = Immutable.Map();
		this.account_ids_by_account = Immutable.Map();

		this.balance_objects_by_address = new Map();
		this.get_account_refs_of_keys_calls = new Set();
		this.get_account_refs_of_accounts_calls = new Set();
		this.account_history_requests = new Map(); //	/< tracks pending history requests
		this.witness_by_account_id = new Map();
		this.committee_by_account_id = new Map();
		this.objects_by_vote_id = new Map();
		this.fetching_get_full_accounts = new Map();
		this.get_full_accounts_subscriptions = new Map();
		clearTimeout(this.timeout);
		this.dispatched = false;
	}

	resetCache() {
		this.subscribed = false;
		this.subError = null;
		this.clearCache();
		this.head_block_time_string = null;
		return this.init();
		// .catch((err) => {
		// 	console.log('resetCache init error:', err);
		// });
	}

	setDispatchFrequency(freq) {
		this.dispatchFrequency = freq;
	}

	init() {
		let reconnectCounter = 0;
		const _init = (resolve, reject) => {
			if (this.subscribed) {
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
						 *  the new witness_node subscription model makes it so we
						 *  never get subscribed to that object, therefore
						 *  this._updateObject is commented out here
						 */
						// this._updateObject( optionalObject, true );

						const headTime = new Date(`${optionalObject.time}+00:00`).getTime();
						this.head_block_time_string = optionalObject.time;
						const now = new Date().getTime();
						this.chain_time_offset.push(now - timeStringToDate(optionalObject.time).getTime());
						const delta = (now - headTime) / 1000;
						// let start = Date.parse('Sep 1, 2015');
						// let progress_delta = headTime - start;
						// this.progress = progress_delta / (now-start);

						if (delta < 60) {
							Apis.instance().dbApi().exec('set_subscribe_callback', [this.onUpdate.bind(this), true])
								.then(() => {
									if (DEBUG) {
										// console.log('synced and subscribed, chainstore ready');
									}
									this.subscribed = true;
									this.subError = null;
									this.notifySubscribers();
									resolve();
								})
								.catch((err) => {
									this.subscribed = false;
									this.subError = err;
									this.notifySubscribers();
									reject(err);
									// console.log('Error: ', err);
								});
						} else {
							// console.log('not yet synced, retrying in 1s');
							this.subscribed = false;
							reconnectCounter += 1;
							this.notifySubscribers();
							if (reconnectCounter > 5) {
								this.subError = new Error('ChainStore sync error, please check your system clock');
								return reject(this.subError);
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
				this.objects_by_id.delete('2.1.0');
				reject(err);
			});
		};

		return new Promise((resolve, reject) => _init(resolve, reject));
	}

	_subTo(type, id) {
		const key = `subbed_${type}`;
		if (!this[key].has(id)) {
			this[key].add(id);
		}
	}

	unSubFrom(type, id) {
		const key = `subbed_${type}`;
		this[key].delete(id);
		this.objects_by_id.delete(id);
	}

	_isSubbedTo(type, id) {
		const key = `subbed_${type}`;
		return this[key].has(id);
	}

	onUpdate(updatedObjects) { // map from account id to objects
		const cancelledOrders = [];
		const closedCallOrders = [];

		for (let a = 0; a < updatedObjects.length; a += 1) {
			for (let i = 0; i < updatedObjects[a].length; i += 1) {
				const obj = updatedObjects[a][i];
				if (ChainValidation.is_object_id(obj)) {
					// An entry containing only an object ID means that object was removed
					// console.log('removed obj', obj);
					// Check if the object exists in the ChainStore
					const oldObj = this.objects_by_id.get(obj);


					if (obj.search(orderPrefix) === 0) {
						// Limit orders

						cancelledOrders.push(obj);
						if (oldObj) {
							let account = this.objects_by_id.get(oldObj.get('seller'));
							if (account && account.has('orders')) {
								const limitOrders = account.get('orders');
								if (account.get('orders').has(obj)) {
									account = account.set('orders', limitOrders.delete(obj));
									this.objects_by_id.set(account.get('id'), account);
								}
							}
						}
					}

					if (obj.search(callOrderPrefix) === 0) {
						// Call orders
						closedCallOrders.push(obj);
						if (oldObj) {
							let account = this.objects_by_id.get(oldObj.get('borrower'));
							if (account && account.has('call_orders')) {
								const callOrders = account.get('call_orders');
								if (account.get('call_orders').has(obj)) {
									account = account.set('call_orders', callOrders.delete(obj));
									this.objects_by_id.set(account.get('id'), account);
								}
							}
						}
					}

					// Remove the object (if it already exists), set to null to indicate it does not exist
					if (oldObj) {
						this.objects_by_id.set(obj, null);
					}
				} else {
					this._updateObject(obj);
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
		// console.log('objects in store count:', this.objects_by_id.size, count);
		this.notifySubscribers();
	}

	notifySubscribers() {
		// Dispatch at most only once every x milliseconds
		if (!this.dispatched) {
			this.dispatched = true;
			this.timeout = setTimeout(() => {
				this.dispatched = false;
				this.subscribers.forEach((callback) => {
					callback();
				});
			}, this.dispatchFrequency);
		}
	}

	/**
	 *  Add a callback that will be called anytime any object in the cache is updated
	 */
	subscribe(callback) {
		if (this.subscribers.has(callback)) {
			throw new Error('Subscribe callback already exists', callback);
			// return console.error('Subscribe callback already exists', callback);
		}

		return this.subscribers.add(callback);
	}

	/**
	 *  Remove a callback that was previously added via subscribe
	 */
	unsubscribe(callback) {
		if (!this.subscribers.has(callback)) {
			throw new Error('Unsubscribe callback does not exists', callback);
			// return console.error('Unsubscribe callback does not exists', callback);
		}

		return this.subscribers.delete(callback);
	}

	/**
	 *  Clear an object from the cache to force it to be fetched again. This may
	 *  be useful if a query failed the first time and the wallet has reason to believe
	 *  it may succeede the second time.
	 */
	clearObjectCache(id) {
		this.objects_by_id.delete(id);
	}

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

		const result = this.objects_by_id.get(id);
		const fullAccountSub = this.get_full_accounts_subscriptions.get(id, false);
		const isAccount = id.substring(0, accountPrefix.length) === accountPrefix;
		const subChange = isAccount && !fullAccountSub && autosubscribe;

		if (result === undefined || force || subChange) {
			return this.fetchObject(id, force, autosubscribe);
		}

		if (result === true) {
			return undefined;
		}

		return result;
	}

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
			const asset = this.getObject(idOrSymbol);

			if (asset && (asset.get('bitasset') && !asset.getIn(['bitasset', 'current_feed']))) {
				return undefined;
			}
			return asset;
		}

		// TODO: verify idOrSymbol is a valid symbol name

		const assetId = this.assets_by_symbol.get(idOrSymbol);

		if (ChainValidation.is_object_id(assetId)) {
			const asset = this.getObject(assetId);

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
					this._updateObject(assetObjects[0], true);
				} else {
					this.assets_by_symbol.set(idOrSymbol, null);
					this.notifySubscribers();
				}
			})
			.catch(() => {
				// console.log('Error: ', err);
				this.assets_by_symbol.delete(idOrSymbol);
			});

		return undefined;
	}

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
		if (this.get_account_refs_of_keys_calls.has(key)) {
			return this.account_ids_by_key.get(key);
		}

		this.get_account_refs_of_keys_calls.add(key);

		Apis.instance().dbApi().exec('get_key_references', [[key]])
			.then(([vecAccountId]) => {
				let refs = Immutable.Set();
				refs = refs.withMutations((r) => {
					for (let i = 0; i < vecAccountId.length; i += 1) {
						r.add(vecAccountId[i]);
					}
				});
				this.account_ids_by_key = this.account_ids_by_key.set(key, refs);
				this.notifySubscribers();
			})
			.catch(() => {
				// console.error('get_key_references', err);
				this.account_ids_by_key = this.account_ids_by_key.delete(key);
				this.get_account_refs_of_keys_calls.delete(key);
			});

		return undefined;
	}

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
		if (this.get_account_refs_of_accounts_calls.has(accountId)) {
			return this.account_ids_by_account.get(accountId);
		}

		this.get_account_refs_of_accounts_calls.add(accountId);

		Apis.instance().dbApi().exec('get_account_references', [accountId])
			.then((vecAccountId) => {
				let refs = Immutable.Set();
				refs = refs.withMutations((r) => {
					for (let i = 0; i < vecAccountId.length; i += 1) {
						r.add(vecAccountId[i]);
					}
				});
				this.account_ids_by_account = this.account_ids_by_account.set(accountId, refs);
				this.notifySubscribers();
			})
			.catch(() => {
				// console.error('get_account_references', err);
				this.account_ids_by_account = this.account_ids_by_account.delete(accountId);
				this.get_account_refs_of_accounts_calls.delete(accountId);
			});
		return undefined;
	}

	/**
	 *  @return a Set of balance ids that are claimable with the given address
	 *  @return undefined if a query is pending and the set is not known at this time
	 *  @return a empty Set if no items are found
	 *
	 *  If this method returns undefined, then it will send a request to the server for
	 *  the current state after which it will be subscribed to changes to this set.
	 */
	getBalanceObjects(address) {
		const current = this.balance_objects_by_address.get(address);
		if (current === undefined) {
			/**
			 *  because balance objects are simply part of the genesis state,
			 *  there is no need to worry about having to update them /
			 *  merge them or index them in updateObject.
			 */
			this.balance_objects_by_address.set(address, Immutable.Set());
			Apis.instance().dbApi().exec('get_balance_objects', [[address]])
				.then(
					(balanceObjects) => {
						const set = new Set();
						for (let i = 0; i < balanceObjects.length; i += 1) {
							this._updateObject(balanceObjects[i]);
							set.add(balanceObjects[i].id);
						}
						this.balance_objects_by_address.set(address, Immutable.Set(set));
						this.notifySubscribers();
					},
					() => {
						this.balance_objects_by_address.delete(address);
					},
				);
		}
		return this.balance_objects_by_address.get(address);
	}


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
				result.push(this.fetchObject(id[i], force, autosubscribe));
			}
			return result;
		}

		if (DEBUG) {
			// console.log('!!! fetchObject: ', id, this.subscribed, !this.subscribed && !force);
		}

		if (!this.subscribed && !force) {
			return undefined;
		}

		if (DEBUG) {
			// console.log('maybe fetch object: ', id);
		}

		if (!ChainValidation.is_object_id(id)) {
			throw new Error(`'argument is not an object id: ${id}`);
		}

		if (id.search('1.2.') === 0) {
			return this.fetchFullAccount(id, autosubscribe);
		}

		if (id.search(witnessPrefix) === 0) {
			this._subTo('witnesses', id);
		}

		if (id.search(committeePrefix) === 0) {
			this._subTo('committee', id);
		}

		const result = this.objects_by_id.get(id);
		if (result === undefined) {
			// the fetch
			if (DEBUG) {
				// console.log('fetching object: ', id);
			}

			this.objects_by_id.set(id, true);

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
							this._updateObject(optionalObject, true);
						} else {
							this.objects_by_id.set(id, null);
							this.notifySubscribers();
						}
					}
				})
				.catch(() => {
					// in the event of an error clear the pending state for id
					// console.log('!!! Chain API error', err);
					this.objects_by_id.delete(id);
				});
		} else if (result === true) {
			// then we are waiting a response
			return undefined;
		}

		return result; // we have a response, return it
	}

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
				return this.getAccount(nameOrId.id, autosubscribe);
			}

			if (nameOrId.get) {
				return this.getAccount(nameOrId.get('id'), autosubscribe);
			}

			return undefined;
		}

		if (ChainValidation.is_object_id(nameOrId)) {
			const account = this.getObject(nameOrId, false, autosubscribe);
			if (account === null) {
				return null;
			}
			/* If sub status changes from false to true, force full fetch */
			const currentSub = this.get_full_accounts_subscriptions.get(nameOrId, false);
			if ((!currentSub && autosubscribe) || account === undefined || account.get('name') === undefined) {
				return this.fetchFullAccount(nameOrId, autosubscribe);
			}
			return account;
		} else if (ChainValidation.is_account_name(nameOrId, true)) {
			const accountId = this.accounts_by_name.get(nameOrId);
			if (accountId === null) {
				return null;
			} // already fetched and it wasn't found
			if (accountId === undefined) {
			// then no query, fetch it
				return this.fetchFullAccount(nameOrId, autosubscribe);
			}

			return this.getObject(accountId, false, autosubscribe); // return it
		}

		throw new Error(`Argument is not an account name or id: ${nameOrId}`);
	}

	/**
	 *  This method will attempt to lookup witness by accountId.
	 *  If witness doesn't exist it will return null,
	 *  if witness is found it will return witness object,
	 *  if it's not fetched yet it will return undefined.
	 *  @param accountId - account id
	 */
	getWitnessById(accountId) {
		const witnessId = this.witness_by_account_id.get(accountId);
		if (witnessId === undefined) {
			this.fetchWitnessByAccount(accountId);
			return undefined;
		} else if (witnessId) {
			this._subTo('witnesses', witnessId);
		}

		return witnessId ? this.getObject(witnessId) : null;
	}

	/**
	 *  This method will attempt to lookup committee member by accountId.
	 *  If committee member doesn't exist it will return null,
	 *  if committee member is found it will return committee member object,
	 *  if it's not fetched yet it will return undefined.
	 *  @param accountId - account id
	 */
	getCommitteeMemberById(accountId) {
		const cmId = this.committee_by_account_id.get(accountId);
		if (cmId === undefined) {
			this.fetchCommitteeMemberByAccount(accountId);
			return undefined;
		} else if (cmId) {
			this._subTo('committee', cmId);
		}
		return cmId ? this.getObject(cmId) : null;
	}

	/**
	 *  Obsolete! Please use getWitnessById
	 *  This method will attempt to lookup the account,
	 *  and then query to see whether or not there is
	 *  a witness for this account.
	 *  If the answer is known, it will return the witness_object, otherwise
	 *  it will attempt to look it up and return null.
	 *  Once the lookup has completed on_update will be called.
	 *
	 *  @param idOrAccount may either be an accountId, a witnessId, or an account_name
	 */
	// getWitness(idOrAccount) {
	// 	const account = this.getAccount(idOrAccount);
	// 	if (!account) { return null; }
	//
	// 	const accountId = account.get('id');
	//
	// 	const witnessId = this.witness_by_account_id.get(accountId);
	// 	if (witnessId === undefined) {
	// 		this.fetchWitnessByAccount(accountId);
	// 		return this.getObject(witnessId);
	// 	}
	//
	// 	const isAccountName = ChainValidation.is_account_name(idOrAccount, true);
	// 	const isAccountPrefix = idOrAccount.substring(0, 4) === '1.2.';
	//
	// 	if (isAccountName || isAccountPrefix) {
	// 		const account = this.getAccount(idOrAccount);
	//
	// 		if (!account) {
	// 			this.lookupAccountByName(idOrAccount).then(
	// 				(account) => {
	// 					if (!account) { return null; }
	//
	// 					const accountId = account.get('id');
	// 					const witnessId = this.witness_by_account_id.get(accountId);
	// 					if (ChainValidation.is_object_id(witnessId)) {
	// 						return this.getObject(witnessId, on_update);
	// 					}
	//
	// 					if (witnessId == undefined) {
	// 						this.fetchWitnessByAccount(accountId).then((witness) => {
	// 							this.witness_by_account_id.set(accountId, witness ? witness.get('id') : null);
	// 							if (witness && on_update) { on_update(); }
	// 						});
	// 					}
	//
	// 				},
	// 				() => {
	// 					let witnessId = this.witness_by_account_id.set( idOrAccount, null )
	// 				},
	// 			);
	// 		} else {
	// 			const accountId = account.get('id')
	// 			const witnessId = this.witness_by_account_id.get( accountId )
	// 			if( ChainValidation.is_object_id( witnessId ) )
	// 			return this.getObject( witnessId, on_update )
	//
	// 			if( witnessId == undefined )
	// 			this.fetchWitnessByAccount( accountId ).then( witness => {
	// 			this.witness_by_account_id.set( accountId, witness?witness.get('id'):null )
	// 			if( witness && on_update ) on_update()
	// 			})
	// 		}
	//
	// 		return null;
	// 	}
	//
	// 	return null;
	// }

	// Obsolete! Please use getCommitteeMemberById
	// getCommitteeMember( id_or_account, on_update = null )
	// {
	// 	const isAccountName = ChainValidation.is_account_name(idOrAccount, true);
	// 	const isAccountPrefix = idOrAccount.substring(0, 4) === '1.2.';
	//
	// 	if (isAccountName || isAccountPrefix) {
	//		 let account = this.getAccount( id_or_account )
	//
	//		 if( !account )
	//		 {
	//			 this.lookupAccountByName( id_or_account ).then( account=>{
	//				 let accountId = account.get('id')
	//				 let committee_id = this.committee_by_account_id.get( accountId )
	//
	//				 if( ChainValidation.is_object_id( committee_id ) )
	//				 	return this.getObject( committee_id, on_update )
	//
	//				 if( committee_id == undefined ) {
	//					 this.fetchCommitteeMemberByAccount( accountId )
	//					 	.then( committee => {
	//							 this.committee_by_account_id.set(
	//							 	accountId,
	//							 	committee ? committee.get('id') : null,
	//							 )
	//
	//							 if( on_update && committee) on_update()
	//					 	} )
	//				 }
	//			 }, error => {
	//				 let witness_id = this.committee_by_account_id.set( id_or_account, null )
	//			 })
	//		 }
	//		 else
	//		 {
	//			 let accountId = account.get('id')
	//			 let committee_id = this.committee_by_account_id.get( accountId )
	//			 if( ChainValidation.is_object_id( committee_id ) )
	//			 	return this.getObject( committee_id, on_update )
	//
	//			 if( committee_id == undefined )
	//			 {
	//				 this.fetchCommitteeMemberByAccount( accountId )
	//				 	.then( committee => {
	//					 	this.committee_by_account_id.set(
	//					 		accountId,
	//					 		committee ? committee.get('id') : null,
	//					 	)
	//
	//					 	if( on_update && committee) on_update()
	//				 } )
	//			 }
	//		 }
	//	 }
	//	 return null
	// }

	/**
	 *
	 *  @return a promise with the witness object
	 */
	fetchWitnessByAccount(accountId) {
		return new Promise((resolve, reject) => {
			Apis.instance().dbApi().exec('get_witness_by_account', [accountId])
				.then((optionalWitnessObject) => {
					if (optionalWitnessObject) {
						this._subTo('witnesses', optionalWitnessObject.id);

						this.witness_by_account_id = this.witness_by_account_id.set(
							optionalWitnessObject.witness_account,
							optionalWitnessObject.id,
						);

						resolve(this._updateObject(optionalWitnessObject, true));
					} else {
						this.witness_by_account_id = this.witness_by_account_id.set(accountId, null);
						this.notifySubscribers();
						resolve(null);
					}

				}, reject);
		});
	}

	/**
	 *
	 *  @return a promise with the witness object
	 */
	fetchCommitteeMemberByAccount(accountId) {
		return new Promise((resolve, reject) => {
			Apis.instance().dbApi().exec('get_committee_member_by_account', [accountId])
				.then((optionalCommitteeObject) => {
					if (optionalCommitteeObject) {
						this._subTo('committee', optionalCommitteeObject.id);

						this.committee_by_account_id = this.committee_by_account_id.set(
							optionalCommitteeObject.committee_member_account,
							optionalCommitteeObject.id,
						);

						resolve(this._updateObject(optionalCommitteeObject, true));
					} else {
						this.committee_by_account_id = this.committee_by_account_id.set(accountId, null);
						this.notifySubscribers();
						resolve(null);
					}
				}, reject);
		});
	}


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
		const subChanged = this.get_full_accounts_subscriptions.has(nameOrId) &&
		(this.get_full_accounts_subscriptions.get(nameOrId) === false && autosubscribe);

		if (ChainValidation.is_object_id(nameOrId) && !subChanged) {
			const current = this.objects_by_id.get(nameOrId);
			fetchAccount = current === undefined;
			if (!fetchAccount && (current && current.get('name'))) {
				return current;
			}
		} else if (!subChanged) {
			if (!ChainValidation.is_account_name(nameOrId, true)) {
				throw new Error(`Argument is not an account name: ${nameOrId}`);
			}

			const accountId = this.accounts_by_name.get(nameOrId);
			if (ChainValidation.is_object_id(accountId)) {
				return this.getAccount(accountId, autosubscribe);
			}
		}

		// only fetch once every 5 seconds if it wasn't found,
		// or if the subscribe status changed to true
		const isFetchingTime = (Date.now() - this.fetching_get_full_accounts.get(nameOrId)) <= 5000;

		if (subChanged || !this.fetching_get_full_accounts.has(nameOrId) || !isFetchingTime) {
			this.fetching_get_full_accounts.set(nameOrId, Date.now());
			// console.log( 'FETCHING FULL ACCOUNT: ', nameOrId, autosubscribe );
			Apis.instance().dbApi().exec('get_full_accounts', [[nameOrId], autosubscribe])
				.then(
					(results) => {
						if (results.length === 0) {
							if (ChainValidation.is_object_id(nameOrId)) {
								this.objects_by_id.set(nameOrId, null);
								this.notifySubscribers();
							}
							return;
						}
						const fullAccount = results[0][1];
						this.get_full_accounts_subscriptions.set(fullAccount.account.name, autosubscribe);
						this.get_full_accounts_subscriptions.set(fullAccount.account.id, autosubscribe);
						if (DEBUG) {
							// console.log('fullAccount: ', fullAccount);
						}
						/* Add this account to list of subbed accounts */
						this._subTo('accounts', fullAccount.account.id);
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

						this.accounts_by_name.set(account.name, account.id);
						account.assets = new Immutable.List(assets || []);
						account.referrer_name = referrerName;
						account.lifetime_referrer_name = lifetimeReferrerName;
						account.registrar_name = registrarName;
						account.balances = {};
						account.orders = new Immutable.Set();
						account.vesting_balances = new Immutable.Set();
						account.balances = new Immutable.Map();
						account.call_orders = new Immutable.Set();
						account.proposals = new Immutable.Set();
						account.vesting_balances = account.vesting_balances.withMutations((set) => {
							vestingBalances.forEach((vb) => {
								this._updateObject(vb);
								set.add(vb.id);
							});
						});

						const subToObjects = [];

						votes.forEach((v) => this._updateObject(v));

						account.balances = account.balances.withMutations((map) => {
							fullAccount.balances.forEach((b) => {
								this._updateObject(b);
								map.set(b.asset_type, b.id);
								subToObjects.push(b.id);
							});
						});
						account.orders = account.orders.withMutations((set) => {
							limitOrders.forEach((order) => {
								this._updateObject(order);
								set.add(order.id);
								subToObjects.push(order.id);
							});
						});
						account.call_orders = account.call_orders.withMutations((set) => {
							callOrders.forEach((co) => {
								this._updateObject(co);
								set.add(co.id);
								subToObjects.push(co.id);
							});
						});

						account.proposals = account.proposals.withMutations((set) => {
							proposals.forEach((p) => {
								this._updateObject(p);
								set.add(p.id);
								subToObjects.push(p.id);
							});
						});

						if (subToObjects.length) {
							Apis.instance().dbApi().exec('get_objects', [subToObjects]);
						}

						this._updateObject(statistics);
						this.fetchRecentHistory(this._updateObject(account));
						this.notifySubscribers();
					},
					() => {
						// console.log('Error: ', err);
						if (ChainValidation.is_object_id(nameOrId)) {
							this.objects_by_id.delete(nameOrId);
						} else {
							this.accounts_by_name.delete(nameOrId);
						}
					},
				);
		}

		return undefined;
	}

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
	}

	getAccountBalance(account, assetType) {
		const balances = account.get('balances');
		if (!balances) {
			return 0;
		}

		const balanceObjId = balances.get(assetType);
		if (balanceObjId) {
			const balanceObj = this.objects_by_id.get(balanceObjId);
			if (balanceObj) {
				return balanceObj.get('balance');
			}
		}
		return 0;
	}

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

		account = this.objects_by_id.get(accountId);
		if (!account) {
			return;
		}


		let pendingRequest = this.account_history_requests.get(accountId);
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
					const currentAccount = this.objects_by_id.get(accountId);

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
					this.objects_by_id.set(accountId, updatedAccount);

					//	if( currentHistory != updatedHistory )
					//   this._notifyAccountSubscribers( accountId )

					const pendingAccountHistory = this.account_history_requests.get(accountId);
					this.account_history_requests.delete(accountId);
					if (pendingAccountHistory.requests > 0) {
						// it looks like some more history may have come in while we were
						// waiting on the result, lets fetch anything new before we resolve
						// this query.
						this.fetchRecentHistory(updatedAccount, limit).then(resolve, reject);
					} else {
						resolve(updatedAccount);
					}
				}); // end then
		});

		this.account_history_requests.set(accountId, pendingRequest);
		return pendingRequest.promise;
	}

	// _notifyAccountSubscribers( accountId )
	// {
	//   let sub = this.subscriptions_by_account.get( accountId )
	//   let acnt = this.objects_by_id.get(accountId)
	//   if( !sub ) return
	//   for( let item of sub.subscriptions )
	// 	  item( acnt )
	// }

	/**
	 *  Callback that receives notification of objects that have been
	 *  added, remove, or changed and are relevant to accountId
	 *  This method updates or removes objects from the main index and
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
	// 		  let old_obj = this._removeObject( update )
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
	// 		  let updated_obj = this._updateObject( update )
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
	// 		  this.objects_by_id.set( acnt.id, acnt )
	// 	   }
	// 	}
	// 	this.fetchRecentHistory( acnt )
	// }


	/**
	 *  Updates the object in place by only merging the set
	 *  properties of object.
	 *  This method will create an immutable object with the given ID if
	 *  it does not already exist.
	 *  This is a 'private' method called when data is received from the
	 *  server and should not be used by others.
	 *  @pre object.id must be a valid object ID
	 *  @return an Immutable constructed from object and deep merged with the current state
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
			if (!this._isSubbedTo('accounts', object.account)) {
				return null; // console.log('not interested in transaction_history of', object.account);
			}
		} else if (object.id.substring(0, orderPrefix.length) === orderPrefix) {
			// limit_order object
			if (!this._isSubbedTo('accounts', object.seller)) {
				return null; // console.log('not interested in limit_orders of', object.seller);
			}
		} else if (object.id.substring(0, callOrderPrefix.length) === callOrderPrefix) {
			// call_order object
			if (!this._isSubbedTo('accounts', object.borrower)) {
				return null; // console.log('not interested in call_orders of', object.borrower);
			}
		} else if (object.id.substring(0, balancePrefix.length) === balancePrefix) {
			// balance object
			if (!this._isSubbedTo('accounts', object.owner)) {
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
			if (!this._isSubbedTo('accounts', object.owner)) {
				return null; // console.log('not interested in stats of', object.owner);
			}
		} else if (object.id.substring(0, witnessPrefix.length) === witnessPrefix) {
			// witness object
			if (!this._isSubbedTo('witnesses', object.id)) {
				return null;
			}
		} else if (object.id.substring(0, committeePrefix.length) === committeePrefix) {
			// committee_member object
			if (!this._isSubbedTo('committee', object.id)) {
				return null;
			}
		} else if (object.id.substring(0, 4) === '0.0.' || object.id.substring(0, 4) === '5.1.') {
			/**
			 *  The witness node spams these random objects related to markets,
			 *  they are never needed by the GUI and thus only fill up the memory,
			 *  so we ignore them
			 */
			return null;
		}

		// DYNAMIC GLOBAL OBJECT
		if (object.id === '2.1.0') {
			object.participation = 100 * (BigInteger(object.recent_slots_filled).bitCount() / 128.0);
			this.head_block_time_string = object.time;
			this.chain_time_offset.push(Date.now() - timeStringToDate(object.time).getTime());
			if (this.chain_time_offset.length > 10) {
				this.chain_time_offset.shift();
			} // remove first
		}

		let current = this.objects_by_id.get(object.id);
		if (!current) {
			// console.log('add object:', object.id);
			current = Immutable.Map();
		}
		const prior = current;
		if (current === undefined || current === true) {
			this.objects_by_id.set(object.id, current = Immutable.fromJS(object));
		} else {
			this.objects_by_id.set(object.id, current = current.mergeDeep(Immutable.fromJS(object)));
		}


		// BALANCE OBJECT
		if (object.id.substring(0, balancePrefix.length) === balancePrefix) {
			let owner = this.objects_by_id.get(object.owner);
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

			this.objects_by_id.set(object.owner, owner);
		} else if (object.id.substring(0, accountStatsPrefix.length) === accountStatsPrefix) {
			// ACCOUNT STATS OBJECT
			try {
				const priorMostRecentOp = prior.get('most_recent_op', '2.9.0');

				if (priorMostRecentOp !== object.most_recent_op) {
					this.fetchRecentHistory(object.owner);
				}
			} catch (err) {
				// console.log('prior error:', 'object:', object, 'prior', prior, 'err:', err);
			}
		} else if (object.id.substring(0, witnessPrefix.length) === witnessPrefix) {
			// WITNESS OBJECT
			if (this._isSubbedTo('witnesses', object.id)) {
				this.witness_by_account_id.set(object.witness_account, object.id);
				this.objects_by_vote_id.set(object.vote_id, object.id);
			} else {
				return null;
			}
		} else if (object.id.substring(0, committeePrefix.length) === committeePrefix) {
			// COMMITTEE MEMBER OBJECT
			if (this._isSubbedTo('committee', object.id)) {
				this.committee_by_account_id.set(object.committee_member_account, object.id);
				this.objects_by_vote_id.set(object.vote_id, object.id);
			} else {
				return null;
			}
		} else if (object.id.substring(0, accountPrefix.length) === accountPrefix) {
			// ACCOUNT OBJECT
			current = current.set('active', Immutable.fromJS(object.active));
			current = current.set('owner', Immutable.fromJS(object.owner));
			current = current.set('options', Immutable.fromJS(object.options));
			current = current.set('whitelisting_accounts', Immutable.fromJS(object.whitelisting_accounts));
			current = current.set('blacklisting_accounts', Immutable.fromJS(object.blacklisting_accounts));
			current = current.set('whitelisted_accounts', Immutable.fromJS(object.whitelisted_accounts));
			current = current.set('blacklisted_accounts', Immutable.fromJS(object.blacklisted_accounts));
			this.objects_by_id.set(object.id, current);
			this.accounts_by_name.set(object.name, object.id);
		} else if (object.id.substring(0, assetPrefix.length) === assetPrefix) {
			// ASSET OBJECT
			this.assets_by_symbol.set(object.symbol, object.id);
			const dynamic = current.get('dynamic');
			if (!dynamic) {
				let dad = this.getObject(object.dynamic_asset_data_id, true);
				if (!dad) {
					dad = Immutable.Map();
				}
				if (!dad.get('asset_id')) {
					dad = dad.set('asset_id', object.id);
				}
				this.objects_by_id.set(object.dynamic_asset_data_id, dad);

				current = current.set('dynamic', dad);
				this.objects_by_id.set(object.id, current);
			}

			const bitasset = current.get('bitasset');
			if (!bitasset && object.bitasset_data_id) {
				let bad = this.getObject(object.bitasset_data_id, true);
				if (!bad) {
					bad = Immutable.Map();
				}

				if (!bad.get('asset_id')) {
					bad = bad.set('asset_id', object.id);
				}
				this.objects_by_id.set(object.bitasset_data_id, bad);

				current = current.set('bitasset', bad);
				this.objects_by_id.set(object.id, current);
			}
		} else if (object.id.substring(0, assetDynamicDataPrefix.length) === assetDynamicDataPrefix) {
			// ASSET DYNAMIC DATA OBJECT
			// let asset_id = assetPrefix + object.id.substring( assetDynamicDataPrefix.length )
			const assetId = current.get('asset_id');
			if (assetId) {
				let assetObj = this.getObject(assetId);
				if (assetObj && assetObj.set) {
					assetObj = assetObj.set('dynamic', current);
					this.objects_by_id.set(assetId, assetObj);
				}
			}

		} else if (object.id.substring(0, workerPrefix.length) === workerPrefix) {
			// WORKER OBJECT
			this.objects_by_vote_id.set(object.vote_for, object.id);
			this.objects_by_vote_id.set(object.vote_against, object.id);
		} else if (object.id.substring(0, bitassetDataPrefix.length) === bitassetDataPrefix) {
			// BITASSET DATA OBJECT
			const assetId = current.get('asset_id');
			if (assetId) {
				let asset = this.getObject(assetId);
				if (asset) {
					asset = asset.set('bitasset', current);
					emitter.emit('bitasset-update', asset);
					this.objects_by_id.set(assetId, asset);
				}
			}
		} else if (object.id.substring(0, callOrderPrefix.length) === callOrderPrefix) {
			// CALL ORDER OBJECT
			// Update nested call_orders inside account object
			if (emit) {
				emitter.emit('call-order-update', object);
			}

			let account = this.objects_by_id.get(object.borrower);
			if (account) {
				if (!account.has('call_orders')) {
					account = account.set('call_orders', new Immutable.Set());
				}
				const callOrders = account.get('call_orders');
				if (!callOrders.has(object.id)) {
					account = account.set('call_orders', callOrders.add(object.id));
					this.objects_by_id.set(account.get('id'), account);
					Apis.instance().dbApi().exec('get_objects', [[object.id]]); // Force subscription to the object in the witness node by calling get_objects
				}
			}
		} else if (object.id.substring(0, orderPrefix.length) === orderPrefix) {
			// LIMIT ORDER OBJECT
			let account = this.objects_by_id.get(object.seller);
			if (account) {
				if (!account.has('orders')) {
					account = account.set('orders', new Immutable.Set());
				}
				const limitOrders = account.get('orders');
				if (!limitOrders.has(object.id)) {
					account = account.set('orders', limitOrders.add(object.id));
					this.objects_by_id.set(account.get('id'), account);
					Apis.instance().dbApi().exec('get_objects', [[object.id]]); // Force subscription to the object in the witness node by calling get_objects
				}
			}
			// POROPOSAL OBJECT
		} else if (object.id.substring(0, proposalPrefix.length) === proposalPrefix) {
			this.addProposalData(object.required_active_approvals, object.id);
			this.addProposalData(object.required_owner_approvals, object.id);
		}


		if (notifySubscribers) {
			this.notifySubscribers();
		}

		return current;
	}

	getObjectsByVoteIds(voteIds) {
		const result = [];
		const missing = [];
		for (let i = 0; i < voteIds.length; i += 1) {
			const obj = this.objects_by_vote_id.get(voteIds[i]);
			if (obj) {
				result.push(this.getObject(obj));
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
								const prefix = voteObjArray[i].id.substring(0, witnessPrefix.length);
								this._subTo(prefix === witnessPrefix ? 'witnesses' : 'committee', voteObjArray[i].id);
								this._updateObject(voteObjArray[i]);
							}
						}
					},
					() => {
						// console.log('Error looking up vote ids: ', err);
					},
				);
		}
		return result;
	}

	getObjectByVoteID(voteId) {
		const objId = this.objects_by_vote_id.get(voteId);
		if (objId) {
			return this.getObject(objId);
		}
		return undefined;
	}

	getHeadBlockDate() {
		return timeStringToDate(this.head_block_time_string);
	}

	getEstimatedChainTimeOffset() {
		if (this.chain_time_offset.length === 0) {
			return 0;
		}
		// Immutable is fast, sorts numbers correctly, and leaves the original unmodified
		// This will fix itself if the user changes their clock
		const medianOffset = Immutable.List(this.chain_time_offset)
			.sort().get(Math.floor((this.chain_time_offset.length - 1) / 2));
		// console.log('medianOffset', medianOffset)
		return medianOffset;
	}

	addProposalData(approvals, objectId) {
		approvals.forEach((id) => {
			let impactedAccount = this.objects_by_id.get(id);
			if (impactedAccount) {
				let proposals = impactedAccount.get('proposals', Immutable.Set());

				if (!proposals.includes(objectId)) {
					proposals = proposals.add(objectId);
					impactedAccount = impactedAccount.set('proposals', proposals);
					this._updateObject(impactedAccount.toJS());
				}
			}
		});
	}

	getBlock(number) {
		return Apis.instance().dbApi().exec('get_block', [number]);
	}

}

const chainStore = new ChainStore();

function FetchChainObjects(method, objectIds, timeout, subMap) {
	const getObject = method.bind(chainStore);

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
					chainStore.unsubscribe(onUpdate);
				}
				resolve(res);
				return true;
			}
			return false;
		}

		const resolved = onUpdate(true);
		if (!resolved) {
			chainStore.subscribe(onUpdate);
		}

		if (timeout && !resolved) {
			timeoutHandle = setTimeout(() => {
				chainStore.unsubscribe(onUpdate);
				reject(new Error('timeout'));
			}, timeout);
		}

	});

}
chainStore.FetchChainObjects = FetchChainObjects;

function FetchChain(methodName, objectIds, timeout = 1900, subMap = {}) {

	const method = chainStore[methodName];
	if (!method) {
		throw new Error(`ChainStore does not have method ${methodName}`);
	}

	const arrayIn = Array.isArray(objectIds);
	if (!arrayIn) {
		objectIds = [objectIds];
	}

	return chainStore.FetchChainObjects(method, Immutable.List(objectIds), timeout, subMap)
		.then((res) => (arrayIn ? res : res.get(0)));
}

chainStore.FetchChain = FetchChain;

export default chainStore;
