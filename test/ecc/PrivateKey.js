const { strictEqual } = require('assert');
const bs58 = require('bs58');
const { ED25519, PrivateKey } = require('../../index');

describe('PrivateKey', () => {

    it('Public key from private ', async () => {

        const edPrivate = 'DET5oLTA94JqbUGVskymaykqudd7DM6sjmEjrYvzZjSRsRt';
        const edPrivateWithoutDET = '5oLTA94JqbUGVskymaykqudd7DM6sjmEjrYvzZjSRsRt';
        const edPrivateWithoutDETDecoded = bs58.decode(edPrivateWithoutDET);
        const edPrivateWithoutHex = edPrivateWithoutDETDecoded.toString('hex');
        const res = ED25519.keyPairFromPrivateKey(edPrivateWithoutHex);

        const publicKey = `DET${bs58.encode(res.publicKey)}`;
        const privateKey = `DET${bs58.encode(res.privateKey)}`;
        const prKey = PrivateKey.fromBuffer(res.privateKey);

        strictEqual(publicKey, prKey.toPublicKey().toPublicKeyString());
        strictEqual(edPrivate, privateKey);

    });
});
