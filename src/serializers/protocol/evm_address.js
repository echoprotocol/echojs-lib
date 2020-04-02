import { asset, extensions } from '../chain';
import { accountId } from '../chain/id/protocol';
import { struct } from '../collections';
import ethAddress from './ethAddress';


const evmAddressRegisterOperationPropsSerializer = struct({
	fee: asset,
	owner: accountId,
	evm_address: ethAddress,
	extensions,
});

export default evmAddressRegisterOperationPropsSerializer;
