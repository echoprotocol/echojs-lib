import { set, struct } from '../collections';
import futureExtension from './future_extension';

const extensionsSerializer = set(futureExtension);
export const accountOperationsExtensionsSerializer = struct({});
export default extensionsSerializer;
