/**
 * This is the data model stored on the blockchain.
 * Each ACRIS flight entry/update is stored with the transaction Id and
 * updater Id so it can conveniently be accessed by the client apps.
 */
import {AcrisAirport} from "../acris-schema/AricsAirport";
import {ApiModelProperty} from "@nestjs/swagger";


export class FlightChainData {
    @ApiModelProperty({required: true})
    flightData: AcrisAirport;
    @ApiModelProperty({required: true, description: 'Unique identifier for the flight, made up of the departure date, depature airport, operating airline and flight number (e.g. 2018-09-13LHRBA0227)'})
    flightKey: string;

    // Which IATA entity updated the data.
    @ApiModelProperty({required: true, description: 'IATA code for organisation that updated the data.'})
    updaterId: string;
    @ApiModelProperty({required: true, description: 'Blockchain transaction identifier'})
    txId: string;
    // TODO: Check if this docType needs to be set for couchDB. It is in the fabric-samples
    docType: string;
    // The timestamp is only used
    @ApiModelProperty({required: true, description: 'Timestamp of when update was made. This is only populated when getting flight history.'})
    timestamp: Date;
}


export interface IFabricTimestamp {
    /**
     * Contains the unix timestamp
     */
    low: number;
    high: number;
    unsigned: boolean;
}

/**
 * Represents the object returned from the API to get the flight history.
 */
export class IFlightChainHistory {
    /**
     * The ACRIS flight data
     */
    value: FlightChainData;
    is_delete: boolean;
    tx_id: string;
    timestamp: IFabricTimestamp;

}
