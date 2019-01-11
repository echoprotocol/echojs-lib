/* eslint-disable max-len */
import { Map } from 'immutable';

import { isFunction, isString, isObject, isArray, isVoid, isUndefined } from '../utils/validator';

import * as CacheConfig from '../constants/cache-config';

import * as reducerCreator from '../redux/reducer-creator';

class Cache {

	constructor() {
		this.isUsed = true;
		this.clearCache();

		this.redux = {
			store: null,
			reducerName: null,
			caches: null,
			reducer: null,
		};
	}

	clearCache() {
		this.subbedAccounts = new Map();
		this.subbedWitnesses = new Map();
		this.subbedCommittee = new Map();
		this.getFullAccountsSubscriptions = new Map();

		this.objectsById = new Map();

		this.accountsByName = new Map();
		this.accountsById = new Map();
		this.accountsIdByKey = Map();

		this.assetByAssetId = new Map();
		this.assetBySymbol = new Map();

		this.contractsByContractId = new Map();
		this.fullContractsByContractId = new Map();
		this.contractResultsByContractResultId = new Map();

		this.blockHeadersByBlockNumber = Map();
		this.blocks = new Map();

		this.transactionsByBlockAndIndex = new Map();

		this.witnessByAccountId = new Map();
		this.witnessByWitnessId = new Map();

		this.committeeMembersByAccountId = new Map();
		this.committeeMembersByCommitteeMemberId = new Map();

		this.objectsByVoteId = new Map();

		this.accountsBalanceByAccountId = new Map();
		this.accountsBalanceByAccountName = new Map();

		this.accountReferencesByAccountId = new Map();

		this.bitAssetsByBitAssetId = new Map();
		this.dynamicAssetDataByDynamicAssetDataId = new Map();

		this.balanceObjectsByBalanceId = new Map();
		this.getAccountRefsOfAccountsCalls = new Map();
		this.fetchingGetFullAccounts = new Map();

		this.chainProperties = new Map();
		this.globalProperties = new Map();
		this.config = new Map();
		this.chainId = null;
		this.dynamicGlobalProperties = new Map();
	}

	setInMap(map, key, value) {
		if (this.isUsed) {
			this.set(map, this[map].set(key, value));
		}
		return this;
	}

	set(field, value) {
		if (!this.isUsed) {
			this[field] = value;
			if (this.redux.store && this.redux.reducer) {
            	this.redux.store.dispatch(this.redux.reducer.set({ field, value }));
			}
		}
		return this;
	}

	/**
	 *
     * @param {Object} store
     * @param {String} reducerName
     * @param {Array.<String>} caches
     */
	setStore({ store, reducerName = CacheConfig.DEFAULT_REDUCER_NAME, caches = CacheConfig.DEFAULT_CACHES_ARRAY }) {
		if (!isObject(store) || !isFunction(store.getState) || isVoid(store.getState())) throw new Error('Expected the state to be available');
		if (!isString(reducerName) || reducerName.length === 0) throw new Error('Reducer name is invalid');
		if (!isVoid(caches) || (!isArray(caches) || !caches.every((c) => isString(c)))) throw new Error('Caches is invalid');

		let reducerFields;
		const startValues = {};

		if (!isVoid(caches)) {
			reducerFields = new Map(caches.reducer((obj, c) => {
				if (isUndefined(this[c])) {
					return obj;
				}

				startValues[c] = this[c];

				if (this[c] instanceof Map) {
					obj[c] = new Map();
				} else {
					obj[c] = null;
				}

				return obj;
			}, {}));
		}

		const reducer = reducerCreator(reducerName, reducerFields);



		this.redux = {
			store, reducerName, caches, reducer,
		};
	}

	setOptions(options) {
		try {
			this.setStore(options);
		} catch (error) {
			throw error;
			// TODO
		}
	}

}

export default Cache;
