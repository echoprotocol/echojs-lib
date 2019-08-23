import * as props from './props';
import { staticVariant } from '../collections';
import { OPERATIONS_IDS } from '../../constants';

const operationSerializer = staticVariant({
	[OPERATIONS_IDS.TRANSFER]: props.transfer,
});
export default operationSerializer;
