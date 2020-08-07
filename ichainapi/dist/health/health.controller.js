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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const FrontendMiddleware_1 = require("../middleware/FrontendMiddleware");
const flight_chain2_service_1 = require("../flight-chain2/flight-chain2.service");
const winstonLogger = require('../winstonConfig');
let HealthController = class HealthController {
    constructor(flightChainService) {
        this.flightChainService = flightChainService;
    }
    getLiveness(res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('getAliveness');
            this.flightChainService.getFlight('2018-01-01LHRBA0227')
                .then(version => {
                winstonLogger.debug('getAliveness good');
                res.status(common_1.HttpStatus.OK).json({ ok: true });
            }).catch(error => {
                if (error.status === common_1.HttpStatus.NOT_FOUND) {
                    res.status(common_1.HttpStatus.OK).json({ ok: true });
                }
                else {
                    winstonLogger.error('getAliveness bad', error);
                    res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, message: error.toString() });
                }
            });
        });
    }
    getReadiness(res) {
        console.log('getReadiness');
        this.flightChainService.getFlight('2018-01-01LHRBA0227')
            .then(version => {
            winstonLogger.debug('getReadiness good');
            res.status(common_1.HttpStatus.OK).json({ ok: true });
        }).catch(error => {
            if (error.status === common_1.HttpStatus.NOT_FOUND) {
                res.status(common_1.HttpStatus.OK).json({ ok: true });
            }
            else {
                winstonLogger.error('getReadiness bad', error);
                res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, message: error.toString() });
            }
        });
    }
};
__decorate([
    common_1.Get('/liveness'),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getLiveness", null);
__decorate([
    common_1.Get('/readiness'),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "getReadiness", null);
HealthController = __decorate([
    common_1.Controller(FrontendMiddleware_1.HEALTH_ROUTE_PREFIX),
    __metadata("design:paramtypes", [flight_chain2_service_1.FlightChain2Service])
], HealthController);
exports.HealthController = HealthController;
//# sourceMappingURL=health.controller.js.map