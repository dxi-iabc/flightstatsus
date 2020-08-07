"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var AppModule_1;
const common_1 = require("@nestjs/common");
const root_module_1 = require("./root/root.module");
const FrontendMiddleware_1 = require("./middleware/FrontendMiddleware");
const morgan_1 = require("@nest-middlewares/morgan");
const flight_chain_module_1 = require("./flight-chain2/flight-chain.module");
const core_module_1 = require("./core/core.module");
const env_1 = require("./common/config/env");
const health_module_1 = require("./health/health.module");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
let AppModule = AppModule_1 = class AppModule {
    constructor() {
        env_1.EnvConfig.initialise();
    }
    static getDBSettings() {
        console.log('getting db settings');
        return {
            database: env_1.EnvConfig.DB_NAME,
            entities: ['dist/**/**.entity{.ts,.js}'],
            host: env_1.EnvConfig.DB_HOST,
            password: env_1.EnvConfig.DB_PASSWORD,
            port: env_1.EnvConfig.DB_PORT,
            synchronize: true,
            type: 'mysql',
            username: env_1.EnvConfig.DB_USERNAME,
        };
    }
    configure(consumer) {
        morgan_1.MorganMiddleware.configure('combined');
        consumer.apply(morgan_1.MorganMiddleware).forRoutes({
            path: '/flightChain/*', method: common_1.RequestMethod.ALL
        }, {
            method: common_1.RequestMethod.ALL, path: '/auth/*'
        });
        consumer.apply(FrontendMiddleware_1.FrontendMiddleware)
            .forRoutes({
            path: '*', method: common_1.RequestMethod.ALL
        });
    }
};
AppModule = AppModule_1 = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forRoot(AppModule_1.getDBSettings()),
            auth_module_1.AuthModule, core_module_1.CoreModule, root_module_1.RootModule, flight_chain_module_1.FlightChain2Module, health_module_1.HealthModule, user_module_1.UserModule],
        controllers: [],
        providers: [],
    }),
    __metadata("design:paramtypes", [])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map