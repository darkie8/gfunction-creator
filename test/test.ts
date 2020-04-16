// import { genericHandlers } from ".";
import { createServer } from "http";
import { genericHandlers, routes, initiateExpress } from "../index";

const appConfig = {
    port : 4000,
    allowedCorsOrigin : "*",
    env : "dev",
    apiVersion : '/api/v1'
    }
    const port = appConfig.port;
    let AppUtility = new genericHandlers();
    let routes : routes[]
    routes = [{type: 'GET', path: '/AB', requesthandler: (req: any, res: { status: (arg0: number) => { send: (arg0: string) => void; }; }) => res.status(200).send(AppUtility.generate(false, 'success', 0, {AB: 'AB'}))}, 
    {type: 'POST', path: '/CD', requesthandler: (req: any, res: { status: (arg0: number) => { send: (arg0: string) => void; }; }) => res.status(200).send(AppUtility.generate(false, 'success', 0, {AB: req.body.cd}))}
]
    const [finalhandlers, errInfo, Info] = [[AppUtility.globalErrorHandler, AppUtility.globalNotFoundHandler], AppUtility.errorInfo, AppUtility.info]
let application = new initiateExpress({routes})
application.initiateAppEngine();

const server = createServer(application.app);
// start listening to http server
server.listen(port);

/**
* Event listener for HTTP server "error" event.
*/

let onError = (err: { syscall: string; code: string; }) => {
if (err.syscall !== 'listen') {
errInfo(err.code + ' not equal listen', 'serverOnErrorHandler', 10)
throw err;
}

// handle specific listen errors with friendly messages
switch (err.code) {
case 'EACCES':
    errInfo(err.code + ':elavated privileges required', 'serverOnErrorHandler', 10);
  process.exit(1);
  break;
case 'EADDRINUSE':
    errInfo(err.code + ':port is already in use.', 'serverOnErrorHandler', 10);
  process.exit(1);
  break;
default:
    errInfo(err.code + ':some unknown error occured', 'serverOnErrorHandler', 10);
  throw err;
}
}

// error event listening
server.on('error', onError);

/**
* Event listener for HTTPS server "listening" event.
*/

let onListening = () => {
let address = server.address();
let bind = (typeof address === 'string') ? 'pipe ' + address : 'port ' + address.port;
console.log('Listening on ' + bind);
Info('server listening on port' + address.port, 'serverOnListeningHandler', 10);
}

// success event listening
server.on('listening', onListening);


// application specific logging, throwing an error, or other logic here
process.on('unhandledRejection', (reason, promise) => {

console.log({'Unhandled Rejection at: Promise': promise, 'reason:': reason});
})
