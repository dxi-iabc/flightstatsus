import {AcrisAirport} from "../../acris-schema/AricsAirport";
import {AcrisFlight} from "../../acris-schema/AcrisFlight";
export class InvalidFlightData implements Error {
    constructor(msg: string, flight: AcrisAirport) {
        this.message = msg;
    }
    flight: AcrisAirport
    message: string;
    name: string;
}
export class UniqueKeyException implements Error {
    constructor(e: Error) {
        this.message = e.message;
        this.name = e.name;
    }

    message: string;
    name: string;
}

export class ACRISFlightValidation {
    
    
    
    
    static verifyAirlineValidACRIS(flight: AcrisFlight): boolean {

        if (!flight || !flight.operatingAirline || !flight.operatingAirline.iataCode || flight.operatingAirline.iataCode.length > 4) {
            const msg = `Invalid flight data, there is no valid flight.operatingAirline.iataCode set.`;
            console.log(msg, flight);
            return false;
        }
        if (!flight || !flight.departureAirport || flight.departureAirport.length !== 3) {
            const msg = 'Invalid flight data, there is no valid flight.departureAirport set.';
            console.log(msg, flight);
            return false;
        }
        if (!flight || !flight.arrivalAirport || flight.arrivalAirport.length !== 3) {
            const msg = 'Invalid flight data, there is no valid flight.arrivalAirport set.';
            console.log(msg, flight);
           return false;
        }
        if (!flight || !flight.flightNumber || !flight.flightNumber.trackNumber || flight.flightNumber.trackNumber.length !== 4) {
            const msg = 'Invalid flight data, there is no valid 4 digit flight.flightNumber.trackNumber set.';
            console.log(msg, flight);
            return false;
        }
        if (!flight || !flight.originDate || !Date.parse(flight.originDate)) {
            const msg = 'Invalid flight data, there is no valid flight.originDate set (e.g. 2018-09-13).';
            console.log(msg, flight);
            return false;
        }
        return true;
    }


    /**
     * Validate the ACRIS json data.
     *
     * @param {AcrisFlight} flight
     * @throws Error InvalidFlightData exception if the ACRIS is not valid
     */
    static verifyValidACRIS(airport: AcrisAirport): void {
        
          if (!airport || !airport.AircraftMovement || !airport.AircraftMovement.AircraftMovementIdentification || !airport.AircraftMovement.AircraftMovementIdentification.IATAOperatorIdentifier|| airport.AircraftMovement.AircraftMovementIdentification.IATAOperatorIdentifier.length > 4) {
            const msg = `Invalid  data, there is no valid airport.AircraftMovement.AircraftMovementIdentification.IATAOperatorIdentifier set.`;
            console.log(msg, airport);
            throw new InvalidFlightData(msg, airport);
        }
        
        
        if (!airport || !airport.AircraftMovement || !airport.AircraftMovement.AircraftMovementIdentification || !airport.AircraftMovement.AircraftMovementIdentification.IATAFlightNumber || airport.AircraftMovement.AircraftMovementIdentification.IATAFlightNumber.length > 4) {
            const msg = `Invalid  data, there is no valid airport.AircraftMovement.AircraftMovementIdentification.IATAFlightNumber set.`;
            console.log(msg, airport);
          throw new InvalidFlightData(msg, airport);
        }

      /*  if (!airport || !airport.AircraftMovement || !airport.AircraftMovement.AircraftMovementIdentification || !airport.AircraftMovement.AircraftMovementIdentification.DisplayedIdentifier || airport.AircraftMovement.AircraftMovementIdentification.DisplayedIdentifier.length > 4) {
            const msg = `Invalid  data, there is no valid airport.AircraftMovement.AircraftMovementIdentification.DisplayedIdentifier set.`;
            console.log(msg, airport);
            throw new InvalidFlightData(msg, airport);
        }*/

        if (!airport || !airport.AircraftMovement || !airport.AircraftMovement.AircraftMovementIdentification || !airport.AircraftMovement.AircraftMovementIdentification.ScheduledDateTime ) {
            const msg = `Invalid  data, there is no valid airport.AircraftMovement.AircraftMovementIdentification.ScheduledDateTime set.`;
            console.log(msg, airport);
           throw new InvalidFlightData(msg, airport);
        }

       /* if (!airport || !airport.AircraftTransport || !airport.AircraftTransport.AircraftTransportIdentifier || !airport.AircraftTransport.AircraftTransportIdentifier.IATATypeCode|| airport.AircraftTransport.AircraftTransportIdentifier.IATATypeCode.length < 1) {
            const msg = `Invalid  data, there is no valid airport.OperatingParties.AirlineParty.IATAIdentifier set.`;
            console.log(msg, airport);
            throw new InvalidFlightData(msg, airport);
        }*/
       /* if (!airport || !airport.AirportFacility || airport.AirportFacility.IATAIdentifier.length !== 3) {
            const msg = 'Invalid  data, there is no valid  airport.AirportFacility.IATAIdentifier set.';
            console.log(msg, airport.AirportFacility);
            throw new InvalidFlightData(msg, airport);
        }*/
       /* if (!airport || !airport.AirportFacility || airport.AirportFacility.IATAIdentifier.length !== 3) {
            const msg = 'Invalid flight data, there is no valid flight.arrivalAirport set.';
           
            throw new Error(msg);
        }*/

      
    }


    /**
     * Generate the unique key for a given acris flight.
     * @param flight
     * @throws Exception if the flight data is missing mandatory fields.
     */
    static generateUniqueKey(airport: AcrisAirport): string {

        try {
            
       console.log(airport.AirportFacility.RunwayFacility)
        let airportNum = airport.AircraftMovement.AircraftMovementIdentification.IATAFlightNumber;
        let dateTime:string =  airport.AircraftMovement.AircraftMovementIdentification.ScheduledDateTime;
             dateTime        =  dateTime.substr(0, dateTime.indexOf("T"));
             
        let arriValORdep     = airport.AircraftMovement.ArrivalOrDeparture;
        let airportCode      = airport.AircraftMovement.FlightOriginOrDestination;
        if(arriValORdep == "D"){
            airportCode =    airport.AirportFacility.IATAIdentifier;
        }
        const flightKey: string =  dateTime +
                                   airport.AircraftMovement.AircraftMovementIdentification.IATAOperatorIdentifier + 
                                   airportNum;
          
        console.log('New Logic generateUniqueKey: ', flightKey);
        return flightKey;
       
        } catch (e) {
            console.log(`generateUniqueKey Exception ${e.message}, json data: `, airport);
            throw new UniqueKeyException(e);
        }
    }
}

