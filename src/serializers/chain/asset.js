import { assetId } from './id';
import { struct } from '../collections';
import { int64 } from '../basic/integers';

const assetSerializer = struct({
	amount: int64,
	asset_id: assetId,
});
export default assetSerializer;
