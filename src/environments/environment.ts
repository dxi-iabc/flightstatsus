// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    // flightChainAPI: 'http://localhost:3002/flightChain/'
    
    authURL: 'http://35.154.248.35:3001/auth/',
    flightChainAPI: 'http://35.154.248.35:3001/iChain/',
    webSocketUrl: 'http://35.154.248.35:4444',
    couchDbUrl:'http://admin:admin@35.154.248.35:5990',
    couchWithoutAuthDbUrl:'http://admin:admin@35.154.248.35:5990',
    userName: 'saa',
    userPass: 'saaPassw0rd!'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
