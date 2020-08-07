import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from '../../user/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'ibssecretcode',
      });
  }

  public async validate(payload): Promise<User> {
    console.log('payload', payload);
    const user = await this.authService.validateUser(payload);
    if (!user) {
      // this one
      throw new UnauthorizedException();
    }
    return user;
  }
}
