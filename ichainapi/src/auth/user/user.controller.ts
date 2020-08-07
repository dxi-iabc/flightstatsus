import { Body, Controller, Get, HttpCode, HttpStatus, Post, Response, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from '../../user/user.service';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('allusers')
    public async loginUser(@Response() res: any) {
      const users = await this.userService.getUsers();
      if (users) {
          return res
            .status(HttpStatus.OK)
            .json(users);
      }
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'No User Data Found'});
    }
}
