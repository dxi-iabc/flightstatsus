
'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs   = require('fs');
const path = require('path');
const yaml = require('js-yaml')
const app  = require('express')();
const http = require('http').Server(app);
const io   = require('socket.io')(http);

// capture network variables from config.json
const configPath = path.join(process.cwd(), '/config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
var connection_file = config.connection_file;
var userName = config.userName;
var gatewayDiscovery = config.gatewayDiscovery;

// connect to the connection file
const filePath = path.join(process.cwd(), '/connection2.yaml');
let fileContents = fs.readFileSync(filePath, 'utf8');
let connectionFile = yaml.safeLoad(fileContents);


const couchdbutil = require('./couchdbutil.js');
const blockProcessing = require('./blockprocessing.js');



const use_couchdb = true;
const couchdb_address = "http://couchdb0:5984";

const configBlockPath = path.resolve(__dirname, 'nextblock.txt');

const nano = require('nano')(couchdb_address);
nano.config.url = 'http://admin:admin@offchain_db:5984';

const options = {
    startBlock: 1
};
var Rx = require('rxjs');
let subject = new Rx.Subject();
io.on('connection', function(socket) {
    console.log("-------------inside-------------")
    subject.subscribe(function(args) {
   console.log("=================inside========", args)
   io.emit('documents', args);
  });
    
    
});

class BlockMap {
    
    constructor() {
        this.list = []
    }
    get(key) {
        key = parseInt(key, 10).toString();
        return this.list[`block${key}`];
    }
    set(key, value) {
        console.log("inside set---", key ,"---", value)
        this.list[`block${key}`] = value;
    }
    remove(key) {
        key = parseInt(key, 10).toString();
        delete this.list[`block${key}`];
    }
}

let ProcessingMap = new BlockMap();
async function getBlockNumber() {
    try {
        console.log('starting to listneing')

        var response = {};

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (!userExists) {
            console.log('An identity for the user ' + userName + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
            return response;            
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();

        await gateway.connect(connectionFile, { wallet, identity: userName, discovery: gatewayDiscovery });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('channelflight');

        // Get the contract from the network.
         
        // Evaluate the specified transaction.
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        
        var client = gateway.getClient();
        
        var channel = client.getChannel("channelflight");
		if(!channel) {
		
			throw new Error("Chhenl not found!");
		}
console.log("Before")

let nextBlock = 1;

        // check to see if there is a next block already defined
        if (fs.existsSync(configBlockPath)) {
            // read file containing the next block to read
            nextBlock = fs.readFileSync(configBlockPath, 'utf8');
        } else {
            // store the next block as 0
            fs.writeFileSync(configBlockPath, parseInt(nextBlock, 10))
        }


const listener = async function(event)  {
    // Handle block event

    // Listener may remove itself if desired
console.log("eevent",event);
   
}
const options = {
    startBlock: 1
};
let called = false;
await network.addBlockListener("my-block-listener3",  async function(error, block) {
        if (error) {
          console.error(error);
          return;
        }
        console.log("Successfully received the block ", block.header.number);
         await ProcessingMap.set(block.header.number, block);
        
 console.log("After  received the block ");
subject.next(block.data.data[0].payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[0].rwset.reads[0].key)
       
        console.log(JSON.stringify(block.data.data[0].payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[0].rwset.reads[0]),"After processing block ", block.header.number);
      }
 , options);
 

	 


    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        response.error = error.message;
        return response;
    }
     processPendingBlocks(ProcessingMap);
}
async function processPendingBlocks(ProcessingMap) {

    setTimeout(async () => {
           
        
           


        // get the next block number from nextblock.txt
        let nextBlockNumber = fs.readFileSync(configBlockPath, 'utf8');
        let processBlock;

        do {
            
            console.log("------------------11-------------------------",nextBlockNumber);

            // get the next block to process from the ProcessingMap
            processBlock = ProcessingMap.get(nextBlockNumber)
            console.log(nextBlockNumber,"process block",processBlock)
            
            console.log("------------------2--------------------------",processBlock);

            if (processBlock == undefined) {
                break;
            }
console.log("-------------------3----------------")
            try {
                   console.log("-------------inside ------ processPendingBlocks")
                await blockProcessing.processBlockEvent("channelflight", processBlock, use_couchdb, nano)
          
                  console.log("-------------After ------ processPendingBlocks")
            } catch (error) {
                console.error(`Failed to process block: ${error}`);
            }

            // if successful, remove the block from the ProcessingMap
            ProcessingMap.remove(nextBlockNumber);

            // increment the next block number to the next block
            fs.writeFileSync(configBlockPath, parseInt(nextBlockNumber, 10) + 1)

            // retrive the next block number to process
            nextBlockNumber = fs.readFileSync(configBlockPath, 'utf8');

        } while (true);

        processPendingBlocks(ProcessingMap);

    }, 250);

}

http.listen(4444, () => {
    getBlockNumber();
    console.log('Listening on port 4444');
});