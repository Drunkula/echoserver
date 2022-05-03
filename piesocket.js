import main from './sockets-common.js';	// import BEFORE pie settings

const PIE_API_KEY = "VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV"
const PIE_SECRET = "Fvev5c0k59VZ1jRLWuj5URyF5idSdHWm"
const PIE_CHANNEL = "dmtestiochan"
const CLUSTER_ID = 'demo'
const NOTIFY_SELF = '&notify_self=1'
const PRESCENCE = "&presence=1"

// credentials change now and again - get them from :
//https://www.piesocket.com/websocket-tester

// MY_ID is made global in sockets

const socketLoc = `wss://${CLUSTER_ID}.piesocket.com/v3/${PIE_CHANNEL}?api_key=${PIE_API_KEY}${NOTIFY_SELF}${PRESCENCE}&user=${MY_ID}`

globalThis.socketLoc = socketLoc;

main();	// from sockets-all