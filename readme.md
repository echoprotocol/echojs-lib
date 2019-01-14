
# Echojs-lib (echojs-lib)

Pure JavaScript ECHO library for node.js and browsers. Can be used to construct, sign and broadcast transactions in JavaScript, and to easily obtain data from the blockchain via public apis.


## Setup

This library can be obtained through npm:
```
npm install echojs-lib
```

## Usage

```javascript
import echo from 'echojs-ws';

const url = 'ws://195.201.164.54:6311';
const options = {
    connectionTimeout: 5000,
	maxRetries: 5,
	pingTimeout: 3000,
	pingInterval: 3000,
	debug: false,
	apis: [
	    'database', 'network_broadcast', 'history', registration', 'asset', 'login', 'network_node'
	    ]
};

echo.connect(url, options).then(() => {
    const account = echo.api.getObject('1.2.0');
});
```

### Api
This library provides api blockchain methods.

To fetch objects you can use `Api`:
```javascript
import echo from 'echojs-lib';

try {
    const result = await echo.api.getAssets(['1.3.0']);
    console.log(result);
} catch (e) {
    console.warn(e);
}
```

#### Subscriber
This library provides subscriber module to notify subscribers about changes.
```javascript
import echo from "echojs-lib";

const callback = (result) => { console.log(result) };

await echo.subscriber.setBlockApplySubscribe(callback);
await echo.subscriber.setEchorandSubscribe(callback);
await echo.subscriber.setAccountSubscribe(callback, ['1.2.0']);
echo.subscriber.setGlobalSubscribe(callback);
await echo.subscriber.setPendingTransactionSubscribe(callback);
echo.subscriber.setStatusSubscribe('connect', callback);
echo.subscriber.setStatusSubscribe('disconnect', callback);
await echo.subscriber.setMarketSubscribe('1.3.0', '1.3.1', callback);

echo.subscriber.removeBlockApplySubscribe(callback);

```

#### Cache
To optimize requests we use caches
```javascript
import echo from "echojs-lib";

console.log(echo.cache.objectsById);
```

#### Redux
We provide redux store update automaticly
```javascript
import echo, { cacheReducer } from "echojs-lib";
import { combineReducers, createStore } from 'redux';

const caches = ['objectsById'] // array of caches you want to follow

const store = createStore(
                combineReducers({
                    ...reducers,
                    cache: cacheReducer(caches), // return reducer
                })
           );

echo.syncCacheWithStore(store);

console.log(echo.cache.objectsById);
```
All objects after and before sync, will be added to redux store.

### ECC
The ECC library contains all the crypto functions for private and public keys as well as transaction creation/signing.

#### Private keys
As a quick example, here's how to generate a new private key from a seed:

```javascript
import { crypto } from 'echojs-lib';

const privateKeyFromPassword = (accountName, role, password) => {
  const seed = `${accountName}${role}${password}`;
  let privateKey = crypto.PrivateKey.fromSeed(seed);
  const publicKey = privateKey.toPublicKey().toString();

  return { privateKey, publicKey };
};

const accountName = 'testusername42';
const role = 'active';
const password = 'P5KDbEubFQS4cNtimMMnTL6tkM4nqWDXjEjhmQDrxGvoY';
const { privateKey, publicKey } = privateKeyFromPassword();

console.log("\nPrivate key:", privateKey.toWif());
console.log("Public key :", publicKey, "\n");
```