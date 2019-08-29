import * as ids from './id';
import PublicKeySerializer from './PublicKey';
import { bytes } from '../basic';
import { uint16 } from '../basic/integers';

export { default as asset } from './asset';
export { default as extensions } from './extensions';
export { default as futureExtension } from './future_extension';

export const publicKey = new PublicKeySerializer();
export const weight = uint16;
export const ripemd160 = bytes(20);

export { ids, PublicKeySerializer };
