import { struct, set, StructSerializer, SetSerializer } from '../collections';
import { uint32 } from '../basic/integers';
import feeParametersSerializer from './fee_parameters';

declare const feeScheduleSerializer: StructSerializer<{
	parameters: SetSerializer<typeof feeParametersSerializer>,
	scale: typeof uint32,
}>;

export default feeScheduleSerializer;
