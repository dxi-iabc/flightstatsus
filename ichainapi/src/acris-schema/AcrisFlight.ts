/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

import {ApiModelProperty} from "@nestjs/swagger";


export class Via {
    /**
     * The via airport as IATA format
     */
    viaAirport: string;
    departure: FlightDepartureInformation;
    arrival: FlightArrivalInformation;
}

/**
 * The flight's operating flightNumber
 */
export class FlightNumber {
    /**
     * The airlineCode-part of the flight-number (e.g. EI)
     */
    @ApiModelProperty({required: true})
    airlineCode: string;
    /**
     * The tracknumber-part of the flight-number (e.g. 123)
     */
    @ApiModelProperty({required: true})
    trackNumber: string;
    /**
     * The optional last character of the flight-number.
     */
    @ApiModelProperty({required: false})
    suffix: string;
}

export class AircraftType {
    /**
     * The aircraft's ICAO-Code
     */
    icaoCode: string;
    /**
     * The model name of the aircraft
     */
    modelName: string;
    /**
     * The registration of the aircraft
     */
    registration: string;
}

export class OperatingAirline {
    /**
     * The airline's IATA-Code
     */
    @ApiModelProperty({required: false})
    iataCode: string;
    /**
     * The airline's ICAO-Code
     */
    @ApiModelProperty({required: false})
    icaoCode: string;
    /**
     * The long name of airline
     */
    @ApiModelProperty({required: false})
    name: string;
}


/**
 * The departure infomation for the flight
 */
export class FlightDepartureInformation {
    /**
     * Scheduled time of arrival including time zone. Format ISO-8601 is used.
     */
    @ApiModelProperty({required: true, description: 'Scheduled time of departure including time zone. Format ISO-8601 is used.'})
    scheduled: string;
    /**
     * Estimated time of arrival including time zone. Format ISO-8601 is used. Every airport should provide the best information he has, corresponding to the FIDS.
     */
    @ApiModelProperty({required: false, description: 'Estimated time of departure including time zone. Format ISO-8601 is used.'})
    estimated: string;
    /**
     * Actual time of arrival including time zone. Format ISO-8601 is used. Every airport should provide the best information he has, corresponding to the FIDS.
     */
    @ApiModelProperty({required: false, description: 'Actual time of departure including time zone. Format ISO-8601 is used.'})
    actual: string;
    /**
     *
     */
    @ApiModelProperty({required: false, description: 'The terminal for the flight.'})
    terminal: string;
    /**
     *
     */
    @ApiModelProperty({required: false, description: 'The departure gate for the flight.'})
    gate: string;
    /**
     * The check-in information for the passenger
     */
    checkinInfo: {
        /**
         * The area of check-in facilities for the flight
         */
        checkinLocation: string;
        /**
         * The time when check-in procedure starts for the flight
         */
        checkInBeginTime: string;
        /**
         * The time when check-in procedure ends for the flight
         */
        checkInEndTime: string;
        /**
         * Additional information about the check-in process
         */
        additionalInfo: string;
    };
    /**
     * A list of airports and the corresponding arrival and departure information for stops during the flight. The order in the array represents the flight order.
     */
    boardingTime: {
        /**
         * A name (intl) of the booking class - if there are different boarding times for different classes
         */
        bookingClass: string;
        /**
         * Boarding time of departure including time zone. Format ISO-8601 is used. Every airport should provide the best information he has, corresponding to the FIDS.
         */
        time: string;
    }[];

}

export class BaggageClaim {
    /**
     * The carousel for baggage claim
     */
    @ApiModelProperty({required: false, description: 'The carousel for baggage claim.'})
    carousel: string;
    /**
     * expected time when the baggage claim begins
     */
    @ApiModelProperty({required: false, description: 'Expected time when the baggage claim begins.'})
    expectedTimeOnCarousel: string;
};
/**
 * The arrival information for the flight
 */
export class FlightArrivalInformation {
    /**
     * Scheduled time of arrival including time zone. Format ISO-8601 is used.
     */
    @ApiModelProperty({required: true, description: 'Scheduled time of arrival including time zone. Format ISO-8601 is used.'})
    scheduled: string;
    /**
     * Estimated time of arrival including time zone. Format ISO-8601 is used. Every airport should provide the best information he has, corresponding to the FIDS.
     */
    @ApiModelProperty({required: false, description: 'Estimated time of arrival including time zone. Format ISO-8601 is used.'})
    estimated: string;
    /**
     * Actual time of arrival including time zone. Format ISO-8601 is used. Every airport should provide the best information he has, corresponding to the FIDS.
     */
    @ApiModelProperty({required: false, description: 'Actual time of arrival including time zone. Format ISO-8601 is used.'})
    actual: string;
    /**
     *
     */
    @ApiModelProperty({required: false, description: 'The terminal for the flight.'})
    terminal: string;
    /**
     *
     */
    @ApiModelProperty({required: false, description: 'The arrival gate for the flight.'})
    gate: string;
    /**
     * Provide information for your passengers where the nearest transfer desks for this flight can be found.
     */
    transferInformation: string;

    @ApiModelProperty({required: false, description: 'Information about where & when to get baggage.'})
    baggageClaim: BaggageClaim

}

/**
 * The flight in stp app services
 */
export class AcrisFlight {
    /**
     * The airline operating the flight. Either IATA or ICAO must be present
     */
    @ApiModelProperty({required: true})
    public operatingAirline: OperatingAirline;

    /**
     * The aircraft-type information
     */
    @ApiModelProperty({required: false})
    public aircraftType: AircraftType;

    @ApiModelProperty({required: true})
    public flightNumber: FlightNumber;
    /**
     * The code-shares associated with the flight
     */
    codeShares: FlightNumber[];
    /**
     * The departure airport as IATA format
     */
    @ApiModelProperty({required: true, description: 'Three letter IATA code for the airport'})
    public departureAirport: string;
    /**
     * The arrival airport as IATA format
     */
    @ApiModelProperty({required: true, description: 'Three letter IATA code for the airport'})
    public arrivalAirport: string;
    /**
     * Date expressed in UTC. Time element is not used. This date MUST not change once initialized. For a flight SFO-DEN-LHR both flight legs SFO-DEN and DEN-LHR will have the origin date of the SFO departing date (example 2015-10-15).
     */
    @ApiModelProperty({required: true, description: 'Date expressed in local date. Time element is not used. This date MUST not change once initialized. For a flight SFO-DEN-LHR both flight legs SFO-DEN and DEN-LHR will have the origin date of the SFO departing date (example 2015-10-15).'})
    originDate: string;

    @ApiModelProperty({required: true, description: 'Departure information'})
    departure: FlightDepartureInformation;

    @ApiModelProperty({required: true, description: 'Arrival information'})
    arrival: FlightArrivalInformation;
    /**
     * The status of the flight
     */
    @ApiModelProperty({required: false, description: 'Status of the flight. One of Cancelled|Diverted|Scheduled|Boarding|GateClosed|Departed|InApproach|Landed|BagClaimStarted|FlightFinished'})
    flightStatus:
        | "Canceled"
        | "Diverted"
        | "Scheduled"
        | "Boarding"
        | "GateClosed"
        | "Departed"
        | "InApproach"
        | "Landed"
        | "BagClaimStarted"
        | "FlightFinished";
    /**
     * A list of airports and the corresponding arrival and departure information for stops during the flight. The order in the array represents the flight order.
     */
    via: Via[];

}