import BigNumber from 'bignumber.js';
import { PROTOCOL_OBJECT_TYPE_ID } from '../../src/constants';

const CONTRACT_TYPE_ID = PROTOCOL_OBJECT_TYPE_ID.CONTRACT;

export const invalidContractIds = [
	`1.${CONTRACT_TYPE_ID}.`,
	`1${CONTRACT_TYPE_ID}.123`,
	`1.${CONTRACT_TYPE_ID}123`,
	`1.${CONTRACT_TYPE_ID}.`,
	`1.${CONTRACT_TYPE_ID}.0123`,
];

const checkContractIdTests = [
	...invalidContractIds.map((invalidContractId) => ({ test: invalidContractId, error: 'invalid contractId format' })),
	{
		test: 'eq 2**152',
		value: `1.${CONTRACT_TYPE_ID}.${new BigNumber(2).pow(152).toString(10)}`,
		error: 'contractId is greater than or equals to 2**152',
	},
	{
		test: 'gt 2**152',
		value: `1.${CONTRACT_TYPE_ID}.${new BigNumber('1e46').toString(10)}`,
		error: 'contractId is greater than or equals to 2**152',
	},
];

export default checkContractIdTests;
