import * as props from './props';

/** @typedef {import("../../constants/operations-ids")} OPERATIONS_IDS */

/**
 * @typedef {Object} OperationIdByPropName
 * @property {OPERATIONS_IDS['TRANSFER']} transfer
 */

/**
 * @template {keyof typeof props} T
 * @typedef {OperationIdByPropName[T]} OperationWithPropName
 */

/**
 * @template {keyof typeof props} T
 * @param {T} opName
 * @returns {OperationWithPropName<T>}
 */
export default function getOperationIdByName(opName) {
	const serializer = props[opName];
	if (!serializer) throw new Error(`unknown operation name ${opName}`);
}
