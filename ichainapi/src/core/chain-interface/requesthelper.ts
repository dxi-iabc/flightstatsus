import { Inject, Injectable } from '@nestjs/common';
import { HlfClient } from './hlfclient';
import { Log } from '../../common/utils/logging/log.service';
import {FlightChainMethod} from "../../flight-chain2/flight-chain2.service";

@Injectable()
export class RequestHelper {
    // TODO: refactor invokes according to https://docs.nestjs.com/recipes/cqrs

    /**
     * Creates an instance of RequestHelper.
     * @param {HlfClient} hlfClient
     * @memberof RequestHelper
     */
    constructor(private hlfClient: HlfClient) {
    }

    /**
     * Pass transaction request to aws queue
     *
     * @param {FlightChainMethod} chainMethod
     * @param {Object} params
     * @param transientMap
     * @returns {Promise<any>}
     * @memberof RequestHelper
     */
    public invokeRequest(chainMethod: FlightChainMethod, params: string[],  transientMap ?: Object): Promise<any> { //} Promise<InvokeResult | any> {
        return this.hlfClient
            .invoke(chainMethod, params, transientMap)
            .then((response) => {
                Log.hlf.debug('Invoke successfully executed: ', response);
                // this.eventService.triggerSuccess(userId, chainMethod, params);
                return {txHash: response};
            })
            .catch((error) => {
                Log.hlf.error(`${chainMethod}`, error);
                // this.eventService.triggerError(userId, chainMethod, params);
                throw error;
            });
    }

    /**
     * Query hlf chain and return response
     *
     * @param {FlightChainMethod} chainMethod
     * @param {Object} params
     * @param transientMap
     * @returns {Promise<any>}
     * @memberof RequestHelper
     */
    public queryRequest(chainMethod: FlightChainMethod, params: string[], transientMap ?: Object): Promise<any> {

        return this.hlfClient
            .query(chainMethod, params, transientMap)
            .then((response) => {
                Log.hlf.debug('Query successfully executed!');
                return response;
            })
            .catch((error) => {
                console.log('queryRequestError', error);
                Log.hlf.error(`${chainMethod}`, error);
                throw error;
            });
    }

    /**
     * Query fabric blockchain to get details of a given transactionId
     *
     * @param transactionId - id of the transation to get the details of
     * @returns {Promise<any>}
     * @memberof RequestHelper
     */
    public queryTransaction(transactionId: string): Promise<any> {

        return this.hlfClient
            .queryTransaction(transactionId)
            .then((response) => {
                Log.hlf.debug('queryTransaction successfully executed!');
                return response;
            })
            .catch((error) => {
                Log.hlf.error(`Cannot get transactionId details`, error);
                throw error;
            });
    }
}
