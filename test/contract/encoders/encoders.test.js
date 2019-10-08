import 'mocha';

describe('encoders', () => {
	require('./default-encoder.test');
	require('./integers-encoders.test');
	require('./static-bytes-encoder.test');
});
