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
<dt><a href="#API">API</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#getObjects">getObjects(objectIds, force)</a> ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#getObject">getObject(objectId, force)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
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
<dt><a href="#getOrderBook">getOrderBook(baseAssetName, quoteAssetName, depth)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getLimitOrders">getLimitOrders(baseAssetId, quoteAssetId, limit)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getCallOrders">getCallOrders(assetId, limit)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getSettleOrders">getSettleOrders(assetId, limit)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getMarginPositions">getMarginPositions(accountId)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getTicker">getTicker(baseAssetName, quoteAssetName)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#get24Volume">get24Volume(baseAssetName, quoteAssetName)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getTradeHistory">getTradeHistory(baseAssetName, quoteAssetName, start, stop, limit)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getWitnesses">getWitnesses(witnessIds, force)</a> ⇒ <code>Promise.&lt;Array.&lt;Witness&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#getWitnessByAccount">getWitnessByAccount(accountId, force)</a> ⇒ <code><a href="#Witness">Promise.&lt;Witness&gt;</a></code></dt>
<dd></dd>
<dt><a href="#lookupWitnessAccounts">lookupWitnessAccounts(lowerBoundName, limit)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getWitnessCount">getWitnessCount()</a> ⇒ <code>Promise.&lt;Number&gt;</code></dt>
<dd></dd>
<dt><a href="#getCommitteeMembers">getCommitteeMembers(committeeMemberIds, force)</a> ⇒ <code>Promise.&lt;Array.&lt;Committee&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#getCommitteeMemberByAccount">getCommitteeMemberByAccount(accountId, force)</a> ⇒ <code><a href="#Committee">Promise.&lt;Committee&gt;</a></code></dt>
<dd></dd>
<dt><a href="#lookupCommitteeMemberAccounts">lookupCommitteeMemberAccounts(lowerBoundName, limit)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getWorkersByAccount">getWorkersByAccount(accountId)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#lookupVoteIds">lookupVoteIds(votes, force)</a> ⇒ <code>Promise.&lt;Array.&lt;Vote&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#getTransactionHex">getTransactionHex(transaction)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getRequiredSignatures">getRequiredSignatures(transaction, availableKeys)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getPotentialSignatures">getPotentialSignatures(transaction)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#getPotentialAddressSignatures">getPotentialAddressSignatures(transaction)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
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
<dt><a href="#getAllContracts">getAllContracts()</a> ⇒ <code>Promise.&lt;Array.&lt;{id:String, statistics:String, suicided:Boolean}&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#getContractLogs">getContractLogs(contractId, fromBlock, toBlock)</a> ⇒ <code>Promise.&lt;Array.&lt;ContractLogs&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#getContractResult">getContractResult(resultContractId, force)</a> ⇒ <code><a href="#ContractResult">Promise.&lt;ContractResult&gt;</a></code></dt>
<dd></dd>
<dt><a href="#getContract">getContract(contractId, force)</a> ⇒ <code>Promise.&lt;{contract_info: {id:String, statistics:String, suicided:Boolean}, code:String, storage:Array.&lt;Array&gt;}&gt;</code></dt>
<dd></dd>
<dt><a href="#callContractNoChangingState">callContractNoChangingState(contractId, accountId, assetId, bytecode)</a> ⇒ <code>Promise.&lt;String&gt;</code></dt>
<dd></dd>
<dt><a href="#getContracts">getContracts(contractIds, force)</a> ⇒ <code>Promise.&lt;Array.&lt;{id:String, statistics:String, suicided:Boolean}&gt;&gt;</code></dt>
<dd></dd>
<dt><a href="#getContractBalances">getContractBalances(contractId, force)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd></dd>
<dt><a href="#getRecentTransactionById">getRecentTransactionById(transactionId)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd></dd>
<dt><a href="#registerAccount">registerAccount(name, ownerKey, activeKey, memoKey, echoRandKey)</a> ⇒ <code>Promise.&lt;null&gt;</code></dt>
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
 Get operations relevant to the specified account.(contractId, stop, limit, start)</a> ⇒ <code>Promise.&lt;Array.&lt;*&gt;&gt;</code></dt>
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
<dt><a href="#Witness">Witness</a> : <code>Object</code></dt>
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
</dl>

