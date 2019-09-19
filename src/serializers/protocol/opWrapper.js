import ISerializer from '../ISerializer';

/** @typedef {import("../../echo/transaction").OperationId} OperationId */

class OperationWrapperSerializer extends ISerializer {

	/**
	 * @readonly
	 * @type {ISerializer}
	 */
	get operationSerializer() { return this._operationSerializer; }

	constructor() {
		super();
		/**
		 * @private
		 * @type {ISerializer}
		 */
		this._operationSerializer = null;
	}

	/** @private */
	onlyIfInited() { if (!this.operationSerializer) throw new Error('operation wrapper is not inited'); }

	/** @param {import("../operation").default} operationSerializer */
	init(operationSerializer) {
		if (this.operationSerializer) throw new Error('already inited');
		if (!(operationSerializer instanceof ISerializer)) throw new Error('inited with no serializer');
		this._operationSerializer = operationSerializer;
	}

	/**
	 * @template {OperationId} T
	 * @param {[T, { [key: string]: any }]} value
	 * @returns {[T, { [key: string]: any }]}
	 */
	toRaw(value) {
		this.onlyIfInited();
		return this.operationSerializer.toRaw(value);
	}

	/**
	 * @template {OperationId} T
	 * @param {Buffer} buffer
	 * @param {number} [offset]
	 * @returns {{ res: [T, { [key: string]: any }], newOffset: number }}
	 */
	readFromBuffer(buffer, offset = 0) {
		this.onlyIfInited();
		return this.operationSerializer.readFromBuffer(buffer, offset);
	}

}

const opWrapper = new OperationWrapperSerializer();
export default opWrapper;
