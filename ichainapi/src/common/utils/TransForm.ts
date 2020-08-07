import {AcrisAirport} from "../../acris-schema/AricsAirport";
import {AcrisFlight} from "../../acris-schema/AcrisFlight";
import { differenceWith ,isArray ,isEqual,isObject,transform,compact} from 'lodash';
export class Simp{
	
typeval:"A"|"D";
	
}
var objStr:string ="";
export class ACRISTransformaer {
    
static transFom(flight: AcrisFlight): AcrisAirport {
var airportTemPlate :AcrisAirport= {

	"AircraftMovement": {
		"ArrivalOrDeparture": "A",
		"FlightOriginOrDestination": "",
	  	"AircraftMovementIdentification": {
		
			"DisplayedIdentifier": "",
			"IATAOperatorIdentifier": "",
			"IATAFlightNumber": "",
			"ICAOIdentifier": "",
			"ScheduledDateTime": ""
		},
		"AircraftMovementStatus": {
			"Cancelled": "No",
			"Cleared": "No",
			"Code": "",
			"Deleted": "No",
			"Regulated": "No",
			"StatusMessages": []
		},
		"DisplayedAircraftMovement": {
			"AircraftMovementStatus": "",
			"Display": true,
			"DisplayFromTime": "",
			"FlightNumber": "",
			"FlightOriginOrDestination": "",
			"EstimatedDateTime": "",
			"ScheduledDateTime": ""
		}
	
	
		
	},
	
	"AircraftTransport": {
		"AircraftTransportIdentifier": {
			"IATATypeCode": "",
			"ICAOTypeCode": "",
			"Registration": ""
		}
	
	},
	"AirportFacility": {
		"IATAIdentifier": ""
	
	
	},
	"OperatingParties": {
		"AirlineParty": {
			"IATAIdentifier": "",
			"ICAOIdentifier": ""
		}
		
	}
};
	
	//let airportTemPlate:AcrisAirport= new AcrisAirport();
	let simObj = new Simp()

    simObj.typeval ="A";
    if(flight.flightStatus == 'Scheduled' || flight.flightStatus == 'Boarding' || flight.flightStatus == "GateClosed" || flight.flightStatus == "Departed"){
         simObj.typeval ="D";
    }
    airportTemPlate.AircraftMovement.ArrivalOrDeparture =  simObj.typeval ;
    if( simObj.typeval  == "A")
     airportTemPlate.AircraftMovement.FlightOriginOrDestination = this.assignValue( flight.departureAirport,airportTemPlate.AircraftMovement.FlightOriginOrDestination);
     else
     airportTemPlate.AircraftMovement.FlightOriginOrDestination = this.assignValue(flight.arrivalAirport ,airportTemPlate.AircraftMovement.FlightOriginOrDestination);
     if(flight.flightNumber){
     airportTemPlate.AircraftMovement.AircraftMovementIdentification.DisplayedIdentifier = this.assignValue(flight.flightNumber.airlineCode + flight.flightNumber.trackNumber,airportTemPlate.AircraftMovement.AircraftMovementIdentification.DisplayedIdentifier);
     airportTemPlate.AircraftMovement.AircraftMovementIdentification.IATAFlightNumber =this.assignValue(flight.flightNumber.trackNumber,airportTemPlate.AircraftMovement.AircraftMovementIdentification.IATAFlightNumber);
     }
     if(flight.operatingAirline) {
      airportTemPlate.AircraftMovement.AircraftMovementIdentification.IATAOperatorIdentifier = this.assignValue(flight.operatingAirline.iataCode ,airportTemPlate.AircraftMovement.AircraftMovementIdentification.IATAOperatorIdentifier);
	  airportTemPlate.AircraftMovement.AircraftMovementIdentification.ICAOIdentifier = this.assignValue(flight.operatingAirline.icaoCode , airportTemPlate.AircraftMovement.AircraftMovementIdentification.ICAOIdentifier);
    
      airportTemPlate.AircraftTransport.AircraftTransportIdentifier.IATATypeCode  =   airportTemPlate.AircraftMovement.AircraftMovementIdentification.IATAOperatorIdentifier;
      airportTemPlate.AircraftTransport.AircraftTransportIdentifier.ICAOTypeCode  =   airportTemPlate.AircraftMovement.AircraftMovementIdentification.ICAOIdentifier;
      airportTemPlate.OperatingParties.AirlineParty.IATAIdentifier                =    airportTemPlate.AircraftMovement.AircraftMovementIdentification.IATAOperatorIdentifier;
      airportTemPlate.OperatingParties.AirlineParty.ICAOIdentifier                =    airportTemPlate.AircraftMovement.AircraftMovementIdentification.ICAOIdentifier ;
     }
	 
	 if( simObj.typeval  == "A")
	 airportTemPlate.AircraftMovement.AircraftMovementIdentification.ScheduledDateTime = this.assignValue(flight.arrival.scheduled , airportTemPlate.AircraftMovement.AircraftMovementIdentification.ScheduledDateTime);
	 else
	 airportTemPlate.AircraftMovement.AircraftMovementIdentification.ScheduledDateTime =  this.assignValue(flight.departure.scheduled ,airportTemPlate.AircraftMovement.AircraftMovementIdentification.ScheduledDateTime ) ;
	 	
     airportTemPlate.AircraftMovement.AircraftMovementStatus.Code = this.assignValue(flight.flightStatus ,airportTemPlate.AircraftMovement.AircraftMovementStatus.Code);
     
     airportTemPlate.AircraftMovement.DisplayedAircraftMovement.AircraftMovementStatus = this.assignValue( flight.flightStatus,    airportTemPlate.AircraftMovement.DisplayedAircraftMovement.AircraftMovementStatus);
     
     airportTemPlate.AircraftMovement.DisplayedAircraftMovement.FlightNumber = this.assignValue(flight.flightNumber.airlineCode + flight.flightNumber.trackNumber,airportTemPlate.AircraftMovement.DisplayedAircraftMovement.FlightNumber);
     airportTemPlate.AircraftMovement.AircraftMovementStatus.StatusMessages.push(flight.flightStatus)
	 airportTemPlate.AircraftMovement.DisplayedAircraftMovement.FlightOriginOrDestination = airportTemPlate.AircraftMovement.FlightOriginOrDestination; 
	 airportTemPlate.AircraftMovement.DisplayedAircraftMovement.EstimatedDateTime =  airportTemPlate.AircraftMovement.AircraftMovementIdentification.ScheduledDateTime;
	 airportTemPlate.AircraftMovement.DisplayedAircraftMovement.ScheduledDateTime  = airportTemPlate.AircraftMovement.AircraftMovementIdentification.ScheduledDateTime;
	 
     if( simObj.typeval  == "A")
       airportTemPlate.AirportFacility.IATAIdentifier = this.assignValue(flight.arrivalAirport ,airportTemPlate.AirportFacility.IATAIdentifier);
     else
      airportTemPlate.AirportFacility.IATAIdentifier = this.assignValue(flight.departureAirport ,airportTemPlate.AirportFacility.IATAIdentifier);
     
	
	let status:AcrisAirport={
	
	"AircraftMovement": {
		
		"AircraftMovementStatus": {
		
			"Code": flight.flightStatus
			
		},
		
		"DisplayedAircraftMovement": {
			"AircraftMovementStatus":flight.flightStatus
		}
	}
 
}
	  return airportTemPlate;
     
}

static assignValue(newvalue,exitsingValue){
    
    if(newvalue == undefined || newvalue == null || newvalue.trim().legth ==0)
     return exitsingValue;
     
     return newvalue;
}

static diff(obj1, obj2) {
    const result = {};
    if (Object.is(obj1, obj2)) {
   			return undefined;
    }
    if (!obj2 || typeof obj2 !== 'object') {
    		return obj2;
    }
    Object.keys(obj1 || {}).concat(Object.keys(obj2 || {})).forEach(key => {
        if(obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
		        result[key] = obj2[key];
        }
        if(typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
        		const value = this.diff(obj1[key], obj2[key]);
            if (value !== undefined) {
            		result[key] = value;
            }
        }
    });
    return result;
}




static replaceNewValue(obj):string{
 objStr = JSON.stringify(obj);
 this.jsonPrinter(obj);
 return objStr;
   
}


static jsonPrinter(obj) {
	

    for (let key in obj) {
    	
       
        if (obj.hasOwnProperty(key) && (typeof obj[key] === "object")) {
			
            this.jsonPrinter(obj[key]);
            
			
        } else {
            
			
			if(key == "__new" ){
			
			    var keyval = obj[key];
	            if(typeof keyval == "string")
	            objStr = objStr.replace('{"__new":"'+ obj[key].trim()+'"}','"'+obj[key].trim()+'"');
	            else
				objStr = objStr.replace('{"__new":"'+ obj[key] +'"}','"'+obj[key] +'"');

			}

            console.log(key + " -> " + obj[key]);
			
        }
    }
}


static getFlightStatusMessagessage(flightStatus){
	
	
	if(flightStatus  == "SH") return "Shdeuled";
    if(flightStatus ==  'BD' )   return "Boarding";
    if(flightStatus ==  'GC' ) return "GateClosed";
    if(flightStatus ==  'AB' )   return "Departed";
    
    if(flightStatus == 'InApproach' )       return "InApproach";
    if(flightStatus == 'LD' )          return "Landed"
    if(flightStatus == 'LB' )  return  "BagClaimStarted";
    if(flightStatus == '**' )  return  "FlightFinished";
    if(flightStatus == "FS")    return  "Aircraft on final approach";
    
    if(flightStatus == 'CX' )       return "Canceled";
    if(flightStatus == 'DV' )       return "Diverted";
    
     if(flightStatus == 'GC' )      return "GateClosed";
     if(flightStatus == 'LC' )     return "Last call to gate";
     if(flightStatus == 'OS' )  return "Overshoot";
     if(flightStatus == 'ZN' ) return "Aircraft entered the radar zone";
     if(flightStatus == 'OC' ) return "Landed and on-chocks";
     if(flightStatus == 'BD' ) return "Boarding started";
     if( flightStatus ==="GO")  return "GateOpened" ;
     if(flightStatus== 'CK' )       return "Check in started"
}

static cleanObject(object) {
    Object
        .entries(object)
        .forEach(([k, v]) => {
            if (v && typeof v === 'object')
                cleanObject(v);
            if (v && 
                typeof v === 'object' && 
                !Object.keys(v).length || 
                v === null || 
                v === undefined ||
                
                v.length === 0
            ) {
                if (Array.isArray(object))
                    object.splice(k, 1);
                else if (!(v instanceof Date))
                    delete object[k];
            }
        });
    return object;
}

static difference(origObj, newObj) {
  function changes(newObj, origObj) {
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

