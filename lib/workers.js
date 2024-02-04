/*
* Title: Workers library
* Description: worker related files
* Author: Wbaidur Rahman
* Date: 3/2/2024
*
*/

// dependencies
const url = require('url');
const http = require('http');
const https = require('https');
const data = require('./data');
const {parseJSON} = require('../helpers/utilities')

// server object - module scaffolding
const worker = {};

// send notification sms to user if state changes
worker.alertUserToStatusChange = (newCheckData) =>{
    const msg = `Alert: Your check for 
    ${newCheckData.method.toUpperCase()} 
    ${newCheckData.protocol}://
    ${newCheckData.url} is currently 
    ${newCheckData.state}`;

    console.log(msg);
};

// save check outcome to database and send to the next process
worker.processCheckOutcome = (originalCheckData, checkOutCome) => {
    // check if checkOutCome is up or down
    let state = !checkOutCome.error && checkOutCome.responseCode && 
        originalCheckData.successCodes.indexOf(checkOutCome.responseCode) > -1
        ? 'up' : 'down';

    // decide whether we should alert the user or not
    let alertWanted = originalCheckData.lastChecked && originalCheckData.state !== state ? true : false;

    // update the check data
    let newCheckData = originalCheckData;

    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();

    // update the check in the disk
    data.update('checks', newCheckData.id, newCheckData, (err) => {

        if(!err) {
            if(alertWanted) {
                // send the checkdata to next process
                worker.alertUserToStatusChange(newCheckData);
            } else {
                console.log('Alert is not needed as there is no state change');
            }
        } else {
            console.log('Error trying to save checkData of one of the checks')
        }
    })
}

// perform check for checkData
worker.performCheck = (originalCheckData) => {
    // prepare the initial check outcome
    let checkOutCome = {
        error: false,
        responseCode: false
    };

    // mark the outcome has not been sent yet
    let outcomeSent = false;

    // parse the hostname and full url from original data
    const parsedUrl = url.parse(`${originalCheckData.protocol}://${originalCheckData.url}`, true);
    const hostName = parsedUrl.hostname;
    const path = parsedUrl.path;

    // construct the request
    const requestDetails = {
        'protocol': originalCheckData.protocol + ':',
        'hostname': hostName,
        'method': originalCheckData.method.toUpperCase(),
        'path': path,
        'timeout': originalCheckData.timeoutSeconds * 1000
    };

    const protocolToUse = originalCheckData.protocol === 'http' ? http : https;

    let req = protocolToUse.request(requestDetails, (res) => {
        // grab the status of the response
        const status = res.statusCode;

        console.log(status);

        checkOutCome.responseCode = status;
        //  update the check outcome and pass to the next process
        if(!outcomeSent) {
            worker.processCheckOutcome(originalCheckData, checkOutCome);
            outcomeSent = true;
        }
    });

    req.on('error', (e) => {
        let checkOutCome = {
            error: true,
            value: e,
        };
        //  update the check outcome and pass to the next process
        if(!outcomeSent) {
            worker.processCheckOutcome(originalCheckData, checkOutCome);
            outcomeSent = true;
        }
    });
    
    req.on('timeout', () => {
        let checkOutCome = {
            error: true,
            value: 'timeout',
        };
        //  update the check outcome and pass to the next process
        if(!outcomeSent) {
            worker.processCheckOutcome(originalCheckData, checkOutCome);
            outcomeSent = true;
        }
    });
    // req send
    req.end();


};

// validate individual check data
worker.validateCheckData = (originalCheckData) => {
    if(originalCheckData && originalCheckData.id) {
        originalCheckData.state = typeof(originalCheckData.state) === 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1 
            ? originalCheckData.state : 'down';
          
        originalCheckData.lastChecked = typeof(originalCheckData.lastChecked) === 'number' && originalCheckData.lastChecked > 0 
            ? originalCheckData.lastChecked : false;
          
        //  pass to the next process
        worker.performCheck(originalCheckData);
    } else{
        console.log('Error: check was invalid or not properly formatted')
    }
}


// lookup all the checks
worker.gatherAllChecks = () => {
    // get all the checks
    data.list('checks', (err, checks) => {
        if(!err && checks && checks.length > 0) {
            checks.forEach(check => {
                // read the checkdata
                data.read('checks', check, (err, originalCheckData) => {
                    if(!err && originalCheckData){
                        // pass the data to the Check validator
                        worker.validateCheckData(parseJSON(originalCheckData));
                    } else {
                       console.log('Error: reading one of the checks data') 
                    }
                });
            });
        } else {
            console.log('Error could not find any checks ')
        }
    })
}


// timer to execute the worker process ones per minute
worker.loop = () => {
    setInterval(() => {
        worker.gatherAllChecks();
    }, 1000*10);
}

// start the workers
worker.init = () => {
    // execute all the checks
    worker.gatherAllChecks();

    // call the loop so that checks continue
    worker.loop();
}

// exports
module.exports = worker;
