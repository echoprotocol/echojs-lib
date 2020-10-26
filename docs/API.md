# Table of contents

- [Api](#api)
- [Classes](#classes)
- [Functions](#functions)
- [Typedefs](#typedefs)

### Api
This library provides api blockchain methods.

To fetch objects you can use `Api`:
```javascript
import echo from 'echojs-lib';

try {
    await echo.connect('ws://127.0.0.1:9000');
    const result = await echo.api.getAssets(['1.3.0']);
    console.log(result);
} catch (e) {
    console.error(e);
}
```
## Classes

<dl>
<dt><a href="#APIInstance">API instance</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#getObjects">getObjects(objectIds, force)</a> ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#getObject">getObject(objectId, force)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd></dd>
<dt><a href="#checkERC20Token">checkERC20Token(contractId)</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd></dd>
<dt><a href="#getBlockHeader">getBlockHeader(blockNum)</a> ⇒ <code><a href="#BlockHeader">Promise.&lt;BlockHeader&gt;</a></code></dt>
<dd></dd>
<dt><a href="#getBlock">getBlock(blockNum)</a> ⇒ <code><a href="#Block">Promise.&lt;Block&gt;</a></code></dt>
<dd></dd>
<dt><a href="#getTransaction">getTransaction(blockNum, transactionIndex)</a> ⇒ <code><a href="#Transaction">Promise.&lt;Transaction&gt;</a></code></dt>
<dd></dd>
<dt><a href="#getChainProperties">getChainProperties(force)</a> ⇒ <code><a href="#ChainProperties">Promise.&lt;ChainProperties&gt;</a></code></dt>
<dd></dd>
<dt><a href="#getGlobalProperties">getGlobalProperties()</a> ⇒ <code><a href="#GlobalProperties">Promise.&lt;GlobalProperties&gt;</a></code></dt>
<dd></dd>
<dt><a href="#getConfig">getConfig(force)</a> ⇒ <code><a href="#Config">Promise.&lt;Config&gt;</a></code></dt>
<dd></dd>
<dt><a href="#getChainId">getChainId(force)</a> ⇒ <code>Promise.&lt;String&gt;</code></dt>
<dd></dd>
<dt><a href="#getDynamicGlobalProperties">getDynamicGlobalProperties()</a> ⇒ <code><a href="#DynamicGlobalProperties">Promise.&lt;DynamicGlobalProperties&gt;</a></code></dt>
<dd></dd>
<dt><a href="#getKeyReferences">getKeyReferences(keys, force)</a> ⇒ <code>Promise.&lt;Array.&lt;*&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#getAccounts">getAccounts(accountIds, force)</a> ⇒ <code>Promise.&lt;Array.&lt;Account&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#getFullAccounts">getFullAccounts(accountNamesOrIds, subscribe, force)</a> ⇒ <code>Promise.&lt;Array.&lt;FullAccount&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#getAccountByName">getAccountByName(accountName, force)</a> ⇒ <code><a href="#Account">Promise.&lt;Account&gt;</a></code></dt>
<dd></dd>
<dt><a href="#getAccountReferences">getAccountReferences(accountId, force)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd></dd>
<dt><a href="#lookupAccountNames">lookupAccountNames(accountNames, force)</a> ⇒ <code>Promise.&lt;Array.&lt;Account&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#lookupAccounts">lookupAccounts(lowerBoundName, limit)</a> ⇒ <code>Promise.&lt;Array.&lt;AccountName, AccountId&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#getAccountCount">getAccountCount()</a> ⇒ <code>Promise.&lt;Number&gt;</code></dt>
<dd></dd>
<dt><a href="#getAccountBalances">getAccountBalances(accountId, assetIds, force)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd></dd>
<dt><a href="#getNamedAccountBalances">getNamedAccountBalances(accountName, assetIds, force)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd></dd>
<dt><a href="#getVestedBalances">getVestedBalances(balanceIds)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getVestingBalances">getVestingBalances(accountId)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getAssets">getAssets(assetIds, force)</a> ⇒ <code>Promise.&lt;Array.&lt;Asset&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#listAssets">listAssets(lowerBoundSymbol, limit)</a> ⇒ <code>Promise.&lt;Array.&lt;Asset&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#lookupAssetSymbols">lookupAssetSymbols(symbolsOrIds, force)</a> ⇒ <code>Promise.&lt;Array.&lt;Asset&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#getMarginPositions">getMarginPositions(accountId)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getTicker">getTicker(baseAssetName, quoteAssetName)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#get24Volume">get24Volume(baseAssetName, quoteAssetName)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getTradeHistory">getTradeHistory(baseAssetName, quoteAssetName, start, stop, limit)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getCommitteeMembers">getCommitteeMembers(committeeMemberIds, force)</a> ⇒ <code>Promise.&lt;Array.&lt;Committee&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#getCommitteeMemberByAccount">getCommitteeMemberByAccount(accountId, force)</a> ⇒ <code><a href="#Committee">Promise.&lt;Committee&gt;</a></code></dt>
<dd></dd>
<dt><a href="#lookupCommitteeMemberAccounts">lookupCommitteeMemberAccounts(lowerBoundName, limit)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getTransactionHex">getTransactionHex(transaction)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getRequiredSignatures">getRequiredSignatures(transaction, availableKeys)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getPotentialSignatures">getPotentialSignatures(transaction)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#verifyAuthority">verifyAuthority(transaction)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#verifyAccountAuthority">verifyAccountAuthority(accountNameOrId, signers)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#validateTransaction">validateTransaction(transaction)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getRequiredFees">getRequiredFees(operations, assetId)</a> ⇒ <code>Promise.&lt;Array.&lt;{asset_id:String, amount:Number}&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#getProposedTransactions">getProposedTransactions(accountNameOrId)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getContractLogs">getContractLogs(opts: { contracts, topics, fromBlock, toBlock })</a> ⇒ <code>Promise.&lt;Array.&lt;ContractLogs&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#getContractResult">getContractResult(resultContractId, force)</a> ⇒ <code><a href="#ContractResult">Promise.&lt;ContractResult&gt;</a></code></dt>
<dd></dd>
<dt><a href="#getContract">getContract(contractId, force)</a> ⇒ <code>Promise.&lt;[0, { code:String, storage:Array.<Array>}] | [1, { code:String }]&gt;</code></dt>
<dd></dd>
<dt><a href="#callContractNoChangingState">callContractNoChangingState(contractId, caller, asset, code)</a> ⇒ <code>Promise.&lt;String&gt;</code></dt>
<dd></dd>
<dt><a href="#getContracts">getContracts(contractIds, force)</a> ⇒ <code>Promise.&lt;Array.&lt;{id:String, statistics:String, suicided:Boolean}&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#getContractBalances">getContractBalances(contractId, force)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd></dd>
<dt><a href="#getRecentTransactionById">getRecentTransactionById(transactionId)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getFeePool">getFeePool(assetId)</a> ⇒ <code>Promise.&lt;BigNumber&gt;</code></dt>
<dd></dd>
<dt><a href="#broadcastTransactionWithCallback">broadcastTransactionWithCallback(signedTransactionObject, wasBroadcastedCallback)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>1
<dd></dd>
<dt><a href="#registerAccount">registerAccount(name, activeKey, echoRandKey, wasBroadcastedCallback)</a> ⇒ <code>Promise.&lt;[{ block_num: number, tx_id: string }]&gt;</code></dt>
<dd></dd>
<dt><a href="#getAccountHistory
 Get operations relevant to the specified account.">getAccountHistory
 Get operations relevant to the specified account.(accountId, stop, limit, start)</a> ⇒ <code>Promise.&lt;Array.&lt;AccountHistory&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#getRelativeAccountHistory
 Get operations relevant to the specified account referenced
 by an event numbering specific to the account.">getRelativeAccountHistory
 Get operations relevant to the specified account referenced
 by an event numbering specific to the account.(accountId, stop, limit, start)</a> ⇒ <code>Promise.&lt;Array.&lt;AccountHistory&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#getAccountHistoryOperations
 Get only asked operations relevant to the specified account.">getAccountHistoryOperations
 Get only asked operations relevant to the specified account.(accountId, operationId, start, stop, limit)</a> ⇒ <code>Promise.&lt;Array.&lt;AccountHistory&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#getContractHistory
 Get operations relevant to the specified account.">getContractHistory
 Get operations relevant to the specified account.(contractId, stop, limit, start)</a> ⇒ <code>Promise.&lt;Array.&lt;ContractHistory&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#getFullContract
 Get full contract info.">getFullContract
 Get full contract info.(contractId, force)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd></dd>
<dt><a href="#broadcastTransaction
	Broadcast a transaction to the network.">broadcastTransaction
	Broadcast a transaction to the network.(tr)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#broadcastBlock
	Broadcast a block to the network.">broadcastBlock
	Broadcast a block to the network.(block)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getAssetHolders
 Retrieve the information about the holders of the specified asset.">getAssetHolders
 Retrieve the information about the holders of the specified asset.(assetId, start, limit)</a> ⇒ <code>Promise.&lt;Array.&lt;{name: String, account_id:String, amount: String}&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#getAssetHoldersCount
 Retrieve the number of holders of the provided asset.">getAssetHoldersCount
 Retrieve the number of holders of the provided asset.(assetId)</a> ⇒ <code>Promise.&lt;Number&gt;</code></dt>
<dd></dd>
<dt><a href="#getAllAssetHolders
 Array of all asset IDs with the number of holders.">getAllAssetHolders
 Array of all asset IDs with the number of holders.()</a> ⇒ <code>Promise.&lt;Array.&lt;{asset_id: String, count: Number}&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#getBalanceObjects">getBalanceObjects(keys)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getBlockVirtualOperations">getBlockVirtualOperations(blockNum)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getFrozenBalances">getFrozenBalances(AccountId)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getBtcAddresses">getBtcAddresses(AccountId)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getBtcDepositScript">getBtcDepositScript(AccountId)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#requestRegistrationTask">requestRegistrationTask()</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getCommitteeFrozenBalance">getCommitteeFrozenBalance()</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getRegistrar">getRegistrar()</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getDidObject">getDidObject(id)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getKey">getKey(idString)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getKeys">getKeys(idString)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#BlockHeader">BlockHeader</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Block">Block</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Transaction">Transaction</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ChainProperties">ChainProperties</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#GlobalProperties">GlobalProperties</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Config">Config</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#DynamicGlobalProperties">DynamicGlobalProperties</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Committee">Committee</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Account">Account</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#AccountHistory">AccountHistory</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#FullAccount">FullAccount</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Asset">Asset</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Vote">Vote</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ContractLogs">ContractLogs</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ContractResult">ContractResult</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#AccountName">AccountName</a> : <code>String</code></dt>
<dd></dd>
<dt><a href="#AccountId">AccountId</a> : <code>String</code></dt>
<dd></dd>
<dt><a href="#SidechainTransfer">SidechainTransfer</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ContractHistory">ContractHistory</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="APIInstance"></a>

## API instance
**Kind**: global class
<a name="new_API_new"></a>

### new API(cache, wsApi)

| Param | Type |
| --- | --- |
| cache | <code>Cache</code> |
| wsApi | <code>WSAPI</code> |

<a name="getObjects"></a>

## getObjects(objectIds, force) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| objectIds | <code>Array.&lt;String&gt;</code> | [Id of the objects to retrieve] |
| force | <code>Boolean</code> | [If force equal to true then he will first see if you have this object in the cache] |

<a name="getObject"></a>

## getObject(objectId, force) ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| objectId | <code>String</code> | [Id of the object to retrieve] |
| force | <code>Boolean</code> | [If force equal to true then he will first see if you have this object in the cache] |

<a name="checkERC20Token"></a>

## checkERC20Token(contractId) ⇒ <code>Promise.&lt;Boolean&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| contractId | <code>String</code> | [Id of the contract to checking] |

<a name="getBlockHeader"></a>

## getBlockHeader(blockNum) ⇒ [<code>Promise.&lt;BlockHeader&gt;</code>](#BlockHeader)
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| blockNum | <code>Number</code> | [Number of the block to retrieve header  (non negative integer)] |

<a name="getBlock"></a>

## getBlock(blockNum) ⇒ [<code>Promise.&lt;Block&gt;</code>](#Block)
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| blockNum | <code>Number</code> | [Number of the block to retrieve (non negative integer)] |

<a name="getTransaction"></a>

## getTransaction(blockNum, transactionIndex) ⇒ [<code>Promise.&lt;Transaction&gt;</code>](#Transaction)
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| blockNum | <code>Number</code> | [Number of the block to retrieve  (non negative integer)] |
| transactionIndex | <code>Number</code> | [Index of the transaction to retrieve (non negative integer)] |

<a name="getChainProperties"></a>

## getChainProperties(force) ⇒ [<code>Promise.&lt;ChainProperties&gt;</code>](#ChainProperties)
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| force | <code>Boolean</code> | [If force equal to true then he will first see if you have this object in the cache] |

<a name="getGlobalProperties"></a>

## getGlobalProperties() ⇒ [<code>Promise.&lt;GlobalProperties&gt;</code>](#GlobalProperties)
**Kind**: global function
<a name="getConfig"></a>

## getConfig(force) ⇒ [<code>Promise.&lt;Config&gt;</code>](#Config)
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| force | <code>Boolean</code> | [If force equal to true then he will first see if you have this object in the cache] |

<a name="getChainId"></a>

## getChainId(force) ⇒ <code>Promise.&lt;String&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| force | <code>Boolean</code> | [If force equal to true then he will first see if you have this object in the cache] |

<a name="getDynamicGlobalProperties"></a>

## getDynamicGlobalProperties() ⇒ [<code>Promise.&lt;DynamicGlobalProperties&gt;</code>](#DynamicGlobalProperties)
**Kind**: global function
<a name="getKeyReferences"></a>

## getKeyReferences(keys, force) ⇒ <code>Promise.&lt;Array.&lt;\*&gt;&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| keys | <code>List.&lt;String&gt;</code> | [public keys (string in bs58 with prefix "ECHO")] |
| force | <code>Boolean</code> | [If force equal to true then he will first see if you have this object in the cache] |

<a name="getAccounts"></a>

## getAccounts(accountIds, force) ⇒ <code>Promise.&lt;Array.&lt;Account&gt;&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| accountIds | <code>Array.&lt;String&gt;</code> | [Id of the accounts to retrieve] |
| force | <code>Boolean</code> | [If force equal to true then he will first see if you have this object in the cache] |

<a name="getFullAccounts"></a>

## getFullAccounts(accountNamesOrIds, subscribe, force) ⇒ <code>Promise.&lt;Array.&lt;FullAccount&gt;&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| accountNamesOrIds | <code>Array.&lt;String&gt;</code> | [Id or names of the accounts to retrieve] |
| subscribe | <code>Boolean</code> | [Subscribe to change this account or not] |
| force | <code>Boolean</code> | [If force equal to true then he will first see if you have this object in the cache] |

<a name="getAccountByName"></a>

## getAccountByName(accountName, force) ⇒ [<code>Promise.&lt;Account&gt;</code>](#Account)
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| accountName | <code>String</code> | [Name of the account to retrieve. Min length - 1, max - 63] |
| force | <code>Boolean</code> | [If force equal to true then he will first see if you have this object in the cache] |

<a name="getAccountReferences"></a>

## getAccountReferences(accountId, force) ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| accountId | <code>String</code> | [Id of the account to retrieve his references] |
| force | <code>Boolean</code> | [If force equal to true then he will first see if you have this object in the cache] |

<a name="lookupAccountNames"></a>

## lookupAccountNames(accountNames, force) ⇒ <code>Promise.&lt;Array.&lt;Account&gt;&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| accountNames | <code>Array.&lt;String&gt;</code> | [Names of the accounts to retrieve accounts. Min length of name - 1, max - 63] |
| force | <code>Boolean</code> | [If force equal to true then he will first see if you have this object in the cache] |

<a name="lookupAccounts"></a>

## lookupAccounts(lowerBoundName, limit) ⇒ <code>Promise.&lt;Array.&lt;AccountName, AccountId&gt;&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| lowerBoundName | <code>String</code> |  [Name of the earliest account to retrieve] |
| limit | <code>Number</code> | [count operations (max 1000)] |

<a name="getAccountCount"></a>

## getAccountCount() ⇒ <code>Promise.&lt;Number&gt;</code>
**Kind**: global function
<a name="getAccountBalances"></a>

## getAccountBalances(accountId, assetIds, force) ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| accountId | <code>String</code> | [Id of the account to retrieve balances] |
| assetIds | <code>Array.&lt;String&gt;</code> | [Ids of the asset to retrieve balances] |
| force | <code>Boolean</code> | [If force equal to true then he will first see if you have this object in the cache] |

<a name="getNamedAccountBalances"></a>

## getNamedAccountBalances(accountName, assetIds, force) ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| accountName | <code>String</code> | [Name of the account to retrieve balances. Min length - 1, max - 63] |
| assetIds | <code>Array.&lt;String&gt;</code> | [Ids of the asset to retrieve balances] |
| force | <code>Boolean</code> | [If force equal to true then he will first see if you have this object in the cache] |

<a name="getVestedBalances"></a>

## getVestedBalances(balanceIds) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| balanceIds | <code>Array.&lt;String&gt;</code> | [Ids of the balance to retrieve vested balances] |

<a name="getVestingBalances"></a>

## getVestingBalances(accountId) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| accountId | <code>String</code> | [Id of the account to retrieve vesting balance] |

<a name="getAssets"></a>

## getAssets(assetIds, force) ⇒ <code>Promise.&lt;Array.&lt;Asset&gt;&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| assetIds | <code>Array.&lt;String&gt;</code> | [Ids of the assets to retrieve] |
| force | <code>Boolean</code> | [If force equal to true then he will first see if you have this object in the cache] |

<a name="listAssets"></a>

## listAssets(lowerBoundSymbol, limit) ⇒ <code>Promise.&lt;Array.&lt;Asset&gt;&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| lowerBoundSymbol | <code>String</code> |  [Symbol of the earliest asset to retrieve] |
| limit | <code>Number</code> | [count operations (max 100)] |

<a name="lookupAssetSymbols"></a>

## lookupAssetSymbols(symbolsOrIds, force) ⇒ <code>Promise.&lt;Array.&lt;Asset&gt;&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| symbolsOrIds | <code>Array.&lt;String&gt;</code> | [Symbols or Ids of the assets to retrieve] |
| force | <code>Boolean</code> | [If force equal to true then he will first see if you have this object in the cache] |

<a name="getMarginPositions"></a>

## getMarginPositions(accountId) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| accountId | <code>String</code> | [Id of the account to retrieve] |

<a name="getTicker"></a>

## getTicker(baseAssetName, quoteAssetName) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| baseAssetName | <code>String</code> | [Name of the base asset] |
| quoteAssetName | <code>String</code> | [Name of the quote asset] |

<a name="get24Volume"></a>

## get24Volume(baseAssetName, quoteAssetName) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| baseAssetName | <code>String</code> | [Name of the base asset] |
| quoteAssetName | <code>String</code> | [Name of the quote asset] |

<a name="getTradeHistory"></a>

## getTradeHistory(baseAssetName, quoteAssetName, start, stop, limit) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| baseAssetName | <code>String</code> | [Name of the base asset] |
| quoteAssetName | <code>String</code> | [Name of the quote asset] |
| start | <code>Number</code> | [Id of the earliest operation to retrieve] |
| stop | <code>Number</code> | [Id of the most recent operation to retrieve] |
| limit | <code>Number</code> | [count operations (max 100)] |

<a name="getCommitteeMembers"></a>

## getCommitteeMembers(committeeMemberIds, force) ⇒ <code>Promise.&lt;Array.&lt;Committee&gt;&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| committeeMemberIds | <code>Array.&lt;String&gt;</code> | [Ids of the committee members to retrieve] |
| force | <code>Boolean</code> | [If force equal to true then he will first see if you have this object in the cache] |

<a name="getCommitteeMemberByAccount"></a>

## getCommitteeMemberByAccount(accountId, force) ⇒ [<code>Promise.&lt;Committee&gt;</code>](#Committee)
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| accountId | <code>String</code> | [Id of the account to retrieve] |
| force | <code>Boolean</code> | [If force equal to true then he will first see if you have this object in the cache] |

<a name="lookupCommitteeMemberAccounts"></a>

## lookupCommitteeMemberAccounts(lowerBoundName, limit) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| lowerBoundName | <code>String</code> |  [Name of the earliest committee member to retrieve] |
| limit | <code>Number</code> | [count operations (max 1000)] |

<a name="getTransactionHex"></a>

## getTransactionHex(transaction) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| transaction | <code>Object</code> | [Transaction to retrieve] |

<a name="getRequiredSignatures"></a>

## getRequiredSignatures(transaction, availableKeys) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| transaction | <code>Object</code> | [Transaction to retrieve] |
| availableKeys | <code>Array.&lt;String&gt;</code> | [public keys (string in bs58 with prefix "ECHO")] |

<a name="getPotentialSignatures"></a>

## getPotentialSignatures(transaction) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| transaction | <code>Object</code> | [Transaction to retrieve] |

<a name="verifyAuthority"></a>

## verifyAuthority(transaction) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| transaction | <code>Object</code> | [Transaction to retrieve] |

<a name="verifyAccountAuthority"></a>

## verifyAccountAuthority(accountNameOrId, signers) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| accountNameOrId | <code>String</code> | [Id or name of the account to verify] |
| signers | <code>Array.&lt;String&gt;</code> | [public keys (string in bs58 with prefix "ECHO")] |

<a name="validateTransaction"></a>

## validateTransaction(transaction) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| transaction | <code>Object</code> | [Transaction to retrieve] |

<a name="getRequiredFees"></a>

## getRequiredFees(operations, assetId) ⇒ <code>Promise.&lt;Array.&lt;{asset\_id:String, amount:Number}&gt;&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| operations | <code>Array.&lt;Object&gt;</code> | [Operations to retrieve] |
| assetId | <code>String</code> | [Id of the asset to retrieve] |

<a name="getProposedTransactions"></a>

## getProposedTransactions(accountNameOrId) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| accountNameOrId | <code>String</code> | [Id or name of the account to retrieve transactions] |

<a name="getContractLogs"></a>

## getContractLogs(opts: { contracts, topics, fromBlock, toBlock }) ⇒ <code>Promise.&lt;Array.&lt;ContractLogs&gt;&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| contracts | <code>Array.&lt;String&gt;</code> | [Ids of the contracts to retrieve] |
| topics | <code>Array.&lt;String&gt;</code> | [Array of topics] |
| fromBlock | <code>Number</code> | [Block number from which to retrieve (non negative integer)] |
| toBlock | <code>Number</code> | [Block number to which retrieve (non negative integer)] |

<a name="getContractResult"></a>

## getContractResult(resultContractId, force) ⇒ [<code>Promise.&lt;ContractResult&gt;</code>](#ContractResult)
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| resultContractId | <code>String</code> | [Id of the contract result to retrieve] |
| force | <code>Boolean</code> | [If force equal to true then he will first see if you have this object in the cache] |

<a name="getContract"></a>

## getContract(contractId, force) ⇒ <code>Promise.&lt;[0, { code:String, storage:Array.<Array>}] | [1, { code:String }]&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| contractId | <code>String</code> | [Id of the contract to retrieve] |
| force | <code>Boolean</code> | [If force equal to true then he will first see if you have this object in the cache] |

<a name="callContractNoChangingState"></a>

## callContractNoChangingState(contractId, caller, asset, code) ⇒ <code>Promise.&lt;String&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| contractId | <code>String</code> | [Id of the contract to call] |
| caller | <code>String</code> | [Id of the account or contract for which the call will being simulated] |
| asset | <code>{ asset_id: string, amount: number | string | BigNumber }</code> | [Asset with which the call will being simulated] |
| code | <code>String</code> | [The code of the method to call] |

<a name="getContracts"></a>

## getContracts(contractIds, force) ⇒ <code>Promise.&lt;Array.&lt;{id:String, statistics:String, suicided:Boolean}&gt;&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| contractIds | <code>Array.&lt;String&gt;</code> | [Ids of the contracts to retrieve] |
| force | <code>Boolean</code> | [If force equal to true then he will first see if you have this object in the cache] |

<a name="getContractBalances"></a>

## getContractBalances(contractId, force) ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| contractId | <code>String</code> | [Id of the contract to retrieve] |
| force | <code>Boolean</code> | [If force equal to true then he will first see if you have this object in the cache] |

<a name="getRecentTransactionById"></a>

## getRecentTransactionById(transactionId) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| transactionId | <code>String</code> | [Id of the transaction to retrieve] |

<a name="getFeePool"></a>

## getFeePool(assetId) ⇒ <code>Promise.&lt;BigNumber&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| assetId | <code>String</code> | [Id of the asset to retrieve] |

<a name="broadcastTransactionWithCallback"></a>

## broadcastTransactionWithCallback(signedTransactionObject, wasBroadcastedCallback) ⇒ <code>Promise.&lt;*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| signedTransactionObject | <code>Object</code> | [Signed transaction] |
| wasBroadcastedCallback | <code>Function</code> | [The callback method that will be called when the transaction is included into a block. The callback method includes the transaction id, block number, and transaction number in the block] |

<a name="registerAccount"></a>

## registerAccount(name, activeKey, echoRandKey, wasBroadcastedCallback) ⇒ <code>Promise&lt;[{ block_num: number, tx_id: string }]&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | [The name of the account, must be unique. Shorter names are more expensive to register] |
| activeKey | <code>String</code> | [string in bs58 with prefix "ECHO"] |
| echoRandKey | <code>String</code> | [string in bs58 with prefix "ECHO"] |
| wasBroadcastedCallback | <code>Function</code> |  [The callback method that will be called when the transaction is included into a block. The callback method includes the transaction id, block number, and transaction number in the block] |


<a name="getAccountHistory"></a>

## getAccountHistory(accountId, stop, limit, start) ⇒ <code>Promise.&lt;Array.&lt;AccountHistory&gt;&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| accountId | <code>String</code> | [Id of the account to retrieve] |
| stop | <code>String</code> | [Id of the earliest operation to retrieve] |
| limit | <code>Number</code> | [count operations (max 100)] |
| start | <code>String</code> | [Id of the most recent operation to retrieve] |

<a name="getRelativeAccountHistory"></a>

## getRelativeAccountHistory(accountId, stop, limit, start) ⇒ <code>Promise.&lt;Array.&lt;AccountHistory&gt;&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| accountId | <code>String</code> | [Id of the account to retrieve] |
| stop | <code>Number</code> | [Sequence number of earliest operation] |
| limit | <code>Number</code> | [count operations (max 100)] |
| start | <code>Number</code> | [Sequence number of the most recent operation to retrieve] |

<a name="getAccountHistory"></a>

## getAccountHistoryOperations(accountId, operationId, start, stop, limit) ⇒ <code>Promise.&lt;Array.&lt;AccountHistory&gt;&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| accountId | <code>String</code> | [Id of the account to retrieve] |
| operationId | <code>String</code> | [Id of the operation to retrieve] |
| start | <code>Number</code> | [Id of the most recent operation to retrieve] |
| stop | <code>Number</code> | [Id of the earliest operation to retrieve] |
| limit | <code>Number</code> | [count operations (max 100)] |

<a name="getContractHistory"></a>

## getContractHistory(contractId, stop, limit, start) ⇒ <code>Promise.&lt;Array.&lt;ContractHistory&gt;&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| contractId | <code>String</code> | [Id of the contract to retrieve] |
| stop | <code>String</code> | [Id of the earliest operation to retrieve] |
| limit | <code>Number</code> | [count operations (max 100)] |
| start | <code>String</code> | [Id of the most recent operation to retrieve] |

<a name="getFullContract"></a>

## getFullContract(contractId, force) ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| contractId | <code>String</code> | [Id of the contract to retrieve] |
| force | <code>Boolean</code> | [If force equal to true then he will first see if you have this object in the cache] |

<a name="broadcastTransaction"></a>

## broadcastTransaction(tr) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| tr | <code>Object</code> | [Transaction to broadcast] |
| tr.ref_block_num | <code>Number</code> | [block number] |
| tr.ref_block_prefix | <code>Number</code> | [block prefix] |
| tr.operations | <code>Array</code> |  [Includes fields: fee, from (accountId), to (accountId), amount, extensions] |
| tr.signatures | <code>Array</code> | [eddsa signature] |

<a name="broadcastBlock"></a>

## broadcastBlock(block) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| block | <code>Object</code> |  |
| block.previous | <code>Number</code> | [previous block id] |
| block.timestamp | <code>Number</code> | [block timestamp] |
| block.transaction_merkle_root | <code>String</code> | [merkle root] |
| block.state_root_hash | <code>String</code> | [hash] |
| block.result_root_hash | <code>String</code> | [result hash] |
| block.ed_signature | <code>String</code> | [eddsa signature] |
| block.round | <code>Number</code> | [round id] |
| block.rand | <code>Number</code> | [rand] |
| block.cert | <code>String</code> | [certificate] |
| block.transactions | <code>Array</code> |  |

<a name="getAssetHolders"></a>

## getAssetHolders>
**Kind**: global function
**Returns**: <code>Promise.&lt;Array.&lt;{name: String, account\_id:String, amount: String}&gt;&gt;</code> - [ { name: 'init0', account_id: '1.2.6', amount: '100000039900000' } ]

| Param | Type | Description |
| --- | --- | --- |
| assetId | <code>String</code> | [Id of the asset to retrieve] |
| start | <code>Number</code> | [account id to start retrieving from] |
| limit | <code>Number</code> | [count accounts (max 100)] |

<a name="getAssetHoldersCount"></a>

## getAssetHoldersCount(assetId) ⇒ <code>Promise.&lt;Number&gt;</code>
**Kind**: global function
**Returns**: <code>Promise.&lt;Number&gt;</code> - result - 8

| Param | Type | Description |
| --- | --- | --- |
| assetId | <code>String</code> | [Id of the asset to retrieve] |

<a name="getAllAssetHolders"></a>

## getAllAssetHolders() ⇒ <code>Promise.&lt;Array.&lt;{asset\_id: String, count: Number}&gt;&gt;</code>
**Kind**: global function
**Returns**: <code>Promise.&lt;Array.&lt;{asset\_id: String, count: Number}&gt;&gt;</code> - [ { asset_id: '1.3.0', count: 8 } ]

<a name="getBalanceObjects"></a>

## getBalanceObjects(keys) ⇒ <code>Promise.&lt;*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| keys | <code>Array.&lt;String&gt;</code> | [public keys (string in bs58 with prefix "ECHO")] |

<a name="getBlockVirtualOperations"></a>

## getBlockVirtualOperations(blockNum) ⇒ <code>Promise.&lt;*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| keys | <code>Number</code> | [Number of the block to retrieve (non negative integer)] |

<a name="getBtcAddresses"></a>

## getBtcAddresses(accountId) ⇒ <code>Promise.&lt;*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| accountId | <code>String</code> | [Id of the account to retrieve] |

<a name="getBtcDepositScript"></a>

## getBtcDepositScript(btcDepositId) ⇒ <code>Promise.&lt;*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| btcDepositId | <code>String</code> | [Id of the btc deposit] |

<a name="requestRegistrationTask"></a>

## requestRegistrationTask() ⇒ <code>Promise.&lt;Object.&lt;{block\_id: String, rand\_num: String, difficulty: Number}&gt;&gt;</code>
**Kind**: global function
**Returns**: <code>Promise.&lt;Object.&lt;{block\_id: String, rand\_num: String, difficulty: Number}&gt;&gt;</code> - { block_id: '00047a74744e20bd587a341820daa699b82e2e00', rand_num: '1409327409238134346', difficulty: 20 }

<a name="getCommitteeFrozenBalance"></a>

## getCommitteeFrozenBalance(committeeMemberId) ⇒ <code>Promise.&lt;*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| committeeMemberId | <code>String</code> | [Id of the committee member] |

<a name="getRegistrar"></a>

## getRegistrar() ⇒ <code>Promise.&lt;String.&lt;'1.2.10'&gt;&gt;</code>
**Kind**: global function
**Returns**: <code>Promise.&lt;String.&lt;getRegistrar&gt;&gt;</code> - '1.2.10'


<a name="lookupCommitteeMemberAccounts"></a>

## lookupCommitteeMemberAccounts(lowerBoundName, limit) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| lowerBoundName | <code>String</code> |  [Name of the earliest committee member to retrieve] |
| limit | <code>Number</code> | [count operations (max 1000)] |


<a name="getDidObject"></a>

## getDidObject(id) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> |  [Identifier for did object] |

<a name="getKey"></a>

## getKey(idString) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| idString | <code>String</code> |  [Key identifier] |

<a name="getKeys"></a>

## getKeys(idString) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| idString | <code>String</code> |  [Did identifier] |

## BlockHeader : <code>Object</code>
<a name="BlockHeader"></a>

```javascript
{
    previous:String,
    timestamp:String,
    account:String,
    transaction_merkle_root:String,
    state_root_hash:String,
    result_root_hash:String,
    extensions:Array
}
```
## Block : <code>Object</code>
<a name="Block"></a>

```javascript
{
    previous:String,
    timestamp:String,
    account:String,
    transaction_merkle_root:String,
    state_root_hash:String,
    result_root_hash:String,
    extensions:Array,
    ed_signature:String,
    round:Number,
    rand:String,
    cert:{
        _rand:String,
        _block_hash:String,
        _producer:Number,
        _signatures:Array.<{
            _step:Number,
            _value:Number,
            _producer:Number,
            _bba_sign:String
        }>
    },
    transactions:Array.<{
        ref_block_num:Number,
        ref_block_prefix:Number,
        fees_collected:Number,
        expiration:String,
        operations:Array,
        extensions:Array,
        signatures:Array.<String>,
        operation_results:Array.<Array>
    }>
}
```
## Transaction : <code>Object</code>
<a name="Transaction"></a>

```javascript
{
    ref_block_num:Number,
    ref_block_prefix:Number,
    fees_collected:Number,
    expiration:String,
    operations:Array.<*>,
    extensions:Array,
    signatures:Array.<String>,
    operation_results:Array.<Array.<*>>
}
```

## ChainProperties : <code>Object</code>
<a name="ChainProperties"></a>

```javascript
{
    id:String,
    chain_id:String,
}
```

## GlobalProperties : <code>Object</code>
<a name="GlobalProperties"></a>

```javascript
{
   id:String,
   parameters:{
       current_fees:{
           parameters:Array.<*>,
           scale:Number
       },
       maintenance_interval:Number,
       maintenance_skip_slots:Number,
       committee_proposal_review_period:Number,
       maximum_transaction_size:Number,
       maximum_block_size:Number,
       maximum_time_until_expiration:Number,
       maximum_proposal_lifetime:Number,
       maximum_asset_whitelist_authorities:Number,
       maximum_asset_feed_publishers:Number,
       maximum_committee_count:Number,
       maximum_authority_membership:Number,
       reserve_percent_of_fee:Number,
       network_percent_of_fee:Number,
       cashback_vesting_period_seconds:Number,
       max_predicate_opcode:Number,
       accounts_per_fee_scale:Number,
       account_fee_scale_bitshifts:Number,
       max_authority_depth:Number,
       frozen_balances_multipliers:Array,
       echorand_config:{
           _time_net_1mb:Number,
           _time_net_256b:Number,
           _creator_count:Number,
           _verifier_count:Number,
           _ok_threshold:Number,
           _max_bba_steps:Number,
           _gc1_delay:Number
       },
       sidechain_config:{
           eth_contract_address:String,
           eth_committee_update_method:{method:String,gas:Number},
           eth_gen_address_method:{method:String,gas:Number},
           eth_withdraw_method:{method:String,gas:Number},
           eth_update_addr_method:{method:String,gas:Number},
           eth_update_contract_address:{method:String,gas:Number},
           eth_withdraw_token_method:{method:String,gas:Number},
           eth_collect_tokens_method:{method:String,gas:Number},
           eth_committee_updated_topic:String,
           eth_gen_address_topic:String,
           eth_deposit_topic:String,
           eth_withdraw_topic:String,
           erc20_deposit_topic:String,
           erc20_withdraw_topic:String,
           ETH_asset_id:String,
           BTC_asset_id:String,
           fines:{generate_eth_address:Number|String},
           gas_price:Number|String,
           satoshis_per_byte:Number,
           coefficient_waiting_blocks:Number,
           btc_deposit_withdrawal_min:Number|String,
           btc_deposit_withdrawal_fee:Number|String,
       },
       gas_price:{
           price:Number|String,
           gas_amount:Number|String,
       },
       extensions:Array
   },
   active_committee_members:Array.<Array<String>>,
}
```
## Config : <code>Object</code>
<a name="Config"></a>

```javascript
{
    ECHO_SYMBOL:String,
    ECHO_ADDRESS_PREFIX:String,
    ECHO_ED_PREFIX:String,
    ECHO_MIN_ACCOUNT_NAME_LENGTH:Number,
    ECHO_MAX_ACCOUNT_NAME_LENGTH:Number,
    ECHO_MIN_ASSET_SYMBOL_LENGTH:Number,
    ECHO_MAX_ASSET_SYMBOL_LENGTH:Number,
    ECHO_MAX_SHARE_SUPPLY:String,
    ECHO_MAX_PAY_RATE:Number,
    ECHO_MAX_SIG_CHECK_DEPTH:Number,
    ECHO_MIN_TRANSACTION_SIZE_LIMIT:Number,
    ECHO_MIN_BLOCK_INTERVAL:Number,
    ECHO_MAX_BLOCK_INTERVAL:Number,
    ECHO_DEFAULT_BLOCK_INTERVAL:Number,
    ECHO_DEFAULT_MAX_TRANSACTION_SIZE:Number,
    ECHO_DEFAULT_MAX_BLOCK_SIZE:Number,
    ECHO_DEFAULT_MAX_TIME_UNTIL_EXPIRATION:Number,
    ECHO_DEFAULT_MAINTENANCE_INTERVAL:Number,
    ECHO_DEFAULT_MAINTENANCE_SKIP_SLOTS:Number,
    ECHO_MIN_UNDO_HISTORY:Number,
    ECHO_MAX_UNDO_HISTORY:Number,
    ECHO_MIN_BLOCK_SIZE_LIMIT:Number,
    ECHO_MIN_TRANSACTION_EXPIRATION_LIMIT:Number,
    ECHO_BLOCKCHAIN_PRECISION:Number,
    ECHO_BLOCKCHAIN_PRECISION_DIGITS:Number,
    ECHO_DEFAULT_TRANSFER_FEE:Number,
    ECHO_MAX_INSTANCE_ID:String,
    ECHO_100_PERCENT:Number,
    ECHO_1_PERCENT:Number,
    ECHO_MAX_MARKET_FEE_PERCENT:Number,
    ECHO_DEFAULT_FORCE_SETTLEMENT_DELAY:Number,
    ECHO_DEFAULT_FORCE_SETTLEMENT_OFFSET:Number,
    ECHO_DEFAULT_FORCE_SETTLEMENT_MAX_VOLUME:Number,
    ECHO_DEFAULT_PRICE_FEED_LIFETIME:Number,
    ECHO_MAX_FEED_PRODUCERS:Number,
    ECHO_DEFAULT_MAX_AUTHORITY_MEMBERSHIP:Number,
    ECHO_DEFAULT_MAX_ASSET_WHITELIST_AUTHORITIES:Number,
    ECHO_DEFAULT_MAX_ASSET_FEED_PUBLISHERS:Number,
    ECHO_COLLATERAL_RATIO_DENOM:Number,
    ECHO_MIN_COLLATERAL_RATIO:Number,
    ECHO_MAX_COLLATERAL_RATIO:Number,
    ECHO_DEFAULT_MAINTENANCE_COLLATERAL_RATIO:Number,
    ECHO_DEFAULT_MAX_SHORT_SQUEEZE_RATIO:Number,
    ECHO_DEFAULT_MARGIN_PERIOD_SEC:Number,
    ECHO_DEFAULT_MAX_COMMITTEE:Number,
    ECHO_DEFAULT_MAX_PROPOSAL_LIFETIME_SEC:Number,
    ECHO_DEFAULT_COMMITTEE_PROPOSAL_REVIEW_PERIOD_SEC:Number,
    ECHO_DEFAULT_NETWORK_PERCENT_OF_FEE:Number,
    ECHO_DEFAULT_MAX_BULK_DISCOUNT_PERCENT:Number,
    ECHO_DEFAULT_BULK_DISCOUNT_THRESHOLD_MIN:Number,
    ECHO_DEFAULT_BULK_DISCOUNT_THRESHOLD_MAX:String,
    ECHO_DEFAULT_CASHBACK_VESTING_PERIOD_SEC:Number,
    ECHO_DEFAULT_BURN_PERCENT_OF_FEE:Number,
    ECHO_DEFAULT_MAX_ASSERT_OPCODE:Number,
    ECHO_DEFAULT_ACCOUNTS_PER_FEE_SCALE:Number,
    ECHO_DEFAULT_ACCOUNT_FEE_SCALE_BITSHIFTS:Number,
    ECHO_MAX_URL_LENGTH:Number,
    ECHO_NEAR_SCHEDULE_CTR_IV:String,
    ECHO_FAR_SCHEDULE_CTR_IV:String,
    ECHO_CORE_ASSET_CYCLE_RATE:Number,
    ECHO_CORE_ASSET_CYCLE_RATE_BITS:Number,
    ECHO_MAX_INTEREST_APR:Number,
    ECHO_COMMITTEE_ACCOUNT:String,
    ECHO_RELAXED_COMMITTEE_ACCOUNT:String,
    ECHO_NULL_ACCOUNT:String,
    ECHO_TEMP_ACCOUNT:String
}
```
## DynamicGlobalProperties : <code>Object</code>
<a name="DynamicGlobalProperties"></a>

```javascript
{
    id:String,
    head_block_number:Number,
    head_block_id:String,
    time:String,
    next_maintenance_time:String,
    last_maintenance_time:String,
    committee_budget:Number,
    accounts_registered_this_interval:Number,
    recently_missed_count:Number,
    current_aslot:Number,
    recent_slots_filled:String,
    dynamic_flags:Number,
    last_irreversible_block_num:Number,
}
```

## Committee : <code>Object</code>
<a name="Committee"></a>

```javascript
{
    id:String,
    committee_member_account:String,
    url:String,
    eth_address:String,
    btc_public_key:String
}
```
## Account : <code>Object</code>
<a name="Account"></a>

```javascript
{
    id:String,
    membership_expiration_date:String,
    registrar:String,
    referrer:String,
    lifetime_referrer:String,
    network_fee_percentage:Number,
    lifetime_referrer_fee_percentage:Number,
    referrer_rewards_percentage:Number,
    active_delegate_share: Number,
    name:String,
    owner:{
        weight_threshold:Number,
        account_auths:Array,
        key_auths:Array,
        },
    active:{
        weight_threshold:Number,
        account_auths:Array,
        key_auths:Array,
        },
    ed_key:String,
    options:{
        delegating_account:String,
        extensions:Array
    },
    statistics:String,
    whitelisting_accounts:Array,
    blacklisting_accounts:Array,
    whitelisted_accounts:Array,
    blacklisted_accounts:Array,
    owner_special_authority:Array,
    active_special_authority:Array,
    top_n_control_flags:NumberT
}
```
## AccountHistory : <code>Object</code>
<a name="AccountHistory"></a>

```javascript
{
    id:String,
    op:Array,
    result:Array,
    block_num:Number,
    trx_in_block:Number,
    op_in_block:Number,
    virtual_op:Number,
    proposal_hist_id: Number|undefined,
}
```
## FullAccount : <code>Object</code>
<a name="FullAccount"></a>

```javascript
{
    id:String,
    membership_expiration_date:String,
    registrar:String,
    referrer:String,
    lifetime_referrer:String,
    network_fee_percentage:Number,
    lifetime_referrer_fee_percentage:Number,
    referrer_rewards_percentage:Number,
    name:String,
    owner:{
        weight_threshold:Number,
        account_auths:Array,
        key_auths:Array,
        },
    active:{
        weight_threshold:Number,
        account_auths:Array,
        key_auths:Array,
        },
    ed_key:String,
    options:{
        delegating_account:String,
        extensions:Array
    },
    statistics:String,
    whitelisting_accounts:Array,
    blacklisting_accounts:Array,
    whitelisted_accounts:Array,
    blacklisted_accounts:Array,
    owner_special_authority:Array,
    active_special_authority:Array,
    top_n_control_flags:Number,
    history:Array.<AccountHistory>,
    balances:Object,
    limit_orders:Object,
    call_orders:Object,
    proposals:Object
}
```
## Asset : <code>Object</code>
<a name="Asset"></a>

```javascript
{
    id:String,
    symbol:String,
    precision:Number,
    issuer:String,
    options:{
        max_supply:String,
        market_fee_percent:Number,
        max_market_fee:String,
        issuer_permissions:Number,
        flags:Number,
        core_exchange_rate:Object,
        whitelist_authorities:Array,
        blacklist_authorities:Array,
        whitelist_markets:Array,
        blacklist_markets:Array,
        description:String,
        extensions:Array
    },
    dynamic_asset_data_id:String,
    dynamic:Object,
    bitasset:(Object|undefined)
}
```
## Vote : <code>Object</code>
<a name="Vote"></a>

```javascript
{
    id:String,
    committee_member_account:(String|undefined),
    vote_id:String,
    total_votes:Number,
    url:String,
    last_avoting_accountslot:(Number|undefined),
    signing_key:(String|undefined),
    pay_vb:(String|undefined),
    total_missed:(Number|undefined),
    last_confirmed_block_num:(Number|undefined),
    ed_signing_key:(String|undefined)
}
```
## ContractLogs : <code>Object</code>
<a name="ContractLogs"></a>

```javascript
{
    address:String,
    log:Array.<String>,
    data:String,
    trx_num:Number,
    op_num:Number
}
```
## ContractResult : <code>Object</code>
<a name="ContractResult"></a>

```javascript
[0,
    {
        exec_res:{
            excepted:String,
            new_address:String,
            output:String,
            code_deposit:String,
            deposit_size:Number,
            gas_for_deposit:String
        },
        tr_receipt:{
            status_code:String,
            gas_used:String,
            bloom:String,
            log:Array
        }
    }
]
```
or
```javascript
[1, { output: String }]
```

## SidechainTransfer : <code>Object</code>
<a name="SidechainTransfer"></a>

```javascript
{
    transfer_id: Number,
    receiver: String,
    amount: Number,
    signatures: String,
    withdraw_code: String
}
```

## CommitteeFrozenBalance : <code>Object</code>
<a name="CommitteeFrozenBalance"></a>

```javascript
{
    owner: String,
    balance: Number
}
```

## ContractHistory : <code>Object</code>
<a name="ContractHistory"></a>

```javascript
{
   block_num:Number,
   id:String,
   op:[
       Number,
       {
           amount:{
               amount: Number,
               asset_id: String
           },
           extensions: [],
           fee:{
               amount:Number,
               asset_id:String
           },
           from:String,
           to:String
       }
   ],
   op_in_trx:Number,
   result: [0, {}],
   trx_in_block:Number,
   virtual_op:Number,
   proposal_hist_id: Number
}
```

## AccountName : <code>String</code>
<a name="AccountName"></a>

```javascript
String
```
## AccountId : <code>String</code>
<a name="AccountId"></a>

```javascript
String
```
