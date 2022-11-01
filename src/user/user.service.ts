import {
  BadGatewayException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/entitys/user';
import { Repository } from 'typeorm';
import { genSalt, hash, compare } from 'bcrypt';
import { Tokens } from 'src/types/token';
import { JwtService } from '@nestjs/jwt';

const otpGenerator = require('otp-generator');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userModel: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(data: any): Promise<Tokens> {
    const salt = await genSalt(10);
    data.password = await hash(data.password, salt);
    const user = await this.userModel.insert(data);
    const token = await this.generateAuthToken(user['raw'].id, data.email);
    await this.updateUserRToken(user['raw'], token.refresh_token);
    return token;
  }

  async loginUser(data: any) {
    let existingUser;
    existingUser = await this.userModel.findOne({
      where: {
        name: data.name,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User does not exist');
    }
    let isValid = await compare(data.password, existingUser.password);
    if (!isValid) {
      throw new BadGatewayException('Password is Invalid');
    } else {
      const otp = otpGenerator.generate(4, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
        digits: true,
      });
      existingUser.access_token = await this.generateAccesToken(
        existingUser.id,
        existingUser.rToken,
      );
      return existingUser;
    }
  }

  async findAll() {
    return await this.userModel.find();
  }

  async editUser(data: any, id: any) {
    this.userModel.update(id, {
      ...(User && { name: data.name }),
      ...(User && { email: data.email }),
      ...(User && { age: data.age }),
      ...(User && { number: data.number }),
    });
  }

  async deleteUser(id: any) {
    return this.userModel.delete({ id: id });
  }

  async generateAuthToken(userId: number, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'vlmna',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'vlmnart',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async generateAccesToken(userId: number, rt: string) {
    const user = await this.userModel.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ForbiddenException('Access Denided');
    }
    if (rt !== user.rToken) {
      throw new ForbiddenException('Access Denided !!');
    }
    const token = await this.generateAuthToken(user.id, user.email);
    await this.updateUserRToken(user.id, token.refresh_token);
    return token;
  }

  async updateUserRToken(userId: any, rt: string) {
    const salt = await genSalt(10);
    const hashrt = await hash(rt, salt);
    await this.userModel.update(userId, {
      ...(User && { rToken: hashrt }),
    });
  }
}
