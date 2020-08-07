export class InformationHandlingRequirements {
	
    Version?: string;
    DataOwner?: string;
    Joint?: string;
    Classification?: string;
    HandlingControls?: string;
	
}

export class CodeShareIdentifier {
    CodeShareFlightNumber: string;
    InformationHandlingRequirements?:InformationHandlingRequirements;
}

export class AircraftMovementIdentification {
AirTrafficControlCallsign: string;
CodeShareIdentifier:       CodeShareIdentifier[];
DisplayedIdentifier:       string;
IATAOperatorIdentifier:    string;
IATAFlightNumber:          string;
ICAOIdentifier:            string;
ScheduledDateTime:         string;
SystemIdentifier:          string;
InformationHandlingRequirements?: InformationHandlingRequirements;
ICAONumber?:               string;
Number?: string;
Suffix? : string ;
TurnRoundIdentifier? : string ;
}

export class AircraftMovementStatus {
	
	Cancelled: 'Yes' | 'No';
    Cleared: string;
    Code: string;
    Deleted: 'Yes' | 'No';
    Regulated: 'Yes' | 'No';
    StatusMessages?: any[];
    OperationalStatus? : string;
    PublicStatus? : string;
	InformationHandlingRequirements?: InformationHandlingRequirements
	DeicingStatus?: 'REQUESTED' | 'SCHEDULED' | 'IN PROGRESS'| 'COMPLETED' ;

}

export class LinkedAircraftMovement {
    ArrivalOrDeparture: 'A' | 'D' ;
    IATAOperatorIdentifier: string;
    IATAFlightNumber: string;
    ICAOIdentifier: string;
    AircraftOnGround: boolean;
    ScheduledDateTime: string;
    SystemIdentifier: string;
    InformationHandlingRequirements?: InformationHandlingRequirements;
	ICAONumber?: string;
	Suffix?: string;
}


export class DisplayedAircraftMovement {
    AircraftMovementStatus: string;
    CheckinZone?: string;
    Comments?: any[];
    Display: boolean;
    DisplayFromTime: string;
    Gate: string;
    FlightNumber: string;
    FlightOriginOrDestination: string;
    EstimatedDateTime: string;
    ScheduledDateTime: string;
	InformationHandlingRequirements?: InformationHandlingRequirements;
	AutomaticProcessing?: string;
    BaggageReclaim?: string;
    CarrierCode?: string;
    DisplayUntilTime? : string;
	Terminal?: string
	OperatedDateTime? : string;
}

export class LocallyDefinedTime {

    Name:  string;
    Type:  string;
    Value: string;
    InformationHandlingRequirements?: InformationHandlingRequirements;
}


export class OperationalTimes {

