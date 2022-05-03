/**
 * echo back what they send, and more
*/

'use strict'
console.log('\x1Bc');

const WS_PORT = 3000; // SOCKET port on glitch doesn't seem to matter -too- much but make sure the face is happy
const PING_INTERVAL = 30000;  // 30 seconds works fine, some libraries use 20
// don't go below 3000

var sendRandCount = 6;	// number of messages to send on connection

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: WS_PORT });

console.log("WSS", wss.address());

console.log(`Waiting for socket connections on ${wss.address().address}:${wss.address().port} at ` + hms());

// once on the first connection set up a broadcast to all clients on an interval

wss.once('connection', function (ws, req) {
	//console.log('CONN', req.headers);
	console.log('wss CONNECTED : at ' + hms());    // send a broadcast every so often
	setInterval(broadcast_on_timer, 8123, wss, `${req.headers.host}:BROADCAST!!`);
});

	// for every connection set up an intermittent ping and respond

wss.on('connection', function (ws, inMsg) {	// inMsg is actually http get request https://github.com/websockets/ws/blob/master/doc/ws.md#event-connection
	ws.isAlive = true;
		// adding a ping/pong feature that's not necessary
	const u = new URL(inMsg.url, inMsg.headers.origin);	// url.parse is deprecated, though it works - so let's do it the official way
	let id = u.searchParams.get('myid');
	ws.id = id ? id : 'Unknown';

	ws.on('pong', on_pong_heartbeat);

	ws.on('message', function (message) { // really does just have message
		message = message.toString();
		console.log('RECEVIED : ', `${message}`);
		broadcast(wss, message);
	});

	ws.on('close', function (code, reason) {
		console.log(`Socket closed id [${this.id}] code: ${code} : reason: ${reason}`);
		broadcast(wss, `<b><r>CLOSE</r></b> for socket [${this.id}] code: ${code} : reason: ${reason}`)
	});

	// inMsg.complete: bool, aborted:bool, upgraded:bool, url, method, statusCode, inMsg.headers {} and lots more
	//console.log('We got a connection inMsg : ', inMsg);	// too much gravy
	//console.dir(inMsg);	// too much gravy

	//	console.log("HEADERS:", inMsg.headers);

	// console.log('We got a connection inMsg.url : ', inMsg.url);	// /?myid=555 this is the cheese!
	//console.log('params:', parse(inMsg.url));
	//console.log('params:', parse(inMsg.url, true).query);	// that's the tikky.. but it's deprecated
	//const u = new URL("http://foo.com"+inMsg.url);
	//const u = new URL(inMsg.url, "http://fake.com/");	// url.parse is deprecated, though it works - so let's do it the official way

	ws.ping("--connection ping--"+id);

	ws.send(`<h4>Welcome, traveller [${id}], from ws socket thing</h4>`);

	send_msgs_on_timer(ws);

	broadcast(wss, `<r>Got a connection with id ${id}</r>`);
})

// when the server stops then stop pinging the clients

wss.on('close', function close() {
	clearInterval(pingInterval);
	console.log("WSS Closing: ", "clearing ping interval timer.");
});


	// randomly message a socket on timer with fluctuations

function send_msgs_on_timer(sock) {
	if (false == 'count' in sock)
		sock.count = 0;	// add a count property to the socket

	if (sock.count++ >= sendRandCount)
		return;

	var tWait = 1000 + Math.random() * 3000;

	setTimeout(() => {
		if (sock.readyState !== WebSocket.OPEN) {
			console.log("Websocket not in ready state for id : ", sock.id);
			return false;
		}

		sock.send(`Rand Msg ${sock.count} of ${sendRandCount} at ${hms()}`);
		send_msgs_on_timer(sock);
	}
	, tWait);
}


	// bangs out a message to all connected clients

function broadcast_on_timer(wss, data) {
	let colour = rnd_colour();
	data = `<span style="color: ${colour}; font-weight:900;">${data} at ${hms()}</span>`;
	broadcast(wss, data);
}

	// broadcast to all

function broadcast(wss, data) {
//	console.log('Broadcasting : ', data);
	wss.clients.forEach(function f(client, idx) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(data);
		}
	});
}

	// duh
function ping_string() { return '--i-ping-you-' + Date.now(); }

	// Date in a nice format

function hms() {
	let d = new Date(); // new one each time??  //return d.toJSON();  //return d.toUTCString();	//return d.toISOString();
	return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '.' + d.getMilliseconds();
}

	// set a socket dead, ping and on pong response revivify (isAlive = true).  On the next round if it hasn't ponged then terminate

const pingInterval = setInterval(
	function ping() {
		wss.clients.forEach(function each(ws) {   // a pong received between pings would set isAlive to true
			if (ws.isAlive === false) {
				console.log("PING:", " Client no longer alive ws.terminate() called");
				broadcast(wss, `No pong from ${ws.id} - terminating`);
				return ws.terminate();
			}

			ws.isAlive = false;
			ws.ping(ping_string()+`-`+ws.id);
		});
	}
	, PING_INTERVAL);

// code from https://github.com/websockets/ws#usage-examples
// as the ping is made isAlive is set to false - but what is 'this' ? it's the function, yeah?
var pongCnt = 0;

function on_pong_heartbeat(data = '') { // receives a buffer but there's sod all in it.
	this.isAlive = true;  // set to false in the ping, back to true in the pong this = websocket
	console.log('Pong induced heartbeat #' + pongCnt++, `data [${data} length: ${data.length}]`, data.toString());
}

function rnd_colour() {
	let cols = ['red', 'green', 'blue', 'magenta', 'darkcyan', 'indigo', 'midnightblue'];
	return cols[~~(Math.random() * cols.length)];
}
