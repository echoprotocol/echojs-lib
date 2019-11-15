import { StructSerializer, StaticVariantSerializer } from './collections';
import { AnyObjectIdSerializer } from './chain/id';
import { asset } from './chain';

export declare enum operationResultVariant {
	VOID = 0,
	OBJECT = 1,
	ASSET = 2,
}

declare const operationResultSerializer: StaticVariantSerializer<{
	[operationResultVariant.VOID]: StructSerializer<{}>,
	[operationResultVariant.OBJECT]: AnyObjectIdSerializer,
	[operationResultVariant.ASSET]: typeof asset,
}>;
export default operationResultSerializer;
