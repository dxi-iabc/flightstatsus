import {HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {RequestHelper} from "../core/chain-interface/requesthelper";
import {FlightChainData, IFabricTimestamp, IFlightChainHistory} from "./FlightChainData";
import {AcrisAirport} from "../acris-schema/AricsAirport";
import {ACRISFlightValidation} from "../common/utils/ACRISValidation";
import {Log} from "../common/utils/logging/log.service";
import _ = require("lodash");
import network = require("./network.js");

/**
 * These are the names of the functions in the chaincode.
 */
export enum FlightChainMethod {
    'getVersion' = 'getVersion',
    'getFlight' = 'getFlight',
    'getFlightHistory' = 'getFlightHistory',
    'createFlight' = 'createFlight',
    'updateFlight' = 'updateFlight'
}

@Injectable()
export class FlightChain2Service {
    /**
     * Creates an instance of CarService.
     * @param {RequestHelper} requestHelper
     * @memberof FlightChain2Service
     */
    constructor(private requestHelper: RequestHelper) {
    }

    /**
     *
     * @returns {Promise<any>}
     * @memberof FlightChain2Service
     */
    getVersion(): Promise<any> {
        return network.getVersion(FlightChainMethod.getVersion);
    }

    /**
     *
     * @returns {Promise<FlightChainData>}
     * @memberof FlightChain2Service
     */
    getFlight(flightKey: string): Promise<FlightChainData> {
        
        return network.queryFlight(FlightChainMethod.getFlight, flightKey).then(
            (flight) => {
                if (!flight) {
                    throw new NotFoundException(`Flight does not exist with flightKey: ${flightKey}`);
                }
                return flight;
            },
            (error) => {
                throw new InternalServerErrorException(error);
            },
        );
    }
    
    getOperationFlightByIataCode(iatacode: string): Promise<any> {
        
        return network.queryFlight("getOperatingAirlineDataByIataCode", iatacode).then(
            (flight) => {
                if (!flight) {
                    throw new NotFoundException(`Flight does not exist with operating iatacode: ${iatacode}`);
                }
                return (flight);
            },
            (error) => {
                throw new InternalServerErrorException(error);
            },
        );
    }
    
    
     getAllFlights(): Promise<any> {
         
        console.log("--------------------start-----");
        
        return network.queryWorldState("getAllDataCode").then(
            (flight) => {
                if (!flight) {
                    throw new NotFoundException(`Flight data does not exist`);
                }
                return flight;
            },
            (error) => {
                throw new InternalServerErrorException(error);
            },
        );
    }

    /**
     *
     * @returns {Promise<FlightChainData[]>}
     * @memberof FlightChain2Service
     */
    getFlightHistory(flightKey: string): Promise<FlightChainData[]> {
        
        return network.queryFlight(FlightChainMethod.getFlightHistory, flightKey).then(
            (flightHistory) => {
                if (!flightHistory || flightHistory.length === 0) {
                    throw new NotFoundException(`Flight does not exist with flightKey: ${flightKey}`);
                }
                return this.processFlightsHistory(flightHistory);
            },
            (error) => {
                throw new InternalServerErrorException(error);
            },
        );

    }


    /**
     * Create new flight
     *
     * @returns {Promise<any>}
     * @memberof FlightChain2Service
     */
    createFlight(flight: AcrisAirport): Promise<FlightChainData> {
        
        
        
        return network.createFlight(JSON.stringify(flight)).then(
            (response:any) => {
                 if(response.message == undefined)
                return network.queryFlight("getFlight",ACRISFlightValidation.generateUniqueKey(flight));
                else
                return response;
            }, (error) => {
                throw new InternalServerErrorException(error);
            });
            
        /*
        return this.requestHelper.invokeRequest(FlightChainMethod.createFlight, [JSON.stringify(flight)]).then(
            (response) => {
                return this.getFlight(ACRISFlightValidation.generateUniqueKey(flight));
            }, (error) => {
                throw new InternalServerErrorException(error);
            });*/
            
    }

    /**
     * Update an existing flight.
     *
     * @returns {Promise<any>}
     * @memberof FlightChain2Service
     */
    updateFlight(flightKey: string, flightDelta: AcrisAirport): Promise<FlightChainData> {
        /*return this.requestHelper.invokeRequest(FlightChainMethod.updateFlight, [flightKey, JSON.stringify(flightDelta)]).then(
            (response) => {
                return this.getFlight(flightKey);
            }, (error) => {
                throw new InternalServerErrorException(error);
            });*/
            
            return network.updateFlight(flightKey, JSON.stringify(flightDelta)).then(
            (response:any) => {
                 if(response.message == undefined)
                return network.queryFlight("getFlight",flightKey);
                else
                return response;
            }, (error) => {
                throw new InternalServerErrorException(error);
            });
    }

    /**
     * Get the transaction details for the given transaction id.
     *
     * @param channelName - name of the channel to execute this command on
     * @param transactionId
     */
    public async getTransactionInfo(transactionId: string): Promise<FlightChainData> {
        // logger.debug(`FlightChainService.getTransactionInfo('${channelName}', '${transactionId}')`);
        // await this.verifyConnectedToNetwork();

       return network.getTaxDetails(transactionId).then(
            (response) => {
                return response;
            }, (error) => {
                Log.hlf.error('error getting transaction id', error);
                if (error.message.indexOf('Entry not found in index') >= 0) {
                    throw new HttpException(error.message, HttpStatus.NOT_FOUND);
                } else {
                    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
                }
            });
    }


    /**
     * Flight at index 0 is the oldest flight.
     *
     * Each element in the flight history contains the full merged ACRIS flight status. For display purposes
     * we want to show the original ACRIS flight data sent to blockchain, and then the deltas after that.
     * Process the flight updates to identify the delta from two ACRIS array elements.
     *
     * @param flightsHistory
     */
    private processFlightsHistory(flightsHistory: IFlightChainHistory[]): FlightChainData[] {

        //logger.debug(flightsHistory);
        //flightsHistory.forEach( flight => logger.debug(flight.value));

        // this.flightLive = flights[flights.length - 1];
        let i = 0;
        let deltas = [];

        /**
         * Add the creation element to the start of the array.
         */
        let creationFlightData = <IFlightChainHistory> _.clone(flightsHistory[0]);
        // originalFlightData.updaterId = originalFlightData.value.updaterId;
        creationFlightData.value.timestamp = FlightChain2Service.dateFromBlockchainTimestamp(creationFlightData.timestamp);

        let currentFlightData = <IFlightChainHistory> _.clone(flightsHistory[flightsHistory.length - 1]);
        currentFlightData.value.timestamp = FlightChain2Service.dateFromBlockchainTimestamp(currentFlightData.timestamp);
        deltas.push(currentFlightData.value);

        /**
         * Now process all other flights to just add the deltas to this array
         */
        for (i = flightsHistory.length - 1; i > 0; i--) {

            let original: IFlightChainHistory = <IFlightChainHistory> flightsHistory[i - 1];
            let merged: IFlightChainHistory = <IFlightChainHistory> flightsHistory[i];

            let deepDiff: FlightChainData = <FlightChainData> this.difference(merged.value, original.value);
            let mergedCopy = _.clone(merged);
            mergedCopy.value = deepDiff;
            mergedCopy.value.timestamp = FlightChain2Service.dateFromBlockchainTimestamp(flightsHistory[i].timestamp);
            if (!mergedCopy.value.updaterId) {
                mergedCopy.value.updaterId = flightsHistory[i].value.updaterId;
            }

            deltas.push(mergedCopy.value);
        }
        deltas.push(creationFlightData.value);
        //logger.debug('DELTAS');
        //deltas.forEach( flight => logger.debug(flight));

        return deltas;
    }

    private static dateFromBlockchainTimestamp(timestamp: IFabricTimestamp): Date {
        if (timestamp) {
            return new Date(timestamp.low * 1000);
        }
        return new Date();
    }

    /**
     * Deep diff between two object, using lodash
     * @param  {Object} object Object compared
     * @param  {Object} base   Object to compare with
     * @return {Object}        Return a new object who represent the diff
     */
    private difference(object: FlightChainData, base: FlightChainData): any {
        function changes(object: any, base: any) {
            return _.transform(object, function (result: any, value: any, key: any) {
                if (!_.isEqual(value, base[key])) {
                    result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
                }
            });
        }

        return changes(object, base);
    }
    
    
       private processFlightsData(flightsHistory: FlightChainData[]): FlightChainData[] {

        //logger.debug(flightsHistory);
        //flightsHistory.forEach( flight => logger.debug(flight.value));

        // this.flightLive = flights[flights.length - 1];
        let i = 0;
        let deltas = [];

      

        /**
         * Now process all other flights to just add the deltas to this array
         */
        for (i = flightsHistory.length - 1; i > 0; i--) {

            
            deltas.push(flightsHistory[i]);
        }
    

        return deltas;
    }
}
