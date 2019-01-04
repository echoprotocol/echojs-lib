/* eslint-disable import/prefer-default-export */
import operation from '../serializer/operation';
import { asset, memoData } from '../serializer/types';
import { optional, protocolId } from '../serializer/basic-types';
import { OBJECT_TYPE } from '../constants/chain-types';

/** @typedef {import('../serializer/operation').Operation} Operation */

export const transfer = operation(0, {
	fee: asset,
	from: protocolId(OBJECT_TYPE.ACCOUNT),
	to: protocolId(OBJECT_TYPE.ACCOUNT),
	amount: asset,
	memo: optional(memoData),
});

/** @type {{[operationName:string]:Operation}} */
const operations = {
	transfer,
};

for (const operationName in operations) {
	if (!Object.prototype.hasOwnProperty.call(operations, operationName)) continue;
	const operationType = operations[operationName];
	operations[operationType.id] = operationType;
}

export default operations;
