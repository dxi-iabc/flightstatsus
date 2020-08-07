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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var FlightChain2Service_1;
const common_1 = require("@nestjs/common");
const requesthelper_1 = require("../core/chain-interface/requesthelper");
const ACRISValidation_1 = require("../common/utils/ACRISValidation");
const log_service_1 = require("../common/utils/logging/log.service");
const _ = require("lodash");
const network = require("./network.js");
var FlightChainMethod;
(function (FlightChainMethod) {
    FlightChainMethod["getVersion"] = "getVersion";
    FlightChainMethod["getFlight"] = "getFlight";
    FlightChainMethod["getFlightHistory"] = "getFlightHistory";
    FlightChainMethod["createFlight"] = "createFlight";
    FlightChainMethod["updateFlight"] = "updateFlight";
})(FlightChainMethod = exports.FlightChainMethod || (exports.FlightChainMethod = {}));
let FlightChain2Service = FlightChain2Service_1 = class FlightChain2Service {
    constructor(requestHelper) {
        this.requestHelper = requestHelper;
    }
    getVersion() {
        return network.getVersion(FlightChainMethod.getVersion);
    }
    getFlight(flightKey) {
        return network.queryFlight(FlightChainMethod.getFlight, flightKey).then((flight) => {
            if (!flight) {
                throw new common_1.NotFoundException(`Flight does not exist with flightKey: ${flightKey}`);
            }
            return flight;
        }, (error) => {
            throw new common_1.InternalServerErrorException(error);
        });
    }
    getOperationFlightByIataCode(iatacode) {
        return network.queryFlight("getOperatingAirlineDataByIataCode", iatacode).then((flight) => {
            if (!flight) {
                throw new common_1.NotFoundException(`Flight does not exist with operating iatacode: ${iatacode}`);
            }
            return (flight);
        }, (error) => {
            throw new common_1.InternalServerErrorException(error);
        });
    }
    getAllFlights() {
        console.log("--------------------start-----");
        return network.queryWorldState("getAllDataCode").then((flight) => {
            if (!flight) {
                throw new common_1.NotFoundException(`Flight data does not exist`);
            }
            return flight;
        }, (error) => {
            throw new common_1.InternalServerErrorException(error);
        });
    }
    getFlightHistory(flightKey) {
        return network.queryFlight(FlightChainMethod.getFlightHistory, flightKey).then((flightHistory) => {
            if (!flightHistory || flightHistory.length === 0) {
                throw new common_1.NotFoundException(`Flight does not exist with flightKey: ${flightKey}`);
            }
            return this.processFlightsHistory(flightHistory);
        }, (error) => {
            throw new common_1.InternalServerErrorException(error);
        });
    }
    createFlight(flight) {
        return network.createFlight(JSON.stringify(flight)).then((response) => {
            if (response.message == undefined)
                return network.queryFlight("getFlight", ACRISValidation_1.ACRISFlightValidation.generateUniqueKey(flight));
            else
                return response;
        }, (error) => {
            throw new common_1.InternalServerErrorException(error);
        });
    }
    updateFlight(flightKey, flightDelta) {
        return network.updateFlight(flightKey, JSON.stringify(flightDelta)).then((response) => {
            if (response.message == undefined)
                return network.queryFlight("getFlight", flightKey);
            else
                return response;
        }, (error) => {
            throw new common_1.InternalServerErrorException(error);
        });
    }
    getTransactionInfo(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return network.getTaxDetails(transactionId).then((response) => {
                return response;
            }, (error) => {
                log_service_1.Log.hlf.error('error getting transaction id', error);
                if (error.message.indexOf('Entry not found in index') >= 0) {
                    throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
                }
                else {
                    throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            });
        });
    }
    processFlightsHistory(flightsHistory) {
        let i = 0;
        let deltas = [];
        let creationFlightData = _.clone(flightsHistory[0]);
        creationFlightData.value.timestamp = FlightChain2Service_1.dateFromBlockchainTimestamp(creationFlightData.timestamp);
        let currentFlightData = _.clone(flightsHistory[flightsHistory.length - 1]);
        currentFlightData.value.timestamp = FlightChain2Service_1.dateFromBlockchainTimestamp(currentFlightData.timestamp);
        deltas.push(currentFlightData.value);
        for (i = flightsHistory.length - 1; i > 0; i--) {
            let original = flightsHistory[i - 1];
            let merged = flightsHistory[i];
            let deepDiff = this.difference(merged.value, original.value);
            let mergedCopy = _.clone(merged);
            mergedCopy.value = deepDiff;
            mergedCopy.value.timestamp = FlightChain2Service_1.dateFromBlockchainTimestamp(flightsHistory[i].timestamp);
            if (!mergedCopy.value.updaterId) {
                mergedCopy.value.updaterId = flightsHistory[i].value.updaterId;
            }
            deltas.push(mergedCopy.value);
        }
        deltas.push(creationFlightData.value);
        return deltas;
    }
    static dateFromBlockchainTimestamp(timestamp) {
        if (timestamp) {
            return new Date(timestamp.low * 1000);
        }
        return new Date();
    }
    difference(object, base) {
        function changes(object, base) {
            return _.transform(object, function (result, value, key) {
                if (!_.isEqual(value, base[key])) {
                    result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
                }
            });
        }
        return changes(object, base);
    }
    processFlightsData(flightsHistory) {
        let i = 0;
        let deltas = [];
        for (i = flightsHistory.length - 1; i > 0; i--) {
            deltas.push(flightsHistory[i]);
        }
        return deltas;
    }
};
FlightChain2Service = FlightChain2Service_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [requesthelper_1.RequestHelper])
], FlightChain2Service);
exports.FlightChain2Service = FlightChain2Service;
//# sourceMappingURL=flight-chain2.service.js.map