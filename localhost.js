import main from './sockets-common.js';	// import BEFORE pie settings

const WS_PORT = 3000;
// credentials change now and again - get them from :
//https://www.piesocket.com/websocket-tester

// MY_ID is made global in sockets-all
//import { rand_between } from "./socket-all";
//export const MY_ID = rand_between(100, 1000);

const socketLoc = `ws://localhost:${WS_PORT}/some/path/?myid=${MY_ID}&foo=Bargain!`;

globalThis.socketLoc = socketLoc;

main();	// from sockets-all