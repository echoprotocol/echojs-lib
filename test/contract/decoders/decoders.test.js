import 'mocha';
import { expect } from 'chai';
import decode from '../../../src/contract/decoders';

describe('decoders', () => {
	it('unknown type', () => {
		const func = () => decode('0123456789abcdeffedbca98765432100123456789abcdeffedbca9876543210', ['unknown_type']);
		expect(func).to.throw(Error, 'unknown type unknown_type');
	});
	it('invalid code length', () => {
		const func = () => decode('0123', ['qwe']);
		expect(func).to.throw(Error, 'length of code is not divisible by 32 bytes');
	});
	require('./bool-decoder.test');
	require('./unsigned-integer-decoder.test');
	require('./signed-integer-decoder.test');
	require('./address-decoder.test');
	require('./dynamic-bytes-decoder.test');
	require('./string-decoder.test');
	require('./static-bytes-decoder.test');
	require('./dynamic-array.test');
});
