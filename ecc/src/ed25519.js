const { createKeyPair, derivePublicKey } = require('ed25519.js');

class ED25519 {

	/**
     *  @method keyPairFromPrivateKey
     *
     *  @param {String|Buffer} privateKey - 32 byte hex string.
     *
     *  @return {{privateKey:Buffer,publicKey:Buffer}} ed25519 privateKey and public key
     */
	static keyPairFromPrivateKey(privateKey) {
		if (!((typeof privateKey === 'string') || Buffer.isBuffer(privateKey))) {
			throw new Error('private key must be string of buffer');
		}

		if (typeof privateKey === 'string') privateKey = Buffer.from(privateKey, 'hex');

		if (privateKey.length !== 32) {
			throw new Error(`Expecting 32 bytes, instead got ${privateKey.length}`);
		}

		const publicKey = derivePublicKey(privateKey);
		return { privateKey, publicKey };
	}

	/**
     *  @method createKeyPair
     *
     *  @return {{privateKey:Buffer,publicKey:Buffer}} ed25519 privateKey and public key
     */
	static createKeyPair() {
		return createKeyPair();
	}

}

module.exports = ED25519;
