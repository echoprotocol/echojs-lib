import { asset } from '../../chain';
import { accountId } from '../../chain/id/protocol';
import { struct } from '../../collections';
import { string as stringSerializer } from '../../basic';

export const sidechainBtcCreateAddressOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	backup_address: stringSerializer,
});


export const sidechainBtcDepositOperationPropsSerializer = struct({});