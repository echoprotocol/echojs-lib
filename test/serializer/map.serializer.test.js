import { strictEqual, ok, deepStrictEqual } from "assert";
import BigNumber from "bignumber.js";
import ByteBuffer from "bytebuffer";

import { shouldReject } from "../_test-utils";
import { map, string, uint32 } from "../../src/serializer/basic-types";

describe.only('map', () => {
	const _map = map(string, uint32);
	describe('validate', () => {
		describe('when invalid type provided', () => {
			shouldReject(() => _map.validate('invalid map type'), 'invalid map value');
		});
		describe('when element of value is not an array', () => {
			shouldReject(() => _map.validate(['not_an_array']), 'element of a value is not an array');
		});
		describe('when invalid count of subelements provided', () => {
			shouldReject(() => _map.validate([[1, 2, 3]]), 'expected 2 subelements (key and value)');
		});
		describe('when several same keys are provided', () => {
			shouldReject(() => _map.validate([['a', 1], ['a', 2]]), 'keys duplicates');
		});
		describe('when key is string-type, but first element\'s key is not a string', () => {
			shouldReject(() => {
				_map.validate([[1, 1]]);
			}, 'key of map at element with index 0: Error: value is not a string');
		});
		describe('when value is integer-type, but first element\'s value is not a integer', () => {
			shouldReject(() => {
				_map.validate([['key', 'not a number']]);
			}, 'value of map at element with index 0: Error: value is not a integer');
		});
		describe('when two elements has the same serialization result', () => {
			shouldReject(() => {
				map(uint32, uint32).validate([[new BigNumber(0), 0], [new BigNumber(0), 1]]);
			}, 'keys duplicates');
		});
		describe('when valid entries provided', () => {
			const entries = [['a', 0]];
			let result;
			it('not rejects', () => result = _map.validate(entries));
			it('returns the same entries', function () {
				if (!result) this.skip();
				strictEqual(entries, result);
			});
		});
		describe('when valid Map provided', () => {
			const value = new Map([['a', 0]]);
			let result;
			it('not rejects', () => result = _map.validate(value));
			it('returns array', function () {
				if (!result) this.skip();
				ok(Array.isArray(result));
			});
			it('with provided entries', function () {
				if (!result || !Array.isArray(result)) this.skip();
				deepStrictEqual(result, [...value.entries()]);
			});
		});
		describe('when dict provided', () => {
			const dict = { a: 0 };
			let result;
			it('not rejects', () => result = _map.validate(dict));
			it('returns array', function () {
				if (!result) this.skip();
				ok(Array.isArray(result));
			});
			it('with provided entries', function () {
				if (!result || !Array.isArray(result)) this.skip();
				deepStrictEqual(result, [['a', 0]]);
			});
		});
	});

	describe('append to ByteBuffer', () => {
		describe('when Map provided', () => {
			const byteBuffer = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);
			it('not rejects', () => _map.appendToByteBuffer(new Map([['a', 0]]), byteBuffer));
			it('appending succeed', () => {
				strictEqual(byteBuffer.copy(0, byteBuffer.offset).toString('hex'), '01016100000000');
			});
		});
	});

	describe('to object', () => {
		describe('when dict provided', () => {
			let result;
			it('should not rejects', () => result = _map.toObject({ a: new BigNumber(0) }));
			it('should return entries', function () {
				if (!result) this.skip();
				deepStrictEqual(result, [['a', 0]]);
			});
		});
	});
});
