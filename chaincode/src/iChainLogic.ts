import { AcrisAirport }  from  "./AricsAirport"
import { differenceWith ,isArray ,isEqual,isObject,transform,compact} from 'lodash';
export class iChainLogic {
static generateUniqueKey(airport: AcrisAirport): string {
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

    }

    /**
     * Validate the ACRIS json data.
     *
     * @param {AcrisFlight} flight
     * @throws Error if the ACRIS is not valid
     */
    static verifyValidACRIS(airport: AcrisAirport): void {

         if (!airport || !airport.AircraftMovement || !airport.AircraftMovement.AircraftMovementIdentification || !airport.AircraftMovement.AircraftMovementIdentification.IATAOperatorIdentifier|| airport.AircraftMovement.AircraftMovementIdentification.IATAOperatorIdentifier.length > 4 ) {
            const msg = `Invalid  data, there is no valid airport.AircraftMovement.AircraftMovementIdentification.IATAOperatorIdentifier set.`;
            console.log(msg, airport);
            throw new Error(msg);
        }
        
        
        if (!airport || !airport.AircraftMovement || !airport.AircraftMovement.AircraftMovementIdentification || !airport.AircraftMovement.AircraftMovementIdentification.IATAFlightNumber) {
            const msg = `Invalid  data, there is no valid airport.AircraftMovement.AircraftMovementIdentification.IATAFlightNumber set.`;
            console.log(msg, airport);
            throw new Error(msg);
        }

       
       
    }

    /**
     * Verify that the caller (identified by iata_code) is allowed to create/update this flight.
     *
     * @param {string} iata_code
     * @param {AcrisFlight} flight
     * @returns {boolean}
     */
    public static verifyAbleToCreateOrModifyFlight(iata_code: string, flight: AcrisAirport): void {

        if (!iata_code || iata_code.length > 3) {
            const msg = `Invalid iata-code '${iata_code}' `;
            console.log(msg);
            throw new Error(msg);
        }
      
        if (this.isAirline(iata_code)) {
            const operatingAirlne = this.getOperatingAirline(flight);
          /*  if (operatingAirlne.toUpperCase() !== iata_code.toUpperCase()) {
                const msg = `Operating airline '${operatingAirlne}' does not match certificate iata-code '${iata_code}'`;
                console.log(msg);
                throw new Error(msg);
            }*/
        } else {
            const departureAirport = this.getDepartureAirport(flight);
            const arrivalAirport = this.getArrivalAirport(flight);
           
        }
    }


   
    /**
     * If iata_code is 2, assume airline. Otherwise assume airport.
     * @param {string} iata_code
     * @returns {boolean}
     */
    private static isAirline(iata_code: string) {
        return iata_code.length === 2;
    }

    private static getOperatingAirline(flight: AcrisAirport) {
        return flight.AirportFacility.IATAIdentifier;
    }

    private static getDepartureAirport(flight: AcrisAirport) {
        return flight.AircraftMovement.FlightOriginOrDestination;
    }

    private static getArrivalAirport(flight: AcrisAirport) {
        return flight.AircraftMovement.FlightOriginOrDestination;
    }
    

