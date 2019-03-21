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

#### Echo rand keys (ED25519)
As a quick example, here's how to generate a rand key from a seed:

```javascript
import { ED25519 } from 'echojs-lib';
import bs58 from 'bs58';

const edKeyPair = ED25519.createKeyPair();
const echoRandPublicKey = `DET${bs58.encode(edKeyPaire.publicKey)}`;

console.log('Public echo rand key :', echoRandPublicKey);
console.log('Private echo rand key :', edKeyPaire.privateKey.toString('hex'));
```