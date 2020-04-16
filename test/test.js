"use strict";
exports.__esModule = true;
// import { genericHandlers } from ".";
var http_1 = require("http");
var index_1 = require("../index");
var appConfig = {
    port: 4000,
    env: "dev"
};
var port = appConfig.port;
var AppUtility = new index_1.genericHandlers();
var routes;
routes = [{ type: 'GET', path: '/AB', requesthandler: function (req, res) { return res.status(200).send(AppUtility.generate(false, 'success', 0, { AB: 'AB' })); } },
    { type: 'POST', path: '/CD', requesthandler: function (req, res) { return res.status(200).send(AppUtility.generate(false, 'success', 0, { AB: req.body.cd })); } }
];
var _a = [[AppUtility.globalErrorHandler, AppUtility.globalNotFoundHandler], AppUtility.errorInfo, AppUtility.info], finalhandlers = _a[0], errInfo = _a[1], Info = _a[2];
var application = new index_1.initiateExpress({ routes: routes });
application.initiateAppEngine();
var server = http_1.createServer(application.app);
// start listening to http server
server.listen(port);
/**
* Event listener for HTTP server "error" event.
*/
var onError = function (err) {
    if (err.syscall !== 'listen') {
        errInfo(err.code + ' not equal listen', 'serverOnErrorHandler', 10);
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
};
// error event listening
server.on('error', onError);
/**
* Event listener for HTTPS server "listening" event.
*/
var onListening = function () {
    var address = server.address();
    var bind = (typeof address === 'string') ? 'pipe ' + address : 'port ' + address.port;
    console.log('Listening on ' + bind);
    Info('server listening on port' + address.port, 'serverOnListeningHandler', 10);
};
// success event listening
server.on('listening', onListening);
// application specific logging, throwing an error, or other logic here
process.on('unhandledRejection', function (reason, promise) {
    console.log({ 'Unhandled Rejection at: Promise': promise, 'reason:': reason });
});
