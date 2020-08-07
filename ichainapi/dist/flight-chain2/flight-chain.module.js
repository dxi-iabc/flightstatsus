"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const flight_chain2_service_1 = require("./flight-chain2.service");
const chain_module_1 = require("../core/chain-interface/chain.module");
const flight_chain2_controller_1 = require("./flight-chain2.controller");
let FlightChain2Module = class FlightChain2Module {
    configure(consumer) {
    }
};
FlightChain2Module = __decorate([
    common_1.Module({
        controllers: [
            flight_chain2_controller_1.FlightChain2Controller,
        ],
        providers: [
            flight_chain2_service_1.FlightChain2Service,
        ],
        imports: [
            chain_module_1.ChainModule,
        ],
        exports: [
            flight_chain2_service_1.FlightChain2Service
        ]
    })
], FlightChain2Module);
exports.FlightChain2Module = FlightChain2Module;
//# sourceMappingURL=flight-chain.module.js.map