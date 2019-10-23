
import Signature from './signature';
import PrivateKey from './private-key';

/**
 *  @method signData
 *
 *  @param  {Buffer} data
 *  @param  {PrivateKey[]} privateKeys
 *
 *  @return {Buffer}
 */
export function signData(data, privateKeys) {

	if (!Array.isArray(privateKeys)) throw new Error('Private Keys field is not an array');
	if (!privateKeys.length) throw new Error('Private Keys length should be more than 0');
	if (!Buffer.isBuffer(data)) throw new Error('invalid data type');
	if (!privateKeys.some((key) => key instanceof PrivateKey)) {
		throw new Error('one of the elements in an array is not PrivateKey');
	}

	return Buffer.concat(privateKeys.map((privateKey) => Signature.signBuffer(data, privateKey).toBuffer()));

}

export default {
	signData,
};
