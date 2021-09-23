import { asset } from "../serializers/chain";

export default interface Price {
	base: typeof asset["__TOutput__"];
	quote: typeof asset["__TOutput__"];
}
