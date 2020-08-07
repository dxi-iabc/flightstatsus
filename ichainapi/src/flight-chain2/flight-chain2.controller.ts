///<reference path="../common/utils/ACRISValidation.ts"/>
import {
    Get,
    Controller,
    Param,
    HttpStatus,
    Post,
    Put,
    Body,
    HttpException,
    Patch,
    Query,
    Inject,
    Res,
    Req,
    LoggerService, NotFoundException, UseGuards
} from '@nestjs/common';
import {AcrisAirport} from '../acris-schema/AricsAirport';
import {AcrisFlight} from '../acris-schema/AcrisFlight';
import {
    ApiImplicitBody,
    ApiImplicitParam,
    ApiOperation,
    ApiResponse,
    ApiUseTags,
    ApiImplicitQuery,
    ApiBearerAuth
} from '@nestjs/swagger';

import NodeCache = require( "node-cache" );
import {FLIGHTCHAIN_ROUTE_PREFIX} from "../middleware/FrontendMiddleware";
import {FlightChain2Service} from "./flight-chain2.service";
import {FlightChainData} from "./FlightChainData";
import {ACRISFlightValidation, UniqueKeyException} from "../common/utils/ACRISValidation";
import { ACRISTransformaer} from "../common/utils/TransForm";
import {AuthGuard} from '@nestjs/passport';
import { diff } from 'json-diff';
import { differenceWith  ,isEqual,compact} from 'lodash';

@ApiUseTags('FlightChain2')
@Controller(FLIGHTCHAIN_ROUTE_PREFIX)
//@ApiBearerAuth()
//@UseGuards(AuthGuard('bearer')) - TODO  Authentication disabled - uncomment these 2 lines to reenable

//@UseGuards(AuthGuard('jwt'))
export class FlightChain2Controller {
    
     public myCache:any = new NodeCache();

    constructor(private flightChainService: FlightChain2Service) {
    }


    /**
     * @param channelName
     */
    @ApiOperation({
        title: 'Get chaincode version',
        description: 'Returns the version of the chaincode deployed',
    })

    @Get('/version')
    @ApiResponse({status: 200, description: 'Returns the version of the chaincode.', type: String})
    @ApiResponse({status: 404, description: 'Not flight matching the given flightKey has been found.'})
    public async getVersion(
        @Req() request): Promise<string> {
        return this.flightChainService.getVersion();
    }


 @ApiOperation({
        title: 'Get one flight',
        description: 'Returns the live state of the flight identified by flightKey',
    })
   

    @Get('/flightsall')
    @ApiResponse({status: 200, description: 'The flight has been successfully returned.', type: FlightChainData})
    @ApiResponse({status: 404, description: 'Not flight matching the given flightKey has been found.', type: NotFoundException})
    public async flightall(
        @Req() request): Promise<FlightChainData[]> {
        return this.flightChainService.getAllFlights();
    }

    /**
     * Get live flight data from the blockchain
     * @param flightKey
     * @param channelName
     */
    @ApiOperation({
        title: 'Get one flight',
        description: 'Returns the live state of the flight identified by flightKey',
    })
    @ApiImplicitParam({
        name: 'flightKey',
        type: 'string',
        required: true,
        description: 'Unique key for each flight. The key is made up of [DepDate][DepAirport][OperatingAirline][OperatingFlightNum]. e.g. 2018-07-22LGWBA0227'
    })

