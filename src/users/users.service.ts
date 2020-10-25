import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { User, UserCreateInput } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private db: PrismaService) {}

  async findOne(username: string): Promise<User> {
    const user = await this.db.user.findOne({
      where: { username },
    })

    if(!user) {
      throw new NotFoundException();
    }

    delete user.password;
    return user;
  }

  async create(data: UserCreateInput): Promise<User> {
    const existing = await this.db.user.findOne({
      where: { username: data.username },
    });

    if(existing) {
      throw new ConflictException('username_already_exists');
    }

    // const hashedPassword = bcrypt.hash(data.password, 10, function(err, hash): string{
    //   console.log('result  ::: ', err, hash)
    //   return "aaa";
    // });
    const hashedPassword = await bcrypt.hash(data.password, 10, function(err, hash): string{
      console.log('result  ::: ', err, hash)
      return "aaa";
    });
    // const hashedPassword = data.password;

    const user = await this.db.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    console.log('create ::: ', user);

    delete user.password;
    return user;

  }
}
