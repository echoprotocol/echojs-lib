import Type from './type';

export { default as uint8 } from './basic-types/integers/uint8';
export { default as uint16 } from './basic-types/integers/uint16';
export { default as uint32 } from './basic-types/integers/uint32';
export { default as uint64 } from './basic-types/integers/uint64';
export { default as varint32 } from './basic-types/integers/varint32';
export { default as int64 } from './basic-types/integers/int64';
// address
// bool
export { default as bytes } from './basic-types/bytes';
// fixed array
// id
// map
export { default as id, protocolId } from './basic-types/id';
// objectId
export { default as optional } from './basic-types/optional';
export { default as publicKey } from './basic-types/public-key-type';
export { default as set } from './basic-types/set';
// static variant
// string
// time point seconds
// vote id

export const voidType = new Type();
