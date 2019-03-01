### Transactions
Using transaction builder you can build and broadcast transaction.

#### Transfer with memo 
```javascript
import echo, { constants, Transaction, PrivateKey } from 'echolib-js';

await echo.connect('ws://127.0.0.1:9000');

const tx = echo.createTransaction();

const privateKey = PrivateKey
	.fromWif('P5JtT3rnTcNfw4RhzDBCC99kDyr8k3YnDZ4m7LCCcRf6r');

const options = {
    fee: { // optional, default fee asset: 1.3.0, amount: will be calculated
        asset_id: '1.3.0'        
    },
    from: '1.2.20',
    to: '1.2.21',
    amount: {
        asset_id: '1.3.0',
        amount: 1
    },
    memo: { // optional
        from: 'ECHO6tMhKMDpynSsLyFL3gk2gZi4xMayficom97fZQKh64FHtCpV7D', // memo key
        to: 'ECHO8gP5V1F9cudUHxxoDb66BwiEPUB4ZQmwgtLXDrXaQAuJWb921w', // memo key
        nonce: 424252442,
        message: '746573745F6D657373616765', // hex string
    },
    extensions: [],
};

tx.addOperation(constants.OPERATIONS_IDS.TRANSFER, options);

tx.addSigner(privateKey);

await tx.broadcast(() => console.log('was broadcasted'));
```
#### Create contract operation
```javascript
import echo, { constants, PrivateKey } from 'echolib-js';

await echo.connect('ws://127.0.0.1:9000');

const privateKey = PrivateKey
	.fromWif('P5JtT3rnTcNfw4RhzDBCC99kDyr8k3YnDZ4m7LCCcRf6r');

const bytecode = '...'; // contract bytecode 
const constructorParameters = '...'; // constructor parameters

const options = {
    fee: { // optional, default fee asset: 1.3.0, amount: will be calculated
        asset_id: '1.3.0'        
    },
    registrar: '1.2.20',
    value: { asset_id: '1.3.0', amount: 1 }, // transfer asset to contract
    code: bytecode + constructorParameters,
    eth_accuracy: false,
};

await echo
    .createTransaction()
    .addOperation(constants.OPERATIONS_IDS.CREATE_CONTRACT, options)
    .addSigner(privateKey)
    .broadcast();
```

#### Call contract operation
```javascript
import echo, { constants, PrivateKey } from 'echolib-js';

await echo.connect('ws://127.0.0.1:9000');

const privateKey = PrivateKey
	.fromWif('P5JtT3rnTcNfw4RhzDBCC99kDyr8k3YnDZ4m7LCCcRf6r');

const method = '...'; // method
const methodParameters = '...'; // parameters 

const contractId = '1.16.20';

const options = {
    fee: { // optional, default fee asset: 1.3.0, amount: will be calculated
        asset_id: '1.3.0'        
    },
    registrar: '1.2.20',
    value: { // if method mark as payable you can transfer asset, if not set amount to 0
        asset_id: '1.3.0',
        amount: 1,
    },
    code: method + methodParameters,
    callee: contractId,
};

await echo
    .createTransaction()
    .addOperation(constants.OPERATIONS_IDS.CALL_CONTRACT, options)
    .addSigner(privateKey)
    .broadcast();
```

#### Create asset operation
```javascript
import echo, { constants, PrivateKey } from 'echolib-js';

await echo.connect('ws://127.0.0.1:9000');

const privateKey = PrivateKey
	.fromWif('P5JtT3rnTcNfw4RhzDBCC99kDyr8k3YnDZ4m7LCCcRf6r');

const options = {
    fee: { // optional, default fee asset: 1.3.0, amount: will be calculated
        asset_id: '1.3.0'        
    },
    issuer: '1.2.20',
    symbol: 'NEWASSET',
    precision: 5,
    common_options: {
        max_supply: 1000000000000000,
        market_fee_percent: 0,
        max_market_fee: 1000000000000000,
        issuer_permissions: 79,
        flags: 0,
        core_exchange_rate: {
            base: {
                amount: 10,
                asset_id: '1.3.0',
            },
            quote: {
                amount: 1,
                asset_id: '1.3.1',
            }
        },
        whitelist_authorities: [],
        blacklist_authorities: [],
        whitelist_markets: [],
        blacklist_markets: [],
        description: '',
    },
    bitasset_opts: undefined, // optional
    is_prediction_market: false,
};

await echo
    .createTransaction()
    .addOperation(constants.OPERATIONS_IDS.ASSET_CREATE, options)
    .addSigner(privateKey)
    .broadcast();
```


#### Account update operation
```javascript
import echo, { constants, PrivateKey } from 'echolib-js';

await echo.connect('ws://127.0.0.1:9000');

const privateKey = PrivateKey
	.fromWif('P5JtT3rnTcNfw4RhzDBCC99kDyr8k3YnDZ4m7LCCcRf6r');

const options = {
    fee: { // optional, default fee asset: 1.3.0, amount: will be calculated
        asset_id: '1.3.0'        
    },
    account: '1.2.20',
    ed_key: '342bb415d4dbefb4924e0d8a0c3041cc18c0c73fc077757197a937e5f9555eab', // optional
    active: { // optional
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[
            'ECHO4tmRW8HFwLSJR1wxPp5at3qeJ2XcfSwpKpAM6AQE8dZugqBtU7',
            1
          ]],
        address_auths: []
    }
};

await echo
    .createTransaction()
    .addOperation(constants.OPERATIONS_IDS.ACCOUNT_UPDATE, options)
    .addSigner(privateKey)
    .broadcast();
```

You can add few operations and signers using this constructions:

```javascript
await echo
    .createTransaction()
    .addOperation(constants.OPERATIONS_IDS.TRANSFER, options)
    .addOperation(constants.OPERATIONS_IDS.TRANSFER, options)
    .addOperation(constants.OPERATIONS_IDS.CALL_CONTRACT, options)
    .addSigner(privateKey)
    .addSigner(privateKey)
    .addSigner(privateKey)
    .broadcast();
```

If you have only one signer you can reduce parts of code:

```javascript
await echo
    .createTransaction()
    .addOperation(constants.OPERATIONS_IDS.TRANSFER, options)
    .broadcast(privateKey);
```

Or sign first and then broadcast:

```javascript
const tr = await echo
    .createTransaction()
    .addOperation(constants.OPERATIONS_IDS.TRANSFER, options)
    .sign(privateKey)
await tr.broadcast();
```
