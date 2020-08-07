import {Get, Controller, Param, HttpStatus, Post, Body, HttpException, Patch, Query, Inject, Res, Req} from '@nestjs/common';

/**
 */
@Controller('')
export class RootController {

    constructor() {
    }

    /**
     * TODO: Is there a better way to do the redirect to the swagger docs from the root URL to /docs ?
     * @param response
     */
     @Get('')
     public async getRootRedirectToDocs(@Res() response) {
        return response.redirect('docs')
    }
}
