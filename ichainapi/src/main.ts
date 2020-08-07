

import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {EnvConfig} from "./common/config/env";

var winstonLogger = require('./winstonConfig');

// var dash = require('appmetrics-dash');
// dash.attach();
// require('./telegrafReporting');



function validateEnvironmentVariables() {

    if (!EnvConfig.LISTENING_PORT) {
        winstonLogger.error('You must specify the LISTENING_PORT as an environment variable.');
        process.exit(201);
    }

    if (!EnvConfig.IDENTITY) {
        winstonLogger.error('You must specify the IDENTITY as an environment variable.');
        process.exit(201);
    }

    if (EnvConfig.IDENTITY === 'SWAGGER_DOCS') {
        winstonLogger.log('Running in demo mode - will not connect to real Fabric network.');
        EnvConfig.IS_DEMO_MODE = true;
    }

}

export const DOCS_URL = 'docs';
async function bootstrap() {

    validateEnvironmentVariables();

    // await bootstrapCertificates();

    const app = await NestFactory.create(AppModule);

    // app.use(winston);


    winstonLogger.info(`Starting FlightChain API for ${EnvConfig.IDENTITY} on port ${EnvConfig.LISTENING_PORT}`);

    let title = `Flight Chain REST API for ${EnvConfig.IDENTITY}`;
    if (EnvConfig.IS_DEMO_MODE)
        title = 'Flight Chain REST API';

    let description = '<p>This Flight Chain API is used to interface to the Smart Contract. Publishers (airlines or airports) will POST to create a new flight record, PATCH to update that flight record and can then GET all flight history.</p>' +
        '<p><h3>API Authorisation</h3>To call the API, you must be issued a token. This key is unique to each organisation. The token will be passed in via an Authorization: Bearer HTTP header, such as -H "Authorization: Bearer TOKEN"</p>' +
        '<p><h3>Flight Key</h3>Each flight is uniquely identified by a flight key.  A flight key consists of departure date, departure airport, operating airline, flight number. e.g. 2019-09-03LHRBA0227. When a flight is ' +
        'created, it is stored in the blockchain state using the unique Flight Key for that flight and you can subsequently use that retrieve the flight data.</p>' +
        '<p><h3>Sample Data</h3>There is sample JSON data available from <a href="https://gitlab.com/FlightChain2/FlightChainAPI/blob/master/REST_SAMPLE_DATA.md">REST_SAMPLE_DATA.md</a></p>'+
        '<p>If you are viewing this on http://swagger.flightchain.aero, there is a flight already loaded. You can use the flight key <strong>\'2019-09-04MIABA0214\'</strong> to test the GET/PATCH apis, or you can simply create flights using the POST api. </p>';

    const options = new DocumentBuilder()
        .setTitle(title)
        .setContactEmail('renjithkn@gmail.com')
        .setExternalDoc('See IBS Blockchain Sandbox for more details','')
        .setDescription(description)
        .setVersion('1.0')
        .setSchemes("http", "https")
        .addBearerAuth("Authorization", 'header')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(DOCS_URL, app, document);


    app.enableCors();
    await app.listen(EnvConfig.LISTENING_PORT);
}

// bootstrapCertificates();

bootstrap();
