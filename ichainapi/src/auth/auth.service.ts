import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  // async createToken(id: number, username: string) {
  //   const secretKey = "sitasecretcode";
  //   const token = jwt.sign({ user_name: username } , secretKey, { expiresIn: '2h'})

  //   return { expires_in: '2h', token };
  // }

  public async validateUser(payload): Promise<User| null> {
    return await this.userService.findById(payload.id);
  }
}
