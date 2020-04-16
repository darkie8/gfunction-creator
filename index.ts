import * as express from 'express';
import * as pino from 'pino';
import * as moment from 'moment';
import * as momentz from 'moment-timezone';
import * as cookieParser from 'cookie-parser';
import { json, urlencoded } from 'body-parser';
import { Request, NextFunction, Response} from 'express';
import {PathParams, Application} from 'express-serve-static-core'
const timeZone = process.env.timeZone ? process.env.timeZone : 'Asia/Kolkata'
const now = () => moment().format();
const normallocalvalue = () => momentz(now()).tz(timeZone).format()
const app = express();

    export interface routes {
        type: 'GET' | 'PUT' | 'POST' | 'DELETE'  | 'OPTIONS';
        path: PathParams;
        middleware?: ((req: Request<any>, res: Response<any>, next: NextFunction) => any)[]
        requesthandler?: (req: Request<any>, res: Response<any>) => any;
        distinctHeaders?: string[][]
    }
    export interface handlerFace {
        (req: Request, res: Response, next?: NextFunction) : any
        
    }
    export interface Errface {
        (err: any, req: Request, res: Response, next?: NextFunction) : any
    }
    
    export interface optionObject {
        allowedCorsOrigin: string; 
        allowedMethods?: string[] | string; 
        allowedHeaders?: string[] | string;
        allowedCred : boolean ;
        allowedMaxAge : string ;
    }
    export interface gFunctionInput {
        routes: routes[]; 
        OptionObjet?: optionObject; 
        initialHandlers?: (handlerFace | Errface)[] | any; 
        finalhandlers?: (handlerFace | Errface)[] | any;
        defaultErrHandler?: Errface;
        notFoundHandler?: handlerFace;  
        newAllHeaders?: string[][]
    }
    export class genericHandlers {
         /* response generation library for api */
        public generate = (response?: any | {error?: boolean, message?: string, status?: number, data?: any}): any => {
            return response
          }
        public errorInfo = (errorMessage: any, errorOrigin: any, errorLevel: any) => {
            let currentTime = normallocalvalue();
            let errorResponse = {
              timestamp: currentTime,
              errorMessage: errorMessage,
              errorOrigin: errorOrigin,
              errorLevel: errorLevel
            }
        
            pino().error(errorResponse)
            return errorResponse
          } // end captureError
        
        public info = (message: any, origin: any, importance: any) => {
            let currentTime = normallocalvalue()
        
            let infoMessage = {
              timestamp: currentTime,
              message: message,
              origin: origin,
              level: importance
            }
        
            pino().info(infoMessage)
            return infoMessage
          } // end infoCapture
        public globalErrorHandler = (err: any, req: Request<any>, res: Response<any>, next: NextFunction) => {
            this.errorInfo(`Application Error Handler called : ${err}`, 'globalErrorHandler', 10)
            if(err) {
                let apiResponse = this.errResponse ? this.errResponse : this.generate({error: true, message: 'Some error occured at global level', status: 500, data: null})
                res.status(500).send(apiResponse)
            }
        
        
        }// end request ip logger function
        
        public globalNotFoundHandler = (req: Request<any>, res: Response<any>, next?: NextFunction) => {
        
            this.errorInfo("Global not found handler called", 'globalNotFoundHandler', 10);
            let apiResponse = this.notFoundResponse ? this.notFoundResponse : this.generate({error: true, message: 'Route not found in the application', status: 404, data: null})
            res.status(404).send(apiResponse)
        
        }
        public notFoundResponse: any;
        public errResponse: any;
        constructor(generate?: ({err: boolean, message: string, status: number, data: any}) => any, errorInfo?: (errorMessage: any, errorOrigin: any, errorLevel: any) => { timestamp: string; errorMessage: any; errorOrigin: any; errorLevel: any; }, info?: (message: any, origin: any, importance: any) => { timestamp: string; message: any; origin: any; level: any; }, globalErrorHandler?: (err: any, req: any, res: { status: (arg0: number) => { send: (arg0: any) => void; }; }, next: () => void) => void, globalNotFoundHandler?: (req: any, res: { status: (arg0: number) => { send: (arg0: any) => void; }; }) => void) {
            this.generate = generate ? generate : this.generate;
            this.errorInfo = errorInfo ? errorInfo : this.errorInfo;
            this.info = info ? info : this.info;
            this.globalErrorHandler = globalErrorHandler ? globalErrorHandler : this.globalErrorHandler;
            this.globalNotFoundHandler = globalNotFoundHandler ? globalNotFoundHandler : this.globalNotFoundHandler;
        }
        /**
         * generateFunction
         */
        public responseGenerator(func: (response: any | {err: boolean, message: string, status: number, data: any}) => any, notFoundRes: any, globalerrRes: any) {
            this.generate = func;
            this.notFoundResponse = notFoundRes;
            this.errResponse = globalerrRes;
        }
        /**
         * errorInfoFunction
         */
        public errorInfoGenerator(func: (errorMessage: any, errorOrigin: any, errorLevel: any) => { timestamp: string; errorMessage: any; errorOrigin: any; errorLevel: any; }) {
            this.errorInfo = func;
        }
        /**
         * infoFunction
         */
        public infoGenerator(func: (message: any, origin: any, importance: any) => { timestamp: string; message: any; origin: any; level: any; }) {
            this.info = func;
        }
        /**
         * globalErrorHandlerFunction
         */
        public globalErrorHandlerGenerator(func: (err: any, req: any, res: { status: (arg0: number) => { send: (arg0: any) => void; }; }, next: () => void) => void) {
            this.globalErrorHandler = func;
        }
        /**
         * globalNotFoundHandlerFunction
         */
        public globalNotFoundHandlerrGenerator(func: (req: any, res: { status: (arg0: number) => { send: (arg0: any) => void; }; }) => void) {
            this.globalNotFoundHandler = func;
        }
    }
    export class initiateExpress {
        private initialHandlers: (handlerFace | Errface)[]
        private routes: routes[];
        private finalhandlers: (handlerFace | Errface)[];
        public app = express();
        private allowedCorsOrigin = '*';
        private allowedMethods = '*';
        private allowedHeaders = '*';
        private allowedCred: boolean;
        private allowedMaxAge: string;
        private AppUtility = new genericHandlers();
        private CommonUtilizedHandler: (handlerFace | Errface)[]
        private normalHeaders = [ ['Access-Control-Allow-Origin', `${this.allowedCorsOrigin}`],
                                  ['Access-Control-Allow-Methods', `${this.allowedMethods}`],
                                  ['Access-Control-Allow-Headers', `${this.allowedHeaders}`]
                                ];
        
        constructor(input: gFunctionInput)  {
            this.routes = input.routes;
            this.initialHandlers = input.initialHandlers ? [json(), urlencoded({ extended: false }), cookieParser()].concat(input.initialHandlers) : [json(), urlencoded({ extended: false }), cookieParser()];
            this.finalhandlers = input.finalhandlers ? input.finalhandlers : [];
            this.CommonUtilizedHandler = [input.defaultErrHandler? input.defaultErrHandler : this.AppUtility.globalErrorHandler, input.notFoundHandler? input.notFoundHandler : this.AppUtility.globalNotFoundHandler]
            this.normalHeaders = !input.newAllHeaders ? this.normalHeaders : this.normalHeaders.concat(input.newAllHeaders);
            this.allowedCorsOrigin = !input.OptionObjet?.allowedCorsOrigin ? '*' : input.OptionObjet.allowedCorsOrigin;
            this.allowedMethods = !input.OptionObjet?.allowedMethods ? '*' : input.OptionObjet.allowedMethods.toString();
            this.allowedHeaders = !input.OptionObjet?.allowedHeaders ? '*' : input.OptionObjet.allowedHeaders.toString();
            this.allowedCred = !input.OptionObjet?.allowedCred ? false : input.OptionObjet.allowedCred ;
            this.allowedMaxAge = !input.OptionObjet?.allowedMaxAge || isNaN(Number(input.OptionObjet.allowedMaxAge)) ? '86400' : input.OptionObjet.allowedMaxAge ;
        }
        /**
         * Handles option request
         */
        private OptionHandler(req: Request, res: Response, next: NextFunction) {
            try {

            if(req.method !== 'OPTIONS') {next(); return;}
            // this.allowedCorsOrigin === '*' ? this.allowedCorsOrigin : new URL(this.allowedCorsOrigin);
            let headers = {};
            // IE8 does not allow domains to be specified, just the *
            headers["Access-Control-Allow-Origin"] = req.headers.origin ? req.headers.origin : this.allowedCorsOrigin;
            headers["Access-Control-Allow-Methods"] = this.allowedMethods;
            headers["Access-Control-Allow-Credentials"] = this.allowedCred;
            headers["Access-Control-Max-Age"] = this.allowedMaxAge; // 24 hours
            headers["Access-Control-Allow-Headers"] = this.allowedHeaders;
            res.writeHead(200, headers);
            res.end();
            } catch (error) {
                next(error);
                // throw error;
            }
        }
        private RouteHandler (app: Application, routes: routes[]) {
            try {
                
               if ( routes.length === 0 ) {throw 'routemismatch'}
               for(let el of routes) {
                if(el.type.toUpperCase() === 'OPTIONS') {
                    app.use(el.middleware)
                    return;
                }
                el.middleware && Array.isArray(el.middleware) ? app[el.type.toLowerCase()](el.path, el.middleware, el.requesthandler)
                : app[el.type.toLowerCase()](el.path, el.requesthandler);
               }
               
            } catch (error) {
                throw error
            }
        }
        private resHeaderSet(app: Application, normalHeaders: string[][]) {
            try {
                
            app.all('*', (req: Request, res: Response, next?: NextFunction)  => {
                try {
                   
                for(let el of normalHeaders) {
                    res.header(el[0], el[1])
                }
                next(); 
                } catch (error) {
                    next(error);
                    // throw error
                }
            })
            } catch (error) {
                throw error
            }
        }
        private setParicularHeaders (app: Application, routes: routes[]) {
            try {
                if(routes.some(el => el.distinctHeaders ? true : false)) {
                    routes.forEach( el => {
                        if(el.distinctHeaders && Array.isArray(el.distinctHeaders) && el.distinctHeaders.every(el => Array.isArray(el))) {
                        app.all(el.path, (req: Request, res: Response, next?: NextFunction) => {
                            try {
                                for(let el1 of el.distinctHeaders) {
                                    res.header(el1[0], el1[1])
                                }
                                next();
                                
                            } catch (error) {
                                next(error);
                                // throw error
                            }
                        })
                        }
                    })
                }
                
            } catch (error) {
                throw error;
            }

        }
        public initiateAppEngine () {
            try {
            this.app.use(this.initialHandlers.concat([this.OptionHandler]))
            this.resHeaderSet(this.app, this.normalHeaders);
            this.setParicularHeaders(this.app, this.routes);
            this.RouteHandler(this.app, this.routes);
            this.app.use(this.finalhandlers.concat(this.CommonUtilizedHandler));
            } catch (error) {
                this.app.use(this.AppUtility.globalErrorHandler)
            }
            
        }
        
    }
    export default initiateExpress;