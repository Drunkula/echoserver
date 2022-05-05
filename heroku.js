import main from './sockets-common.js';	// import BEFORE pie settings

const WS_PORT = 3000;

// MY_ID is made global in sockets-all

//const socketLoc = `ws://localhost:${WS_PORT}/some/path/?myid=${MY_ID}&foo=Bargain!`;

//const socketLoc = `ws://websock-echo.herokuapp.com/?myid=${MY_ID}&you=heroku`;
const socketLoc = `wss://websock-echo.herokuapp.com/?myid=${MY_ID}&you=heroku`;
	// above are triggering logs
	// below nope even though the server is meant to be using 3000
//const socketLoc = `wss://websock-echo.herokuapp.com:${WS_PORT}/?myid=${MY_ID}&you=heroku`;
//const socketLoc = `ws://websock-echo.herokuapp.com:${WS_PORT}/?myid=${MY_ID}&you=heroku`;

globalThis.socketLoc = socketLoc;

main();	// from sockets-all