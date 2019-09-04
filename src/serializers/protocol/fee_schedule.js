import { struct, set } from '../collections';
import { uint32 } from '../basic/integers';
import feeParametersSerializer from './fee_parameters';

const feeScheduleSerializer = struct({
	parameters: set(feeParametersSerializer),
	scale: uint32,
});

export default feeScheduleSerializer;
