import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/database/database.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, DatabaseModule],
})
export class AppModule {}
