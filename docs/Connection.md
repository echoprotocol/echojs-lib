import echo, { constants } from 'echojs-lib';

const { 
    WS_CONSTANTS: { 
        DATABASE_API,
        NETWORK_BROADCAST_API,
        HISTORY_API,
        REGISTRATION_API,
        ASSET_API,
        LOGIN_API,
        NETWORK_NODE_API,
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
    ]
};

try {
    await echo.connect(echoNodeurl, options);
    const account = await echo.api.getObject('1.2.0');
} catch (e) {
    console.error(e);
}
