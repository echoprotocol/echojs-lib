import * as integers from './integers';
import BoolSerializer from './Bool';
import BytesSerializer from './Bytes';
import StringSerializer from './StringSerializer';
import TimePointSecSerializer from './TimePointSec';
import VariantObjectSerializer from './VariantObject';

export const bool = new BoolSerializer();

/**
 * @param {number} bytesCount
 * @returns {BytesSerializer}
 */
export const bytes = (bytesCount) => new BytesSerializer(bytesCount);

export const string = new StringSerializer();
export const timePointSec = new TimePointSecSerializer();
export const variantObject = new VariantObjectSerializer();

export { integers, BoolSerializer, BytesSerializer, StringSerializer, TimePointSecSerializer, VariantObjectSerializer };