    ActualCommenceofGroundHandlingTimeACGT: string;
    EstimatedOffBlockTimeEOBT: string;
    EstimatedTakeOffTimeETOT: string;
    EstimatedTaxiOutDurationEXOT: string;
    PlannedLastCallTime: string;
    ScheduledOffBlockTimeSOBT: string;
    TargetOffBlockTimeTOBT: string;
    LocallyDefinedTimes ?: LocallyDefinedTime[];
    InformationHandlingRequirements?: InformationHandlingRequirements;
    ActualCommencementofDeicingTimeACZT?: string;
    ActualDeIcingDurationADIT?: string;
    ActualEndBoardingTimeAEBT?: string;
    ActualEndofDeicingTimeAEZT?: string;
    ActualEndofGroundHandlingTimeAEGT?: string;
    ActualFinalApproachTimeAFAT?: string
    ActualGroundHandlingDurationAGHT?: string;
    ActualInBlockTimeAIBT?: string;
    ActualLandingTimeALDT?: string;
    ActualLastCallTime?: string;
    ActualOffBlockTimeAOBT?: string;
    ActualReadyforDeicingTimeARZT?: string;
    ActualReadyforDepartureTimeARDT?: string;
    ActualStartBoardingTimeASBT?: string;
    ActualStartUpApprovalTimeASAT?: string;
    ActualStartUpRequestTimeASRT?: string;
    ActualTakeOffTimeATOT?: string;
    ActualTaxiInDurationAXIT?: string;
    ActualTaxiOutDurationAXOT?: string;
    ActualTurnaroundTimeATTT?: string;
    CalculatedTakeOffTimeCTOT?: string;
    EntryintoApproachZoneTime?: string;
    EstimatedCommencementofDeIcingTimeECZT?: string;
    EstimatedDeIcingDurationEDIT?: string;
    EstimatedEndBoardingTimeEEBT?: string;
    EstimatedEndofDeicingTimeEEZT?: string;
    EstimatedInBlockTimeEIBT?: string;
    EstimatedLandingTimeELDT?: string;
    EstimatedLastCallTime?: string;
    EstimatedReadyforDeicingTimeERZT?: string;
    EstimatedStartBoardingTime?: string;
    EstimatedTaxiInDurationEXIT?: string;
    EstimatedTurnAroundDurationETTT?: string;
    MinimumTurnAroundTimeMTTT?: string;
    PlannedStartBoardingTime?: string;
    ScheduledInBlockTimeSIBT?: string;
    ScheduledTurnAroundDurationSTTT?: string;
    TargetLandingTimeTLDT?: string;
    TargetStartUpApprovalTimeTSAT?: string;
    TargetTakeOffTimeTTOT?: string;

	
	
}

export class DiversionInformation {

    DivertIndicator: string;
    InformationHandlingRequirements?: InformationHandlingRequirements;
    DivertAirport?: string;
    DivertAirportFacilityCode?: string;
    DivertReason?: string;
    DivertReasonCode?: string;
}

export class BillingInformation {
	AircraftFEGPEquipped: boolean;
    AircraftPCAEquipped: boolean;
    InformationHandlingRequirements?: InformationHandlingRequirements;
    RebatePassengerNumbers?: string;
    RebatePassengerReasonCode?: string;
}

export class IATAIrregularitiesDelay {	

InformationHandlingRequirements?: InformationHandlingRequirements;      
Duration?: string;
NumericCode?: string;

}
	
export class DisplayedConnectionAircraftMovement {
	
    InformationHandlingRequirements?: InformationHandlingRequirements;  
    CheckinZone?: string;
    ConnectingFlightDestination?: string;
    ConnectingFlightNumber?: string;
    Gate?: string;
    Order?: string;
    Terminal?: string;
    NoOfTransferringBags?: number;
    NoOfTransferringPassengers?: string;
    EstimatedDateTime?: string;
    OperatedDateTime?: string;
    ScheduledDateTime?: string;
}
	
export class AircraftMovement { 
    InformationHandlingRequirements?: InformationHandlingRequirements;                   
    ArrivalOrDeparture: 'A' | 'D' ;
	ArrivalSecurityCheck?: string;
    DepartureSecurityCheck?: string;
    DeicingMode?: string;
    DeicingStandLocation?: string;
    DeicingPadLocation?: string;
    DeicingRigEquipment?: string;
    Description?: string;
	FlightOriginOrDestination: string;
	FlightClassification: string;
	SpecialNeedsIndicator?: any[];
	AircraftMovementIdentification: AircraftMovementIdentification;
	AircraftMovementStatus: AircraftMovementStatus;
	LinkedAircraftMovement: LinkedAircraftMovement;
	DisplayedAircraftMovement: DisplayedAircraftMovement;
	Connections?: DisplayedConnectionAircraftMovement[];
	OperationalTimes: OperationalTimes;
	IATAIrregularitiesDelays?: IATAIrregularitiesDelay[];
	DiversionInformation: DiversionInformation;
	BillingInformation: BillingInformation;
    FromStand?: string;
    Priority? : string;
    RepeatNumber?: string;
    TechnicalStop?: string;
  
}
export class PortOfCallLoading {
    InformationHandlingRequirements?: InformationHandlingRequirements;
    NumberOfBags?: string;
    NumberOfCrew?: string;
    NumberOfCargo?: string;
    NumberOfPassengers?: string;
    WeightOfBags?: string;
    WeightOfCargo?: string;
    WeightOfMail?: string;
}
export class PortOfCall {
    IATALocationCode: string;
    ICAOLocationCode: string;
    Name: string;
    RouteLeg: number;
    InformationHandlingRequirements?: InformationHandlingRequirements;
    PortOfCallLoading? : PortOfCallLoading;
}
export class Route {
    RouteInternationalDomestic: string;
    FlightPlanID: string;
    StandardInstrumentDeparture: string;
    PortOfCall?: PortOfCall[];
    InformationHandlingRequirements?: InformationHandlingRequirements;
}

