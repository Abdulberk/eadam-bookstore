import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async createUser(@Body() createUserDto: Prisma.UserCreateInput) {
    return await this.userService.create(createUserDto);
  }

  @Delete('/delete/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }

  @Patch(':userId/role')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async changeUserRole(
    @Param('userId') userId: string,
    @Body('role') role: Role,
  ) {
    return await this.userService.changeUserRole(userId, role);
  }
}
