import * as ids from "./id";
import PublicKeySerializer from "./PublicKey";
import { BytesSerializer } from "../basic";
import { uint16 } from "../basic/integers";

export { default as asset } from "./asset";
export { default as extensions } from "./extensions";
export { default as futureExtension } from "./future_extension";

export declare const publicKey: PublicKeySerializer;
export declare const weight: typeof uint16;
export declare const ripemd160: BytesSerializer;

export { ids, PublicKeySerializer };
