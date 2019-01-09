import Type from '../type';
import { validateUnsignedSafeInteger } from '../../utils/validators';

class VoteIdType extends Type {

	/**
	 * @param {string|{type:number,id:number}} value
	 * @return {{type:number,id:number}}
	 */
	validate(value) {
		if (typeof value === 'string') {
			if (!/^\d+:\d+$/.test(value)) throw new Error('invalid voteId format');
			const [type, id] = value.split(':').map((str) => Number.parseInt(str, 10));
			value = { type, id };
		} else if (typeof value !== 'object' || value === null) throw new Error('invalid voteId type');
		const { type, id } = value;
		validateUnsignedSafeInteger(type, 'vote type');
		validateUnsignedSafeInteger(id, 'vote id');
		if (type > 0xff) throw new Error('invalid type');
		if (id > 0xffffff) throw new Error('invalid id');
		return { type, id };
	}

	/**
	 * @param {string|{type:number,id:number}} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const { type, id } = this.validate(value);
		// eslint-disable-next-line no-bitwise
		bytebuffer.writeUint32((id << 8) | type);
	}

	/**
	 * @param {stirng|{type:number,id:number}} value
	 * @returns {string}
	 */
	toObject(value) {
		const { type, id } = this.validate(value);
		return `${type}:${id}`;
	}

}

export default new VoteIdType();
