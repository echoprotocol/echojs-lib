### Constants

List of constants which we provide

 ```javascript
 import { constants } from 'echojs-lib';

console.log(constants.CHAIN_TYPES) // information about ids

/*
{
    RESERVED_SPACE_ID: {
        RELATIVE_PROTOCOL: 0,
        PROTOCOL: 1,
        IMPLEMENTATION: 2,
    },
    IMPLEMENTATION_OBJECT_TYPE_ID: {
        GLOBAL_PROPERTY: 0,
        DYNAMIC_GLOBAL_PROPERTY: 1,
        ASSET_DYNAMIC_DATA: 2,
        ASSET_BITASSET_DATA: 3,
        ACCOUNT_BALANCE: 4,
        ACCOUNT_STATISTICS: 5,
        TRANSACTION: 6,
        BLOCK_SUMMARY: 7,
        ACCOUNT_TRANSACTION_HISTORY: 8,
        CHAIN_PROPERTY: 9,
        BUDGET_RECORD: 10,
        SPECIAL_AUTHORITY: 11,
        CONTRACT_BALANCE: 12,
        CONTRACT_HISTORY: 13,
        CONTRACT_STATISTICS: 14,
        ACCOUNT_ADDRESS: 15,
        CONTRACT_POOL: 16,
        MALICIOUS_COMMITTEEMEN: 17,
    },
    VOTE_TYPE_ID: {
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
    ASSET_CREATE: 4,
    ASSET_UPDATE: 5,
    ASSET_UPDATE_BITASSET: 6,
    ASSET_UPDATE_FEED_PRODUCERS: 7,
    ASSET_ISSUE: 8,
    ASSET_RESERVE: 9,
    ASSET_FUND_FEE_POOL: 10,
    ASSET_PUBLISH_FEED: 11,
    PROPOSAL_CREATE: 12,
    PROPOSAL_UPDATE: 13,
    PROPOSAL_DELETE: 14,
    COMMITTEE_MEMBER_CREATE: 15,
    COMMITTEE_MEMBER_UPDATE: 16,
    COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS: 17,
    VESTING_BALANCE_CREATE: 18,
    VESTING_BALANCE_WITHDRAW: 19,
    BALANCE_CLAIM: 20,
    BALANCE_FREEZE: 21,
    OVERRIDE_TRANSFER: 22,
    ASSET_CLAIM_FEES: 23,
    CONTRACT_CREATE: 24,
    CONTRACT_CALL: 25,
    CONTRACT_TRANSFER: 26,
    CONTRACT_UPDATE: 27,
    ACCOUNT_ADDRESS_CREATE: 28,
    TRANSFER_TO_ADDRESS: 29,
    SIDECHAIN_ETH_CREATE_ADDRESS: 30,
    SIDECHAIN_ETH_APPROVE_ADDRESS: 31,
    SIDECHAIN_ETH_DEPOSIT: 32,
    SIDECHAIN_ETH_WITHDRAW: 33,
    SIDECHAIN_ETH_APPROVE_WITHDRAW: 34,
    CONTRACT_FUND_POOL: 35,
    CONTRACT_WHITELIST: 36,
    SIDECHAIN_ETH_ISSUE: 37,
    SIDECHAIN_ETH_BURN: 38,
    SIDECHAIN_ERC20_REGISTER_TOKEN: 39,
    SIDECHAIN_ERC20_DEPOSIT_TOKEN: 40,
    SIDECHAIN_ERC20_WITHDRAW_TOKEN: 41,
    SIDECHAIN_ERC20_APPROVE_TOKEN_WITHDRAW: 42,
    SIDECHAIN_ERC20_ISSUE: 43,
    SIDECHAIN_ERC20_BURN: 44,
    SIDECHAIN_BTC_CREATE_ADDRESS: 45,
    SIDECHAIN_BTC_INTERMEDIATE_DEPOSIT: 46,
    SIDECHAIN_BTC_DEPOSIT: 47,
    SIDECHAIN_BTC_WITHDRAW: 48,
    SIDECHAIN_BTC_APPROVE_WITHDRAW: 49,
    SIDECHAIN_BTC_AGGREGATE: 50,
}
*/
 ```
