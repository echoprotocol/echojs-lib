## Table of contents

- [ECC](#ecc)
    - [Private keys](#private-keys)
    - [Echorand keys (ED25519)](#echorand-keys-ed25519)
    - [Random keys](#random-keys)
    - [Sign Data](#sign-data)

### ECC
The ECC library contains all the crypto functions for private and public keys as well as transaction creation/signing.

#### Private keys
As a quick example, here's how to generate a new private key from a seed:

```javascript
import { PrivateKey } from 'echojs-lib';

const privateKeyFromPassword = (accountName, role, password) => {
  	const seed = `${accountName}${role}${password}`;
  	const privateKey = PrivateKey.fromSeed(seed);
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

#### Echorand keys (ED25519)
As a quick example, here's how to generate a rand key from a seed:

```javascript
import { ED25519 } from 'echojs-lib';
import bs58 from 'bs58';

const edKeyPair = ED25519.createKeyPair();
const echoRandPublicKey = `ECHO${bs58.encode(edKeyPair.publicKey)}`;

console.log('Public echorand key :', echoRandPublicKey);
console.log('Private echorand key :', edKeyPair.privateKey.toString('hex'));
```

#### Random keys
As a quick example, here's how to generate a random key:

```javascript
import { ED25519, PrivateKey } from 'echojs-lib';

const edKeyPair = ED25519.createKeyPair();
const privateKey = PrivateKey.fromBuffer(edKeyPair.privateKey);

console.log('Random private key :', privateKey.toWif());
console.log('Random public key :', privateKey.toPublicKey().toPublicKeyString());
```

#### Sign Data

As a quick example, here's how to sign data:

```javascript
import { PrivateKey, crypto } from 'echojs-lib';

const buffer = Buffer.from('test', 'utf-8');
const result = crypto.utils.signData(buffer, [PrivateKey.fromWif('5JLi3M4H9qY3FMTyGW9TCC92ebbqNo36sUHwJqpKxvJMWN2XwbH')]);

console.log('Signed data:', result.toString('hex'));
```
