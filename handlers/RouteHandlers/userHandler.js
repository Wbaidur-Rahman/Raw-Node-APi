/*
* Title: User Handler
* Description: Handler for handle user requests
* Author: Wbaidur Rahman
* Date: 1/2/2024
*
*/

const {hash} = require('../../helpers/utilities');;
const {parseJSON} = require('../../helpers/utilities');;
const data = require('../../lib/data')
const tokenHandler = require('./tokenHandler') 

// module scaffolding
const handler = {};

// checking if the requested method is available
handler.userHandler = (requestProperties, callback) =>{
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestProperties.method) > -1){
        handler._users[requestProperties.method](requestProperties, callback);
    }else {
        callback(405)
    }
};


// scaffolding for coresponding methods 
handler._users = {};

handler._users.post = (requestProperties, callback) => {
    const firstName = typeof(requestProperties.body.firstName) === 'string' &&
                requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
                
    const lastName = typeof(requestProperties.body.lastName) === 'string' &&
                requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
                
    const phone = typeof(requestProperties.body.phone) === 'string' &&
                requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
                
    const password = typeof(requestProperties.body.password) === 'string' &&
                requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
                
    const tosAgreement = typeof(requestProperties.body.tosAgreement) === 'boolean' &&
                requestProperties.body.tosAgreement ? requestProperties.body.tosAgreement : false;

    // console.log(firstName, lastName, phone, password, tosAgreement);
    
    if(firstName && lastName && phone && password && tosAgreement) {
        // make sure that the user doesn't already exists
        data.read('users', phone, (err) =>{
            if(err) {
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };
                // store the user to db
                data.create('users', phone, userObject, (err) => {
                    if(!err){
                        callback(200, {
                            message: 'User was created successfully!',
                        });

                    }else{
                        callback(500, {'error': 'Could not create user!'});
                    }
                })
            } else {
                callback(500, {
                    'error': 'There was a problem in server side, user may already exists',
                })
            }
        })
    } else{
        callback(400, {
            error: 'You have a problem in your request'
        });
    }
}

// TODO: Authentication
handler._users.get = (requestProperties, callback) => {
    // check the phone is valid
    const phone =
        typeof(requestProperties.queryStringObject.phone) === 'string' && 
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
                : false;

    console.log(requestProperties.queryStringObject.phone.length)     

    if(phone) {

        // verify token
        let token = typeof(requestProperties.headers.token) === 'string'
        ? requestProperties.headers.token
        : false;

        // console.log(token)
        tokenHandler._token.verify(token, phone, (tokenId) => {
            if(tokenId) {
                data.read('users', phone, (err, u) => {
                    const user = { ...parseJSON(u) };
                    /*
                        single level object
                        so it will be immutably copied
                        not deeply nested means not object lies into object
                    */
                    if(!err && user) {
                        delete user.password;
                        callback(200, user);
                    } else{
                        callback(404, {
                            message : "Error",
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'User Authentication failed',
                })
            }
        });
    } else {
        callback(404, {
            'error': 'Requested user not found!',
        });
    }
}

// TODO: Authentication
handler._users.put = (requestProperties, callback) => {
    const firstName = typeof(requestProperties.body.firstName) === 'string' &&
                requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
                
    const lastName = typeof(requestProperties.body.lastName) === 'string' &&
                requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
                
    const phone = typeof(requestProperties.body.phone) === 'string' &&
                requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
                
    const password = typeof(requestProperties.body.password) === 'string' &&
                requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
                
    const tosAgreement = typeof(requestProperties.body.tosAgreement) === 'boolean' &&
                requestProperties.body.tosAgreement ? requestProperties.body.tosAgreement : false;


    if(phone) {
        if(firstName || lastName || password){


        // verify token
        let token = typeof(requestProperties.headers.token) === 'string'
            ? requestProperties.headers.token
            : false;

        // console.log(token)
        tokenHandler._token.verify(token, phone, (tokenId) => {
            if(tokenId) {
                
            //  lookup the user
                data.read('users', phone, (err, uData) => {
                    const userData = { ...parseJSON(uData) };
    
                    if(!err && userData){
                        if(firstName) {
                            userData.firstName = firstName;
                        }
                        if(lastName) {
                            userData.lastName = lastName;
                        }
                        if(password) {
                            userData.password = hash(password);
                        }
    
                        // store in database
                        data.update('users', phone, userData, (err) =>{
                            if(!err) {
                                callback(200, {
                                    'message': 'User updated successfully',
                                })
                            }else {
                                callback(400, {
                                    'error' : 'Error in updating in server'
                                });
                            }
                        })
                    } else {
                        callback(400, {
                            'error' : 'Error in giving input'
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'User Authentication failed',
                })
            }
        });

        } else {
            callback (400, {
                'error': 'Please enter required fields',
            })
        }

    } else {
        callback(400, {
            'error' : 'Invalid phone, try again',
        });
    }
}

// TODO: Authentication
handler._users.delete = (requestProperties, callback) => {
    const phone = typeof(requestProperties.queryStringObject.phone) === 'string' &&
                requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;

    if(phone) {

         // verify token
         let token = typeof(requestProperties.headers.token) === 'string'
         ? requestProperties.headers.token
         : false;

     // console.log(token)
     tokenHandler._token.verify(token, phone, (tokenId) => {
         if(tokenId) {

            // lookup the user
            data.read('users', phone, (err, userData) => {
                if(!err && userData){
                    data.delete('users', phone, (err) => {
                        if(!err) {
                            callback(200, {
                                'message': 'User was successfully deleted'
                            })
                        }else{
                            callback(500, {
                                'error': `can't delete user`,
                            })
                        }
                    })
                }else {
                    callback(404, {
                        'error': 'User not exists',
                    })
                }
            });
        } else {
            callback(403, {
                error: 'User Authentication failed',
            })
        }
    });
    } else {
        callback(500, {
            'error': 'User not exists',
        })
    }
}

module.exports = handler;
