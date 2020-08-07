import { AcrisAirport }  from  "./AricsAirport"
export interface IFlightChainData {
    flightData: AcrisAirport;
    flightKey: string;
    updaterId: string;
    txId: string;
    docType: string;
    acrisType:string;
}
