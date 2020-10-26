## Table of contents

- [Constants](#constants)
    - [Chain types](#chain-types)
    - [Chain config](#chain-config)
    - [WS constants](#ws-constants)
    - [Start operation id](#start-operation-id)
    - [Core asset id](#core-asset-id)
    - [Echorand types](#echorand-types)
    - [Cancel limit order](#cancel-limit-order)
    - [Update call order](#update-call-order)
    - [Close call order](#close-call-order)
    - [Bitasset update](#bitasset-update)
    - [Cache maps](#cache-maps)
    - [Operations ids](#operations-ids)

### Constants

List of constants which we provide

```javascript
 import { constants } from 'echojs-lib';
```

#### Chain types

```javascript
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
        TRANSACTION_DEDUPE: 6,
        BLOCK_SUMMARY: 7,
        ACCOUNT_TRANSACTION_HISTORY: 8,
        CHAIN_PROPERTY: 9,
        SPECIAL_AUTHORITY: 10,
        CONTRACT_BALANCE: 11,
        CONTRACT_HISTORY: 12,
        CONTRACT_STATISTICS: 13,
        ACCOUNT_ADDRESS: 14,
        CONTRACT_POOL: 15,
        MALICIOUS_COMMITTEEMEN: 16,
        INCENTIVES_POOL: 17,
    },
    VOTE_TYPE_ID: {
        COMMITTEE: 0,
    },
}
*/
```

#### Chain config

```javascript
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
```
 
#### WS constants
 
```javascript
console.log(constants.WS_CONSTANTS) // websocket constants

/*
{
    CONNECTION_TIMEOUT: 5000,
    MAX_RETRIES: 1000,
    PING_TIMEOUT: 10000,
    PING_DELAY: 10000,
    DEBUG: false,
    CONNECTION_CLOSED_ERROR_MESSAGE: 'connection closed',
    CHAIN_API: {
        DATABASE_API: 'database',
        NETWORK_BROADCAST_API: 'network_broadcast',
        HISTORY_API: 'history',
        REGISTRATION_API: 'registration',
        ASSET_API: 'asset',
        LOGIN_API: 'login',
        NETWORK_NODE_API: 'network_node',
        ECHORAND_API: 'echorand',
        DID_API: 'did'
    },
    CHAIN_APIS: [
        CHAIN_API.DATABASE_API,
        CHAIN_API.NETWORK_BROADCAST_API,
        CHAIN_API.HISTORY_API,
        CHAIN_API.REGISTRATION_API,
        CHAIN_API.ASSET_API,
        CHAIN_API.LOGIN_API,
        CHAIN_API.NETWORK_NODE_API,
        CHAIN_API.ECHORAND_API,
        CHAIN_API.DID_API
    ],
    DEFAULT_CHAIN_APIS: [
        CHAIN_API.DATABASE_API,
        CHAIN_API.NETWORK_BROADCAST_API,
        CHAIN_API.HISTORY_API,
        CHAIN_API.LOGIN_API,
    ],
    STATUS: { OPEN: 'OPEN', ERROR: 'ERROR', CLOSE: 'CLOSE' },
}
*/
```

#### Start operation id

```javascript
console.log(constants.START_OPERATION_ID) // start operation id

/*
    1.10.0
*/
```

#### Core asset id

```javascript
console.log(constants.CORE_ASSET_ID) // core asset id

/*
    1.3.0
*/
```

#### Echorand types

```javascript
console.log(constants.ECHORAND_TYPES)

/*
{
    START_NOTIFICATION: 1,
    BLOCK_NOTIFICATION: 2,
}
*/
```

#### Cancel limit order

```javascript
console.log(constants.CANCEL_LIMIT_ORDER)

/*
    cancel-limit-order
*/
```

#### Update call order

```javascript
console.log(constants.UPDATE_CALL_ORDER)

/*
    update-call-order
*/
```

#### Close call order

```javascript
console.log(constants.CLOSE_CALL_ORDER)

/*
    close-call-order
*/
```

#### Bitasset update

```javascript
console.log(constants.BITASSET_UPDATE)

/*
    bitasset-update
*/
```

#### Cache maps

```javascript
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
```

#### Operations ids

```javascript
console.log(constants.OPERATIONS_IDS); // operation id

/*
{
    TRANSFER: 0,
    TRANSFER_TO_ADDRESS: 1,
    OVERRIDE_TRANSFER: 2,
    ACCOUNT_CREATE: 3,
    ACCOUNT_UPDATE: 4,
    ACCOUNT_WHITELIST: 5,
    ACCOUNT_ADDRESS_CREATE: 6,
    ASSET_CREATE: 7,
    ASSET_UPDATE: 8,
    ASSET_UPDATE_BITASSET: 9,
    ASSET_UPDATE_FEED_PRODUCERS: 10,
    ASSET_ISSUE: 11,
    ASSET_RESERVE: 12,
    ASSET_FUND_FEE_POOL: 13,
    ASSET_PUBLISH_FEED: 14,
    ASSET_CLAIM_FEES: 15,
    PROPOSAL_CREATE: 16,
    PROPOSAL_UPDATE: 17,
    PROPOSAL_DELETE: 18,
    COMMITTEE_MEMBER_CREATE: 19,
    COMMITTEE_MEMBER_UPDATE: 20,
    COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS: 21,
    COMMITTEE_MEMBER_ACTIVATE: 22,
    COMMITTEE_MEMBER_DEACTIVATE: 23,
    COMMITTEE_FROZEN_BALANCE_DEPOSIT: 24,
    COMMITTEE_FROZEN_BALANCE_WITHDRAW: 25,
    VESTING_BALANCE_CREATE: 26,
    VESTING_BALANCE_WITHDRAW: 27,
    BALANCE_CLAIM: 28,
    BALANCE_FREEZE: 29,
    BALANCE_UNFREEZE: 30,
    REQUEST_BALANCE_UNFREEZE: 31,
    CONTRACT_CREATE: 32,
    CONTRACT_CALL: 33,
    CONTRACT_INTERNAL_CREATE: 34, // VIRTUAL
    CONTRACT_INTERNAL_CALL: 35, // VIRTUAL
    CONTRACT_SELFDESTRUCT: 36, // VIRTUAL
    CONTRACT_UPDATE: 37,
    CONTRACT_FUND_POOL: 38,
    CONTRACT_WHITELIST: 39,
    SIDECHAIN_ETH_CREATE_ADDRESS: 40,
    SIDECHAIN_ETH_APPROVE_ADDRESS: 41,
    SIDECHAIN_ETH_DEPOSIT: 42,
    SIDECHAIN_ETH_SEND_DEPOSIT = 43,
    SIDECHAIN_ETH_WITHDRAW = 44,
    SIDECHAIN_ETH_SEND_WITHDRAW = 45,
    SIDECHAIN_ETH_APPROVE_WITHDRAW = 46,
    SIDECHAIN_ETH_UPDATE_CONTRACT_ADDRESS = 47,
    SIDECHAIN_ISSUE = 48, // VIRTUAL
    SIDECHAIN_BURN = 49, // VIRTUAL
    SIDECHAIN_ERC20_REGISTER_TOKEN = 50,
    SIDECHAIN_ERC20_DEPOSIT_TOKEN = 51,
    SIDECHAIN_ERC20_SEND_DEPOSIT_TOKEN = 52,
    SIDECHAIN_ERC20_WITHDRAW_TOKEN = 53,
    SIDECHAIN_ERC20_SEND_WITHDRAW_TOKEN = 54,
    SIDECHAIN_ERC20_APPROVE_TOKEN_WITHDRAW = 55,
    SIDECHAIN_ERC20_ISSUE = 56, // VIRTUAL
    SIDECHAIN_ERC20_BURN = 57, // VIRTUAL
    SIDECHAIN_BTC_CREATE_ADDRESS = 58,
    SIDECHAIN_BTC_CREATE_INTERMEDIATE_DEPOSIT = 59,
    SIDECHAIN_BTC_INTERMEDIATE_DEPOSIT = 60,
    SIDECHAIN_BTC_DEPOSIT = 61,
    SIDECHAIN_BTC_WITHDRAW = 62,
    SIDECHAIN_BTC_AGGREGATE = 63,
    SIDECHAIN_BTC_APPROVE_AGGREGATE = 64,
    BLOCK_REWARD = 65,// VIRTUAL
    EVM_ADDRESS_REGISTER = 66,
    DID_CREATE_OPERATION = 67,
    DID_UPDATE_OPERATION = 68,
    DID_DELETE_OPERATION = 69,
}
*/
 ```
