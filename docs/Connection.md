## Table of contents

- [Connection](#connection)

### Connection

#### Before use echo instances you should connect to node.
You need do this once, before start, and after force disconnect (if you want to continue work).
Lib provide reconnecting socket it can reconnect automatically after network disconnect or node disconnect, you can tune **maxRetries**  to set maximum count of retries and **connectionTimeout** to set delay betweeen reconnection attempts, also this param responsible for answering wating time.

```javascript
import echo, { constants } from 'echojs-lib';

const { 
    WS_CONSTANTS: {
        CHAIN_API: {
            DATABASE_API,
            NETWORK_BROADCAST_API,
            HISTORY_API,
            REGISTRATION_API,
            ASSET_API,
            LOGIN_API,
            NETWORK_NODE_API,
            ECHORAND_API,
            DID_API
        }
    } 
} = constants; // access to different APIs

const echoNodeurl = 'ws://127.0.0.1:9000'; // node url

const options = {
    connectionTimeout: 5000, // delay in ms between reconnection requests, default call delay before reject it.
    maxRetries: 1000, // max count retries before close socket.
    pingTimeout: 3000, // delay time in ms between ping request and socket disconnect.
    debug: false, // debug mode status.
    apis: [
        DATABASE_API,
        NETWORK_BROADCAST_API,
        HISTORY_API,
        REGISTRATION_API,
        ASSET_API,
        LOGIN_API,
        NETWORK_NODE_API,
        ECHORAND_API,
        DID_API
    ]
};

try {
    await echo.connect(echoNodeurl, options);
    const account = await echo.api.getObject('1.2.0');
} catch (e) {
    console.error(e);
}
