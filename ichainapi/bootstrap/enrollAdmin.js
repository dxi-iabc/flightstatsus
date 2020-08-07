'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Enroll the admin user
 */

var Fabric_Client = require('fabric-client');
var Fabric_CA_Client = require('fabric-ca-client');

var path = require('path');
var util = require('util');
var os = require('os');

//
var fabric_client = new Fabric_Client();
var fabric_ca_client = null;
var admin_user = null;
var member_user = null;
var store_path = path.join(__dirname,'../',"wallet","admin");//path.join(__dirname, 'hfc-key-store');
console.log(' Store path:'+store_path);
let CA_Endpoint = process.env.CA_ENDPOINT || 'https://localhost:8054';
let FABRIC_CA_SERVER_CA_NAME = process.env.FABRIC_CA_SERVER_CA_NAME || 'ca.gatewick.ibs.aero';
let MSPID = process.env.MSPID || 'GatewickMSP';
let CRYPTO_CONFIG_PATH = process.env.CRYPTO_CONFIG_PATH || '/home/ec2-user/environment/FlightStatusNetwork/ichain/flight-network'
console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
console.log('');
console.log(`Adding an admin user to the CA.`);
console.log(`  - at endpoint ${CA_Endpoint}. You can set the endpoint with environment variable CA_ENDPOINT. Defaults to 'http://localhost:7054' if not specified.`);
console.log(`  - With FABRIC_CA_SERVER_CA_NAME = ${FABRIC_CA_SERVER_CA_NAME}. You can set this with environment variable FABRIC_CA_SERVER_CA_NAME. Defaults to 'ca.sita.aero' if not specified.`);
console.log(`  - With MSPID = ${MSPID}. You can set this with environment variable MSPID. Defaults to 'SITAMSP' if not specified.`);
console.log('');
console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');



// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
Fabric_Client.newDefaultKeyValueStore({ path: store_path
}).then((state_store) => {
    // assign the store to the fabric client
    fabric_client.setStateStore(state_store);
    var crypto_suite = Fabric_Client.newCryptoSuite();
    // use the same location for the state store (where the users' certificate are kept)
    // and the crypto store (where the users' keys are kept)
    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
    crypto_suite.setCryptoKeyStore(crypto_store);
    fabric_client.setCryptoSuite(crypto_suite);
    var tlsOptions = {
        trustedRoots: [CRYPTO_CONFIG_PATH +"/crypto-config/peerOrganizations/gatewick.ibs.aero/ca/ca.gatewick.ibs.aero-cert.pem"],
        verify: false
    };
    console.log('getting CA client...');
    // be sure to change the http to https when the CA is running TLS enabled
    fabric_ca_client = new Fabric_CA_Client(CA_Endpoint, tlsOptions , FABRIC_CA_SERVER_CA_NAME, crypto_suite);
    console.log('got CA client...');

    // first check to see if the admin is already enrolled
    console.log('get user context');
    return fabric_client.getUserContext('admin', true);
}).then((user_from_store) => {
    console.log('got user context', user_from_store);
    if (user_from_store && user_from_store.isEnrolled()) {
        console.log('Successfully loaded admin from persistence');
        admin_user = user_from_store;
        return null;
    } else {
        // need to enroll it with CA server
        console.log('Enrolling');

        return fabric_ca_client.enroll({
            enrollmentID: 'admin',
            enrollmentSecret: 'adminpw'
        }).then((enrollment) => {
            console.log('Successfully enrolled admin user "admin"');
            return fabric_client.createUser(
                {username: 'admin',
                    mspid: MSPID,
                    cryptoContent: { privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate }
                });
        }).then((user) => {
            console.log('admin_user', admin_user);
            admin_user = user;
            return fabric_client.setUserContext(admin_user);
        }).catch((err) => {
            console.error('Failed to enroll and persist admin. Error: ' + err.stack ? err.stack : err);
            throw new Error('Failed to enroll admin');
        });
    }
}).then(() => {
    console.log('Assigned the admin user to the fabric client ::' + admin_user.toString());
}).catch((err) => {
    console.error('Failed to enroll admin: ' + err, err);
});
