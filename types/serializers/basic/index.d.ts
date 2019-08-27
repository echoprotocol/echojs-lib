import * as integers from './integers';
import BytesSerializer from './Bytes';
import StringSerializer from './StringSerializer';
import TimePointSecSerializer from './TimePointSec';

export function bytes(bytesCount: number): BytesSerializer;
export declare const timePointSec: TimePointSecSerializer;
export declare const string: StringSerializer;

export { integers, BytesSerializer, StringSerializer, TimePointSecSerializer };