<a name="API"></a>

## API
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

| Param | Type |
| --- | --- |
| objectIds | <code>Array.&lt;String&gt;</code> |
| force | <code>Boolean</code> |

<a name="getObject"></a>

## getObject(objectId, force) ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| objectId | <code>String</code> |
| force | <code>Boolean</code> |

<a name="getBlockHeader"></a>

## getBlockHeader(blockNum) ⇒ [<code>Promise.&lt;BlockHeader&gt;</code>](#BlockHeader)
**Kind**: global function

| Param | Type |
| --- | --- |
| blockNum | <code>Number</code> |

<a name="getBlock"></a>

## getBlock(blockNum) ⇒ [<code>Promise.&lt;Block&gt;</code>](#Block)
**Kind**: global function

| Param | Type |
| --- | --- |
| blockNum | <code>Number</code> |

<a name="getTransaction"></a>

## getTransaction(blockNum, transactionIndex) ⇒ [<code>Promise.&lt;Transaction&gt;</code>](#Transaction)
**Kind**: global function

| Param | Type |
| --- | --- |
| blockNum | <code>Number</code> |
| transactionIndex | <code>Number</code> |

<a name="getChainProperties"></a>

## getChainProperties(force) ⇒ [<code>Promise.&lt;ChainProperties&gt;</code>](#ChainProperties)
**Kind**: global function

| Param | Type |
| --- | --- |
| force | <code>Boolean</code> |

<a name="getGlobalProperties"></a>

## getGlobalProperties() ⇒ [<code>Promise.&lt;GlobalProperties&gt;</code>](#GlobalProperties)
**Kind**: global function
<a name="getConfig"></a>

## getConfig(force) ⇒ [<code>Promise.&lt;Config&gt;</code>](#Config)
**Kind**: global function

| Param | Type |
| --- | --- |
| force | <code>Boolean</code> |

<a name="getChainId"></a>

## getChainId(force) ⇒ <code>Promise.&lt;String&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| force | <code>Boolean</code> |

<a name="getDynamicGlobalProperties"></a>

## getDynamicGlobalProperties() ⇒ [<code>Promise.&lt;DynamicGlobalProperties&gt;</code>](#DynamicGlobalProperties)
**Kind**: global function
<a name="getKeyReferences"></a>

## getKeyReferences(keys, force) ⇒ <code>Promise.&lt;Array.&lt;\*&gt;&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| keys | <code>List.&lt;String&gt;</code> | [public keys] |
| force | <code>Boolean</code> |  |

<a name="getAccounts"></a>

## getAccounts(accountIds, force) ⇒ <code>Promise.&lt;Array.&lt;Account&gt;&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| accountIds | <code>Array.&lt;String&gt;</code> |
| force | <code>Boolean</code> |

<a name="getFullAccounts"></a>

## getFullAccounts(accountNamesOrIds, subscribe, force) ⇒ <code>Promise.&lt;Array.&lt;FullAccount&gt;&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| accountNamesOrIds | <code>Array.&lt;String&gt;</code> |
| subscribe | <code>Boolean</code> |
| force | <code>Boolean</code> |

<a name="getAccountByName"></a>

## getAccountByName(accountName, force) ⇒ [<code>Promise.&lt;Account&gt;</code>](#Account)
**Kind**: global function

| Param | Type |
| --- | --- |
| accountName | <code>String</code> |
| force | <code>Boolean</code> |

<a name="getAccountReferences"></a>

## getAccountReferences(accountId, force) ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| accountId | <code>String</code> |
| force | <code>Boolean</code> |

<a name="lookupAccountNames"></a>

## lookupAccountNames(accountNames, force) ⇒ <code>Promise.&lt;Array.&lt;Account&gt;&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| accountNames | <code>Array.&lt;String&gt;</code> |
| force | <code>Boolean</code> |

