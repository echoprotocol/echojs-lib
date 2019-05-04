
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

Using this seed, private keys are generated for either the default roles `active, memo`, or as specified. A minimum password length of 12 characters is enforced, but an even longer password is recommended. Three methods are provided:

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

try {
    const result = await ChainStore.FetchChain('getAsset', '1.3.0');
    console.log(result);
} catch (e) {
    console.warn(e);
}
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

#### Contracts

You can deploy and call contracts using echojs-lib. For example:

```javascript
const { ContractFrame, PrivateKey } = require('echojs-lib');

const contractFrame = new ContractFrame();
const privateKey = PrivateKey.fromWif('5JMontd8b8iPWrAU36PRYhWBwPhhv1RQGNTxjtrSLodoioqHA7k');

const call = await contractFrame.callContract({
    accountId: '1.2.1',
    contractId: '1.16.1',
    bytecode: 'a9059cbb000000000000000000000000000000000000000000000000000000000000005d0000000000000000000000000000000000000000000000000000000000000001',
}, privateKey);

const deploy = await contractFrame.deployContract({
    accountId: '1.2.1',
    bytecode: '608060405234801561001057600080fd5b506040805190810160405280600581526020017f46495845440000000000000000000000000000000000000000000000000000008152506000908051906020019061005c9291906100eb565b506040805190810160405280601a81526020017f4578616d706c6520466978656420537570706c7920546f6b656e000000000000815250600190805190602001906100a89291906100eb565b506012600260006101000a81548160ff021916908360ff160217905550600260009054906101000a900460ff1660ff16600a0a620f424002600381905550610190565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061012c57805160ff191683800117855561015a565b8280016001018555821561015a579182015b8281111561015957825182559160200191906001019061013e565b5b509050610167919061016b565b5090565b61018d91905b80821115610189576000816000905550600101610171565b5090565b90565b6107ba8061019f6000396000f30060806040526004361061008e576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde0314610093578063095ea7b31461012357806323b872dd14610188578063313ce5671461020d57806370a082311461023e57806395d89b4114610295578063cae9ca5114610325578063dd62ed3e146103d0575b600080fd5b34801561009f57600080fd5b506100a8610447565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100e85780820151818401526020810190506100cd565b50505050905090810190601f1680156101155780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561012f57600080fd5b5061016e600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506104e5565b604051808215151515815260200191505060405180910390f35b34801561019457600080fd5b506101f3600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610572565b604051808215151515815260200191505060405180910390f35b34801561021957600080fd5b5061022261057f565b604051808260ff1660ff16815260200191505060405180910390f35b34801561024a57600080fd5b5061027f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610592565b6040518082815260200191505060405180910390f35b3480156102a157600080fd5b506102aa6105db565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156102ea5780820151818401526020810190506102cf565b50505050905090810190601f1680156103175780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561033157600080fd5b506103b6600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610679565b604051808215151515815260200191505060405180910390f35b3480156103dc57600080fd5b50610431600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610707565b6040518082815260200191505060405180910390f35b60018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104dd5780601f106104b2576101008083540402835291602001916104dd565b820191906000526020600020905b8154815290600101906020018083116104c057829003601f168201915b505050505081565b600081600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506001905092915050565b6000600190509392505050565b600260009054906101000a900460ff1681565b6000600460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106715780601f1061064657610100808354040283529160200191610671565b820191906000526020600020905b81548152906001019060200180831161065457829003601f168201915b505050505081565b600082600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550600190509392505050565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050929150505600a165627a7a72305820046bd2dc1aba505a81a9536e9c45623b1e0ab3336a6d1e31bb2f2ee198c77b270029',
}, privateKey);

const info = await contractFrame.getContractInfo('1.16.1');
// info: { contract_info: { id: '1.16.8', statistics: '2.20.8', suicided: false }

const result = await contractFrame.getContractResult('1.17.1');

/* result:
    {
        "exec_res": {
            "excepted": "None",
            "new_address": "0000000000000000000000000000000000000000",
            "output": "0000000000000000000000000000000000000000000000000000000000000001",
            "code_deposit": "None",
            "gas_refunded": "0000000000000000000000000000000000000000000000000000000000000000",
            "deposit_size": 0,
            "gas_for_deposit": "0000000000000000000000000000000000000000000000000000000000000000"
        },
        "tr_receipt": {
            "status_code": "1",
            "gas_used": "0000000000000000000000000000000000000000000000000000000000008be1",
            "bloom": "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001400000000000000000000000002000004000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000010000000200000000000000000000000200002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            "log": [
                {
                    "address": "0100000000000000000000000000000000000008",
                    "log": [
                        "ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                        "0000000000000000000000000000000000000000000000000000000000000056",
                        "000000000000000000000000000000000000000000000000000000000000005d"
                    ],
                    "data": "0000000000000000000000000000000000000000000000000000000000000001"
                }
            ]
        }
    }
*/

const constant = await contractFrame.getContractConstant('1.16.1', '1.2.1', '1.3.0', '95d89b41');

// constant: 000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000067465737465740000000000000000000000000000000000000000000000000000

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
