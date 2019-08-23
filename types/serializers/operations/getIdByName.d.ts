import * as props from "./props";
import { OPERATIONS_IDS } from "../../constants";

export type OperationIdByName = {
	transfer: OPERATIONS_IDS.TRANSFER,
};

export type OperationWithName<T extends keyof typeof props> = OperationIdByName[T];

export default function getOperationIdByName<T extends keyof typeof props>(name: T): OperationWithName<T>;
