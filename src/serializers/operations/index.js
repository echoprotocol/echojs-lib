import OperationSerializer from './operation';
import * as props from './props';

export {
	default as getIdByPropName,
	OperationIdByName as IdByName,
	OperationWithName as WithName,
} from './getIdByName';

export const operation = new OperationSerializer();

export { props, OperationSerializer };
