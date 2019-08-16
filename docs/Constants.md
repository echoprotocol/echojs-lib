### Constants

List of constants which we provide

 ```javascript
 import { constants } from 'echojs-lib';

console.log(constants.CHAIN_TYPES) // information about ids

/*
{
    RESERVED_SPACES: {
        RELATIVE_PROTOCOL_IDS: 0,
        PROTOCOL_IDS: 1,
        IMPLEMENTATION_IDS: 2,
    },
    IMPLEMENTATION_OBJECT_TYPE: {
        GLOBAL_PROPERTY: 0,
        DYNAMIC_GLOBAL_PROPERTY: 1,
        RESERVED: 2,
        ASSET_DYNAMIC_DATA: 3,
        ASSET_BITASSET_DATA: 4,
        ACCOUNT_BALANCE: 5,
        ACCOUNT_STATISTICS: 6,
        TRANSACTION: 7,
        BLOCK_SUMMARY: 8,
        ACCOUNT_TRANSACTION_HISTORY: 9,
        CHAIN_PROPERTY: 10,
        BUDGET_RECORD: 11,
        SPECIAL_AUTHORITY: 12,
        BUYBACK_OBJECT: 13,
        COLLATERAL_BID: 14,
        CONTRACT_BALANCE: 15,
        CONTRACT_HISTORY: 16,
        CONTRACT_STATISTICS: 17,
        ACCOUNT_ADDRESS: 18,
        CONTRACT_POOL: 19,
        MALICIOUS_COMMITTEEMEN: 20,
    },
    VOTE_TYPE: {
        COMMITTEE: 0,
    },
}
*/

console.log(constants.CHAIN_CONFIG) // Generai information about chain

/*
{
    CORE_ASSET: 'ECHO',
    ADDRESS_PREFIX: 'ECHO',
    EXPIRE_IN_SECONDS: 15,
    EXPIRE_IN_SECONDS_PROPOSAL: 24 * 60 * 60,
    REVIEW_IN_SECONDS_COMMITTEE: 24 * 60 * 60,
    NETWORKS: {
        ECHO_DEV: {
            CORE_ASSET: 'ECHO',
            ADDRESS_PREFIX: 'ECHO',
            CHAIN_ID:'233ae92c7218173c76b5ffad9487b063933eec714a12e3f2ea48026a4526294',
        },
    }
}
*/

console.log(constants.WS_CONSTANTS) // websocket constants

/*
{
    CONNECTION_TIMEOUT: 5 * 1000,
    MAX_RETRIES: 1000;
    PING_TIMEOUT: 10 * 1000,
    PING_DELAY: 10 * 1000,
    DEBUG: false,
    DATABASE_API: 'database',
    NETWORK_BROADCAST_API: 'network_broadcast',
    HISTORY_API: 'history',
    REGISTRATION_API: 'registration',
    ASSET_API: 'asset',
    LOGIN_API: 'login',
    NETWORK_NODE_API: 'network_node',
    CHAIN_APIS: [
        DATABASE_API,
        NETWORK_BROADCAST_API,
        HISTORY_API,
        REGISTRATION_API,
        ASSET_API,
        LOGIN_API,
        NETWORK_NODE_API,
    ],
    DEFAULT_CHAIN_APIS: [
        DATABASE_API,
        NETWORK_BROADCAST_API,
        HISTORY_API,
        LOGIN_API,
    ],
    STATUS: {
        OPEN: 'OPEN',
        ERROR: 'ERROR',
        CLOSE: 'CLOSE',
    },
}
*/

console.log(constants.START_OPERATION_ID) // start operation id

/*
    1.10.0
*/

console.log(constants.CORE_ASSET_ID) // core asset id

/*
    1.3.0
*/

console.log(constants.ECHORAND_TYPES)

/*
{
	START_NOTIFICATION: 1,
	BLOCK_NOTIFICATION: 2,
}
*/

console.log(constants.CANCEL_LIMIT_ORDER)

/*
    cancel-limit-order
*/

console.log(constants.UPDATE_CALL_ORDER)

/*
    update-call-order
*/

console.log(constants.CLOSE_CALL_ORDER)

/*
    close-call-order
*/

console.log(constants.BITASSET_UPDATE)

/*
    bitasset-update
*/


console.log(constants.CACHE_MAPS) // cache maps

/*
{
    SUBBED_ACCOUNTS: 'subbedAccounts',
    SUBBED_COMMITTEE: 'subbedCommittee',
    GET_FULL_ACCOUNTS_SUBSCRIPTIONS: 'getFullAccountsSubscriptions',
    OBJECTS_BY_ID: 'objectsById',
    ACCOUNTS_BY_NAME: 'accountsByName',
    ACCOUNTS_BY_ID: 'accountsById',
    ACCOUNTS_ID_BY_KEY: 'accountsIdByKey',
    ASSET_BY_ASSET_ID: 'assetByAssetId',
    ASSET_BY_SYMBOL: 'assetBySymbol',
    CONTRACTS_BY_CONTRACT_ID: 'contractsByContractId',
    FULL_CONTRACTS_BY_CONTRACT_ID: 'fullContractsByContractId',
    CONTRACT_RESULTS_BY_CONTRACT_RESULT_ID:'contractResultsByContractResultId',
    BLOCK_HEADERS_BY_BLOCK_NUMBER: 'blockHeadersByBlockNumber',
    BLOCKS: 'blocks',
    TRANSACTIONS_BY_BLOCK_AND_INDEX: 'transactionsByBlockAndIndex',
    COMMITTEE_MEMBERS_BY_ACCOUNT_ID: 'committeeMembersByAccountId',
    COMMITTEE_MEMBERS_BY_COMMITTEE_MEMBER_ID:'committeeMembersByCommitteeMemberId',
    OBJECTS_BY_VOTE_ID: 'objectsByVoteId',
    ACCOUNTS_BALANCE_BY_ACCOUNT_ID: 'accountsBalanceByAccountId',
    ACCOUNTS_BALANCE_BY_ACCOUNT_NAME: 'accountsBalanceByAccountName',
    ACCOUNT_REFERENCES_BY_ACCOUNT_ID: 'accountReferencesByAccountId',
    BALANCE_OBJECTS_BY_BALANCE_ID: 'balanceObjectsByBalanceId',
    GET_ACCOUNT_REFS_OF_ACCOUNTS_CALLS: 'getAccountRefsOfAccountsCalls',
    FULL_ACCOUNTS: 'fullAccounts',
    BIT_ASSETS_BY_BIT_ASSET_ID: 'bitAssetsByBitAssetId',
    DYNAMIC_ASSET_DATA_BY_DYNAMIC_ASSET_DATA_ID:'dynamicAssetDataByDynamicAssetDataId',
    DYNAMIC_ID_TO_ASSET_ID: 'dynamicIdToAssetId',
    BIT_ASSET_ID_TO_ASSET_ID: 'bitAssetIdToAssetId',
    CHAIN_PROPERTIES: 'chainProperties',
    GLOBAL_PROPERTIES: 'globalProperties',
    CONFIG: 'config',
    CHAIN_ID: 'chainId',
    DYNAMIC_GLOBAL_PROPERTIES: 'dynamicGlobalProperties',
}
*/

console.log(constants.OPERATIONS_IDS); // operation id

/*
{
    TRANSFER: 0,
    ACCOUNT_CREATE: 1,
    ACCOUNT_UPDATE: 2,
    ACCOUNT_WHITELIST: 3,
    ACCOUNT_TRANSFER: 4,
    ASSET_CREATE: 5,
    ASSET_UPDATE: 6,
    ASSET_UPDATE_BITASSET: 7,
    ASSET_UPDATE_FEED_PRODUCERS: 8,
    ASSET_ISSUE: 9,
    ASSET_RESERVE: 10,
    ASSET_FUND_FEE_POOL: 11,
    ASSET_PUBLISH_FEED: 12,
    PROPOSAL_CREATE: 13,
    PROPOSAL_UPDATE: 14,
    PROPOSAL_DELETE: 15,
    COMMITTEE_MEMBER_CREATE: 16,
    COMMITTEE_MEMBER_UPDATE: 17,
    COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS: 18,
    VESTING_BALANCE_CREATE: 19,
    VESTING_BALANCE_WITHDRAW: 20,
    BALANCE_CLAIM: 21,
    OVERRIDE_TRANSFER: 22,
    ASSET_CLAIM_FEES: 23,
    CREATE_CONTRACT: 24,
    CALL_CONTRACT: 25,
    CONTRACT_TRANSFER: 26,
    CHANGE_SIDECHAIN_CONFIG: 27,
    ACCOUNT_ADDRESS_CREATE: 28,
    TRANSFER_TO_ADDRESS: 29,
    GENERATE_ETH_ADDRESS: 30,
    CREATE_ETH_ADDRESS: 31,
    DEPOSIT_ETH: 32,
    WITHDRAW_ETH: 33,
    APPROVE_WITHDRAW_ETH: 34,
    CONTRACT_FUND_POOL: 35,
    CONTRACT_WHITELIST: 36,
    SIDECHAIN_ISSUE: 37,
    SIDECHAIN_BURN: 38,
    REGISTER_ERC20_TOKEN: 39,
    DEPOSIT_ERC20_TOKEN: 40,
    WITHDRAW_ERC20_TOKEN: 41,
    APPROVE_ERC20_TOKEN_WITHDRAW: 42,
    CONTRACT_UPDATE: 43,
}
*/
 ```
