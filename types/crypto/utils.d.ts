import {Buffer} from 'buffer';
import PrivateKey from './private-key';

declare function signData(data: Buffer, privateKeys: PrivateKey[]): Buffer;

export default interface Utils {
	signData(data: Buffer, privateKeys: PrivateKey[]): Buffer,
}
