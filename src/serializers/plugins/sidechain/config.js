import { struct } from '../../collections';
import { string as stringSerializer, bytes } from '../../basic';
import { uint64, int64, uint32 } from '../../basic/integers';
import ethAddress from '../../protocol/ethAddress';
import { assetId } from '../../chain/id/protocol';

export const ethMethodSerializer = struct({
	method: stringSerializer,
	gas: uint64,
});

export const ethTopicSerializer = bytes(64);

export const sidechainFinesSerializer = struct({ generate_eth_address: int64 });

export const sidechainConfigSerializer = struct({
	eth_contract_address: ethAddress,
	eth_committee_update_method: ethMethodSerializer,
	eth_gen_address_method: ethMethodSerializer,
	eth_withdraw_method: ethMethodSerializer,
	eth_update_addr_method: ethMethodSerializer,
	eth_withdraw_token_method: ethMethodSerializer,
	eth_collect_tokens_method: ethMethodSerializer,
	eth_committee_updated_topic: ethTopicSerializer,
	eth_gen_address_topic: ethTopicSerializer,
	eth_deposit_topic: ethTopicSerializer,
	eth_withdraw_topic: ethTopicSerializer,
	erc20_deposit_topic: ethTopicSerializer,
	erc20_withdraw_topic: ethTopicSerializer,
	ETH_asset_id: assetId,
	waiting_eth_blocks: uint32,
	fines: sidechainFinesSerializer,
	waiting_blocks: uint32,
	BTC_asset_id: assetId,
	waiting_btc_blocks: uint32,
	satoshis_per_byte: uint32,
	echo_blocks_per_aggregation: uint32,
});

export const sidechainERC20ConfigSerializer = struct({
	contract_code: stringSerializer,
	create_token_fee: uint64,
	transfer_topic: ethTopicSerializer,
	check_balance_method: ethMethodSerializer,
	burn_method: ethMethodSerializer,
	issue_method: ethMethodSerializer,
});
