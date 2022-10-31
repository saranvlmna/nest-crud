import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entitys/user';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'vlmna',
      password: 'vlmna4578',
      database: 'nest_test',
      entities: [User],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
