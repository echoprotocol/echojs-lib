import { shouldReject } from './_test-utils';
// eslint-disable-next-line import/no-unresolved, import/extensions
import { serializers } from '../';

describe('deserializer', () => {
	describe('when first argument is not a buffer', () => {
		shouldReject(() => serializers.operation.deserialize('not a buffer'), 'invalid buffer type');
	});

	require('./deserializer/collections/index.collection.deserializer.test');
	require('./deserializer/chain/chain.deserializer.test');
	require('./deserializer/operation.deserializer.test');
	require('./deserializer/vote-id-deserializer.test');
});
