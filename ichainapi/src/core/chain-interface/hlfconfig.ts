import { Injectable } from '@nestjs/common';
import {Channel, ChannelEventHub, Peer} from 'fabric-client';
import Client = require('fabric-client');
import { HlfConfigOptions } from '../../common/config/config.model';

@Injectable()
export class HlfConfig {
    public options: HlfConfigOptions;
    public client: Client;
    public channel: Channel;
    public targets: Peer[] = [];
    public eventHub: ChannelEventHub;
}
