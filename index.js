"use strict";
exports.__esModule = true;
var express = require("express");
var pino = require("pino");
var moment = require("moment");
var momentz = require("moment-timezone");
var cookieParser = require("cookie-parser");
var body_parser_1 = require("body-parser");
var timeZone = process.env.timeZone ? process.env.timeZone : 'Asia/Kolkata';
var now = function () { return moment().format(); };
var normallocalvalue = function () { return momentz(now()).tz(timeZone).format(); };
var app = express();
var genericHandlers = /** @class */ (function () {
    function genericHandlers(generate, errorInfo, info, globalErrorHandler, globalNotFoundHandler) {
        var _this = this;
        /* response generation library for api */
        this.generate = function (err, message, status, data) {
            var response = {
                error: err,
                message: message,
                status: status,
                data: data
            };
            return response;
        };
        this.errorInfo = function (errorMessage, errorOrigin, errorLevel) {
            var currentTime = normallocalvalue();
            var errorResponse = {
                timestamp: currentTime,
                errorMessage: errorMessage,
                errorOrigin: errorOrigin,
                errorLevel: errorLevel
            };
            pino().error(errorResponse);
            return errorResponse;
        }; // end captureError
        this.info = function (message, origin, importance) {
            var currentTime = normallocalvalue();
            var infoMessage = {
                timestamp: currentTime,
                message: message,
                origin: origin,
                level: importance
            };
            pino().info(infoMessage);
            return infoMessage;
        }; // end infoCapture
        this.globalErrorHandler = function (err, req, res, next) {
            _this.errorInfo("Application Error Handler called : " + err, 'globalErrorHandler', 10);
            if (err) {
                var apiResponse = _this.generate(true, 'Some error occured at global level', 500, null);
                res.status(500).send(apiResponse);
            }
        }; // end request ip logger function
        this.globalNotFoundHandler = function (req, res, next) {
            _this.errorInfo("Global not found handler called", 'globalNotFoundHandler', 10);
            var apiResponse = _this.generate(true, 'Route not found in the application', 404, null);
            res.status(404).send(apiResponse);
        };
        this.generate = generate ? generate : this.generate;
        this.errorInfo = errorInfo ? errorInfo : this.errorInfo;
        this.info = info ? info : this.info;
        this.globalErrorHandler = globalErrorHandler ? globalErrorHandler : this.globalErrorHandler;
        this.globalNotFoundHandler = globalNotFoundHandler ? globalNotFoundHandler : this.globalNotFoundHandler;
    }
    /**
     * generateFunction
     */
    genericHandlers.prototype.responseGenerator = function (func) {
        this.generate = func;
    };
    /**
     * errorInfoFunction
     */
    genericHandlers.prototype.errorInfoGenerator = function (func) {
        this.errorInfo = func;
    };
    /**
     * infoFunction
     */
    genericHandlers.prototype.infoGenerator = function (func) {
        this.info = func;
    };
    /**
     * globalErrorHandlerFunction
     */
    genericHandlers.prototype.globalErrorHandlerGenerator = function (func) {
        this.globalErrorHandler = func;
    };
    /**
     * globalNotFoundHandlerFunction
     */
    genericHandlers.prototype.globalNotFoundHandlerrGenerator = function (func) {
        this.globalNotFoundHandler = func;
    };
    return genericHandlers;
}());
exports.genericHandlers = genericHandlers;
var initiateExpress = /** @class */ (function () {
    function initiateExpress(input) {
        var _a, _b, _c, _d, _e;
        this.app = express();
        this.allowedCorsOrigin = '*';
        this.allowedMethods = '*';
        this.allowedHeaders = '*';
        this.AppUtility = new genericHandlers();
        this.normalHeaders = [['Access-Control-Allow-Origin', "" + this.allowedCorsOrigin],
            ['Access-Control-Allow-Methods', "" + this.allowedMethods],
            ['Access-Control-Allow-Headers', "" + this.allowedHeaders]
        ];
        this.routes = input.routes;
        this.initialHandlers = input.initialHandlers ? [body_parser_1.json(), body_parser_1.urlencoded({ extended: false }), cookieParser()].concat(input.initialHandlers) : [body_parser_1.json(), body_parser_1.urlencoded({ extended: false }), cookieParser()];
        this.finalhandlers = input.finalhandlers ? input.finalhandlers : [];
        this.CommonUtilizedHandler = [input.defaultErrHandler ? input.defaultErrHandler : this.AppUtility.globalErrorHandler, input.notFoundHandler ? input.notFoundHandler : this.AppUtility.globalNotFoundHandler];
        this.normalHeaders = !input.newAllHeaders ? this.normalHeaders : this.normalHeaders.concat(input.newAllHeaders);
        this.allowedCorsOrigin = !((_a = input.OptionObjet) === null || _a === void 0 ? void 0 : _a.allowedCorsOrigin) ? '*' : input.OptionObjet.allowedCorsOrigin;
        this.allowedMethods = !((_b = input.OptionObjet) === null || _b === void 0 ? void 0 : _b.allowedMethods) ? '*' : input.OptionObjet.allowedMethods.toString();
        this.allowedHeaders = !((_c = input.OptionObjet) === null || _c === void 0 ? void 0 : _c.allowedHeaders) ? '*' : input.OptionObjet.allowedHeaders.toString();
        this.allowedCred = !((_d = input.OptionObjet) === null || _d === void 0 ? void 0 : _d.allowedCred) ? false : input.OptionObjet.allowedCred;
        this.allowedMaxAge = !((_e = input.OptionObjet) === null || _e === void 0 ? void 0 : _e.allowedMaxAge) || isNaN(Number(input.OptionObjet.allowedMaxAge)) ? '86400' : input.OptionObjet.allowedMaxAge;
    }
    /**
     * Handles option request
     */
    initiateExpress.prototype.OptionHandler = function (req, res, next) {
        try {
            if (req.method !== 'OPTIONS') {
                next();
                return;
            }
            // this.allowedCorsOrigin === '*' ? this.allowedCorsOrigin : new URL(this.allowedCorsOrigin);
            var headers = {};
            // IE8 does not allow domains to be specified, just the *
            headers["Access-Control-Allow-Origin"] = req.headers.origin ? req.headers.origin : this.allowedCorsOrigin;
            headers["Access-Control-Allow-Methods"] = this.allowedMethods;
            headers["Access-Control-Allow-Credentials"] = this.allowedCred;
            headers["Access-Control-Max-Age"] = this.allowedMaxAge; // 24 hours
            headers["Access-Control-Allow-Headers"] = this.allowedHeaders;
            res.writeHead(200, headers);
            res.end();
        }
        catch (error) {
            next(error);
            // throw error;
        }
    };
    initiateExpress.prototype.RouteHandler = function (app, routes) {
        try {
            if (routes.length === 0) {
                throw 'routemismatch';
            }
            for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
                var el = routes_1[_i];
                if (el.type.toUpperCase() === 'OPTIONS') {
                    app.use(el.middleware);
                    return;
                }
                el.middleware && Array.isArray(el.middleware) ? app[el.type.toLowerCase()](el.path, el.middleware, el.requesthandler)
                    : app[el.type.toLowerCase()](el.path, el.requesthandler);
            }
        }
        catch (error) {
            throw error;
        }
    };
    initiateExpress.prototype.resHeaderSet = function (app, normalHeaders) {
        try {
            app.all('*', function (req, res, next) {
                try {
                    for (var _i = 0, normalHeaders_1 = normalHeaders; _i < normalHeaders_1.length; _i++) {
                        var el = normalHeaders_1[_i];
                        res.header(el[0], el[1]);
                    }
                    next();
                }
                catch (error) {
                    next(error);
                    // throw error
                }
            });
        }
        catch (error) {
            throw error;
        }
    };
    initiateExpress.prototype.setParicularHeaders = function (app, routes) {
        try {
            if (routes.some(function (el) { return el.distinctHeaders ? true : false; })) {
                routes.forEach(function (el) {
                    if (el.distinctHeaders && Array.isArray(el.distinctHeaders) && el.distinctHeaders.every(function (el) { return Array.isArray(el); })) {
                        app.all(el.path, function (req, res, next) {
                            try {
                                for (var _i = 0, _a = el.distinctHeaders; _i < _a.length; _i++) {
                                    var el1 = _a[_i];
                                    res.header(el1[0], el1[1]);
                                }
                                next();
                            }
                            catch (error) {
                                next(error);
                                // throw error
                            }
                        });
                    }
                });
            }
        }
        catch (error) {
            throw error;
        }
    };
    initiateExpress.prototype.initiateAppEngine = function () {
        try {
            this.app.use(this.initialHandlers.concat([this.OptionHandler]));
            this.resHeaderSet(this.app, this.normalHeaders);
            this.setParicularHeaders(this.app, this.routes);
            this.RouteHandler(this.app, this.routes);
            this.app.use(this.finalhandlers.concat(this.CommonUtilizedHandler));
        }
        catch (error) {
            this.app.use(this.AppUtility.globalErrorHandler);
        }
    };
    return initiateExpress;
}());
exports.initiateExpress = initiateExpress;
exports["default"] = initiateExpress;
