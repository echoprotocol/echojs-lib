import * as integers from './integers';
import BoolSerializer from './Bool';
import BytesSerializer from './Bytes';
import StringSerializer from './StringSerializer';
import TimePointSecSerializer from './TimePointSec';
import VariantObjectSerializer from './VariantObject';

export declare const bool: BoolSerializer;
export function bytes(bytesCount: number): BytesSerializer;
export declare const timePointSec: TimePointSecSerializer;
export declare const string: StringSerializer;
export declare const variantObject: VariantObjectSerializer;

export { integers, BoolSerializer, BytesSerializer, StringSerializer, TimePointSecSerializer, VariantObjectSerializer };
