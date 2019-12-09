import { StructSerializer } from '../../collections';
import { StringSerializer, BytesSerializer } from '../../basic';
import { uint64, int64, uint32 } from '../../basic/integers';
import ethAddress from '../../protocol/ethAddress';
import { assetId } from '../../chain/id/protocol';

export declare const ethMethodSerializer: StructSerializer<{
	method: StringSerializer,
	gas: typeof uint64,
}>;

export declare const ethTopicSerializer: BytesSerializer;

export declare const sidechainFinesSerializer: StructSerializer<{ generate_eth_address: typeof int64 }>;

export declare const sidechainConfigSerializer: StructSerializer<{
	eth_contract_address: typeof ethAddress,
	eth_committee_update_method: typeof ethMethodSerializer,
	eth_gen_address_method: typeof ethMethodSerializer,
	eth_withdraw_method: typeof ethMethodSerializer,
	eth_update_addr_method: typeof ethMethodSerializer,
	eth_update_contract_address: typeof ethMethodSerializer,
	eth_withdraw_token_method: typeof ethMethodSerializer,
	eth_collect_tokens_method: typeof ethMethodSerializer,
	eth_committee_updated_topic: typeof ethTopicSerializer,
	eth_gen_address_topic: typeof ethTopicSerializer,
	eth_deposit_topic: typeof ethTopicSerializer,
	eth_withdraw_topic: typeof ethTopicSerializer,
	erc20_deposit_topic: typeof ethTopicSerializer,
	erc20_withdraw_topic: typeof ethTopicSerializer,
	ETH_asset_id: typeof assetId,
	BTC_asset_id: typeof assetId,
	fines: typeof sidechainFinesSerializer,
	gas_price: typeof uint64,
	satoshis_per_byte: typeof uint32,
	coefficient_waiting_blocks: typeof uint32,
	btc_deposit_withdrawal_min: typeof uint64,
	btc_deposit_withdrawal_fee: typeof uint64,
}>;

export declare const sidechainERC20ConfigSerializer: StructSerializer<{
	contract_code: StringSerializer,
	create_token_fee: typeof uint64,
	transfer_topic: typeof ethTopicSerializer,
	check_balance_method: typeof ethMethodSerializer,
	burn_method: typeof ethMethodSerializer,
	issue_method: typeof ethMethodSerializer,
}>;