    @Get('/:flightKey')
    @ApiResponse({status: 200, description: 'The flight has been successfully returned.', type: FlightChainData})
    @ApiResponse({status: 404, description: 'Not flight matching the given flightKey has been found.', type: NotFoundException})
    public async getOneFlight(
        @Param('flightKey') flightKey): Promise<FlightChainData> {
        return this.flightChainService.getFlight(flightKey);
    }
    
    
    /**
     * Create a new flight on the blockchain
     * @param flight
     * @param channelName
     */
    @ApiOperation({deprecated: true, title: 'Create a new flight on the network - DEPRECATED, use PUT verb instead', description: 'When creating a flight with the POST command, the following fields are mandatory: originDate, departureAirport, arrivalAirport, operatingAirline.iataCode and flightNumber.trackNumber'})
    @Post("/test")
    @ApiResponse({status: 200, description: 'The flight has been successfully created.', type:FlightChainData, isArray: false})
    @ApiResponse({status: 404, description: 'Not flight matching the given flightKey has been found.'})
    @ApiResponse({status: 400, description: 'The flight already exists, or the input flight data is invalid'})
    public async acrisFlight(
        @Body() flight: AcrisFlight): Promise<any> {
            let isValid = true;
console.log(flight)
        try {
            
            
           return ACRISTransformaer.transFom(flight);
            
            
        } catch (e) {
            console.log(e)
            throw new HttpException('Invalid flight data. Did you pass the mandatory fields (originDate, departureAirport, arrivalAirport, operatingAirline.iataCode and flightNumber.trackNumber) : '+e.message, HttpStatus.BAD_REQUEST);
        }

       
        
        return isValid;
    }


    /**
     * Create a new flight on the blockchain
     * @param flight
     * @param channelName
     */
    @ApiOperation({deprecated: true, title: 'Create a new flight on the network - DEPRECATED, use PUT verb instead', description: 'When creating a flight with the POST command, the following fields are mandatory: originDate, departureAirport, arrivalAirport, operatingAirline.iataCode and flightNumber.trackNumber'})
    @Post()
    @ApiResponse({status: 200, description: 'The flight has been successfully created.', type:FlightChainData, isArray: false})
    @ApiResponse({status: 404, description: 'Not flight matching the given flightKey has been found.'})
    @ApiResponse({status: 400, description: 'The flight already exists, or the input flight data is invalid'})
    public async createFlight(
        @Body() flight: AcrisAirport): Promise<FlightChainData> {

        try {
            ACRISFlightValidation.verifyValidACRIS(flight);
        } catch (e) {
            throw new HttpException('Invalid flight data. Did you pass the mandatory fields (originDate, departureAirport, arrivalAirport, operatingAirline.iataCode and flightNumber.trackNumber) : '+e.message, HttpStatus.BAD_REQUEST);
        }
       
       console.log(flight.AircraftMovement.AircraftMovementIdentification.DisplayedIdentifier,"---11----",flight);
       if(flight.AircraftMovement && flight.AircraftMovement.AircraftMovementStatus &&  flight.AircraftMovement.AircraftMovementStatus.StatusMessages && flight.AircraftMovement.AircraftMovementStatus.StatusMessages.length == 0)
                   flight.AircraftMovement.AircraftMovementStatus.StatusMessages = [ACRISTransformaer.getFlightStatusMessagessage(flight.AircraftMovement.AircraftMovementStatus.Code)];
            console.log("---12----",flight);      
        const flightCreated: FlightChainData = await this.flightChainService.createFlight(flight);
        if (flightCreated === undefined) {
            throw new HttpException('Invalid flight', HttpStatus.BAD_REQUEST);
        }
        let success = this.myCache.set(flightCreated.flightKey, JSON.stringify(flightCreated.flightData), 80000 );
        return flightCreated;
    }

