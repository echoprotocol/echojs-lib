# Table of contents

- [Cache](#cache)
    - [Cache maps constants](#cache-maps-constants)
    - [Cache options](#cache-options)
        - [isUsed](#isused)
        - [blocksLimit](#blockslimit)
        - [expirationTime](#expirationtime)
        - [minCleaningTime](#mincleaningtime)

### Cache
To optimize requests we use caches

In following example we import cache and get stored objects.
```javascript
import echo, { constants } from "echojs-lib";
```

#### Cache maps constants

```javascript
const { CACHE_MAPS } = constants;

console.log(echo.cache[CACHE_MAPS.OBJECTS_BY_ID]);

console.log(CACHE_MAPS)
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

#### Cache options

| Param | Type | Default Value |
| --- | --- | --- |
| isUsed | `boolean` | `true` |
| blocksLimit | `number | null` | `20` |
| expirationTime | `number | null` |`null` |
| minCleaningTime | `number` | `500` |

##### isUsed

`isUsed` - a flag that determines whether or not to use the cache.

```javascript
import echo from 'echolib-js';
const cacheOptions = { isUsed: false };
await echo.connect('ws://127.0.0.1:9000', { cache: cacheOptions });
```

##### blocksLimit

`blocksLimit` - the maximum number of blocks stored in cache. Must be a non-negative integer.

```javascript
import echo from 'echolib-js';
const cacheOptions = { blocksLimit: 10 };
await echo.connect('ws://127.0.0.1:9000', { cache: cacheOptions });
```

##### expirationTime

`expirationTime` - the time after which the object will be cleared from the cache. If equals to `null`, then it will never be cleared. Blocks will never be cleared this way _(see `isUsed` option)_.

```javascript
import echo from 'echolib-js';
const cacheOptions = { expirationTime: 1e3 };
await echo.connect('ws://127.0.0.1:9000', { cache: cacheOptions });
```

##### minCleaningTime

`minCleaningTime` - the minimal time after which objects will be cleared using `expirationTime`.

```javascript
import echo from 'echolib-js';
const cacheOptions = { minCleaningTime: 200 };
await echo.connect('ws://127.0.0.1:9000', { cache: cacheOptions });
```

> Cache data stored in Immutable.js objects
