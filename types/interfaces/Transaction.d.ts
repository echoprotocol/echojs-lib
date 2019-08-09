export default interface Transaction {
	ref_block_num: number,
	ref_block_prefix: number,
	expiration: string,
	operations: Array.<any>,
	extensions: Array<any>,
	signatures: Array.<string>,
	operation_results: Array<Array<any>>;
}