    /**
     * Create/update a flight on the blockchain
     * @param flight
     * @param channelName
     * 
     */
    @ApiOperation({title: 'Create a new flight, or update an existing flight on the network.', description: 'When using the PUT verb, it is necessary to always pass the mandatory fields: originDate, departureAirport, arrivalAirport, operatingAirline.iataCode and flightNumber.trackNumber'})
    @Put()
    @ApiResponse({status: 200, description: 'The flight has been successfully created.', type:FlightChainData, isArray: false})
    @ApiResponse({status: 400, description: 'The input flight data is invalid'})
    public async createFlightIndempotent(
        @Body() flight: AcrisAirport): Promise<FlightChainData> {
        let key = null;

        try {
            ACRISFlightValidation.verifyValidACRIS(flight);
            key = ACRISFlightValidation.generateUniqueKey(flight);
        } catch (e) {
            //throw new HttpException('Invalid flight data. Did you pass the mandatory fields (originDate, departureAirport, arrivalAirport, operatingAirline.iataCode and flightNumber.trackNumber) : '+e.message, HttpStatus.BAD_REQUEST);
        
            key ="0"
        }
        
        let flightCreated: FlightChainData ;
        
        if(this.myCache.has(key) || key =="0"){
            
            
            let oldFlightData = JSON.parse(this.myCache.get(key))
            let flightDiffData = ACRISTransformaer.difference(JSON.parse(this.myCache.get(key)),flight);// diff(JSON.parse(this.myCache.get(key)),flight);
            
             let newData= ACRISTransformaer.replaceNewValue(flightDiffData);
             
            console.log("------------------Ne Diff data---------------------",newData);
            let newflight:AcrisAirport;
             if(newData != undefined){
                 
             newflight = JSON.parse(newData);
             if(newflight.SequenceID)
             newflight.SequenceID = flight.SequenceID;
             if(newflight.SchemaVersion)
             newflight.SchemaVersion  = flight.SchemaVersion;
               console.log("---------1start----------") 
             if(newflight.AircraftTransport && newflight.AircraftTransport.AircraftTransportLoad && newflight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried && newflight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried.TotalPassengerCount && flight.AircraftTransport != undefined && flight.AircraftTransport.AircraftTransportLoad != undefined &&  flight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried != undefined  && flight.AircraftTransport != undefined  && flight.AircraftTransport.AircraftTransportLoad != undefined &&  flight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried.TotalPassengerCount != undefined )
                  newflight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried.TotalPassengerCount = flight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried.TotalPassengerCount;
              console.log("---------1 end----------") 
             if(newflight.AircraftMovement && newflight.AircraftMovement.AircraftMovementStatus &&  newflight.AircraftMovement.AircraftMovementStatus.StatusMessages && newflight.AircraftMovement.AircraftMovementStatus.StatusMessages.length > 0)
                   newflight.AircraftMovement.AircraftMovementStatus.StatusMessages = [];
               
             if(flight.AircraftMovement && newflight.AircraftMovement){
                
                console.log("---------1----------") 
              if( newflight.AircraftMovement.AircraftMovementStatus &&  newflight.AircraftMovement.AircraftMovementStatus.Code &&flight.AircraftMovement.AircraftMovementStatus && flight.AircraftMovement.AircraftMovementStatus.Code != undefined && flight.AircraftMovement.AircraftMovementStatus.Code.length > 0){
                   newflight.AircraftMovement.AircraftMovementStatus.StatusMessages = [ACRISTransformaer.getFlightStatusMessagessage(flight.AircraftMovement.AircraftMovementStatus.Code)];
                   newflight.AircraftMovement.AircraftMovementStatus.StatusMessages =compact( differenceWith(newflight.AircraftMovement.AircraftMovementStatus.StatusMessages , oldFlightData.AircraftMovement.AircraftMovementStatus.StatusMessages , isEqual));
              }   
              
              if(newflight.AircraftMovement.SpecialNeedsIndicator != undefined && flight.AircraftMovement.SpecialNeedsIndicator != undefined &&  flight.AircraftMovement.SpecialNeedsIndicator.length > 0  )
                   newflight.AircraftMovement.SpecialNeedsIndicator = compact(differenceWith( flight.AircraftMovement.SpecialNeedsIndicator, oldFlightData.AircraftMovement.SpecialNeedsIndicator,isEqual));
              if( newflight.AircraftMovement.AircraftMovementIdentification && newflight.AircraftMovement.AircraftMovementIdentification.CodeShareIdentifier && flight.AircraftMovement.AircraftMovementIdentification && flight.AircraftMovement.AircraftMovementIdentification.CodeShareIdentifier != undefined &&  flight.AircraftMovement.AircraftMovementIdentification.CodeShareIdentifier.length > 0)
                    newflight.AircraftMovement.AircraftMovementIdentification.CodeShareIdentifier =differenceWith( flight.AircraftMovement.AircraftMovementIdentification.CodeShareIdentifier, oldFlightData.AircraftMovement.AircraftMovementIdentification.CodeShareIdentifier,isEqual);
                 
              if(newflight.AircraftMovement.DisplayedAircraftMovement && newflight.AircraftMovement.DisplayedAircraftMovement.Comments && flight.AircraftMovement.DisplayedAircraftMovement && flight.AircraftMovement.DisplayedAircraftMovement.Comments != undefined &&  flight.AircraftMovement.DisplayedAircraftMovement.Comments.length > 0)
                    newflight.AircraftMovement.DisplayedAircraftMovement.Comments =differenceWith(flight.AircraftMovement.DisplayedAircraftMovement.Comments, oldFlightData.AircraftMovement.DisplayedAircraftMovement.Comments, isEqual); 
                 
               if(newflight.AircraftMovement.Connections && flight.AircraftMovement.Connections &&  flight.AircraftMovement.Connections.length > 0)
                     newflight.AircraftMovement.Connections = differenceWith( flight.AircraftMovement.Connections , oldFlightData.AircraftMovement.Connections,isEqual);    
                 
                if(flight.AircraftMovement.OperationalTimes && flight.AircraftMovement.OperationalTimes.LocallyDefinedTimes != undefined &&  flight.AircraftMovement.OperationalTimes.LocallyDefinedTimes.length > 0 && newflight.AircraftMovement.OperationalTimes && newflight.AircraftMovement.OperationalTimes.LocallyDefinedTimes)
                    
                    newflight.AircraftMovement.OperationalTimes.LocallyDefinedTimes = differenceWith( flight.AircraftMovement.OperationalTimes.LocallyDefinedTimes , oldFlightData.AircraftMovement.OperationalTimes.LocallyDefinedTimes, isEqual);    
                 
               if( newflight.AircraftMovement.IATAIrregularitiesDelays  && flight.AircraftMovement.IATAIrregularitiesDelays != undefined &&  flight.AircraftMovement.IATAIrregularitiesDelays.length > 0)
                           newflight.AircraftMovement.IATAIrregularitiesDelays = differenceWith(flight.AircraftMovement.IATAIrregularitiesDelays, oldFlightData.AircraftMovement.IATAIrregularitiesDelays,isEqual);
            
            
             }
             if(newflight != undefined){
             console.log("---------2start----------") 
            if(newflight.Route && newflight.Route.PortOfCall && flight.Route && flight.Route.PortOfCall != undefined &&  flight.Route.PortOfCall.length > 0 &&  oldFlightData && oldFlightData.Route)
                           newflight.Route.PortOfCall = differenceWith(flight.Route.PortOfCall , oldFlightData.Route.PortOfCall , isEqual);
                    console.log("---------3start----------") 
            if(  newflight.AirportFacility && newflight.AirportFacility.TerminalFacility && flight.AirportFacility && flight.AirportFacility.TerminalFacility != undefined &&  flight.AirportFacility.TerminalFacility.length > 0 && oldFlightData & oldFlightData.AirportFacility && oldFlightData.AirportFacility.TerminalFacility )
                           newflight.AirportFacility.TerminalFacility = differenceWith(flight.AirportFacility.TerminalFacility , oldFlightData.AirportFacility.TerminalFacility , isEqual);
              console.log("---------4start----------")      
            if( newflight.AircraftTransport && newflight.AircraftTransport.AircraftTransportCabin && flight.AircraftTransport && flight.AircraftTransport.AircraftTransportCabin != undefined &&  flight.AircraftTransport.AircraftTransportCabin.length > 0 && oldFlightData &&  oldFlightData.AircraftTransport && oldFlightData.AircraftTransport.AircraftTransportCabin )
                           newflight.AircraftTransport.AircraftTransportCabin = differenceWith(flight.AircraftTransport.AircraftTransportCabin , oldFlightData.AircraftTransport.AircraftTransportCabin , isEqual) ;
                     console.log("---------5start----------")  
            if(newflight.AircraftTransport && newflight.AircraftTransport.AircraftTransportLoad && newflight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried && flight.AircraftTransport && flight.AircraftTransport.AircraftTransportLoad != undefined &&  flight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried && flight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried.PassengerTypes.length > 0 && oldFlightData)
                           newflight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried.PassengerTypes = differenceWith(flight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried.PassengerTypes , oldFlightData.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried.PassengerTypes , isEqual);
                           
             console.log("---------6start----------") 
                                
            if(newflight.AircraftTransport && newflight.AircraftTransport.AircraftTransportLoad && newflight.AircraftTransport.AircraftTransportLoad.BagItemCarried && flight.AircraftTransport && flight.AircraftTransport.AircraftTransportLoad != undefined &&  flight.AircraftTransport.AircraftTransportLoad.BagItemCarried && flight.AircraftTransport.AircraftTransportLoad.BagItemCarried.BagTypes.length > 0 && oldFlightData && oldFlightData.flight && oldFlightData.flight.AircraftTransport && oldFlightData.flight.AircraftTransport.AircraftTransportLoad && oldFlightData.flight.AircraftTransport.AircraftTransportLoad.BagItemCarried && oldFlightData.flight.AircraftTransport.AircraftTransportLoad.BagItemCarried.BagTypes)
                           newflight.AircraftTransport.AircraftTransportLoad.BagItemCarried.BagTypes = differenceWith(flight.AircraftTransport.AircraftTransportLoad.BagItemCarried.BagTypes , oldFlightData.flight.AircraftTransport.AircraftTransportLoad.BagItemCarried.BagTypes , isEqual);
             
               console.log("---------7start----------") 
               
            if(newflight.AircraftTransport && newflight.AircraftTransport.AircraftTransportLoad && newflight.AircraftTransport.AircraftTransportLoad.CargoItemCarried && flight.AircraftTransport && flight.AircraftTransport.AircraftTransportLoad != undefined &&  flight.AircraftTransport.AircraftTransportLoad.CargoItemCarried && flight.AircraftTransport.AircraftTransportLoad.CargoItemCarried.CargoTypes.length > 0 && oldFlightData && oldFlightData.flight && oldFlightData.flight.AircraftTransport &&oldFlightData.flight.AircraftTransport.AircraftTransportLoad && oldFlightData.flight.AircraftTransport.AircraftTransportLoad.CargoItemCarried  && oldFlightData.flight.AircraftTransport.AircraftTransportLoad.CargoItemCarried.CargoTypes)
                           newflight.AircraftTransport.AircraftTransportLoad.CargoItemCarried.CargoTypes = differenceWith(flight.AircraftTransport.AircraftTransportLoad.CargoItemCarried.CargoTypes , oldFlightData.flight.AircraftTransport.AircraftTransportLoad.CargoItemCarried.CargoTypes , isEqual);
                                       
             console.log("---------8start----------") 
            if(newflight.OperatingParties && newflight.OperatingParties.HandlingAgentParty && flight.OperatingParties && flight.OperatingParties.HandlingAgentParty != undefined &&  flight.OperatingParties.HandlingAgentParty.length > 0 &&  oldFlightData && oldFlightData.OperatingParties && oldFlightData.OperatingParties.HandlingAgentParty)
                           newflight.OperatingParties.HandlingAgentParty =differenceWith( flight.OperatingParties.HandlingAgentParty , oldFlightData.OperatingParties.HandlingAgentParty , isEqual);
              
              
                console.log("---------9start----------")     
            if(flight.LocalInformation != undefined &&  flight.LocalInformation.length > 0 && oldFlightData && oldFlightData.LocalInformation)
                           newflight.LocalInformation = compact(differenceWith( flight.LocalInformation , oldFlightData.LocalInformation , isEqual));
                           
              console.log("---------10start----------") 
            }
             }
            console.log("------------------before update-----------------",JSON.stringify(newflight));
            if(newflight == undefined) newflight = flight;
            flightCreated = await this.flightChainService.updateFlight(key, newflight);
            if (flightCreated === undefined) {
                    throw new HttpException('Invalid flight', HttpStatus.BAD_REQUEST);
                }
                
                 let success = this.myCache.set(flightCreated.flightKey, JSON.stringify(flightCreated.flightData), 200000 );
                return flightCreated;
            
        }else{
        
                flightCreated = await this.flightChainService.createFlight(flight);
                if (flightCreated === undefined) {
                    throw new HttpException('Invalid flight', HttpStatus.BAD_REQUEST);
                }
                 let success = this.myCache.set(flightCreated.flightKey, JSON.stringify(flightCreated.flightData), 200000 );
                return flightCreated;
        }
    }