export class AircraftTransportIdentifier {
	
    IATATypeCode: string;
    ICAOTypeCode: string;
    Registration: string;
    InformationHandlingRequirements?: InformationHandlingRequirements;
    AircraftBodyType?: string;
    AircraftVersion?: string;
    CodeRequired?: string;
    FleetNumber?: string;
    GeneralTypeCode?: string;
    GroupCode?: string;
    IATASubtypeCode?: string;
	
	
}
export class AircraftTransportCabin {
	
    NumberOfSeats: number;
	InformationHandlingRequirements?: InformationHandlingRequirements;
    Cabin?: string;
    CabinClassType?: string;
    CabinType?: string;
    Compartment?: string;
    SeatCapacity?: number;
    Status?: string;

	
}

export class PassengerType {
    PassengerTypeCount: number;
    PassengerType: string;
    InformationHandlingRequirements? : string;
}

 export class PassengerPartyCarried {
 
    TotalPassengerCount: number;
    PassengerTypes?: PassengerType[];
    InformationHandlingRequirements? : string;
}
export class BagType {
	
	BagTypeCount?: number;
	BagTypeWeight?: number;
	BagType?: number;
	
}
export class BagItemCarried {
	
    TotalCount: number;
    TotalWeight: number;
    BagTypes?: BagType[];
	InformationHandlingRequirements? : string;

}

export class CargoTypes {
	
	InformationHandlingRequirements?: InformationHandlingRequirements;
	CargoTypeCount?: number;
	CargoTypeWeight?: number;
	CargoType?: string;
}

export class CargoItemCarried {
    TotalWeight: number;
    CargoTypes?: CargoTypes[];
	InformationHandlingRequirements?: InformationHandlingRequirements;
    SpecialCargo?: string;
    TotalCount?: string;

}

export class MailItemCarried {
    TotalWeight: number;
    InformationHandlingRequirements?: InformationHandlingRequirements;
}

export class CrewType{
    InformationHandlingRequirements?: InformationHandlingRequirements;
    CrewTypeCount?: number;
    CrewType?: string;	
}

export class CrewPartyCarried {
	
    InformationHandlingRequirements?: InformationHandlingRequirements;
    CrewCount?: number;
    CrewTypes?: string;
}	

 export class AircraftTransportLoad {
	 
	BallastWeight?:number;
    DeadLoad: number ;
    PassengerPartyCarried: PassengerPartyCarried ;
    BagItemCarried: BagItemCarried ;
    CargoItemCarried: CargoItemCarried ;
    MailItemCarried: MailItemCarried ;
    InformationHandlingRequirements?: InformationHandlingRequirements;
    CrewPartyCarried?: CrewPartyCarried; 

}

export class AircraftTransport {
	
	AircraftDescription?: string;
	EarliestDeliveryDateTime?: string;
    FutureMaximumTakeOffWeight?: string;
    GuidanceRequired?: string;
    LatestDeliveryDateTime?: string;
    Mode?: string;
    NoiseCertificationIndicator?: string;
    StandChangeIndicator?: string;
    VehicleRequired?: boolean;
    AircraftTransportIdentifier: AircraftTransportIdentifier ;
    AircraftTransportCabin?: AircraftTransportCabin[];
    AircraftTransportLoad: AircraftTransportLoad ;
    InformationHandlingRequirements?: InformationHandlingRequirements;
	 
}

