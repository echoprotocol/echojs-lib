const walletAPIMethodsArray = [
	// FIXME: actualize
	'help',
	'help_method',
	'info',
	'about',
	'exit',
	'begin_builder_transaction',
	'add_operation_to_builder_transaction',
	'replace_operation_in_builder_transaction',
	'set_fees_on_builder_transaction',
	'preview_builder_transaction',
	'sign_builder_transaction',
	'propose_builder_transaction',
	'propose_builder_transaction2',
	'remove_builder_transaction',
	'is_new',
	'is_locked',
	'lock', 'unlock', 'set_password',
	'dump_private_keys',
	'list_my_accounts',
	'list_accounts',
	'list_account_balances',
	'list_id_balances',
	'list_assets',
	'import_key',
	'import_accounts',
	'import_account_keys',
	'import_balance',
	'suggest_brain_key',
	'derive_keys_from_brain_key',
	'register_account',
	'create_contract',
	'call_contract',
	'get_contract_result',
	'create_account_with_brain_key',
	'transfer',
	'transfer2',
	'get_transaction_id',
	'create_asset',
	'update_asset',
	'update_bitasset',
	'update_asset_feed_producers',
	'publish_asset_feed',
	'issue_asset',
	'get_asset',
	'get_bitasset_data',
	'fund_asset_fee_pool',
	'reserve_asset',
	'whitelist_account',
	'create_committee_member',
	'get_committee_member',
	'list_committee_members',
	'create_eddsa_keypair',
	'get_vesting_balances',
	'withdraw_vesting',
	'get_account',
	'get_contract',
	'get_contract_object',
	'call_contract_no_changing_state',
	'get_account_id',
	'get_block',
	'get_block_virtual_ops',
	'get_account_count',
	'get_account_history',
	'get_relative_account_history',
	'is_public_key_registered',
	'get_global_properties',
	'get_dynamic_global_properties',
	'get_object',
	'get_private_key',
	'load_wallet_file',
	'normalize_brain_key',
	'save_wallet_file',
	'serialize_transaction',
	'sign_transaction',
	'get_prototype_operation',
	'propose_parameter_change',
	'propose_fee_change',
	'approve_proposal',
	'flood_network',
	'network_add_nodes',
	'network_get_connected_peers',
	'change_sidechain_config',
	'generate_eth_address',
	'get_eth_address',
	'get_account_deposits',
	'get_account_withdrawals',
	'get_erc20_token',
	'check_erc20_token',
	'get_erc20_account_deposits',
	'get_erc20_account_withdrawals',
	'get_account_addresses',
	'get_account_by_address',
	'withdraw_eth',
	'generate_account_address',
	'contract_fund_fee_pool',
	'whitelist_contract_pool',
	'get_contract_pool_whitelist',
	'get_contract_pool_balance',
	'register_erc20_token',
	'withdraw_erc20_token',
	'propose_register_asset_in_sidechain',
	'transfer_to_eth_erc20',
	'get_committee_frozen_balance',
	'committee_freeze_balance',
	'create_activate_committee_member_proposal',
	'create_deactivate_committee_member_proposal',
	'committee_withdraw_balance',
];

const operationPrototypeArray = [
	'transfer_operation',
	'transfer_to_address_operation',
	'override_transfer_operation',
	'account_create_operation',
	'account_update_operation',
	'account_whitelist_operation',
	'account_address_create_operation',
	'asset_create_operation',
	'asset_update_operation',
	'asset_update_bitasset_operation',
	'asset_update_feed_producers_operation',
	'asset_issue_operation',
	'asset_reserve_operation',
	'asset_fund_fee_pool_operation',
	'asset_publish_feed_operation',
	'asset_claim_fees_operation',
	'proposal_create_operation',
	'proposal_update_operation',
	'proposal_delete_operation',
	'committee_member_create_operation',
	'committee_member_update_operation',
	'committee_member_update_global_parameters_operation',
	'committee_member_activate_operation',
	'committee_member_deactivate_operation',
	'committee_frozen_balance_deposit_operation',
	'committee_frozen_balance_withdraw_operation',
	'vesting_balance_create_operation',
	'vesting_balance_withdraw_operation',
	'balance_claim_operation',
	'balance_freeze_operation',
	'balance_unfreeze_operation',
	'contract_create_operation',
	'contract_call_operation',
	'contract_internal_create_operation',
	'contract_internal_call_operation',
	'contract_selfdestruct_operation',
	'contract_update_operation',
	'contract_fund_pool_operation',
	'contract_whitelist_operation',
	'sidechain_eth_create_address_operation',
	'sidechain_eth_approve_address_operation',
	'sidechain_eth_deposit_operation',
	'sidechain_eth_withdraw_operation',
	'sidechain_eth_approve_withdraw_operation',
	'sidechain_issue_operation',
	'sidechain_burn_operation',
	'sidechain_erc20_register_token_operation',
	'sidechain_erc20_deposit_token_operation',
	'sidechain_erc20_withdraw_token_operation',
	'sidechain_erc20_approve_token_withdraw_operation',
	'sidechain_erc20_issue_operation',
	'sidechain_erc20_burn_operation',
	'sidechain_btc_create_address_operation',
	'sidechain_btc_create_intermediate_deposit_operation',
	'sidechain_btc_intermediate_deposit_operation',
	'sidechain_btc_deposit_operation',
	'sidechain_btc_withdraw_operation',
	'sidechain_btc_approve_withdraw_operation',
	'sidechain_btc_aggregate_operation',
	'block_reward_operation',
];

export { walletAPIMethodsArray, operationPrototypeArray };
