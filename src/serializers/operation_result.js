import { struct, staticVariant } from './collections';
import { anyObjectId } from './chain/id';
import { asset } from './chain';

export const operationResultVariant = {
	VOID: 0,
	OBJECT: 1,
	ASSET: 2,
};

const operationResultSerializer = staticVariant({
	[operationResultVariant.VOID]: struct({}),
	[operationResultVariant.OBJECT]: anyObjectId,
	[operationResultVariant.ASSET]: asset,
});
export default operationResultSerializer;
