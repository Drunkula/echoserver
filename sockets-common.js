// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
let socket;
let count = 0;
let sendLimit = 8;
var connectAttempts = 0;
let reconnectLimit = 5;
let reconnectDelay = 3000;  //ms between reconnect attempts

globalThis.MY_ID = rand_between(100, 1000);

	/**
	 * EXPORTED - config file defines socketLoc globally then calls main()
	 */

export default function main() {
	console.log("SOCKET LOC: ", socketLoc);

	if (socket = get_websocket()) {
		console.log("SOCKET: ", socket);

			// The ping and pong events don't actually exist... but they might one day
/* 		socket.onping = function fping() {
			 o(`Pinged with : ${arguments}`);
		}
		socket.onpong = function fpong() {
			o(`PONGED with : ${arguments}`);
		}
 */
		send_msg_rand();

		document.getElementById('myid').textContent = MY_ID;

		o(`<h3>Using : ${socketLoc}`);

		document.title = `${MY_ID} :: ${socketLoc}`;
	}
};


function get_websocket() {
	let socket;

	try {
		socket = new WebSocket(socketLoc);
	} catch (error) {	// error doesn't get triggered here - but in .onerror
		o('<r>ERROR:</r>' + error.toString());
		oSend('NOT APPANING');
		console.error(error);
		//return false;
		socket = false;
	}

    connectAttempts++;

    if ( !socket ) {
		return false;
	}

        // add the listeners open, message, error, close

	socket.onopen = (event) => {
		o("<c>.onopen</c> : Socket Opened : " + event.toString());
		console.log("onopen:", event);

		socket.send('Hey there - i just opened : '+MY_ID);
	};

	socket.onmessage = (event) => {
		if (event.data.includes('BROADCAST')) {
			oBroadcast(event.data)
		} else {
			o('<m>.onmessage</m> : ' + event.data)
		}
		//console.log("onmessage:", event);
	}
		// if the socket fails to open here's where we find out
	socket.onerror = function (event) {
		o('<h3><r>.onerror</r></h3> <r>error</r> : ' + event.toString())
		console.log(".onerror: ", event);
	}

	socket.onclose =(e) => {
		o("<r>.onclose</r> YOU CLOSED THE SOCKET!!!! code : " + e.code + " reason : " + e.reason + " - " + e.toString(), false);

		if ( connectAttempts < reconnectLimit ) {
			o('<r>ATTEMPTING:</r> to reopen a websocket on attempt ' + connectAttempts + ` of ${reconnectLimit}`);
			setTimeout(get_websocket, reconnectDelay);
		}
	}

	setup_socket_buttons(socket);

    return socket;
}

	// adds send message, and other commands - should check readyState really

function setup_socket_buttons(socket) {
	document.getElementById('sendrand').onclick = () => {
		socket.send("RAND BUTTON:"+MY_ID+'-' + rand_between(1, 10000))
	}
	document.getElementById('cmd_status').onclick = () => {
		socket.send("cmd_status");
	}
	document.getElementById('cmd_ping').onclick = () => {
		socket.send("cmd_ping");
	}
	document.getElementById('open').onclick = () => {
		main();
	}

	document.getElementById('close').onclick = () => {
		socket.close(4321, `reason: you is smel, from ${MY_ID}`);	// code must be 1000 or between 3000 - 4999 and include a reason https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1
	}
}

    // random message on timer
function send_msg_rand() {
    if (count++ >= sendLimit)
        return;

    var tWait = rand_between(1000, 4000);

    setTimeout( () => {
		if ( socket.readyState !== 1 ) {
			o("<r>ERROR send_msg_rand():</r> " + 'Socket readyState not open: '+socket.readyState);
			return false;
		}

        let msg = `Message ${count} of ${sendLimit} from ${MY_ID}`;
        socket.send(msg);
        send_msg_rand();    // send another message after
        oSend('Sending: ' + msg, false);
    }, tWait);
}


export function rand_between(start, end) {
    return ~~(start + Math.random() * (end - start + 1));
}





function o(str, clearIt, after="<br/>") {
	if (clearIt)
		return document.getElementById('output').innerHTML = str + after;

	// https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
	document.getElementById('output').insertAdjacentHTML('afterbegin', str + after);
}

function oSend(str, clearIt, after="<br/>") {
	if (clearIt)
		return document.getElementById('sent').innerHTML = str + after;
	document.getElementById('sent').insertAdjacentHTML('afterbegin', str + after);
}

function oBroadcast(str, clearIt, after="<br/>") {
	if (clearIt)
		return document.getElementById('broadcasts').innerHTML = str + after;
	document.getElementById('broadcasts').insertAdjacentHTML('afterbegin', str + after);
}