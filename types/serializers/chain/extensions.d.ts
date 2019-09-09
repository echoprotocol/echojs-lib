import { SetSerializer } from "../collections";
import futureExtension from "./future_extension";

declare const extensionsSerializer: SetSerializer<typeof futureExtension>;
export default extensionsSerializer;
