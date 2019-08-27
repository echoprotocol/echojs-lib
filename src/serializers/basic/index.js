import * as integers from './integers';
import BytesSerializer from './Bytes';
import StringSerializer from './StringSerializer';
import TimePointSecSerializer from './TimePointSec';

/**
 * @param {number} bytesCount
 * @returns {BytesSerializer}
 */
export const bytes = (bytesCount) => new BytesSerializer(bytesCount);

export const string = new StringSerializer();
export const timePointSec = new TimePointSecSerializer();

export { integers, BytesSerializer, TimePointSecSerializer };
