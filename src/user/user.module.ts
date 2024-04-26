import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AccessModule } from '@app/common/access-control/access-control.module';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [AccessModule],
  controllers: [UserController],
  providers: [UserService, JwtService],
  exports: [UserService],
})
export class UserModule {}
