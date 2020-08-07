import { Module } from '@nestjs/common';
import { RequestHelper } from './requesthelper';
import { HlfClient } from './hlfclient';
import { HlfConfig } from './hlfconfig';
// import { QueueModule } from '../queue/queue.module';
// import { EventsModule } from '../events/events.module';

@Module({
    providers: [
        RequestHelper,
        HlfConfig,
        HlfClient
    ],
    exports: [
        RequestHelper,
        HlfConfig,
        HlfClient
    ],
    imports: [
        // QueueModule,
        // EventsModule
    ]
})
export class ChainModule {
}
