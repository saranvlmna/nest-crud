import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'src/db/entitys/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  access_tokenStratergie,
  refresh_tokenStratergie,
} from 'src/stratergies';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
  providers: [UserService, access_tokenStratergie, refresh_tokenStratergie],
})
export class UserModule {}
