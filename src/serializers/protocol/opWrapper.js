import ISerializer from '../ISerializer';

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

	/** @param {import("../operation").default} operationSerializer */
	init(operationSerializer) {
		if (this.operationSerializer) throw new Error('already inited');
		if (!(operationSerializer instanceof ISerializer)) throw new Error('inited with no serializer');
		this._operationSerializer = operationSerializer;
	}

	/**
	 * @template {import('../../echo/transaction').OperationId} T
	 * @param {[T, { [key: string]: any }]} value
	 * @returns {[T, { [key: string]: any }]}
	 */
	toRaw(value) {
		if (!this.operationSerializer) throw new Error('operation wrapper is not inited');
		return this.operationSerializer.toRaw(value);
	}

}

const opWrapper = new OperationWrapperSerializer();
export default opWrapper;
