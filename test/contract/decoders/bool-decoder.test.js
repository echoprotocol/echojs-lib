import 'mocha';
import { strictEqual } from 'assert';
import { expect } from 'chai';
import decode, { decodeBool } from '../../../src/contract/decoders';

describe('bool', () => {
	it('failure', () => expect(() => decodeBool('not_a_boolean')).to.throw(Error, 'unable to decode bool'));
	it('true', () => {
		strictEqual(decodeBool('0000000000000000000000000000000000000000000000000000000000000001'), true);
	});
	it('false', () => {
		strictEqual(decodeBool('0000000000000000000000000000000000000000000000000000000000000000'), false);
	});
	it('decode by default function', () => {
		strictEqual(decode('0000000000000000000000000000000000000000000000000000000000000001', ['bool']), true);
		strictEqual(decode('0000000000000000000000000000000000000000000000000000000000000000', ['bool']), false);
		const func = () => decode('0123456789abcdeffedbca98765432100123456789abcdeffedbca9876543210', ['bool']);
		expect(func).to.throw(Error, 'unable to decode bool');
	});
});
