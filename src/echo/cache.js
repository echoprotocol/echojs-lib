import { Map, List } from 'immutable';

class Cache {

	constructor(options) {
		this.options = options;
		this.clearCache();
	}

	clearCache() {
		this.subbedAccounts = new Map();
		this.subbedWitnesses = new Map();
		this.subbedCommittee = new Map();

		this.objectsById = new Map();
		this.accountsByName = new Map();
		this.asMapsBySymbol = new Map();
		this.accountIdsBy_key = Map();
		this.accountIdsByAccount = Map();

		this.balanceObjectsByAddress = new Map();
		this.getAccountRefsOf_keys_calls = new Map();
		this.getAccountRefsOfAccounts_calls = new Map();
		this.accountHistoryRequests = new Map();
		this.witnessByAccountId = new Map();
		this.committeeByAccountId = new Map();
		this.objectsByVoteId = new Map();
		this.fetching_getFullAccounts = new Map();
		this.getFullAccounts_subscriptions = new Map();
		this.blocks = new Map();
	}

}

export default Cache;
