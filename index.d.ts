declare module 'gfunction-creator/index' {
  import * as express from 'express';
  import { Request, NextFunction, Response } from 'express';
  import { PathParams } from 'express-serve-static-core';
  export interface routes {
      type: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'OPTIONS';
      path: PathParams;
      middleware?: ((req: Request, res: Response, next: NextFunction) => any)[];
      requesthandler?: (req: Request, res: Response) => any;
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
      generate: (err: boolean, message: string, status: number, data: any) => any;
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
      globalErrorHandler: (err: any, req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("express-serve-static-core").Query>, res: express.Response<any>, next: express.NextFunction) => void;
      globalNotFoundHandler: (req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("express-serve-static-core").Query>, res: express.Response<any>, next?: express.NextFunction) => void;
      constructor(generate?: (err: boolean, message: string, status: number, data: any) => any, errorInfo?: (errorMessage: any, errorOrigin: any, errorLevel: any) => {
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
      responseGenerator(func: (err: boolean, message: string, status: number, data: any) => any): void;
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
declare module 'gfunction-creator' {
  import main = require('gfunction-creator/index');
  export = main;
}