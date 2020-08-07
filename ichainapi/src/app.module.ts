import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {RootModule} from "./root/root.module";
import {FrontendMiddleware} from "./middleware/FrontendMiddleware";
import {MorganMiddleware} from "@nest-middlewares/morgan";
import {FlightChain2Module} from "./flight-chain2/flight-chain.module";
import {CoreModule} from "./core/core.module";
import {EnvConfig} from "./common/config/env";
import {Log} from "./common/utils/logging/log.service";
import {HealthModule} from "./health/health.module";
import {TypeOrmModule } from '@nestjs/typeorm';
import {AuthModule } from './auth/auth.module';
import {UserModule } from './user/user.module';


@Module({
  imports: [TypeOrmModule.forRoot(AppModule.getDBSettings()),
      AuthModule,CoreModule, RootModule, FlightChain2Module, HealthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
    
       private static getDBSettings(): any {
        console.log('getting db settings');
      
        return {
            database: EnvConfig.DB_NAME,
            entities: ['src/**/**.entity{.ts,.js}'],    //Uncomment this line for minikube/local use
            //entities: ['dist/**/**.entity{.ts,.js}'],
            host: EnvConfig.DB_HOST,
            password: EnvConfig.DB_PASSWORD,
            port: EnvConfig.DB_PORT,
            synchronize: true,
            type: 'mysql',
            username: EnvConfig.DB_USERNAME,
        };
    }


    constructor() {
        EnvConfig.initialise();
    }

    configure(consumer: MiddlewareConsumer): void {

        // IMPORTANT! Call Middleware.configure BEFORE using it for routes
        MorganMiddleware.configure( 'combined')
        consumer.apply(MorganMiddleware).forRoutes( {
            // @ts-ignore
            path: '/flightChain/*', method: RequestMethod.ALL
        },
         {
          // @ts-ignore
          method: RequestMethod.ALL, path: '/auth/*' });


        consumer.apply(FrontendMiddleware)
            .forRoutes({
                // @ts-ignore
                path: '*', method: RequestMethod.ALL
            },
        );
    }
}
