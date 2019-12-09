* [x] Add field `btc_block_number` to `sidechain_btc_aggregate_operation` and `btc_aggregating_object`
* [x] Add fields `btc_deposit_withdrawal_min`, `btc_deposit_withdrawal_fee` to `sidechain_config`
* [ ] Update contract subscription
	* [ ] Update the contracts logs subscription filter
	* [ ] Add method `unsubscribe_contract_logs` in database API
* [ ] Bitcoin key to configure-keys
* [ ] Implement 24 hours delay for deposit and withdrawal processing in Ethereum sidechain
	* [x] `sidechain_eth_send_deposit_operation`
	* [x] `sidechain_eth_send_withdraw_operation`
	* [x] `sidechain_erc20_send_deposit_operation`
	* [ ] `sidechain_erc20_send_withdraw_operation`
