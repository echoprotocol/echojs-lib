import Type from '../type';
import PublicKey from '../../crypto/public-key';

class PublicKeyType extends Type {

	validate(value) {
		if (value instanceof PublicKey) return;
		if (typeof value !== 'string') throw new Error('invalid publicKey type');
		PublicKey.fromStringOrThrow(value);
	}

	appendToByteBuffer() { super.appendToByteBuffer(); }

}

const publicKey = new PublicKeyType();

export default publicKey;
