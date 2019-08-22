### Cache
To optimize requests we use caches

In following example we import cache and get stored objects.
```javascript
import echo, { constants } from "echojs-lib";

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

#### Set cache options

"isUsed" - a flag that determines whether or not to use the cache;
if it "false" then the cache will not be used;
if not specified, then the default is true.
Values by default: 

| Param | Type |
| --- | --- |
| isUsed | <code>true</code> |
| blocksLimit | <code>20</code> |
| expirationTime | <code>null</code> |
| minCleaningTime | <code>500</code> |

```javascript
import echo from 'echolib-js';
await echo.connect('ws://127.0.0.1:9000', { cache: { isUsed: false } });
```

"blocksLimit" - the maximum number of blocks allows you to store in the cache must be integer.

```javascript
import echo from 'echolib-js';
await echo.connect('ws://127.0.0.1:9000', { cache: { blocksLimit: 10 } });
```

"expirationTime" - after this time, the block will be cleared from the cache;
if "expirationTime" = null, then it will never be cleared.

```javascript
import echo, { constants } from 'echolib-js';
await echo.connect('ws://127.0.0.1:9000', {cache: { expirationTime: 1000 } });
```

"minCleaningTime" - the time after which the block will be cleared from the cache
after the expiration of "minCleaningTime" of the previous block.

```javascript
import echo, { constants } from 'echolib-js';
await echo.connect('ws://127.0.0.1:9000', {cache: { minCleaningTime: 1000 } });
```

> Cache data stored in Immutable.js objects



