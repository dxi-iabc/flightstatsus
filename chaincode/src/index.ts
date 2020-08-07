import shim = require('fabric-shim');
import { iChain } from './iChain';
shim.start(new iChain());