<a name="lookupAccounts"></a>

## lookupAccounts(lowerBoundName, limit) ⇒ <code>Promise.&lt;Array.&lt;AccountName, AccountId&gt;&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| lowerBoundName | <code>String</code> |
| limit | <code>Number</code> |

<a name="getAccountCount"></a>

## getAccountCount() ⇒ <code>Promise.&lt;Number&gt;</code>
**Kind**: global function
<a name="getAccountBalances"></a>

## getAccountBalances(accountId, assetIds, force) ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| accountId | <code>String</code> |
| assetIds | <code>Array.&lt;String&gt;</code> |
| force | <code>Boolean</code> |

<a name="getNamedAccountBalances"></a>

## getNamedAccountBalances(accountName, assetIds, force) ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| accountName | <code>String</code> |
| assetIds | <code>Array.&lt;String&gt;</code> |
| force | <code>Boolean</code> |

<a name="getVestedBalances"></a>

## getVestedBalances(balanceIds) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| balanceIds | <code>Array.&lt;String&gt;</code> |

<a name="getVestingBalances"></a>

## getVestingBalances(accountId) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| accountId | <code>String</code> |

<a name="getAssets"></a>

## getAssets(assetIds, force) ⇒ <code>Promise.&lt;Array.&lt;Asset&gt;&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| assetIds | <code>Array.&lt;String&gt;</code> |
| force | <code>Boolean</code> |

<a name="listAssets"></a>

## listAssets(lowerBoundSymbol, limit) ⇒ <code>Promise.&lt;Array.&lt;Asset&gt;&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| lowerBoundSymbol | <code>String</code> |
| limit | <code>Number</code> |

<a name="lookupAssetSymbols"></a>

## lookupAssetSymbols(symbolsOrIds, force) ⇒ <code>Promise.&lt;Array.&lt;Asset&gt;&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| symbolsOrIds | <code>Array.&lt;String&gt;</code> |
| force | <code>Boolean</code> |

<a name="getOrderBook"></a>

## getOrderBook(baseAssetName, quoteAssetName, depth) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| baseAssetName | <code>String</code> |
| quoteAssetName | <code>String</code> |
| depth | <code>Number</code> |

<a name="getLimitOrders"></a>

## getLimitOrders(baseAssetId, quoteAssetId, limit) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| baseAssetId | <code>String</code> |
| quoteAssetId | <code>String</code> |
| limit | <code>Number</code> |

<a name="getCallOrders"></a>

## getCallOrders(assetId, limit) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| assetId | <code>String</code> |
| limit | <code>Number</code> |

<a name="getSettleOrders"></a>

## getSettleOrders(assetId, limit) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| assetId | <code>String</code> |
| limit | <code>Number</code> |

<a name="getMarginPositions"></a>

## getMarginPositions(accountId) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| accountId | <code>String</code> |

<a name="getTicker"></a>

## getTicker(baseAssetName, quoteAssetName) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| baseAssetName | <code>String</code> |
| quoteAssetName | <code>String</code> |

<a name="get24Volume"></a>

## get24Volume(baseAssetName, quoteAssetName) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| baseAssetName | <code>String</code> |
| quoteAssetName | <code>String</code> |

<a name="getTradeHistory"></a>

## getTradeHistory(baseAssetName, quoteAssetName, start, stop, limit) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| baseAssetName | <code>String</code> |
| quoteAssetName | <code>String</code> |
| start | <code>Number</code> |
| stop | <code>Number</code> |
| limit | <code>Number</code> |

<a name="getWitnesses"></a>

## getWitnesses(witnessIds, force) ⇒ <code>Promise.&lt;Array.&lt;Witness&gt;&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| witnessIds | <code>Array.&lt;String&gt;</code> |
| force | <code>Boolean</code> |

<a name="getWitnessByAccount"></a>

## getWitnessByAccount(accountId, force) ⇒ [<code>Promise.&lt;Witness&gt;</code>](#Witness)
**Kind**: global function

| Param | Type |
| --- | --- |
| accountId | <code>String</code> |
| force | <code>Boolean</code> |

