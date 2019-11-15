import * as ids from './id';
import PublicKeySerializer from './PublicKey';
import PrivateKeySerializer from './PrivateKey';
import { bytes } from '../basic';
import { uint16 } from '../basic/integers';

export { default as asset } from './asset';
export { default as extensions } from './extensions';
export { default as futureExtension } from './future_extension';

export const publicKey = new PublicKeySerializer();
export const privateKey = new PrivateKeySerializer();
export const weight = uint16;
export const ripemd160 = bytes(20);
export const sha256 = bytes(32);
export const checksum = ripemd160;

export { ids, PublicKeySerializer, PrivateKeySerializer };