   public static cleanObject(object:any) {
    Object
        .entries(object)
        .forEach(([k, v]) => {
            if (v && typeof v === 'object')
                this.cleanObject(v);
            if (v && 
                typeof v === 'object' && 
                !Object.keys(v).length || 
                v === null || 
                v === undefined ||
                (<any>v).length === 0
            ) {
                if (Array.isArray(object))
                    object.splice(<any>k, 1);
                else if (!(v instanceof Date))
                    delete object[k];
            }
        });
    return object;
}

public static filterArray(value:any, oldValue:any,key:any):any{
    
    
  
    
  const val =  value.filter((x:any) =>{
        
        return (x != null && x != undefined && x != ""  && x.toString().trim() != "null");
    });
    
    

    if(val.length > 0  && key == null ) {
        
       let newArry = [];
       
       for(let i=0;i < val.length; i++){
             let isPresent = true;
             
           for(let j = 0; j < oldValue.length;j++){
               
               if(oldValue[j].toString().trim() == val[i].toString().trim()){
               isPresent = false
               break;
               }
               if(isPresent)newArry.push(val[i].trim());
           }
           
           
       }
       return val;
        
    }
    return [];
}


public static arrayChanges(flight:AcrisAirport,oldFlight:AcrisAirport){
    
    
         
    if(flight == undefined || oldFlight == undefined) return flight;
      if(oldFlight.AircraftMovement && oldFlight.AircraftMovement.AircraftMovementStatus &&  oldFlight.AircraftMovement.AircraftMovementStatus.StatusMessages && oldFlight.AircraftMovement.AircraftMovementStatus.StatusMessages.length > 0 && flight.AircraftMovement && flight.AircraftMovement.AircraftMovementStatus &&  flight.AircraftMovement.AircraftMovementStatus.StatusMessages && flight.AircraftMovement.AircraftMovementStatus.StatusMessages.length > 0)
                   flight.AircraftMovement.AircraftMovementStatus.StatusMessages = differenceWith(compact(flight.AircraftMovement.AircraftMovementStatus.StatusMessages) , oldFlight.AircraftMovement.AircraftMovementStatus.StatusMessages , isEqual);
               
             if(flight.AircraftMovement && oldFlight.AircraftMovement){
              
                if(oldFlight.AircraftMovement.SpecialNeedsIndicator != undefined && flight.AircraftMovement.SpecialNeedsIndicator != undefined &&  flight.AircraftMovement.SpecialNeedsIndicator.length > 0  )
                   flight.AircraftMovement.SpecialNeedsIndicator = (this.filterArray( compact(flight.AircraftMovement.SpecialNeedsIndicator), oldFlight.AircraftMovement.SpecialNeedsIndicator,null));
                
               if( oldFlight.AircraftMovement.AircraftMovementIdentification && oldFlight.AircraftMovement.AircraftMovementIdentification.CodeShareIdentifier && flight.AircraftMovement.AircraftMovementIdentification && flight.AircraftMovement.AircraftMovementIdentification.CodeShareIdentifier != undefined &&  flight.AircraftMovement.AircraftMovementIdentification.CodeShareIdentifier.length > 0)
                    flight.AircraftMovement.AircraftMovementIdentification.CodeShareIdentifier =differenceWith(compact( flight.AircraftMovement.AircraftMovementIdentification.CodeShareIdentifier), oldFlight.AircraftMovement.AircraftMovementIdentification.CodeShareIdentifier,isEqual);
                 
               if(oldFlight.AircraftMovement.DisplayedAircraftMovement && oldFlight.AircraftMovement.DisplayedAircraftMovement.Comments && flight.AircraftMovement.DisplayedAircraftMovement && flight.AircraftMovement.DisplayedAircraftMovement.Comments != undefined &&  flight.AircraftMovement.DisplayedAircraftMovement.Comments.length > 0)
                    flight.AircraftMovement.DisplayedAircraftMovement.Comments =differenceWith(compact(flight.AircraftMovement.DisplayedAircraftMovement.Comments), oldFlight.AircraftMovement.DisplayedAircraftMovement.Comments, isEqual); 
                 
                if(oldFlight.AircraftMovement.Connections && flight.AircraftMovement.Connections &&  flight.AircraftMovement.Connections.length > 0)
                     flight.AircraftMovement.Connections = compact(differenceWith( compact(flight.AircraftMovement.Connections) , oldFlight.AircraftMovement.Connections,isEqual));    
                 
                 if(flight.AircraftMovement.OperationalTimes && flight.AircraftMovement.OperationalTimes.LocallyDefinedTimes != undefined &&  flight.AircraftMovement.OperationalTimes.LocallyDefinedTimes.length > 0 && oldFlight.AircraftMovement.OperationalTimes && oldFlight.AircraftMovement.OperationalTimes.LocallyDefinedTimes)
                    
                    flight.AircraftMovement.OperationalTimes.LocallyDefinedTimes = differenceWith( compact(flight.AircraftMovement.OperationalTimes.LocallyDefinedTimes) , oldFlight.AircraftMovement.OperationalTimes.LocallyDefinedTimes, isEqual);    
                 
                if( oldFlight.AircraftMovement.IATAIrregularitiesDelays  && flight.AircraftMovement.IATAIrregularitiesDelays != undefined &&  flight.AircraftMovement.IATAIrregularitiesDelays.length > 0)
                           flight.AircraftMovement.IATAIrregularitiesDelays = differenceWith(compact(flight.AircraftMovement.IATAIrregularitiesDelays), oldFlight.AircraftMovement.IATAIrregularitiesDelays,isEqual);
             }
             
             
             
             if(oldFlight.Route && oldFlight.Route.PortOfCall && flight.Route && flight.Route.PortOfCall != undefined &&  flight.Route.PortOfCall.length > 0 )
                           flight.Route.PortOfCall = compact(differenceWith(compact(flight.Route.PortOfCall) , oldFlight.Route.PortOfCall , isEqual));
          
            
             if(  flight.AirportFacility && flight.AirportFacility.TerminalFacility && flight.AirportFacility && flight.AirportFacility.TerminalFacility != undefined &&  flight.AirportFacility.TerminalFacility.length > 0 &&  oldFlight.AirportFacility && oldFlight.AirportFacility.TerminalFacility )
                           flight.AirportFacility.TerminalFacility = differenceWith(compact(flight.AirportFacility.TerminalFacility), oldFlight.AirportFacility.TerminalFacility , isEqual);
              
            if( oldFlight.AircraftTransport && oldFlight.AircraftTransport.AircraftTransportCabin && flight.AircraftTransport && flight.AircraftTransport.AircraftTransportCabin != undefined &&  flight.AircraftTransport.AircraftTransportCabin.length > 0 && oldFlight &&  oldFlight.AircraftTransport && oldFlight.AircraftTransport.AircraftTransportCabin )
                           flight.AircraftTransport.AircraftTransportCabin = differenceWith(compact(flight.AircraftTransport.AircraftTransportCabin ), oldFlight.AircraftTransport.AircraftTransportCabin , isEqual) ;
          
            if(oldFlight.AircraftTransport && oldFlight.AircraftTransport.AircraftTransportLoad && oldFlight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried && flight.AircraftTransport && flight.AircraftTransport.AircraftTransportLoad != undefined &&  flight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried && flight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried.PassengerTypes.length > 0 && oldFlight)
                           flight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried.PassengerTypes = differenceWith(compact(flight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried.PassengerTypes) , oldFlight.AircraftTransport.AircraftTransportLoad.PassengerPartyCarried.PassengerTypes , isEqual);
                           
           if(oldFlight.AircraftTransport && oldFlight.AircraftTransport.AircraftTransportLoad && oldFlight.AircraftTransport.AircraftTransportLoad.BagItemCarried && flight.AircraftTransport && flight.AircraftTransport.AircraftTransportLoad != undefined &&  flight.AircraftTransport.AircraftTransportLoad.BagItemCarried && flight.AircraftTransport.AircraftTransportLoad.BagItemCarried.BagTypes.length > 0 )
                           flight.AircraftTransport.AircraftTransportLoad.BagItemCarried.BagTypes = differenceWith(compact(flight.AircraftTransport.AircraftTransportLoad.BagItemCarried.BagTypes) , oldFlight.AircraftTransport.AircraftTransportLoad.BagItemCarried.BagTypes , isEqual);
             
        
               
            if(oldFlight.AircraftTransport && oldFlight.AircraftTransport.AircraftTransportLoad && oldFlight.AircraftTransport.AircraftTransportLoad.CargoItemCarried && flight.AircraftTransport && flight.AircraftTransport.AircraftTransportLoad != undefined &&  flight.AircraftTransport.AircraftTransportLoad.CargoItemCarried && flight.AircraftTransport.AircraftTransportLoad.CargoItemCarried.CargoTypes.length > 0 )
                           flight.AircraftTransport.AircraftTransportLoad.CargoItemCarried.CargoTypes =compact( differenceWith(compact(flight.AircraftTransport.AircraftTransportLoad.CargoItemCarried.CargoTypes) , oldFlight.AircraftTransport.AircraftTransportLoad.CargoItemCarried.CargoTypes , isEqual));
                                       
             
            if(oldFlight.OperatingParties && oldFlight.OperatingParties.HandlingAgentParty && flight.OperatingParties && flight.OperatingParties.HandlingAgentParty != undefined &&  flight.OperatingParties.HandlingAgentParty.length > 0 )
                           flight.OperatingParties.HandlingAgentParty = compact(differenceWith( compact(flight.OperatingParties.HandlingAgentParty ), oldFlight.OperatingParties.HandlingAgentParty , isEqual));
              
              
                    
            if(flight.LocalInformation != undefined &&  flight.LocalInformation.length > 0 && oldFlight && oldFlight.LocalInformation)
                           flight.LocalInformation = compact(differenceWith( compact(flight.LocalInformation) , oldFlight.LocalInformation , isEqual));
                           
               
        return flight ;
             
             
             
            
}
    
    
public static difference(origObj:any, newObj:any) {
  function changes(newObj:any, origObj:any) {
    let arrayIndexCounter = 0
    return transform(newObj, function (result, value, key) {
      if (!isEqual(value, origObj[key])) {
        let resultKey = isArray(origObj) ? arrayIndexCounter++ : key
        result[resultKey] = (isObject(value) && isObject(origObj[key])) ? changes(value, origObj[key]) : value
      }
    })
  }
  return changes(newObj, origObj)
}


}

