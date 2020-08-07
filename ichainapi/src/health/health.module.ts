import {Module} from '@nestjs/common';
import {HealthController} from "./health.controller";
import {FlightChain2Module} from "../flight-chain2/flight-chain.module";

@Module({
    controllers: [HealthController],
    providers: [],
    imports: [FlightChain2Module]
})
export class HealthModule {
}
