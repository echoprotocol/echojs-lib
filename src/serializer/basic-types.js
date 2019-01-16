import Type from './type';

export { default as uint8 } from './basic-types/integers/uint8';
export { default as uint16 } from './basic-types/integers/uint16';
export { default as uint32 } from './basic-types/integers/uint32';
export { default as uint64 } from './basic-types/integers/uint64';
export { default as varint32 } from './basic-types/integers/varint32';
export { default as int64 } from './basic-types/integers/int64';
export { default as address } from './basic-types/address';
export { default as bool } from './basic-types/bool';
export { default as bytes } from './basic-types/bytes';
export { default as fixedArray } from './basic-types/fixed-array';
export { default as array } from './basic-types/array';
export { default as id } from './basic-types/id';
export { default as protocolId } from './basic-types/protocolId';
export { default as map } from './basic-types/map';
export { default as objectId } from './basic-types/object-id';
export { default as optional } from './basic-types/optional';
export { default as publicKey } from './basic-types/public-key-type';
export { default as set } from './basic-types/set';
export { default as staticVariant } from './basic-types/static-variant';
export { default as string } from './basic-types/string';
export { default as timePointSec } from './basic-types/time-point-sec';
export { default as voteId } from './basic-types/voteId';

export const empty = new Type();
