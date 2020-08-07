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
const swagger_1 = require("@nestjs/swagger");
class Via {
}
exports.Via = Via;
class FlightNumber {
}
__decorate([
    swagger_1.ApiModelProperty({ required: true }),
    __metadata("design:type", String)
], FlightNumber.prototype, "airlineCode", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: true }),
    __metadata("design:type", String)
], FlightNumber.prototype, "trackNumber", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: false }),
    __metadata("design:type", String)
], FlightNumber.prototype, "suffix", void 0);
exports.FlightNumber = FlightNumber;
class AircraftType {
}
exports.AircraftType = AircraftType;
class OperatingAirline {
}
__decorate([
    swagger_1.ApiModelProperty({ required: false }),
    __metadata("design:type", String)
], OperatingAirline.prototype, "iataCode", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: false }),
    __metadata("design:type", String)
], OperatingAirline.prototype, "icaoCode", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: false }),
    __metadata("design:type", String)
], OperatingAirline.prototype, "name", void 0);
exports.OperatingAirline = OperatingAirline;
class FlightDepartureInformation {
}
__decorate([
    swagger_1.ApiModelProperty({ required: true, description: 'Scheduled time of departure including time zone. Format ISO-8601 is used.' }),
    __metadata("design:type", String)
], FlightDepartureInformation.prototype, "scheduled", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: false, description: 'Estimated time of departure including time zone. Format ISO-8601 is used.' }),
    __metadata("design:type", String)
], FlightDepartureInformation.prototype, "estimated", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: false, description: 'Actual time of departure including time zone. Format ISO-8601 is used.' }),
    __metadata("design:type", String)
], FlightDepartureInformation.prototype, "actual", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: false, description: 'The terminal for the flight.' }),
    __metadata("design:type", String)
], FlightDepartureInformation.prototype, "terminal", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: false, description: 'The departure gate for the flight.' }),
    __metadata("design:type", String)
], FlightDepartureInformation.prototype, "gate", void 0);
exports.FlightDepartureInformation = FlightDepartureInformation;
class BaggageClaim {
}
__decorate([
    swagger_1.ApiModelProperty({ required: false, description: 'The carousel for baggage claim.' }),
    __metadata("design:type", String)
], BaggageClaim.prototype, "carousel", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: false, description: 'Expected time when the baggage claim begins.' }),
    __metadata("design:type", String)
], BaggageClaim.prototype, "expectedTimeOnCarousel", void 0);
exports.BaggageClaim = BaggageClaim;
;
class FlightArrivalInformation {
}
__decorate([
    swagger_1.ApiModelProperty({ required: true, description: 'Scheduled time of arrival including time zone. Format ISO-8601 is used.' }),
    __metadata("design:type", String)
], FlightArrivalInformation.prototype, "scheduled", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: false, description: 'Estimated time of arrival including time zone. Format ISO-8601 is used.' }),
    __metadata("design:type", String)
], FlightArrivalInformation.prototype, "estimated", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: false, description: 'Actual time of arrival including time zone. Format ISO-8601 is used.' }),
    __metadata("design:type", String)
], FlightArrivalInformation.prototype, "actual", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: false, description: 'The terminal for the flight.' }),
    __metadata("design:type", String)
], FlightArrivalInformation.prototype, "terminal", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: false, description: 'The arrival gate for the flight.' }),
    __metadata("design:type", String)
], FlightArrivalInformation.prototype, "gate", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: false, description: 'Information about where & when to get baggage.' }),
    __metadata("design:type", BaggageClaim)
], FlightArrivalInformation.prototype, "baggageClaim", void 0);
exports.FlightArrivalInformation = FlightArrivalInformation;
class AcrisFlight {
}
__decorate([
    swagger_1.ApiModelProperty({ required: true }),
    __metadata("design:type", OperatingAirline)
], AcrisFlight.prototype, "operatingAirline", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: false }),
    __metadata("design:type", AircraftType)
], AcrisFlight.prototype, "aircraftType", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: true }),
    __metadata("design:type", FlightNumber)
], AcrisFlight.prototype, "flightNumber", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: true, description: 'Three letter IATA code for the airport' }),
    __metadata("design:type", String)
], AcrisFlight.prototype, "departureAirport", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: true, description: 'Three letter IATA code for the airport' }),
    __metadata("design:type", String)
], AcrisFlight.prototype, "arrivalAirport", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: true, description: 'Date expressed in local date. Time element is not used. This date MUST not change once initialized. For a flight SFO-DEN-LHR both flight legs SFO-DEN and DEN-LHR will have the origin date of the SFO departing date (example 2015-10-15).' }),
    __metadata("design:type", String)
], AcrisFlight.prototype, "originDate", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: true, description: 'Departure information' }),
    __metadata("design:type", FlightDepartureInformation)
], AcrisFlight.prototype, "departure", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: true, description: 'Arrival information' }),
    __metadata("design:type", FlightArrivalInformation)
], AcrisFlight.prototype, "arrival", void 0);
__decorate([
    swagger_1.ApiModelProperty({ required: false, description: 'Status of the flight. One of Cancelled|Diverted|Scheduled|Boarding|GateClosed|Departed|InApproach|Landed|BagClaimStarted|FlightFinished' }),
    __metadata("design:type", String)
], AcrisFlight.prototype, "flightStatus", void 0);
exports.AcrisFlight = AcrisFlight;
//# sourceMappingURL=AcrisFlight.js.map