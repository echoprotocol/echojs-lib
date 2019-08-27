import OperationSerializer from "./operation";
import * as props from "./props";

export {
	default as getIdByPropName,
	OperationIdByName as IdByName,
	OperationWithName as WithName,
} from "./getIdByName";

export declare const operation: OperationSerializer;

export { props, OperationSerializer };
