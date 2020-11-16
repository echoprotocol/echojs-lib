import { set, struct } from '../collections';
import futureExtension from './future_extension';

const extensionsSerializer = set(futureExtension);
export const accountCreateOperationExtensionsSerializer = struct({});
export default extensionsSerializer;