export class CheckinZoneFacility {
	
	InformationHandlingRequirements?: InformationHandlingRequirements;
    CheckinStartTime: string ;
    CheckinZoneIdentifier: string ;
    CheckinEndTime?: string;
    CheckinStatus?: string;
    CheckinZoneDescription?: string;
	
}

export class BagItemDelivery {
	
    InformationHandlingRequirements?: InformationHandlingRequirements;
    ActualFirstBagTime?: string;
    ActualLastBagTime?: string;
    CarouselNumber?: string;
    ConveyorNumber?: string;
    LegacyFIDSCheckinZone?: string;
    SecondaryCarouselNumber?: string;
    BaggageReclaimStatus?: string;

}


export interface GateFacility {
	
	InformationHandlingRequirements?: InformationHandlingRequirements;
    ActualGateOpenTime: string;
    PlannedGateOpenTime: string;
    GateNumber: string;
    GateType: string;
    GatingDueDateTime: string;
    LocalBoardingStatusAtGate: string;
    PierCode?: string;
    AirJettyHireCode?: string;
    AirJettyType?: string;
    ExpectedGateOpenTime?: string;
    ActualGateCloseTime?: string;
    GatingAction?: string;
    GeneralRemarks?: string;
    GoToPassportControl?: string;
    PreviousGate?: string;
    RemoteOperationGate?: string;
    SecondaryGateNumber?: string;
    StaffReadyForGateControl?: string;
    
}

export class TerminalFacility {
	
	InformationHandlingRequirements?: InformationHandlingRequirements;
    Code: string;
	Description?:string;
    CheckinZoneFacility: CheckinZoneFacility;
    BagItemDelivery?: BagItemDelivery;
    GateFacility?: GateFacility;

}

export class RunwayFacility {
	
	InformationHandlingRequirements?: InformationHandlingRequirements;
    RunwayIdentifier: string;
}

export class StandFacility {
	InformationHandlingRequirements?: InformationHandlingRequirements;
    ArrivalStand: string ;
    CoachingIsRequired: boolean ;
    ProvisionalStandNumber: string ;
    StandHoldRequired: boolean ;
    StandNumber?: string ;
    StandType?: string ;
    StandHoldConflictingStand?: string;
	StandLocation?: string;
}

export class AirportFacility {
	
	InformationHandlingRequirements?: InformationHandlingRequirements;
    IATAIdentifier: string ;
    TerminalFacility?: TerminalFacility[];
    RunwayFacility: RunwayFacility ;
    StandFacility?: StandFacility ;
}

export class AirlineParty {
	
    IATAIdentifier: string ;
    ICAOIdentifier: string ;
    Remark?: any[];
	AllianceCode?: string;
}

export class HandlingAgentParty {
    Code: string ;
    Remark?: any[];
	InformationHandlingRequirements?: InformationHandlingRequirements;
    CateringLoaderNumber?: string;
	HandlingCrewNumber?: string;
    PassengerHandlingTeamIdentifier?: string;
    Name?: string;
    Type?: string;
}

export class OperatingParties {
    AirlineParty: AirlineParty ;
    HandlingAgentParty?: HandlingAgentParty[];
}

export class LocalInformation{	
	
    InformationHandlingRequirements?: InformationHandlingRequirements;
    LocalIdentifier?: string;
    LocalDescription?: string
    LocalValue?: string;
	
}

 export class AcrisAirport {
	InformationHandlingRequirements?: InformationHandlingRequirements;
    MessageLastUpdateTime: string;
    MessageGenerationTime: string;
    SequenceID: number;
    SchemaVersion?: string;
    MessageID?: string;
    MessageOperation: string;
    AircraftMovement: AircraftMovement;
    Route: Route;
    AircraftTransport: AircraftTransport;
    AirportFacility: AirportFacility;
    OperatingParties: OperatingParties;
    LocalInformation?: any[];
	
}

 


	



	

 

 

	
	
	
  
		

	
	
	
	