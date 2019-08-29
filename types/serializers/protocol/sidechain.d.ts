import ethAddress from './ethAddress';
import { uint64 } from '../basic/integers';
import { asset, extensions } from '../chain';
import { accountId } from '../chain/id/protocol';
import { StructSerializer, VectorSerializer } from '../collections';
import { config } from '../plugins/sidechain';

export declare const sidechainChangeConfigOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	registrar: typeof accountId,
	new_config: typeof config,
	extensions: typeof extensions,
}>;

export declare const sidechainEthCreateAddressOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	account: typeof accountId,
	extensions: typeof extensions,
}>;

export declare const sidechainEthApproveAddressOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_id: typeof accountId,
	malicious_committeemen: VectorSerializer<typeof accountId>,
	account: typeof accountId,
	eth_addr: typeof ethAddress,
	extensions: typeof extensions,
}>;

export declare const sidechainEthDepositOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_id: typeof accountId,
	deposit_id: typeof uint64,
	account: typeof accountId,
	value: typeof uint64,
	extensions: typeof extensions,
}>;
