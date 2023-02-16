import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { user, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.userCreateInput): Promise<void> {
    const { username, password } = data;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // try {
    // await this.save(user);
    // } catch (error) {
    // if (error.code === '23505') {
    //duplicate username
    // throw new ConflictException('Username already exists');
    //} else {
    // throw new InternalServerErrorException();
    // }
    //}
  }
}
