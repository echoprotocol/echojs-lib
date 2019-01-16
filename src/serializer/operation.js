import { Serializable } from './serializable';
import Type from './type';
import { validateUnsignedSafeInteger } from '../utils/validators';
import { ECHO_ASSET_ID } from '../constants';

class Operation extends Type {

	/**
	 * @readonly
	 * @type {number}
	 */
	get id() { return this._id; }

	/**
	 * @readonly
	 * @type {Serializable}
	 */
	get serializable() { return this._serializable; }

	/**
	 * @param {number} id
	 * @param {Serializable} serializable
	 */
	constructor(id, serializable) {
		validateUnsignedSafeInteger(id);
		if (!(serializable instanceof Serializable)) {
			if (typeof serializable !== 'object' || serializable === null) throw new Error('invalid serializable type');
			serializable = new Serializable(serializable);
		}
		super();
		/**
		 * @private
		 * @type {number}
		 */
		this._id = id;
		/**
		 * @private
		 * @type {Serializable}
		 */
		this._serializable = serializable;
	}

	/** @typedef {number} _OperationId */

	/**
	 * @param {{[key:string]:any}} props
	 * @returns {{[key:string]:any}}
	 */
	_withUnrequiredFees(props) {
		return {
			...props,
			fee: { asset_id: ECHO_ASSET_ID, amount: 0, ...props.fee },
		};
	}

	/**
	 * @param {[_OperationId,{[key:string]:any}]} value
	 * @param {boolean=true} feeIsRequired
	 */
	validate(value, feeIsRequired = true) {
		if (!Array.isArray(value)) throw new Error('operation is not an array');
		if (value.length !== 2) throw new Error('invalid count of operation elements');
		const [operationId, operationProps] = value;
		if (operationId !== this.id) throw new Error('invalid operation id');
		this.serializable.validate(feeIsRequired ? operationProps : this._withUnrequiredFees(operationProps));
	}

	/**
	 * @param {[_OperationId,{[key:string]:any}]} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		this.validate(value);
		this.serializable.appendToByteBuffer(value[1], bytebuffer);
	}

	/**
	 * @param {[_OperationId,{[key:string]:any}]} value
	 * @param {boolean=} feeIsRequired
	 */
	toObject(value, feeIsRequired = true) {
		this.validate(value, feeIsRequired);
		const [, operationProps] = value;
		return this.serializable.toObject(feeIsRequired ? operationProps : this._withUnrequiredFees(operationProps));
		// return [this.id, this.serializable.toObject(operationProps)];
	}

}

/**
 * @param {number} id
 * @param {Serializable} serializable
 * @returns {Operation}
 */
export default function operation(id, serializable) { return new Operation(id, serializable); }
export { Operation };
