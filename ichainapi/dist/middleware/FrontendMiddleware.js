"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const path = require("path");
const main_1 = require("../main");
exports.FLIGHTCHAIN_ROUTE_PREFIX = 'iChain';
exports.HEALTH_ROUTE_PREFIX = 'health';
exports.AUTH_ROUTE_PREFIX = 'auth';
exports.USER_ROUTE_PREFIX = 'user';
const allowedExt = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.woff2',
    '.woff',
    '.ttf',
    '.svg',
];
const resolvePath = (file) => path.resolve(`./dist/flight-chain-ui/${file}`);
let FrontendMiddleware = class FrontendMiddleware {
    resolve(...args) {
        return (req, res, next) => {
            const url = req.baseUrl;
            if (url.indexOf(exports.FLIGHTCHAIN_ROUTE_PREFIX) === 1) {
                next();
            }
            else if (url.indexOf(exports.HEALTH_ROUTE_PREFIX) === 1) {
                next();
            }
            else if (url.indexOf(exports.USER_ROUTE_PREFIX) === 1) {
                next();
            }
            else if (url.indexOf(exports.AUTH_ROUTE_PREFIX) === 1) {
                next();
            }
            else if (url.indexOf(main_1.DOCS_URL) === 1) {
                next();
            }
            else if (allowedExt.filter((ext) => url.indexOf(ext) > 0).length > 0) {
                res.sendFile(resolvePath(url));
            }
            else {
                res.sendFile(resolvePath('index.html'));
            }
        };
    }
};
FrontendMiddleware = __decorate([
    common_1.Injectable()
], FrontendMiddleware);
exports.FrontendMiddleware = FrontendMiddleware;
//# sourceMappingURL=FrontendMiddleware.js.map