
# Echojs-lib (echojs-lib)

Pure JavaScript ECHO library for node.js and browsers. Can be used to construct, sign and broadcast transactions in JavaScript, and to easily obtain data from the blockchain via public apis.


## Setup

This library can be obtained through npm:
```
npm install echojs-lib
```

## Usage

Three sub-libraries are included: `ECC`, `Chain` and `Serializer`. Generally only the `ECC` and `Chain` libraries need to be used directly.

#### Login
The login class uses the following format for keys:

```javascript
const keySeed = accountName + role + password
```

Using this seed, private keys are generated for either the default roles `active, owner, memo`, or as specified. A minimum password length of 12 characters is enforced, but an even longer password is recommended. Three methods are provided:

```javascript
import { Login } from 'echojs-lib';

Login.generateKeys(accountName, password, roles, prefix)
Login.checkKeys({ accountName, password, auths })
Login.signTransaction(tr)
```

The auths object should contain the auth arrays from the account object. An example is this:

```
{
    active: [
        ["GPH5Abm5dCdy3hJ1C5ckXkqUH2Me7dXqi9Y7yjn9ACaiSJ9h8r8mL", 1]
    ]
}
```

If checkKeys is successful, you can use signTransaction to sign a TransactionBuilder transaction using the private keys for that account.

#### State container
The Chain library contains a complete state container called the ChainStore. The ChainStore will automatically configure the `set_subscribe_callback` and handle any incoming state changes appropriately. It uses Immutable.js for storing the state, so all objects are return as immutable objects. It has its own `subscribe` method that can be used to register a callback that will be called whenever a state change happens.

The ChainStore has several useful methods to retrieve, among other things, objects, assets and accounts using either object ids or asset/account names. These methods are synchronous and will return `undefined` to indicate fetching in progress, and `null` to indicate that the object does not exist.

```javascript
import { Apis } from 'echojs-ws';
import { ChainStore } from 'echojs-lib';

const address = 'wss://test-node.info/ws';
let dynamicGlobal = null;
const updateState = (object) => {
    dynamicGlobal = ChainStore.getObject("2.1.0");
    console.log("ChainStore object update\n", dynamicGlobal ? dynamicGlobal.toJS() : dynamicGlobal);
}

Apis.instance(address, true).init_promise.then((res) => {
    console.log("connected to:", res[0].network);
    ChainStore.init().then(() => {
        ChainStore.subscribe(updateState);
    });
});
```

### Chain
This library provides utility functions to handle blockchain state as well as a login class that can be used for simple login functionality using a specific key seed.

To fetch objects you can use `ChainStore`:
```javascript
import { ChainStore } from 'echojs-lib';

// method = 'getAsset', key = assetId
const result = await ChainStore.FetchChain(method, key);
```
> New or updated object you can get through a ChainStore.subscribe(() => {});

#### Transactions
In next example we will build and broadcast simple `asset transfer` transaction, private key will take from previous example.
```javascript
import { TransactionBuilder } from "echojs-lib";

const buildAndSendTransaction = async (operation, options, privateKey) => {
	const tr = new TransactionBuilder();
	tr.add_type_operation(operation, options);
	await tr.set_required_fees();
	tr.add_signer(privateKey);
	return tr.broadcast();
};

const privateKey = '5JMontd8b8iPWrAU36PRYhWBwPhhv1RQGNTxjtrSLodoioqHA7k';
const operation = 'transfer';
const options = {
	from: '1.2.1',
	to: '1.2.2',
	amount: {
		amount: 10,
		asset_id: '1.3.0',
	},
};

buildAndSendTransaction(operation, options, privateKey)
	.then(() => console.log('transaction was completed'))
	.catch(() => console.log('transaction wasn\'t completed'))
```


#### Validation
Handily to use standard validation method instead write own, a few examples:
```javascript
import { ChainValidation } from 'echojs-lib';

let accountError = ChainValidation.is_account_name_error(accountName);
if (accountError) console.log(accountError);
```
#### Utility
In this example we will generate password:
```javascript
import { TransactionHelper, Aes, key } from 'echojs-lib';

const generatedPassword = (`P${key.get_random_key().toWif()}`).substr(0, 45);

const nonce = TransactionHelper.unique_nonce_uint64();
const message = Aes.encryptWithChecksum(
	privateKey, memo_key, nonce, Buffer.from(memoMessage, 'utf-8')
),
const memo = { from: '1.2.1', to: '1.2.2', nonce, message };
```
After it you can use `generatedPassword` to make privateKey.

> At `ops` from `echojs-lib` you can find whole operation schemes to form your own options for `TransactionBuilder`

### ECC
The ECC library contains all the crypto functions for private and public keys as well as transaction creation/signing.

#### Private keys
As a quick example, here's how to generate a new private key from a seed:

```javascript
import { PrivateKey } from 'echojs-lib';

const privateKeyFromPassword = (accountName, role, password) => {
  const seed = `${accountName}${role}${password}`;
  let privateKey = PrivateKey.fromSeed(seed);
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
Now let's encrypt memo message:
```javascript
import { TransactionHelper, Aes } from 'echojs-lib';

const nonce = TransactionHelper.unique_nonce_uint64();
const message = Aes.encryptWithChecksum(
	privateKey, memo_key, nonce, Buffer.from(memoMessage, 'utf-8')
),
const memo = { from: '1.2.1', to: '1.2.2', nonce, message };
```

This `memo` may be included at `options` when transfer assets.