<a name="lookupWitnessAccounts"></a>

## lookupWitnessAccounts(lowerBoundName, limit) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| lowerBoundName | <code>String</code> |
| limit | <code>Number</code> |

<a name="getWitnessCount"></a>

## getWitnessCount() ⇒ <code>Promise.&lt;Number&gt;</code>
**Kind**: global function
<a name="getCommitteeMembers"></a>

## getCommitteeMembers(committeeMemberIds, force) ⇒ <code>Promise.&lt;Array.&lt;Committee&gt;&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| committeeMemberIds | <code>Array.&lt;String&gt;</code> |
| force | <code>Boolean</code> |

<a name="getCommitteeMemberByAccount"></a>

## getCommitteeMemberByAccount(accountId, force) ⇒ [<code>Promise.&lt;Committee&gt;</code>](#Committee)
**Kind**: global function

| Param | Type |
| --- | --- |
| accountId | <code>String</code> |
| force | <code>Boolean</code> |

<a name="lookupCommitteeMemberAccounts"></a>

## lookupCommitteeMemberAccounts(lowerBoundName, limit) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| lowerBoundName | <code>String</code> |
| limit | <code>Number</code> |

<a name="getWorkersByAccount"></a>

## getWorkersByAccount(accountId) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| accountId | <code>String</code> |

<a name="lookupVoteIds"></a>

## lookupVoteIds(votes, force) ⇒ <code>Promise.&lt;Array.&lt;Vote&gt;&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| votes | <code>Array.&lt;String&gt;</code> |
| force | <code>Boolean</code> |

<a name="getTransactionHex"></a>

## getTransactionHex(transaction) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| transaction | <code>Object</code> |

<a name="getRequiredSignatures"></a>

## getRequiredSignatures(transaction, availableKeys) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| transaction | <code>Object</code> |  |
| availableKeys | <code>Array.&lt;String&gt;</code> | [public keys] |

<a name="getPotentialSignatures"></a>

## getPotentialSignatures(transaction) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| transaction | <code>Object</code> |

<a name="getPotentialAddressSignatures"></a>

## getPotentialAddressSignatures(transaction) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| transaction | <code>Object</code> |

<a name="verifyAuthority"></a>

## verifyAuthority(transaction) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| transaction | <code>Object</code> |

<a name="verifyAccountAuthority"></a>

## verifyAccountAuthority(accountNameOrId, signers) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| accountNameOrId | <code>Object</code> |  |
| signers | <code>Array.&lt;String&gt;</code> | [public keys] |

<a name="validateTransaction"></a>

## validateTransaction(transaction) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| transaction | <code>Object</code> |

<a name="getRequiredFees"></a>

## getRequiredFees(operations, assetId) ⇒ <code>Promise.&lt;Array.&lt;{asset\_id:String, amount:Number}&gt;&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| operations | <code>Array.&lt;Object&gt;</code> |
| assetId | <code>String</code> |

<a name="getProposedTransactions"></a>

## getProposedTransactions(accountNameOrId) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| accountNameOrId | <code>String</code> |

<a name="getAllContracts"></a>

## getAllContracts() ⇒ <code>Promise.&lt;Array.&lt;{id:String, statistics:String, suicided:Boolean}&gt;&gt;</code>
**Kind**: global function
<a name="getContractLogs"></a>

## getContractLogs(contractId, fromBlock, toBlock) ⇒ <code>Promise.&lt;Array.&lt;ContractLogs&gt;&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| contractId | <code>String</code> |
| fromBlock | <code>Number</code> |
| toBlock | <code>Number</code> |

<a name="getContractResult"></a>

## getContractResult(resultContractId, force) ⇒ [<code>Promise.&lt;ContractResult&gt;</code>](#ContractResult)
**Kind**: global function

| Param | Type |
| --- | --- |
| resultContractId | <code>String</code> |
| force | <code>Boolean</code> |

<a name="getContract"></a>

