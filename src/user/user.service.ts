import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { error } from 'console';
import { User } from 'src/db/entitys/user';
import { Repository } from 'typeorm';
import { genSalt, hash, compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userModel: Repository<User>,
  ) {}

  async createUser(user: any) {
    const salt = await genSalt(10);
    user.password = await hash(user.password, salt);
    return await this.userModel.insert(user);
  }

  async loginUser(data: any) {
    let existingUser;
    existingUser = await this.userModel.findOne({
      where: {
        name: data.name,
      },
    });
    if (!existingUser) {
      throw new error('user dose not exist');
    }
    let isValid = await compare(data.password, existingUser.password);
    if (!isValid) {
      throw new Error('Password is Invalid');
    } else {
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
}
