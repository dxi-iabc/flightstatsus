import { Module, NestModule } from '@nestjs/common';
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware';
import { EnvConfig } from '../common/config/env';
// import { JwtauthenticationMiddleware } from '../common/middleware/jwtauthentication.middleware';
// import { HlfcredsgeneratorMiddleware } from '../common/middleware/hlfcredsgenerator.middleware';
import {FlightChain2Service} from "./flight-chain2.service";
import {ChainModule} from "../core/chain-interface/chain.module";
import {FlightChain2Controller} from "./flight-chain2.controller";
// import {HlfcredsgeneratorMiddleware} from "../common/middleware/hlfcredsgenerator.middleware";

@Module({
    controllers: [
        FlightChain2Controller,
    ],
    providers: [
        FlightChain2Service,
    ],
    imports: [
        ChainModule,
    ],
    exports: [
        FlightChain2Service
    ]
})
export class FlightChain2Module implements NestModule {
    configure(consumer: MiddlewareConsumer): void {

        // if (!EnvConfig.SKIP_MIDDLEWARE) {
        //      consumer
                 // .apply(JwtauthenticationMiddleware, HlfcredsgeneratorMiddleware)
                 //.apply(HlfcredsgeneratorMiddleware)
                 // .forRoutes(FlightChain2Controller);
        // }
    }
}
