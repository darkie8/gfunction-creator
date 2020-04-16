declare module 'google-function-http-tool/index' {
  import * as express from 'express';
  import { Request, NextFunction, Response } from 'express';
  import { PathParams } from 'express-serve-static-core';
  export interface routes {
      type: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'OPTIONS';
      path: PathParams;
      middleware?: ((req: Request<any>, res: Response<any>, next: NextFunction) => any)[];
      requesthandler?: (req: Request<any>, res: Response<any>) => any;
      distinctHeaders?: string[][];
  }
  export interface handlerFace {
      (req: Request, res: Response, next?: NextFunction): any;
  }
  export interface Errface {
      (err: any, req: Request, res: Response, next?: NextFunction): any;
  }
  export interface optionObject {
      allowedCorsOrigin: string;
      allowedMethods?: string[] | string;
      allowedHeaders?: string[] | string;
      allowedCred: boolean;
      allowedMaxAge: string;
  }
  export interface gFunctionInput {
      routes: routes[];
      OptionObjet?: optionObject;
      initialHandlers?: (handlerFace | Errface)[] | any;
      finalhandlers?: (handlerFace | Errface)[] | any;
      defaultErrHandler?: Errface;
      notFoundHandler?: handlerFace;
      newAllHeaders?: string[][];
  }
  export class genericHandlers {
      generate: (response?: any) => any;
      errorInfo: (errorMessage: any, errorOrigin: any, errorLevel: any) => {
          timestamp: string;
          errorMessage: any;
          errorOrigin: any;
          errorLevel: any;
      };
      info: (message: any, origin: any, importance: any) => {
          timestamp: string;
          message: any;
          origin: any;
          level: any;
      };
      globalErrorHandler: (err: any, req: Request<any>, res: Response<any>, next: express.NextFunction) => void;
      globalNotFoundHandler: (req: Request<any>, res: Response<any>, next?: express.NextFunction) => void;
      notFoundResponse: any;
      errResponse: any;
      constructor(generate?: ({ err: boolean, message: string, status: number, data: any }: {
          err: any;
          message: any;
          status: any;
          data: any;
      }) => any, errorInfo?: (errorMessage: any, errorOrigin: any, errorLevel: any) => {
          timestamp: string;
          errorMessage: any;
          errorOrigin: any;
          errorLevel: any;
      }, info?: (message: any, origin: any, importance: any) => {
          timestamp: string;
          message: any;
          origin: any;
          level: any;
      }, globalErrorHandler?: (err: any, req: any, res: {
          status: (arg0: number) => {
              send: (arg0: any) => void;
          };
      }, next: () => void) => void, globalNotFoundHandler?: (req: any, res: {
          status: (arg0: number) => {
              send: (arg0: any) => void;
          };
      }) => void);
      /**
       * generateFunction
       */
      responseGenerator(func: (response: any | {
          err: boolean;
          message: string;
          status: number;
          data: any;
      }) => any, notFoundRes: any, globalerrRes: any): void;
      /**
       * errorInfoFunction
       */
      errorInfoGenerator(func: (errorMessage: any, errorOrigin: any, errorLevel: any) => {
          timestamp: string;
          errorMessage: any;
          errorOrigin: any;
          errorLevel: any;
      }): void;
      /**
       * infoFunction
       */
      infoGenerator(func: (message: any, origin: any, importance: any) => {
          timestamp: string;
          message: any;
          origin: any;
          level: any;
      }): void;
      /**
       * globalErrorHandlerFunction
       */
      globalErrorHandlerGenerator(func: (err: any, req: any, res: {
          status: (arg0: number) => {
              send: (arg0: any) => void;
          };
      }, next: () => void) => void): void;
      /**
       * globalNotFoundHandlerFunction
       */
      globalNotFoundHandlerrGenerator(func: (req: any, res: {
          status: (arg0: number) => {
              send: (arg0: any) => void;
          };
      }) => void): void;
  }
  export class initiateExpress {
      private initialHandlers;
      private routes;
      private finalhandlers;
      app: import("express-serve-static-core").Express;
      private allowedCorsOrigin;
      private allowedMethods;
      private allowedHeaders;
      private allowedCred;
      private allowedMaxAge;
      private AppUtility;
      private CommonUtilizedHandler;
      private normalHeaders;
      constructor(input: gFunctionInput);
      /**
       * Handles option request
       */
      private OptionHandler;
      private RouteHandler;
      private resHeaderSet;
      private setParicularHeaders;
      initiateAppEngine(): void;
  }
  export default initiateExpress;

}
declare module 'google-function-http-tool' {
  import main = require('google-function-http-tool/index');
  export = main;
}