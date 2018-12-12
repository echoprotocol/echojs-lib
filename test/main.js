import "babel-polyfill";
import WS from '../src/echo/ws/ApiInstances'

describe('instance', () => {
    describe('#connection()', () => {
        it('should connect to remote socket', async (done) => {
            // console.log(parseuri('http://google.com'))
            const ws = new WS();
            try {
                await ws.connect('google.com', { connectionTimeout: 5000, maxRetries: 0 });
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