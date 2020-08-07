import {Get, Controller, Param, HttpStatus, Post, Body, HttpException, Patch, Query, Inject, Res, Req} from '@nestjs/common';
import {HEALTH_ROUTE_PREFIX} from "../middleware/FrontendMiddleware";
import {FlightChain2Service} from "../flight-chain2/flight-chain2.service";
const winstonLogger = require('../winstonConfig');


/**
 * This controller is for checking the state of the API, and reporting to k8s
 */
@Controller(HEALTH_ROUTE_PREFIX)
export class HealthController {

    constructor(private flightChainService: FlightChain2Service) {
    }


    @Get('/liveness')
    public async getLiveness(@Res() res) {
        console.log('getAliveness');
        this.flightChainService.getFlight('2018-01-01LHRBA0227')
            .then(version => {
                winstonLogger.debug('getAliveness good');
                res.status(HttpStatus.OK).json({ok:true})
            }).catch(error => {
                if (error.status === HttpStatus.NOT_FOUND) {
                    // it is expected that the flight will not be found, so a 404 is actually OK response
                    res.status(HttpStatus.OK).json({ok:true})
                } else {
                    winstonLogger.error('getAliveness bad', error);
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ok:false, message: error.toString()})
                }
        })
    }

    @Get('/readiness')
    public getReadiness(@Res() res) {
        console.log('getReadiness');
        this.flightChainService.getFlight('2018-01-01LHRBA0227')
            .then(version => {
                winstonLogger.debug('getReadiness good');
                res.status(HttpStatus.OK).json({ok:true})
            }).catch(error => {
            if (error.status === HttpStatus.NOT_FOUND) {
                // it is expected that the flight will not be found, so a 404 is actually OK response
                res.status(HttpStatus.OK).json({ok:true})
            } else {
                winstonLogger.error('getReadiness bad', error);
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ok:false, message: error.toString()})
            }
        })
    }
}
