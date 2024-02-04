/*
* Title: Token Handler
* Description: Handler for handle token requests for authentication
* Author: Wbaidur Rahman
* Date: 1/2/2024
*
*/

const {hash} = require('../../helpers/utilities');
const {createRandomString} = require('../../helpers/utilities');
const {parseJSON} = require('../../helpers/utilities');
const data = require('../../lib/data')

// module scaffolding
const handler = {};

// checking if the requested method is available
handler.tokenHandler = (requestProperties, callback) =>{
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestProperties.method) > -1){
        handler._token[requestProperties.method](requestProperties, callback);
    }else {
        callback(405)
    }
};


// scaffolding for coresponding methods 
handler._token = {};

handler._token.post = (requestProperties, callback) => {
    const phone = 
        typeof(requestProperties.body.phone) === 'string' &&
        requestProperties.body.phone.trim().length === 11 
        ? requestProperties.body.phone 
        : false;
        
    const password = 
        typeof(requestProperties.body.password) === 'string' &&
        requestProperties.body.password.trim().length > 0
        ? requestProperties.body.password 
        : false;

    // checking if the phone && password is ok
    if(phone && password) {
        data.read('users', phone, (err, userData) => {
            const hashedPassword = hash(password);

            if(!err && userData){
                // check for correct password
                if(hashedPassword === parseJSON(userData).password) {
                    let tokenId = createRandomString(20);
                    let expires = Date.now() + 60*60*1000;
                    let tokenObject = {
                        'phone': phone,
                        'id': tokenId,
                        expires
                    }

                    // store the token in db
                    data.create('tokens', tokenId, tokenObject, (err) => {
                        if(!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, {
                                error: 'There was a problem in the server side!',
                            })
                        }
                    });
                } else{
                    callback(400, {
                        error: 'Invalid Password'
                    })
                }
            }else{
                callback(400, {
                    error: 'You have a problem in your request, there may no maching user',
                });
            }
        })
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
    
}

handler._token.get = (requestProperties, callback) => {
    // check the id  valid
    const id =
        typeof(requestProperties.queryStringObject.id) === 'string' && 
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
                : false;

    if(id) {
        // lookup the user
        data.read('tokens', id, (err, tokenData) => {
            const token = { ...parseJSON(tokenData) };
            /*
                single level object
                so it will be immutably copied
                not deeply nested means not object lies into object
            */
            if(!err && token) {
                callback(200, token);
            } else{
                callback(404, {
                    message : "Error",
                });
            }
        });
        
    } else {
        callback(404, {
            'error': 'Requested token not found!',
        });
    }
        
}

handler._token.put = (requestProperties, callback) => {
    const id =
        typeof(requestProperties.queryStringObject.id) === 'string' && 
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
                : false;

    const extend =
    typeof(requestProperties.body.extend) === 'boolean' && 
    requestProperties.body.extend === true
        ? true
        : false;

    if(id && extend) {
        data.read('tokens', id, (err, tokenData) => {
            if(!err && tokenData){
                let tokenObject = parseJSON(tokenData);

                if(tokenObject.expires > Date.now()){
                    tokenObject.expires = Date.now() + 60*60*1000;

                    // store updated token
                    data.update('tokens', id, tokenObject, (err) =>{
                        if(!err){
                            callback(200, {
                                message: 'Token updated successfully',
                            })
                        } else{
                            callback(500, {
                                message: 'Error in updating',
                            })
                        }
                    })
                } else{
                    callback(405, {
                        error: 'id may already expired',
                    })
                }
            } else {
                callback(500, {
                    error: 'Error in reading token',
                })
            }
        })
    } else {
        callback(400, {
            error: 'There was a problem in your request',
        })
    }
}

handler._token.delete = (requestProperties, callback) => {
    const id =
    typeof(requestProperties.queryStringObject.id) === 'string' && 
    requestProperties.queryStringObject.id.trim().length === 20
        ? requestProperties.queryStringObject.id
        : false;
    
    if(id) {
        // lookup the user
        data.delete('tokens', id, (err) => {
            
            if(!err) {
                callback(200, {
                    message: 'Token deleted successfully',
                });
            } else{
                callback(500, {
                    message : "Error",
                });
            }
        });
        
    } else {
        callback(404, {
            'error': 'Requested token not found!',
        });
    }
}

handler._token.verify = (id, phone, callback) => {
    data.read('tokens', id, (err, tokenData)=> {
        if(!err && tokenData){
            if(parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > 0){
                callback(true);
            }else{
                callback(false);
            }
        }else{
            callback(false);
        }
    })
}

module.exports = handler;
