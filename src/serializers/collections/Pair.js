import ISerializer from '../ISerializer';

export default class PairSerializer extends ISerializer {

	get firstSerializer() { return this._firstSerializer; }

	get secondSerializer() { return this._secondSerializer; }


	constructor(firstSerializer, secondSerializer) {
		if (!(firstSerializer instanceof ISerializer)) throw new Error('key is not serializer');
		if (!(firstSerializer instanceof ISerializer)) throw new Error('value is not serializer');
		super();
		/**
		 * @private
		 * @type {TKey}
		 */
		this._firstSerializer = firstSerializer;
		/**
		 * @private
		 * @type {TValue}
		 */
		this._secondSerializer = secondSerializer;
	}

	toRaw(value) {
		const raw = new Array(2);
		try {
			raw[0] = this.firstSerializer.toRaw(value[0]);
			raw[1] = this.secondSerializer.toRaw(value[1]);
		} catch (error) {
			throw new Error(`Unable to serialize pair: ${error.message}`);
		}
		return raw;
	}

	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		this.firstSerializer.appendToByteBuffer(raw[0], bytebuffer);
		this.secondSerializer.appendToByteBuffer(raw[1], bytebuffer);
	}

	readFromBuffer(buffer, offset = 0) {
		const result = [];
		let it = offset;

		const { res: firstElement, newOffset: intermediateOffset } = this.firstSerializer.readFromBuffer(buffer, it);
		result.push(firstElement);
		it = intermediateOffset;

		const { res: secondElement, newOffset } = this.secondSerializer.readFromBuffer(buffer, it);
		result.push(secondElement);
		it = newOffset;

		return { res: result, newOffset: it };
	}

}
