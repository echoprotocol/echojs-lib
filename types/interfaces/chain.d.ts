import { RESERVED_SPACE_ID } from "../constants/chain-types";
import { OperationSerializer, operationResult, chain } from "../serializers";
import { uint32, uint16 } from "../serializers/basic/integers";
import { extensions } from "../serializers/chain";
import { ObjectIdSerializer } from "../serializers/chain/id";
import { StructSerializer } from "../serializers/collections";

export type OperationHistoryObject = StructSerializer<{
	id: ObjectIdSerializer<RESERVED_SPACE_ID>;
	op: OperationSerializer;
	result: typeof operationResult;
	block_num: typeof uint32;
	trx_in_block: typeof uint16;
	op_in_trx: typeof uint16;
	virtual_op: typeof uint16;
	extensions: typeof extensions;
}>["__TOutput__"];
