import { set, struct, optional } from '../collections';
import futureExtension from './future_extension';

const extensionsSerializer = set(futureExtension);
export const accountOperationsExtensionsSerializer = optional(struct({}));
export default extensionsSerializer;