    /**
     * Update an existing flight on the network.
     * @param flightKey
     * @param flight
     * @param channelName
     */
    @ApiOperation({title: 'Update an existing flight on the network'})
    @ApiImplicitParam({
        name: 'flightKey',
        type: 'string',
        required: true,
        description: 'Unique key for each flight. The key is made up of [DepDate][DepAirport][OperatingAirline][OperatingFlightNum]. e.g. 2018-07-22LGWBA0227'
    })

    @Patch('/:flightKey')
    @ApiResponse({status: 200, description: 'The flight has been successfully updated.', type:FlightChainData, isArray: false})
    @ApiResponse({status: 404, description: 'Not flight matching the given flightKey has been found.'})
    @ApiResponse({status: 400, description: 'The input flight data is invalid'})
    public async updateFlight(
        @Param('flightKey') flightKey, @Body() flight: AcrisAirport): Promise<FlightChainData> {
        // winstonLogger.debug(`FlightChainController.updateFlight(channelName=${channelName}, flightKey=${flightKey})`);
         let flightCreated: FlightChainData ;
        flightCreated = await this.flightChainService.updateFlight(flightKey, flight);
         let success = this.myCache.set(flightCreated.flightKey, JSON.stringify(flightCreated.flightData), 200000 );
                return flightCreated;
    }
    
    
    
    
    
    
     /**
     *
     * Get the history of all updates to a flight from the blockchain.
     *
     * @param Operatingflightcode
     * 
     */
   
   
   
   
    /**
     *
     * Get the history of all updates to a flight from the blockchain.
     *
     * @param Operatingflightcode
     * 
     */
    @ApiOperation({
        title: 'Get flight by Operatingflightcode',
        description: 'Returns the details by Operatingflightcode'
    })
    @ApiImplicitParam({
        name: 'iataCode',
        type: 'string',
        required: true,
        description: 'Details by operating flight iata code'
    })

