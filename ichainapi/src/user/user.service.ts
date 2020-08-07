import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private saltRounds = 10;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>) {}

  public async getUserByUsername(username: string): Promise<User> | null {
    console.log("input",username);
    return await this.userRepository.findOne({
       where: { username: username } 
    });
  }

  public async getUsers(): Promise<User[]>|null {
    return await this.userRepository.find();
  }

  public async createUser(user: User): Promise<User> {
    user.password = await this.getHash(user.password);
    return this.userRepository.save(user);
  }

  public async getHash(password: string | undefined): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  public async compareHash(
    password: string | undefined,
    hash: string | undefined,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOneOrFail(id);
  }
}
