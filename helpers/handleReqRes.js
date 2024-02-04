/*
* Title: Handle Request and Rasponse
* Description: Handle Request Response
* Author: Wbaidur Rahman
* Date: 1/2/2024
*
*/
const {StringDecoder} = require('string_decoder')
const url = require('url')
const routes = require('../routes')
const {notFoundHandler} = require('../handlers/RouteHandlers/notFoundHandler')
const {parseJSON} = require('./utilities')

// module scaffolding
const handler = {};

// handle request response
handler.handleReqRes = (req, res) => {
    // request handling
    // get the url and parse it
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname
    const trimmedPath = path.replace(/^\/+|\/+$/g,'');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headers = req.headers;

    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headers
    }

    // console.log(requestProperties);

    const decoder = new StringDecoder('utf-8');

    let realData = '';

    // console.log(routes)

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] :notFoundHandler;


    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on('end', (buffer) => {
        realData += decoder.end();
        
        requestProperties.body = parseJSON(realData);

        chosenHandler(requestProperties, (statusCode, payLoad) => {
            statusCode = typeof(statusCode) === 'number' ? statusCode : 500;
            payload = typeof(payLoad) === 'object' ? payLoad : {};
    
            const payloadString = JSON.stringify(payLoad);
    
            // return the final response
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode);
            res.end(payloadString);
        });

        // res.end(realData)
        // response handle
        // res.end('Hello Programmers')
    });
};

module.exports = handler;