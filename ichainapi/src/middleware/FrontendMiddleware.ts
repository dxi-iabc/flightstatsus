import {Injectable, MiddlewareFunction, NestMiddleware} from '@nestjs/common';
import {Request} from 'express';
import * as path from 'path';
import {DOCS_URL} from '../main';

export const FLIGHTCHAIN_ROUTE_PREFIX = 'iChain';
export const HEALTH_ROUTE_PREFIX = 'health';
export const AUTH_ROUTE_PREFIX = 'auth';
export const USER_ROUTE_PREFIX = 'user';

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

const resolvePath = (file: string) => path.resolve(`./dist/flight-chain-ui/${file}`);

@Injectable()
export class FrontendMiddleware implements NestMiddleware {
    public resolve(...args: any[]): MiddlewareFunction {
        return (req: Request, res, next) => {
            const  url  = req.baseUrl;
            if (url.indexOf(FLIGHTCHAIN_ROUTE_PREFIX) === 1) {
                // it starts with /api --> continue with execution
                next();
            } else if (url.indexOf(HEALTH_ROUTE_PREFIX) === 1) {
                // it starts with /api --> continue with execution
                next();
            }   else if (url.indexOf(USER_ROUTE_PREFIX) === 1) {
                // it starts with /user --> continue with execution
                next();
            } else if (url.indexOf(AUTH_ROUTE_PREFIX) === 1) {
                    // it starts with /auth --> continue with execution
                    next();
            } else if (url.indexOf(DOCS_URL) === 1) {
                    // it starts with /docs --> continue with execution
                    next();
            } else if (allowedExt.filter((ext) => url.indexOf(ext) > 0).length > 0) {
                // it has a file extension --> resolve the file
                res.sendFile(resolvePath(url));
            } else {
                // in all other cases, redirect to the index.html!
                res.sendFile(resolvePath('index.html'));
            }
        };
    }
}
