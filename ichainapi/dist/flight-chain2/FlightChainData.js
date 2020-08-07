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
const AricsAirport_1 = require("../acris-schema/AricsAirport");
const swagger_1 = require("@nestjs/swagger");
class FlightChainData {
}
__decorate([
    swagger_1.ApiModelProperty({ required: true }),
    __metadata("design:type", AricsAirport_1.AcrisAirport)
], FlightChainData.prototype, "flightData", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: true, description: 'Unique identifier for the flight, made up of the departure date, depature airport, operating airline and flight number (e.g. 2018-09-13LHRBA0227)' }),
    __metadata("design:type", String)
], FlightChainData.prototype, "flightKey", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: true, description: 'IATA code for organisation that updated the data.' }),
    __metadata("design:type", String)
], FlightChainData.prototype, "updaterId", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: true, description: 'Blockchain transaction identifier' }),
    __metadata("design:type", String)
], FlightChainData.prototype, "txId", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: true, description: 'Timestamp of when update was made. This is only populated when getting flight history.' }),
    __metadata("design:type", Date)
], FlightChainData.prototype, "timestamp", void 0);
exports.FlightChainData = FlightChainData;
class IFlightChainHistory {
}
exports.IFlightChainHistory = IFlightChainHistory;
//# sourceMappingURL=FlightChainData.js.map