    @Get('/:iataCode/operatingflights')
    @ApiResponse({status: 200, description: 'The flight has been successfully returned.', type:FlightChainData, isArray: true})
    @ApiResponse({status: 404, description: 'Not flight matching the given flightKey has been found.'})
    public async getOperationFlightByIataCode(@Param('iataCode') iataCode
        ): Promise<FlightChainData[]> {
        
        console.log("------------",iataCode)
        return this.flightChainService.getOperationFlightByIataCode(iataCode);
        }

    

    /**
     *
     * Get the history of all updates to a flight from the blockchain.
     *
     * @param flightKey
     * @param channelName
     */
    @ApiOperation({
        title: 'Get flight history',
        description: 'Returns the history of udpates for the flight identified by flightKey'
    })
    @ApiImplicitParam({
        name: 'flightKey',
        type: 'string',
        required: true,
        description: 'Unique key for each flight. The key is made up of [DepDate][DepAirport][OperatingAirline][OperatingFlightNum]. e.g. 2018-07-22LGWBA0227'
    })

    @Get('/:flightKey/history')
    @ApiResponse({status: 200, description: 'The flight has been successfully returned.', type:FlightChainData, isArray: true})
    @ApiResponse({status: 404, description: 'Not flight matching the given flightKey has been found.'})
    public async getFlightHistory(
        @Param('flightKey') flightKey): Promise<FlightChainData[]> {
        return this.flightChainService.getFlightHistory(flightKey);
    }


    @ApiOperation({title: 'Get transaction info', description: 'Returns the details of a given transaction'})
    @ApiImplicitParam({
        name: 'transactionId',
        type: 'string',
        required: true,
        description: 'Transaction Id returned after every flight creation or update.'
    })
    @Get('/transaction/:transactionId')
    @ApiResponse({status: 200, description: 'The transaction info has been successfully returned.'})
    @ApiResponse({status: 404, description: 'Not transaction info matching the given transactionId has been found.'})
    @ApiResponse({status: 500, description: 'Unknown internal server error.'})
    public async getTransactionInfo(
        @Param('transactionId') transactionId): Promise<any> {
        // winstonLogger.debug(`FlightChainController.getTransactionInfo(channelName=${channelName}, transactionId=${transactionId})`);
        return this.flightChainService.getTransactionInfo(transactionId);
    }




}
