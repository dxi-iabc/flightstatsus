"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const env_1 = require("./common/config/env");
var winstonLogger = require('./winstonConfig');
function validateEnvironmentVariables() {
    if (!env_1.EnvConfig.LISTENING_PORT) {
        winstonLogger.error('You must specify the LISTENING_PORT as an environment variable.');
        process.exit(201);
    }
    if (!env_1.EnvConfig.IDENTITY) {
        winstonLogger.error('You must specify the IDENTITY as an environment variable.');
        process.exit(201);
    }
    if (env_1.EnvConfig.IDENTITY === 'SWAGGER_DOCS') {
        winstonLogger.log('Running in demo mode - will not connect to real Fabric network.');
        env_1.EnvConfig.IS_DEMO_MODE = true;
    }
}
exports.DOCS_URL = 'docs';
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        validateEnvironmentVariables();
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        winstonLogger.info(`Starting FlightChain API for ${env_1.EnvConfig.IDENTITY} on port ${env_1.EnvConfig.LISTENING_PORT}`);
        let title = `Flight Chain REST API for ${env_1.EnvConfig.IDENTITY}`;
        if (env_1.EnvConfig.IS_DEMO_MODE)
            title = 'Flight Chain REST API';
        let description = '<p>This iChain API is used to interface to the Smart Contract..</p>';
        const options = new swagger_1.DocumentBuilder()
            .setTitle(title)
            .setContactEmail('renjithkn@gmail.com')
            .setExternalDoc('See IBS Blockchain Sandbox for more details', '')
            .setDescription(description)
            .setVersion('1.0')
            .setSchemes("http", "https")
            .addBearerAuth("Authorization", 'header')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, options);
        swagger_1.SwaggerModule.setup(exports.DOCS_URL, app, document);
        app.enableCors();
        yield app.listen(env_1.EnvConfig.LISTENING_PORT);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map