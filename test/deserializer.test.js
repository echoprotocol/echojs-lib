import { shouldReject } from './_test-utils';
import { serializers } from '../'

describe.only('deserializer', () => {
	describe('when first argument is not a buffer', () => {
		shouldReject(() => serializers.operation.deserialize('not a buffer'), 'invalid buffer type');
	});

	require('./deserializer/collections/index.collection.deserializer.test');
	require('./deserializer/public-key.deserializer.test');
});
