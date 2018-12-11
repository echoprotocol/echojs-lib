import "babel-polyfill";
import WS from '../src/echo/ws/ApiInstances'

describe('instance', () => {
    describe('#connection()', () => {
        it('should connect to remote socket', async (done) => {
            const ws = new WS();
            try {
                await ws.connect('echo-devnet-node.pixelplex.io/ws', { connectionTimeout: 5000, maxRetries: 10 });
                console.log('resolve')
                Promise.resolve();
            } catch (e) {
                console.log(e);
                Promise.reject(e);
            }
            console.log('resolved');
        }).timeout(10000);
    });
});