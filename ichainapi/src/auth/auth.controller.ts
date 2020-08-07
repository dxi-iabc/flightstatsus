import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Response,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginUserDto } from './login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  private async loginUser(@Response() res: any, @Body() loginDto: LoginUserDto) {
    console.log("88888888888888",loginDto)
    if (!(loginDto && loginDto.username && loginDto.password)) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Username and password are required!' });
    }

    const user = await this.userService.getUserByUsername(loginDto.username.trim());
    let result = await this.userService.getUsers();
    
    console.log(user,"---", result);

    if (user.username) {
      console.log("-------",loginDto.password, user.password)
      let result =(loginDto.password.trim()=== user.password.trim());
      console.log("result---",result)
      if (
        loginDto.password.trim()=== user.password.trim()
      ) {
        let airports = "";
        let airlines = "";
        if (user.type.toLowerCase() === 'airline') {
          airlines = user.iATACode;
        } else if (user.type.toLowerCase() === 'airport') {
          airports = user.iATACode;
        }
        return res
          .status(HttpStatus.OK)
          .json({jwt: this.jwtService.sign({
              id: user.id,
              userAirlines: airlines,
              userAirports: airports,
            }),
            status: 200,
            username: loginDto.username,
          });
      }
    }

    return res
      .status(HttpStatus.FORBIDDEN)
      .json({ status: 403, message: 'Username or password wrong!' });
  }
}
