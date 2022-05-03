import main from './sockets-common.js';	// import BEFORE pie settings

const WS_PORT = 3000;

// MY_ID is made global in sockets-all

const socketLoc = `ws://localhost:${WS_PORT}/some/path/?myid=${MY_ID}&foo=Bargain!`;

globalThis.socketLoc = socketLoc;

main();	// from sockets-all