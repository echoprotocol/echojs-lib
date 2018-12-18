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
        this.getFullAccountsSubscriptions = new Map();

		this.objectsById = new Map();
		this.accountsByName = new Map();
		this.accountsById = new Map();
		this.accountIdByKey = Map();

		this.assetByAssetId = new Map();
		this.assetBySymbol = new Map();

        this.contractBalanceByContractId = new Map();

		this.blockHeadersByBlockNumber = Map();

        this.witnessByAccountId = new Map();
        this.balanceObjectsByBalanceId = new Map();
        this.getAccountRefsOfKeysCalls = new Map();
        this.getAccountRefsOfAccountsCalls = new Map();
        this.accountHistoryRequests = new Map();
		this.committeeByAccountId = new Map();
		this.objectsByVoteId = new Map();
		this.fetchingGetFullAccounts = new Map();
		this.blocks = new Map();

		this.chainProperties = null;
		this.globalProperties = null;
		this.config = null;
		this.chainId = null;
		this.dynamicGlobalProperties = null;
	}

}

export default Cache;
