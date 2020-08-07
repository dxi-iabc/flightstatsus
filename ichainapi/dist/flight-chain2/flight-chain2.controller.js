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
const AricsAirport_1 = require("../acris-schema/AricsAirport");
const swagger_1 = require("@nestjs/swagger");
const NodeCache = require("node-cache");
const FrontendMiddleware_1 = require("../middleware/FrontendMiddleware");
const flight_chain2_service_1 = require("./flight-chain2.service");
const FlightChainData_1 = require("./FlightChainData");
const ACRISValidation_1 = require("../common/utils/ACRISValidation");
const TransForm_1 = require("../common/utils/TransForm");
const lodash_1 = require("lodash");
let FlightChain2Controller = class FlightChain2Controller {
    constructor(flightChainService) {
        this.flightChainService = flightChainService;
        this.myCache = new NodeCache();
    }
    getVersion(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.flightChainService.getVersion();
        });
    }
    flightall(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.flightChainService.getAllFlights();
        });
    }
    getOneFlight(flightKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.flightChainService.getFlight(flightKey);
        });
    }
    createFlight(flight) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                ACRISValidation_1.ACRISFlightValidation.verifyValidACRIS(flight);
            }
            catch (e) {
                throw new common_1.HttpException('Invalid flight data. Did you pass the mandatory fields (originDate, departureAirport, arrivalAirport, operatingAirline.iataCode and flightNumber.trackNumber) : ' + e.message, common_1.HttpStatus.BAD_REQUEST);
            }
            if (flight.AircraftMovement && flight.AircraftMovement.AircraftMovementStatus && flight.AircraftMovement.AircraftMovementStatus.StatusMessages && flight.AircraftMovement.AircraftMovementStatus.StatusMessages.length == 0)
                flight.AircraftMovement.AircraftMovementStatus.StatusMessages = [TransForm_1.ACRISTransformaer.getFlightStatusMessagessage(flight.AircraftMovement.AircraftMovementStatus.Code)];
            const flightCreated = yield this.flightChainService.createFlight(flight);
            if (flightCreated === undefined) {
                throw new common_1.HttpException('Invalid flight', common_1.HttpStatus.BAD_REQUEST);
            }
            let success = this.myCache.set(flightCreated.flightKey, JSON.stringify(flightCreated.flightData), 80000);
            return flightCreated;
        });
    }
    createFlightIndempotent(flight) {
        return __awaiter(this, void 0, void 0, function* () {
            let key = null;
            try {
                ACRISValidation_1.ACRISFlightValidation.verifyValidACRIS(flight);
                key = ACRISValidation_1.ACRISFlightValidation.generateUniqueKey(flight);
            }
            catch (e) {
                key = "0";
            }
            let flightCreated;
            if (this.myCache.has(key) || key == "0") {
                let oldFlightData = JSON.parse(this.myCache.get(key));
                let flightDiffData = TransForm_1.ACRISTransformaer.difference(JSON.parse(this.myCache.get(key)), flight);
                let newData = TransForm_1.ACRISTransformaer.replaceNewValue(flightDiffData);
                console.log("------------------Ne Diff data---------------------", newData);
                let newflight;
                if (newData != undefined) {
                    newflight = JSON.parse(newData);
                    if (newflight.SequenceID)
                        newflight.SequenceID = flight.SequenceID;
                    if (newflight.SchemaVersion)
                        newflight.SchemaVersion = flight.SchemaVersion;
                    console.log("---------1start----------");
                    if (newflight.AircraftTransport && newflight.AircraftTransport.AircraftTransportLoad && newflight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried && newflight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried.TotalPassengerCount && flight.AircraftTransport != undefined && flight.AircraftTransport.AircraftTransportLoad != undefined && flight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried != undefined && flight.AircraftTransport != undefined && flight.AircraftTransport.AircraftTransportLoad != undefined && flight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried.TotalPassengerCount != undefined)
                        newflight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried.TotalPassengerCount = flight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried.TotalPassengerCount;
                    console.log("---------1 end----------");
                    if (newflight.AircraftMovement && newflight.AircraftMovement.AircraftMovementStatus && newflight.AircraftMovement.AircraftMovementStatus.StatusMessages && newflight.AircraftMovement.AircraftMovementStatus.StatusMessages.length > 0)
                        newflight.AircraftMovement.AircraftMovementStatus.StatusMessages = [];
                    if (flight.AircraftMovement && newflight.AircraftMovement) {
                        console.log("---------1----------");
                        if (newflight.AircraftMovement.AircraftMovementStatus && newflight.AircraftMovement.AircraftMovementStatus.Code && flight.AircraftMovement.AircraftMovementStatus && flight.AircraftMovement.AircraftMovementStatus.Code != undefined && flight.AircraftMovement.AircraftMovementStatus.Code.length > 0) {
                            newflight.AircraftMovement.AircraftMovementStatus.StatusMessages = [TransForm_1.ACRISTransformaer.getFlightStatusMessagessage(flight.AircraftMovement.AircraftMovementStatus.Code)];
                            newflight.AircraftMovement.AircraftMovementStatus.StatusMessages = lodash_1.compact(lodash_1.differenceWith(newflight.AircraftMovement.AircraftMovementStatus.StatusMessages, oldFlightData.AircraftMovement.AircraftMovementStatus.StatusMessages, lodash_1.isEqual));
                        }
                        if (newflight.AircraftMovement.SpecialNeedsIndicator != undefined && flight.AircraftMovement.SpecialNeedsIndicator != undefined && flight.AircraftMovement.SpecialNeedsIndicator.length > 0)
                            newflight.AircraftMovement.SpecialNeedsIndicator = lodash_1.compact(lodash_1.differenceWith(flight.AircraftMovement.SpecialNeedsIndicator, oldFlightData.AircraftMovement.SpecialNeedsIndicator, lodash_1.isEqual));
                        if (newflight.AircraftMovement.AircraftMovementIdentification && newflight.AircraftMovement.AircraftMovementIdentification.CodeShareIdentifier && flight.AircraftMovement.AircraftMovementIdentification && flight.AircraftMovement.AircraftMovementIdentification.CodeShareIdentifier != undefined && flight.AircraftMovement.AircraftMovementIdentification.CodeShareIdentifier.length > 0)
                            newflight.AircraftMovement.AircraftMovementIdentification.CodeShareIdentifier = lodash_1.differenceWith(flight.AircraftMovement.AircraftMovementIdentification.CodeShareIdentifier, oldFlightData.AircraftMovement.AircraftMovementIdentification.CodeShareIdentifier, lodash_1.isEqual);
                        if (newflight.AircraftMovement.DisplayedAircraftMovement && newflight.AircraftMovement.DisplayedAircraftMovement.Comments && flight.AircraftMovement.DisplayedAircraftMovement && flight.AircraftMovement.DisplayedAircraftMovement.Comments != undefined && flight.AircraftMovement.DisplayedAircraftMovement.Comments.length > 0)
                            newflight.AircraftMovement.DisplayedAircraftMovement.Comments = lodash_1.differenceWith(flight.AircraftMovement.DisplayedAircraftMovement.Comments, oldFlightData.AircraftMovement.DisplayedAircraftMovement.Comments, lodash_1.isEqual);
                        if (newflight.AircraftMovement.Connections && flight.AircraftMovement.Connections && flight.AircraftMovement.Connections.length > 0)
                            newflight.AircraftMovement.Connections = lodash_1.differenceWith(flight.AircraftMovement.Connections, oldFlightData.AircraftMovement.Connections, lodash_1.isEqual);
                        if (flight.AircraftMovement.OperationalTimes && flight.AircraftMovement.OperationalTimes.LocallyDefinedTimes != undefined && flight.AircraftMovement.OperationalTimes.LocallyDefinedTimes.length > 0 && newflight.AircraftMovement.OperationalTimes && newflight.AircraftMovement.OperationalTimes.LocallyDefinedTimes)
                            newflight.AircraftMovement.OperationalTimes.LocallyDefinedTimes = lodash_1.differenceWith(flight.AircraftMovement.OperationalTimes.LocallyDefinedTimes, oldFlightData.AircraftMovement.OperationalTimes.LocallyDefinedTimes, lodash_1.isEqual);
                        if (newflight.AircraftMovement.IATAIrregularitiesDelays && flight.AircraftMovement.IATAIrregularitiesDelays != undefined && flight.AircraftMovement.IATAIrregularitiesDelays.length > 0)
                            newflight.AircraftMovement.IATAIrregularitiesDelays = lodash_1.differenceWith(flight.AircraftMovement.IATAIrregularitiesDelays, oldFlightData.AircraftMovement.IATAIrregularitiesDelays, lodash_1.isEqual);
                    }
                    if (newflight != undefined) {
                        console.log("---------2start----------");
                        if (newflight.Route && newflight.Route.PortOfCall && flight.Route && flight.Route.PortOfCall != undefined && flight.Route.PortOfCall.length > 0 && oldFlightData && oldFlightData.Route)
                            newflight.Route.PortOfCall = lodash_1.differenceWith(flight.Route.PortOfCall, oldFlightData.Route.PortOfCall, lodash_1.isEqual);
                        console.log("---------3start----------");
                        if (newflight.AirportFacility && newflight.AirportFacility.TerminalFacility && flight.AirportFacility && flight.AirportFacility.TerminalFacility != undefined && flight.AirportFacility.TerminalFacility.length > 0 && oldFlightData & oldFlightData.AirportFacility && oldFlightData.AirportFacility.TerminalFacility)
                            newflight.AirportFacility.TerminalFacility = lodash_1.differenceWith(flight.AirportFacility.TerminalFacility, oldFlightData.AirportFacility.TerminalFacility, lodash_1.isEqual);
                        console.log("---------4start----------");
                        if (newflight.AircraftTransport && newflight.AircraftTransport.AircraftTransportCabin && flight.AircraftTransport && flight.AircraftTransport.AircraftTransportCabin != undefined && flight.AircraftTransport.AircraftTransportCabin.length > 0 && oldFlightData && oldFlightData.AircraftTransport && oldFlightData.AircraftTransport.AircraftTransportCabin)
                            newflight.AircraftTransport.AircraftTransportCabin = lodash_1.differenceWith(flight.AircraftTransport.AircraftTransportCabin, oldFlightData.AircraftTransport.AircraftTransportCabin, lodash_1.isEqual);
                        console.log("---------5start----------");
                        if (newflight.AircraftTransport && newflight.AircraftTransport.AircraftTransportLoad && newflight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried && flight.AircraftTransport && flight.AircraftTransport.AircraftTransportLoad != undefined && flight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried && flight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried.PassengerTypes.length > 0 && oldFlightData)
                            newflight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried.PassengerTypes = lodash_1.differenceWith(flight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried.PassengerTypes, oldFlightData.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried.PassengerTypes, lodash_1.isEqual);
                        console.log("---------6start----------");
                        if (newflight.AircraftTransport && newflight.AircraftTransport.AircraftTransportLoad && newflight.AircraftTransport.AircraftTransportLoad.BagItemCarried && flight.AircraftTransport && flight.AircraftTransport.AircraftTransportLoad != undefined && flight.AircraftTransport.AircraftTransportLoad.BagItemCarried && flight.AircraftTransport.AircraftTransportLoad.BagItemCarried.BagTypes.length > 0 && oldFlightData && oldFlightData.flight && oldFlightData.flight.AircraftTransport && oldFlightData.flight.AircraftTransport.AircraftTransportLoad && oldFlightData.flight.AircraftTransport.AircraftTransportLoad.BagItemCarried && oldFlightData.flight.AircraftTransport.AircraftTransportLoad.BagItemCarried.BagTypes)
                            newflight.AircraftTransport.AircraftTransportLoad.BagItemCarried.BagTypes = lodash_1.differenceWith(flight.AircraftTransport.AircraftTransportLoad.BagItemCarried.BagTypes, oldFlightData.flight.AircraftTransport.AircraftTransportLoad.BagItemCarried.BagTypes, lodash_1.isEqual);
                        console.log("---------7start----------");
                        if (newflight.AircraftTransport && newflight.AircraftTransport.AircraftTransportLoad && newflight.AircraftTransport.AircraftTransportLoad.CargoItemCarried && flight.AircraftTransport && flight.AircraftTransport.AircraftTransportLoad != undefined && flight.AircraftTransport.AircraftTransportLoad.CargoItemCarried && flight.AircraftTransport.AircraftTransportLoad.CargoItemCarried.CargoTypes.length > 0 && oldFlightData && oldFlightData.flight && oldFlightData.flight.AircraftTransport && oldFlightData.flight.AircraftTransport.AircraftTransportLoad && oldFlightData.flight.AircraftTransport.AircraftTransportLoad.CargoItemCarried && oldFlightData.flight.AircraftTransport.AircraftTransportLoad.CargoItemCarried.CargoTypes)
                            newflight.AircraftTransport.AircraftTransportLoad.CargoItemCarried.CargoTypes = lodash_1.differenceWith(flight.AircraftTransport.AircraftTransportLoad.CargoItemCarried.CargoTypes, oldFlightData.flight.AircraftTransport.AircraftTransportLoad.CargoItemCarried.CargoTypes, lodash_1.isEqual);
                        console.log("---------8start----------");
                        if (newflight.OperatingParties && newflight.OperatingParties.HandlingAgentParty && flight.OperatingParties && flight.OperatingParties.HandlingAgentParty != undefined && flight.OperatingParties.HandlingAgentParty.length > 0 && oldFlightData && oldFlightData.OperatingParties && oldFlightData.OperatingParties.HandlingAgentParty)
                            newflight.OperatingParties.HandlingAgentParty = lodash_1.differenceWith(flight.OperatingParties.HandlingAgentParty, oldFlightData.OperatingParties.HandlingAgentParty, lodash_1.isEqual);
                        console.log("---------9start----------");
                        if (flight.LocalInformation != undefined && flight.LocalInformation.length > 0 && oldFlightData && oldFlightData.LocalInformation)
                            newflight.LocalInformation = lodash_1.compact(lodash_1.differenceWith(flight.LocalInformation, oldFlightData.LocalInformation, lodash_1.isEqual));
                        console.log("---------10start----------");
                    }
                }
                console.log("------------------before update-----------------", JSON.stringify(newflight));
                if (newflight == undefined)
                    newflight = flight;
                flightCreated = yield this.flightChainService.updateFlight(key, newflight);
                if (flightCreated === undefined) {
                    throw new common_1.HttpException('Invalid flight', common_1.HttpStatus.BAD_REQUEST);
                }
                let success = this.myCache.set(flightCreated.flightKey, JSON.stringify(flightCreated.flightData), 200000);
                return flightCreated;
            }
            else {
                flightCreated = yield this.flightChainService.createFlight(flight);
                if (flightCreated === undefined) {
                    throw new common_1.HttpException('Invalid flight', common_1.HttpStatus.BAD_REQUEST);
                }
                let success = this.myCache.set(flightCreated.flightKey, JSON.stringify(flightCreated.flightData), 200000);
                return flightCreated;
            }
        });
    }
    updateFlight(flightKey, flight) {
        return __awaiter(this, void 0, void 0, function* () {
            let flightCreated;
            flightCreated = yield this.flightChainService.updateFlight(flightKey, flight);
            let success = this.myCache.set(flightCreated.flightKey, JSON.stringify(flightCreated.flightData), 200000);
            return flightCreated;
        });
    }
    getOperationFlightByIataCode(iataCode) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("------------", iataCode);
            return this.flightChainService.getOperationFlightByIataCode(iataCode);
        });
    }
    getFlightHistory(flightKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.flightChainService.getFlightHistory(flightKey);
        });
    }
    getTransactionInfo(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.flightChainService.getTransactionInfo(transactionId);
        });
    }
};
__decorate([
    swagger_1.ApiOperation({
        title: 'Get chaincode version',
        description: 'Returns the version of the chaincode deployed',
    }),
    common_1.Get('/version'),
    swagger_1.ApiResponse({ status: 200, description: 'Returns the version of the chaincode.', type: String }),
    swagger_1.ApiResponse({ status: 404, description: 'Not flight matching the given flightKey has been found.' }),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FlightChain2Controller.prototype, "getVersion", null);
__decorate([
    swagger_1.ApiOperation({
        title: 'Get one flight',
        description: 'Returns the live state of the flight identified by flightKey',
    }),
    common_1.Get('/flightsall'),
    swagger_1.ApiResponse({ status: 200, description: 'The flight has been successfully returned.', type: FlightChainData_1.FlightChainData }),
    swagger_1.ApiResponse({ status: 404, description: 'Not flight matching the given flightKey has been found.', type: common_1.NotFoundException }),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FlightChain2Controller.prototype, "flightall", null);
__decorate([
    swagger_1.ApiOperation({
        title: 'Get one flight',
        description: 'Returns the live state of the flight identified by flightKey',
    }),
    swagger_1.ApiImplicitParam({
        name: 'flightKey',
        type: 'string',
        required: true,
        description: 'Unique key for each flight. The key is made up of [DepDate][DepAirport][OperatingAirline][OperatingFlightNum]. e.g. 2018-07-22LGWBA0227'
    }),
    common_1.Get('/:flightKey'),
    swagger_1.ApiResponse({ status: 200, description: 'The flight has been successfully returned.', type: FlightChainData_1.FlightChainData }),
    swagger_1.ApiResponse({ status: 404, description: 'Not flight matching the given flightKey has been found.', type: common_1.NotFoundException }),
    __param(0, common_1.Param('flightKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FlightChain2Controller.prototype, "getOneFlight", null);
__decorate([
    swagger_1.ApiOperation({ deprecated: true, title: 'Create a new flight on the network - DEPRECATED, use PUT verb instead', description: 'When creating a flight with the POST command, the following fields are mandatory: originDate, departureAirport, arrivalAirport, operatingAirline.iataCode and flightNumber.trackNumber' }),
    common_1.Post(),
    swagger_1.ApiResponse({ status: 200, description: 'The flight has been successfully created.', type: FlightChainData_1.FlightChainData, isArray: false }),
    swagger_1.ApiResponse({ status: 404, description: 'Not flight matching the given flightKey has been found.' }),
    swagger_1.ApiResponse({ status: 400, description: 'The flight already exists, or the input flight data is invalid' }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AricsAirport_1.AcrisAirport]),
    __metadata("design:returntype", Promise)
], FlightChain2Controller.prototype, "createFlight", null);
__decorate([
    swagger_1.ApiOperation({ title: 'Create a new flight, or update an existing flight on the network.', description: 'When using the PUT verb, it is necessary to always pass the mandatory fields: originDate, departureAirport, arrivalAirport, operatingAirline.iataCode and flightNumber.trackNumber' }),
    common_1.Put(),
    swagger_1.ApiResponse({ status: 200, description: 'The flight has been successfully created.', type: FlightChainData_1.FlightChainData, isArray: false }),
    swagger_1.ApiResponse({ status: 400, description: 'The input flight data is invalid' }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AricsAirport_1.AcrisAirport]),
    __metadata("design:returntype", Promise)
], FlightChain2Controller.prototype, "createFlightIndempotent", null);
__decorate([
    swagger_1.ApiOperation({ title: 'Update an existing flight on the network' }),
    swagger_1.ApiImplicitParam({
        name: 'flightKey',
        type: 'string',
        required: true,
        description: 'Unique key for each flight. The key is made up of [DepDate][DepAirport][OperatingAirline][OperatingFlightNum]. e.g. 2018-07-22LGWBA0227'
    }),
    common_1.Patch('/:flightKey'),
    swagger_1.ApiResponse({ status: 200, description: 'The flight has been successfully updated.', type: FlightChainData_1.FlightChainData, isArray: false }),
    swagger_1.ApiResponse({ status: 404, description: 'Not flight matching the given flightKey has been found.' }),
    swagger_1.ApiResponse({ status: 400, description: 'The input flight data is invalid' }),
    __param(0, common_1.Param('flightKey')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, AricsAirport_1.AcrisAirport]),
    __metadata("design:returntype", Promise)
], FlightChain2Controller.prototype, "updateFlight", null);
__decorate([
    swagger_1.ApiOperation({
        title: 'Get flight by Operatingflightcode',
        description: 'Returns the details by Operatingflightcode'
    }),
    swagger_1.ApiImplicitParam({
        name: 'iataCode',
        type: 'string',
        required: true,
        description: 'Details by operating flight iata code'
    }),
    common_1.Get('/:iataCode/operatingflights'),
    swagger_1.ApiResponse({ status: 200, description: 'The flight has been successfully returned.', type: FlightChainData_1.FlightChainData, isArray: true }),
    swagger_1.ApiResponse({ status: 404, description: 'Not flight matching the given flightKey has been found.' }),
    __param(0, common_1.Param('iataCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FlightChain2Controller.prototype, "getOperationFlightByIataCode", null);
__decorate([
    swagger_1.ApiOperation({
        title: 'Get flight history',
        description: 'Returns the history of udpates for the flight identified by flightKey'
    }),
    swagger_1.ApiImplicitParam({
        name: 'flightKey',
        type: 'string',
        required: true,
        description: 'Unique key for each flight. The key is made up of [DepDate][DepAirport][OperatingAirline][OperatingFlightNum]. e.g. 2018-07-22LGWBA0227'
    }),
    common_1.Get('/:flightKey/history'),
    swagger_1.ApiResponse({ status: 200, description: 'The flight has been successfully returned.', type: FlightChainData_1.FlightChainData, isArray: true }),
    swagger_1.ApiResponse({ status: 404, description: 'Not flight matching the given flightKey has been found.' }),
    __param(0, common_1.Param('flightKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FlightChain2Controller.prototype, "getFlightHistory", null);
__decorate([
    swagger_1.ApiOperation({ title: 'Get transaction info', description: 'Returns the details of a given transaction' }),
    swagger_1.ApiImplicitParam({
        name: 'transactionId',
        type: 'string',
        required: true,
        description: 'Transaction Id returned after every flight creation or update.'
    }),
    common_1.Get('/transaction/:transactionId'),
    swagger_1.ApiResponse({ status: 200, description: 'The transaction info has been successfully returned.' }),
    swagger_1.ApiResponse({ status: 404, description: 'Not transaction info matching the given transactionId has been found.' }),
    swagger_1.ApiResponse({ status: 500, description: 'Unknown internal server error.' }),
    __param(0, common_1.Param('transactionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FlightChain2Controller.prototype, "getTransactionInfo", null);
FlightChain2Controller = __decorate([
    swagger_1.ApiUseTags('FlightChain2'),
    common_1.Controller(FrontendMiddleware_1.FLIGHTCHAIN_ROUTE_PREFIX),
    __metadata("design:paramtypes", [flight_chain2_service_1.FlightChain2Service])
], FlightChain2Controller);
exports.FlightChain2Controller = FlightChain2Controller;
//# sourceMappingURL=flight-chain2.controller.js.map