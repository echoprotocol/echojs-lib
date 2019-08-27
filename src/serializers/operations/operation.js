import * as props from './props';
import { staticVariant } from '../collections';
import ISerializer from '../ISerializer';
import { OPERATIONS_IDS, ECHO_ASSET_ID } from '../../constants';

/**
 * @template {ISerializer} T
 * @typedef {import("../ISerializer").SerializerInput<T>} SerializerInput
 */

const operationProps = {
	[OPERATIONS_IDS.TRANSFER]: props.transfer,
	[OPERATIONS_IDS.ACCOUNT_CREATE]: props.accountCreate,
	[OPERATIONS_IDS.ACCOUNT_UPDATE]: props.accountUpdate,
};

const operationSerializer = staticVariant(operationProps);

/** @typedef {typeof OPERATIONS_IDS[keyof typeof OPERATIONS_IDS]} OperationId */

/**
 * @template {OperationId} T
 * @typedef {T extends keyof typeof operationProps ? typeof operationProps[T] : unknown} OperationPropsSerializer
 */

/**
 * @template {OperationId} T
 * @typedef {SerializerInput<OperationPropsSerializer<T>>} OperationInput
 */

/**
 * @template {OperationId} T
 * @typedef {Omit<OperationInput<T>, 'fee'>} OperationInputWithoutFee
 */

/**
 * @template {OperationId} T
 * @typedef {OperationInputWithoutFee<T> & { fee?: Partial<OperationInput<T>['fee']> }} OperationInputWithUnrequiredFee
 */

/**
 * @template {OperationId} T
 * @template {boolean} TWithUnrequiredFee
 * @typedef {[T, TWithUnrequiredFee extends false ? OperationInput<T> : OperationInputWithUnrequiredFee<T>]} TInput
 */

/**
 * @template {OperationId} T
 * @typedef {[T, SerializerOutput<OperationPropsSerializer<T>>]} TOutput
 */

/**
 * @template {boolean} TWithUnrequiredFee
 * @typedef {TWithUnrequiredFee extends true ? true[] & { length: 1 } : []} ToRawMethodOptions
 */

/** @augments {ISerializer<TInput<OperationId, boolean>, TOutput<OperationId>>} */
export default class OperationSerializer extends ISerializer {

	/**
	 * @template {OperationId} T
	 * @template {boolean} TWithUnrequiredFee
	 * @param {TInput<T, TWithUnrequiredFee>} value
	 * @param {ToRawMethodOptions<TWithUnrequiredFee>} options
	 */
	toRaw(value, ...options) {
		const withUnrequiredFee = !!options[0];
		const input = value;
		if (withUnrequiredFee) {
			input[1] = {
				...input[1],
				fee: { asset_id: ECHO_ASSET_ID, amount: 0, ...input[1].fee },
			};
		}
		return operationSerializer.toRaw(input);
	}

	/**
	 * @template {OperationId} T
	 * @param {TInput<T, false>} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		return operationSerializer.appendToByteBuffer(value, bytebuffer);
	}

}