## getContract(contractId, force) ⇒ <code>Promise.&lt;{contract\_info: {id:String, statistics:String, suicided:Boolean}, code:String, storage:Array.&lt;Array&gt;}&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| contractId | <code>String</code> |
| force | <code>Boolean</code> |

<a name="callContractNoChangingState"></a>

## callContractNoChangingState(contractId, accountId, assetId, bytecode) ⇒ <code>Promise.&lt;String&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| contractId | <code>String</code> |
| accountId | <code>String</code> |
| assetId | <code>String</code> |
| bytecode | <code>String</code> |

<a name="getContracts"></a>

## getContracts(contractIds, force) ⇒ <code>Promise.&lt;Array.&lt;{id:String, statistics:String, suicided:Boolean}&gt;&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| contractIds | <code>Array.&lt;String&gt;</code> |
| force | <code>Boolean</code> |

<a name="getContractBalances"></a>

## getContractBalances(contractId, force) ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| contractId | <code>String</code> |
| force | <code>Boolean</code> |

<a name="getRecentTransactionById"></a>

## getRecentTransactionById(transactionId) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| transactionId | <code>String</code> |

<a name="registerAccount"></a>

## registerAccount(name, ownerKey, activeKey, memoKey, echoRandKey) ⇒ <code>Promise.&lt;null&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| name | <code>String</code> |
| ownerKey | <code>String</code> |
| activeKey | <code>String</code> |
| memoKey | <code>String</code> |
| echoRandKey | <code>String</code> |

<a name="getAccountHistory"></a>

## getAccountHistory(accountId, stop, limit, start) ⇒ <code>Promise.&lt;Array.&lt;AccountHistory&gt;&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| accountId | <code>String</code> |  |
| stop | <code>String</code> | [Id of the earliest operation to retrieve] |
| limit | <code>Number</code> | [count operations (max 100)] |
| start | <code>String</code> | [Id of the most recent operation to retrieve] |

<a name="getRelativeAccountHistory"></a>

## getRelativeAccountHistory(accountId, stop, limit, start) ⇒ <code>Promise.&lt;Array.&lt;AccountHistory&gt;&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| accountId | <code>String</code> |  |
| stop | <code>Number</code> | [Sequence number of earliest operation] |
| limit | <code>Number</code> | [count operations (max 100)] |
| start | <code>Number</code> | [Sequence number of the most recent operation to retrieve] |

<a name="getAccountHistory"></a>

## getAccountHistoryOperations(accountId, operationId, start, stop, limit) ⇒ <code>Promise.&lt;Array.&lt;AccountHistory&gt;&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| accountId | <code>String</code> |  |
| operationId | <code>String</code> |  |
| start | <code>Number</code> | [Id of the most recent operation to retrieve] |
| stop | <code>Number</code> | [Id of the earliest operation to retrieve] |
| limit | <code>Number</code> | [count operations (max 100)] |

<a name="getContractHistory"></a>

## getContractHistory(contractId, stop, limit, start) ⇒ <code>Promise.&lt;Array.&lt;\*&gt;&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| contractId | <code>String</code> |  |
| stop | <code>String</code> | [Id of the earliest operation to retrieve] |
| limit | <code>Number</code> | [count operations (max 100)] |
| start | <code>String</code> | [Id of the most recent operation to retrieve] |

<a name="broadcastTransaction"></a>

## broadcastTransaction(tr) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type |
| --- | --- |
| tr | <code>Object</code> |
| tr.ref_block_num | <code>Number</code> |
| tr.ref_block_prefix | <code>Number</code> |
| tr.operations | <code>Array</code> |
| tr.signatures | <code>Array</code> |

<a name="broadcastBlock"></a>

