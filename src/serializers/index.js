import * as basic from './basic';
import * as collections from './collections';
import * as chain from './chain';
import * as plugins from './plugins';
import * as protocol from './protocol';
import OperationSerializer from './operation';
import opWrapper from './protocol/opWrapper';
import * as wallet from './wallet';

export {
	default as transaction,
	signedTransactionSerializer as signedTransaction,
	processedTransactionSerializer as processedTransaction,
} from './transaction';
export { default as operationResult } from './operation_result';
export {
	blockSignatureSerializer as blockSignature,
	blockHeaderSerializer as blockHeader,
	signedBlockHeaderSerializer as signedBlockHeader,
	signedBlockSerializer as signedBlock,
} from './block';

export const operation = new OperationSerializer();

opWrapper.init(operation);

export { basic, collections, chain, OperationSerializer, plugins, protocol, opWrapper, wallet };
