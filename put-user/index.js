'use strict'
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10'
});

exports.handler = (event, context, callback) => {

    let params = event;
    console.log('Received upsert user request with params: ', event);
    
    saveUser(params)
        .then( user => context.done(null, user) )
        .catch( err => {
            console.log('Unexpected error adding user: ', JSON.stringify(err));
            context.done( { code: '500', message: 'Unexpected error' } )
        });
};

var saveUser = (user) => {

    user.id = user.id ? user.id : generateUUID();
    user.created = (new Date()).toString();

    var params = {
        TableName: "User",
        Item: user,
    };
    // Can't use the aws .promise() response because dynamodb.put operation inexplicably doesn't support returning the put object
    return new Promise( (resolve, reject) => {
        docClient.put(params, (err, data) =>  err ? reject(err) : resolve(user) );
    });
};

function generateUUID(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}