## broadcastBlock(block) ⇒ <code>Promise.&lt;\*&gt;</code>
**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| block | <code>Object</code> |  |
| block.previous | <code>Number</code> | [previous block id] |
| block.timestamp | <code>Number</code> | [block timestamp] |
| block.witness | <code>String</code> | [witness id] |
| block.transaction_merkle_root | <code>String</code> | [merkle root] |
| block.state_root_hash | <code>String</code> | [hash] |
| block.result_root_hash | <code>String</code> | [result hash] |
| block.witness_signature | <code>String</code> | [witness signature] |
| block.ed_signature | <code>String</code> | [eddsa signature] |
| block.verifications | <code>Array</code> | [{witness-id, witness-signature}] |
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
| assetId | <code>String</code> | [asset id to retrieve] |
| start | <code>Number</code> | [account id to start retrieving from] |
| limit | <code>Number</code> | [count accounts (max 100)] |

<a name="getAssetHoldersCount"></a>

## getAssetHoldersCount(assetId) ⇒ <code>Promise.&lt;Number&gt;</code>
**Kind**: global function
**Returns**: <code>Promise.&lt;Number&gt;</code> - result - 8

| Param | Type | Description |
| --- | --- | --- |
| assetId | <code>String</code> | [asset id to retrieve] |

<a name="getAllAssetHolders"></a>

## getAllAssetHolders() ⇒ <code>Promise.&lt;Array.&lt;{asset\_id: String, count: Number}&gt;&gt;</code>
**Kind**: global function
**Returns**: <code>Promise.&lt;Array.&lt;{asset\_id: String, count: Number}&gt;&gt;</code> - [ { asset_id: '1.3.0', count: 8 } ]

## BlockHeader : <code>Object</code>
<a name="BlockHeader"></a>

```javascript
{
    previous:String,
    timestamp:String,
    witness:String,
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
    witness:String,
    account:String,
    transaction_merkle_root:String,
    state_root_hash:String,
    result_root_hash:String,
    extensions:Array,
    witness_signature:String,
    ed_signature:String,
    verifications:Array,
    round:Number,
    rand:String,
    cert:{
        _rand:String,
        _block_hash:String,
        _producer:Number,
        _signatures:Array.<{
            _step:Number,
            _value:Number,
            _signer:Number,
            _bba_sign:String
        }>
    },
    transactions:Array.<{
        ref_block_num:Number,
        ref_block_prefix:Number,
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
    immutable_parameters:{
        min_committee_member_count:Number,
        min_witness_count:Number,
        num_special_accounts:Number,
        num_special_assets:Number
    }
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
       block_interval:Number,
       maintenance_interval:Number,
       maintenance_skip_slots:Number,
       committee_proposal_review_period:Number,
       maximum_transaction_size:Number,
       maximum_block_size:Number,
       maximum_time_until_expiration:Number,
       maximum_proposal_lifetime:Number,
       maximum_asset_whitelist_authorities:Number,
       maximum_asset_feed_publishers:Number,
       maximum_witness_count:Number,
       maximum_committee_count:Number,
       maximum_authority_membership:Number,
       reserve_percent_of_fee:Number,
       network_percent_of_fee:Number,
       lifetime_referrer_percent_of_fee:Number,
       cashback_vesting_period_seconds:Number,
       cashback_vesting_threshold:Number,
       count_non_member_votes:Boolean,
       allow_non_member_whitelists:Boolean,
       witness_pay_per_block:Number,
       worker_budget_per_day:String,
       max_predicate_opcode:Number,
       fee_liquidation_threshold:Number,
       accounts_per_fee_scale:Number,
       account_fee_scale_bitshifts:Number,
       max_authority_depth:Number,
       extensions:Array
   },
   next_available_vote_id:Number,
   active_committee_members:Array.<String>,
   active_witnesses:Array.<String>
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
    ECHO_DEFAULT_MAX_WITNESSES:Number,
    ECHO_DEFAULT_MAX_COMMITTEE:Number,
    ECHO_DEFAULT_MAX_PROPOSAL_LIFETIME_SEC:Number,
    ECHO_DEFAULT_COMMITTEE_PROPOSAL_REVIEW_PERIOD_SEC:Number,
    ECHO_DEFAULT_NETWORK_PERCENT_OF_FEE:Number,
    ECHO_DEFAULT_LIFETIME_REFERRER_PERCENT_OF_FEE:Number,
    ECHO_DEFAULT_MAX_BULK_DISCOUNT_PERCENT:Number,
    ECHO_DEFAULT_BULK_DISCOUNT_THRESHOLD_MIN:Number,
    ECHO_DEFAULT_BULK_DISCOUNT_THRESHOLD_MAX:String,
    ECHO_DEFAULT_CASHBACK_VESTING_PERIOD_SEC:Number,
    ECHO_DEFAULT_CASHBACK_VESTING_THRESHOLD:Number,
    ECHO_DEFAULT_BURN_PERCENT_OF_FEE:Number,
    ECHO_WITNESS_PAY_PERCENT_PRECISION:Number,
    ECHO_DEFAULT_MAX_ASSERT_OPCODE:Number,
    ECHO_DEFAULT_FEE_LIQUIDATION_THRESHOLD:Number,
    ECHO_DEFAULT_ACCOUNTS_PER_FEE_SCALE:Number,
    ECHO_DEFAULT_ACCOUNT_FEE_SCALE_BITSHIFTS:Number,
    ECHO_MAX_WORKER_NAME_LENGTH:Number,
    ECHO_MAX_URL_LENGTH:Number,
    ECHO_NEAR_SCHEDULE_CTR_IV:String,
    ECHO_FAR_SCHEDULE_CTR_IV:String,
    ECHO_CORE_ASSET_CYCLE_RATE:Number,
    ECHO_CORE_ASSET_CYCLE_RATE_BITS:Number,
    ECHO_DEFAULT_WITNESS_PAY_PER_BLOCK:Number,
    ECHO_DEFAULT_WITNESS_PAY_VESTING_SECONDS:Number,
    ECHO_DEFAULT_WORKER_BUDGET_PER_DAY:String,
    ECHO_MAX_INTEREST_APR:Number,
    ECHO_COMMITTEE_ACCOUNT:String,
    ECHO_WITNESS_ACCOUNT:String,
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
    current_witness:String,
    next_maintenance_time:String,
    last_budget_time:String,
    witness_budget:Number,
    accounts_registered_this_interval:Number,
    recently_missed_count:Number,
    current_aslot:Number,
    recent_slots_filled:String,
    dynamic_flags:Number,
    last_irreversible_block_num:Number
}
```

