'use strict';

var Fabric_Client    = require('fabric-client');
var Fabric_CA_Client = require('fabric-ca-client');
var path             = require('path');
var util             = require('util');
var os               = require('os');
//
var fabric_client    = new Fabric_Client();
var fabric_client1    = new Fabric_Client();
var fabric_ca_client = null;
var admin_user       = null;
var member_user      = null;
//var store_path       = path.join(__dirname, 'hfc-key-store');
let CA_Endpoint      = process.env.CA_ENDPOINT || 'https://localhost:8054';
let MSPID            = process.env.MSPID ||  'GatewickMSP';
const moveFile = require('move-file');
const args           = process.argv;
if (args.length !== 4) {
    console.error('');
    console.error('You must specify the username and the identity of the airline/airport being added')
    console.error('');
    process.exit(1);
}
let username = args[2];
var IATACode = args[3];

if (IATACode.length < 2 || IATACode.length > 3) {
    console.error('');
    console.error(`'${IATACode} is not a valid airline or airport code.`);
    console.error('The identity value must be 2 letter IATA code (for an airline) or 3 letter IATA code (for an airport)');
    console.error('');
    process.exit(1);
    
} else {
    
    IATACode = IATACode.toUpperCase();
    
}


var store_path = path.join(__dirname ,'../' , "wallet" , username);
var store_admin_path = path.join(__dirname,'../',"wallet", "admin");
console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
console.log('');
console.log(`Adding ${username} with attribute 'iata-code' value of ${IATACode}`);
console.log('An attribute for iata-code will also be added to the certificate which can be used in the chain code to validate the transaction executor');
console.log('');
console.log(`The Certificate Authority endpoint is ${CA_Endpoint}. You can set this with environment variable CA_ENDPOINT`);
console.log(`The MSPID is ${MSPID}. You can set this with environment variable MSPID`);
console.log('');
console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');


// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
Fabric_Client.newDefaultKeyValueStore({
    path: store_path
}).then((state_store) => {
    // assign the store to the fabric client
    console.log(state_store);
    fabric_client.setStateStore(state_store);
    var crypto_suite = Fabric_Client.newCryptoSuite();
    // use the same location for the state store (where the users' certificate are kept)
    // and the crypto store (where the users' keys are kept)
    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
    crypto_suite.setCryptoKeyStore(crypto_store);
    fabric_client.setCryptoSuite(crypto_suite);
    var tlsOptions = {
        trustedRoots: [],
        verify: false
    };
    // be sure to change the http to https when the CA is running TLS enabled
   
   var str1 = state_store;
   str1._dir = store_admin_path;
  

  fabric_client1.setStateStore(str1);
   // use the same location for the state store (where the users' certificate are kept)
    // and the crypto store (where the users' keys are kept)
    var crypto_suite1 = Fabric_Client.newCryptoSuite();
    var crypto_store1 = Fabric_Client.newCryptoKeyStore({path: store_admin_path});
    crypto_suite1.setCryptoKeyStore(crypto_store1);
    fabric_client1.setCryptoSuite(crypto_suite1);
    console.log(str1)
    // first check to see if the admin is already enrolled
    //fabric_client.getUserContext('admin', true);
      fabric_ca_client = new Fabric_CA_Client(CA_Endpoint, null, '', crypto_suite);
    return fabric_client1.getUserContext('admin', true);
}).then((user_from_store) => {
    console.log("---inside----")
    if (user_from_store && user_from_store.isEnrolled()) {
        console.log('Successfully loaded admin from persistence');
        admin_user = user_from_store;
    } else {
        throw new Error('Failed to get admin.... run enrollAdmin.js');
    }

    // at this point we should have the admin user
    // first need to register the user with the CA server
    let attrs = [];
    attrs.push({name: 'iata-code', value: IATACode, ecert: true});
console.log(fabric_ca_client)
    return fabric_ca_client.register({
        attrs: attrs,
        enrollmentID: username,
        affiliation: 'org1.department1',
        role: 'client'
    }, admin_user);
}).then((secret) => {
    // next we need to enroll the user with CA server
    console.log('Successfully registered ' + username + ' - secret:' + secret);

    return fabric_ca_client.enroll({enrollmentID: username, enrollmentSecret: secret});
}).then((enrollment) => {
    console.log('Successfully enrolled member user "'+username+'" ');
    return fabric_client.createUser(
        {
            username: username,
            mspid: MSPID,
            cryptoContent: {privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate}
        });
}).then((user) => {

    // console.log('user created ', user);
    member_user = user;
    return fabric_client.setUserContext(member_user);
}).then(() => {
    console.log(username + ' was successfully registered and enrolled and is ready to interact with the fabric network');
    moveFile(store_admin_path+"/"+username,store_path +"/"+ username)
}).catch((err) => {
    console.error('Failed to register: ' + err);
    if (err.toString().indexOf('Authorization') > -1) {
        console.error('Authorization failures may be caused by having admin credentials from a previous CA instance.\n' +
            'Try again after deleting the contents of the store directory ' + store_path);
    }
});
