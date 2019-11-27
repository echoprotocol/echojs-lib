import { strictEqual } from 'assert';
import { serializers } from '../..';

const { voteId: voteIdSer } = serializers.protocol;

describe('vote id', () => {
	describe('when should succeed', () => {
		const input = '123:456';
		const buffer = voteIdSer.serialize(input);
		/** @type {typeof voteId_s['__TOutput__']} */
		let result;
		let rejects = true;
		it('should not rejects', () => {
			result = voteIdSer.deserialize(buffer);
			rejects = false;
		});
		it('should returns correct value', function () {
			if (rejects) this.skip();
			strictEqual(result, input);
		});
	});
});
