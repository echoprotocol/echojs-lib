import { set, string } from "../../src/serializer/basic-types";
import { deepStrictEqual } from "assert";

describe('set', () => {
	it('validate returns Array', () => {
		deepStrictEqual(set(string).validate(new Set(['qwe', 'asd'])), ['qwe', 'asd']);
	});
});
