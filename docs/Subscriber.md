## Table of contents

- [Subscriber](#subscriber)
- [Block Apply Subscribe](#block-apply-subscribe)
- [Echorand Subscribe](#echorand-subscribe)
- [Account Subscribe](#account-subscribe)
- [Global Subscribe](#global-subscribe)
- [Pending Transaction Subscribe](#pending-transaction-subscribe)
- [Status Subscribe](#status-subscribe)

#### Subscriber
This library provides subscriber module to notify subscribers about changes.

Following examples represent usage different subscribers and example result which they return.

> You automatically subscribe on object when you requested it via API.

#### Block Apply Subscribe

```javascript
import echo from "echojs-lib";

const callback = (result) => {
console.log(result);
/*
["0001bbf91d02b003c115f4238c3de0a0c032b598"]
*/
};

await echo.connect('ws://127.0.0.1:9000');

await echo.subscriber.setBlockApplySubscribe(callback);
// to remove block applay subscriber
echo.subscriber.removeBlockApplySubscribe(callback);
```

#### Echorand Subscribe

```javascript
import echo from "echojs-lib";

const callback = (result) => {
console.log(result);
/*
{ type: "round_started", round: 113782 }
*/
/*
{
    block_hash: "0001bc768755bc424951dd248317b1705812a538",
    producer: 24,
    rand: "6dfa76a402a59f2ade51dc44359d429a8dfacda21a8b1720bb2e7c693aa9b19a",
    round: 113782,
    type: "block_produced"
}
*/
/*
{ type: "gc_started", round: 113782 }
*/
/*
{ type: "bba_started", round: 113875 }
*/
};

await echo.connect('ws://127.0.0.1:9000');

await echo.subscriber.setEchorandSubscribe(callback);
// to remove echo rand subscriber
echo.subscriber.removeEchorandSubscribe(callback);
```

#### Account Subscribe

```javascript
import echo from "echojs-lib";

const callback = (result) => {
console.log(result);
/*
{
    active: {
        account_auths: [],
        key_auths: [["ECHO76zGaUmBNXk9yD3EmAP1KYPBabkgnVmLiDSs99ZRLap1TV4GC8", 1]],
        weight_threshold: 1
    },
    active_special_authority: [0, {}],
    blacklisted_accounts: [],
    blacklisting_accounts: [],
    ed_key: "7497001946b5b6107d9316270ab199e92e10dbab332cdfff5570122882dbd4f3",
    id: "1.2.455",
    lifetime_referrer: "1.2.12",
    lifetime_referrer_fee_percentage: 3000,
    membership_expiration_date: "1970-01-01T00:00:00",
    name: "vsharaev2",
    network_fee_percentage: 2000,
    options: {
        delegating_account: "1.2.12",
        extensions: [],
        num_committee: 0,
        votes: [],
        voting_account: "1.2.5"
    },
    owner: {
        account_auths: [],
        key_auths: [["ECHO6P3owTYeFpQGc9t4WJmCDvAxGV9TaZvkuPi1DbrtSfYb8WbVHH", 1]],
        weight_threshold: 1,
    },
    owner_special_authority: [0, {}],
    referrer: "1.2.12",
    referrer_rewards_percentage: 7500,
    registrar: "1.2.12",
    statistics: "2.6.455",
    top_n_control_flags: 0,
    whitelisted_accounts: [],
    whitelisting_accounts: []
}
*/
};

await echo.connect('ws://127.0.0.1:9000');

await echo.subscriber.setAccountSubscribe(callback, ['1.2.455']);
// to remove account subscriber
echo.subscriber.removeAccountSubscribe(callback);
```

#### Global Subscribe

Returning whole objects which has been updated

```javascript
import echo from "echojs-lib";

const callback = (result) => {
console.log(result);
/*
{id: "1.18.114111", results_id: []}
*/
};

await echo.connect('ws://127.0.0.1:9000');

echo.subscriber.setGlobalSubscribe(callback);
// to remove global subscriber
echo.subscriber.removeGlobalSubscribe(callback);
```

#### Pending Transaction Subscribe

```javascript
import echo from "echojs-lib";

const callback = (result) => {};

await echo.connect('ws://127.0.0.1:9000');
await echo.subscriber.setPendingTransactionSubscribe(callback);
// to remove pending pransaction subscriber
echo.subscriber.removePendingTransactionSubscribe(callback);
```

#### Status Subscribe

```javascript
import echo from "echojs-lib";

const callbackOnConnect = (result) => {
console.log(result);
/*
"OPEN"
*/
};

const callbackOnDisconnect = (result) => {
console.log(result);
/*
"CLOSE"
*/
};

await echo.connect('ws://127.0.0.1:9000');

echo.subscriber.setStatusSubscribe('connect', callbackOnConnect);
echo.subscriber.setStatusSubscribe('disconnect', callbackOnDisconnect);

// to remove status subscriber
echo.subscriber.removeStatusSubscribe(callbackOnConnect);
echo.subscriber.removeStatusSubscribe(callbackOnDisconnect);
```
