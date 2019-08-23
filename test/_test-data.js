import { PrivateKey } from "../src";
import { ACCOUNT, CONTRACT } from '../src/constants/object-types';

export const privateKey = PrivateKey.fromWif('5KkYp8qdQBaRmLqLz8WVrGjzkt7E13qVcr7cpdLowgJ1mjRyDx2');
export const accountName = 'nathan';
export const accountId = `1.${ACCOUNT}.10`;
export const contractId = `1.${CONTRACT}.0`;

export const url = 'ws://127.0.0.1:6311';

export const ED_PRIVATE = '5eePidTGLR7ecWiQB1b7osm1iMDfQo2HKAzfyN4QDma4';
export const ED_PRIVATE_WITHOUT_PREFIX = '5eePidTGLR7ecWiQB1b7osm1iMDfQo2HKAzfyN4QDma4';
export const WIF = '5JLi3M4H9qY3FMTyGW9TCC92ebbqNo36sUHwJqpKxvJMWN2XwbH';
