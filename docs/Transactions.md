## Table of contents

- [Transactions](#transactions)
    - [Transfer](#transfer)
    - [Account create](#account-create)
    - [Create contract operation](#create-contract-operation)
    - [Call contract operation](#call-contract-operation)
    - [Create asset operation](#create-asset-operation)
    - [Issue asset](#issue-asset)
    - [Account update operation](#account-update-operation)

### Transactions
Using transaction builder you can build and broadcast transaction.

#### Transfer
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
    extensions: [],
};

tx.addOperation(constants.OPERATIONS_IDS.TRANSFER, options);

tx.addSigner(privateKey);

await tx.broadcast(() => console.log('was broadcasted'));
```

#### Account create
```javascript
import echo, { constants, Transaction, PrivateKey } from 'echolib-js';

await echo.connect('ws://127.0.0.1:9000');

const tx = echo.createTransaction();

const privateKey = PrivateKey
	.fromWif('P5JtT3rnTcNfw4RhzDBCC99kDyr8k3YnDZ4m7LCCcRf6r');

const options = {
    ed_key: "f2e2bf07dc5fe2d49d68b3e53a54fc74de149737d342c2f920bcf55e5ffcdf02",
    registrar: "1.2.20",
    referrer: "1.2.20",
    referrer_percent: 0,
    name: "new-user",
    owner: { // by default has key_auths
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[
            "ECHO6tMhKMDpynSsLyFL3gk2gZi4xMayficom97fZQKh64FHtCpV7D",
            1,
        ]],
    },
    active: { // by default has key_auths
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[
            "ECHO6tMhKMDpynSsLyFL3gk2gZi4xMayficom97fZQKh64FHtCpV7D",
            1,
        ]],
    },
    options: {
        voting_account: "1.2.1",
        delegating_account: "1.2.1",
        num_committee: 0,
        votes: [],
        extensions: [],
    },
};

tx.addOperation(constants.OPERATIONS_IDS.ACCOUNT_CREATE, options);

tx.addSigner(privateKey);

await tx.broadcast();

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
    .addOperation(constants.OPERATIONS_IDS.CONTRACT_CREATE, options)
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
    .addOperation(constants.OPERATIONS_IDS.CONTRACT_CALL, options)
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

#### Issue asset
```js
import echo, { OPERATIONS_IDS } from "echojs-lib";
const wif = '5K2YUVmWfxbmvsNxCsfvArXdGXm7d5DC9pn4yD75k2UaSYgkXTh';
await echo.connect('ws://127.0.0.1:6311');
const tx = echo.createTransaction();
tx.addOperation(OPERATIONS_IDS.ASSET_ISSUE, {
	asset_to_issue: { asset_id: '1.3.1', amount: 123 },
	issue_to_account: '1.2.12',
	issuer: '1.2.23',
});
tx.addSigner(PrivateKey.fromWif(wif));
await tx.broadcast();
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
    .addOperation(constants.OPERATIONS_IDS.CONTRACT_CALL, options)
    .addSigner(privateKey)
    .addSigner(privateKey)
    .addSigner(privateKey)
    .broadcast();
```

Or sign first and then broadcast:

```javascript
const tr = await echo
    .createTransaction()
    .addOperation(constants.OPERATIONS_IDS.TRANSFER, options)
    .sign(privateKey);

await tr.broadcast();
```