## Witness : <code>Object</code>
<a name="Witness"></a>

```javascript
{
    id:String,
    witness_account:String,
    last_aslot:Number,
    signing_key:String,
    pay_vb:String,
    vote_id:String,
    total_votes:Number,
    url:String,
    total_missed:Number,
    last_confirmed_block_num:Number,
    ed_signing_key:String
}
```

## Committee : <code>Object</code>
<a name="Committee"></a>

```javascript
{
    id:String,
    committee_member_account:String,
    vote_id:String,
    total_votes:Number,
    url:String
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
    name:String,
    owner:{
        weight_threshold:Number,
        account_auths:Array,
        key_auths:Array,
        address_auths:Array
        },
    active:{
        weight_threshold:Number,
        account_auths:Array,
        key_auths:Array,
        address_auths:Array
        },
    ed_key:String,
    options:{
        memo_key:String,
        voting_account:String,
        delegating_account:String,
        num_witness:Number,
        num_committee:Number,
        votes:Array,
        extensions:Array
    },
    statistics:String,
    whitelisting_accounts:Array,
    blacklisting_accounts:Array,
    whitelisted_accounts:Array,
    blacklisted_accounts:Array,
    owner_special_authority:Array,
    active_special_authority:Array,
    top_n_control_flags:Number
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
    virtual_op:Number
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
        address_auths:Array
        },
    active:{
        weight_threshold:Number,
        account_auths:Array,
        key_auths:Array,
        address_auths:Array
        },
    ed_key:String,
    options:{
        memo_key:String,
        voting_account:String,
        delegating_account:String,
        num_witness:Number,
        num_committee:Number,
        votes:Array,
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
    witness_account:(String|undefined),
    vote_id:String,
    total_votes:Number,
    url:String,
    last_aslot:(Number|undefined),
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
    data:String
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
            gas_refunded:String,
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