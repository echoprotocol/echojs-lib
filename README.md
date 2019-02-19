# Echojs-lib (echojs-lib)

Pure JavaScript ECHO library for node.js and browsers. Can be used to construct, sign and broadcast transactions in JavaScript, and to easily obtain data from the blockchain via public apis.


## Setup

This library can be obtained through npm:
```
npm install echojs-lib
```

## Preparation

Launched echo node (https://github.com/echoprotocol/echo-core) with open port

## Usage

```javascript
import echo from 'echojs-lib';

await echo.connect('ws://127.0.0.1:9000');
const account = await echo.api.getObject('1.2.0');
```

You also can use it with require
```javascript
const { default: echo } = require('echojs-lib');	

await echo.connect('ws://127.0.0.1:9000');
const account = await echo.api.getObject('1.2.0');
```

To more examples and options look at section below


[Connection](docs/Connection.md) - More connections options

[API](docs/API.md) - List with all api methodes

[Subscriber](docs/Subscriber.md) - Subscriber module

[Cache](docs/Cache.md) - Information about cache

[Redux](docs/Redux.md) - Information about integrating lib cache to redux with auto update

[Transactions](docs/Transactions.md) - Transactions exampels

[Crypto](docs/Crypto.md) - Create private/public keys example

[Constants](docs/Constants.md) - List of constants you can use