# google-function-http-tool

=========

A simple google function creator, it makes your google function code small with default provided setting; you just have to add what you need to add , no more unnecessary coding! Everything is configured , and also can be fine tuned with custom stuff. You can create normal express app too with this tool.

## Installation

  `npm install google-function-http-tool`

## Usage

    const gFunction = require('gfunction-creator');
    const genericHandlers = gFunction.genericHandlers;
    const initiateExpress = gFunction.initiateExpress
    // import { genericHandlers, routes, initiateExpress } from "gfunction-creator";

    let AppUtility = new genericHandlers();
    const [errInfo, Info] = [AppUtility.errorInfo, AppUtility.info]
    let routes = [{
     type: 'GET',
     path: '/AB',
     requesthandler: (req, res) => {
        Info('success', 'AB', 5 )
        res.status(200).send(AppUtility.generate(false, 'success', 0, {AB: 'AB'}))
    }
     }, 
    {type: 'POST',
     path: '/CD', 
     requesthandler: (req, res) => {
        Info('success', 'CD', 5 );
        res.status(200).send(AppUtility.generate(false, 'success', 0, {AB: req.body.cd}))
    }
     }
    ];
    let application = new initiateExpress({routes})
    application.initiateAppEngine();
    module.exports ={app: application.app}
    
    // in google function just put app in Function to execute input box.

## Tests

  `npm run test`
  
  `curl --location --request POST 'http://localhost:4000/CD' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'cd=sdsfsdfsd'`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.
