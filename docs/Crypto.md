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
const { privateKey, publicKey } = privateKeyFromPassword(accountName, role, password);

console.log('Private key:', privateKey.toWif());
console.log('Public key :', publicKey);
```

#### Echo rand keys (ED25519)
As a quick example, here's how to generate a rand key from a seed:

```javascript
import { ED25519 } from 'echojs-lib';
import bs58 from 'bs58';
import random from 'crypto-random-string';

const EchoRandKeyBuffer = ED25519.keyPairFromSeed(Buffer.from(random(32)));
const echoRandPublicKey = Buffer.from(EchoRandKeyBuffer.publicKey, 'hex');
const echoRandKey = `DET${bs58.encode(echoRandPublicKey)}`;

console.log('Public echo rand key :', echoRandKey);
console.log('Private echo rand key :', EchoRandKeyBuffer.privateKey);
```