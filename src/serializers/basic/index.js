import * as integers from './integers';
import BytesSerializer from './Bytes';
import TimePointSecSerializer from './TimePointSec';

/**
 * @param {number} bytesCount
 * @returns {BytesSerializer}
 */
export const bytes = (bytesCount) => new BytesSerializer(bytesCount);

export const timePointSec = new TimePointSecSerializer();

export { integers, BytesSerializer, TimePointSecSerializer };
