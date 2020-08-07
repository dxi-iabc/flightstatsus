import * as http from "http";


/**
 * This will periodically post data to the Telegraf server
 */
const telegrafPort = 8186;

console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-')
console.log('-');
console.log('-');
console.log(`- Starting reporting of metrics to telegraf on port ${telegrafPort}`);
console.log('-');
console.log('-');
const appmetrics = require('appmetrics');
const monitoring = appmetrics.monitor();
appmetrics.start();
console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-')

monitoring.on('initialized', function (env) {
    console.log('monitoring.on(initialized)')
    env = monitoring.getEnvironment();
    for (var entry in env) {
        console.log(entry + ':' + env[entry]);
    };
});

monitoring.on('cpu', (cpu) => {
    //console.log('[' + new Date(cpu.time) + '] CPU Process Percentage: ' + cpu.process + 'CPU System Percentage: ' + cpu.system);
    const postData = `cpuProcess=${cpu.process},cpuSystem=${cpu.system},cpuTime=${cpu.time}`;

    const options = {
        port: telegrafPort,
        path: '/write?precision=ms',
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    };

    const req = http.request(options, (res) => {
        // console.log(`STATUS: ${res.statusCode}`);
        // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            // console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            // console.log('No more data in response.');
        });
    });

    req.on('error', (e) => {
        console.error(`Telegraf reporting problem with request: ${e.message}`);
    });

    req.write(postData);
    req.end();
});
