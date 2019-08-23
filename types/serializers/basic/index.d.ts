import * as integers from './integers';
import BytesSerializer from './Bytes';
import TimePointSecSerializer from './TimePointSec';

export function bytes(bytesCount: number): BytesSerializer;
export declare const timePointSec: TimePointSecSerializer;

export { integers, BytesSerializer, TimePointSecSerializer };
