import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '.prisma/client';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}
  async create(createUserDto: Prisma.UserCreateInput): Promise<Partial<User>> {
    try {
      const user = await this.databaseService.user.findUnique({
        where: {
          email: createUserDto.email,
        },
      });
      if (user) {
        throw new ConflictException('User already exists');
      }
      const rounds = 10;
      const salt = bcrypt.genSaltSync(rounds);
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
      const newUser = this.databaseService.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });

      return newUser;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.databaseService.user.findUnique({
        where: {
          email: email,
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(id: string): Promise<User> {
    try {
      const user = await this.databaseService.user.findUnique({
        where: {
          id: id,
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    try {
      const userDeleted = await this.databaseService.user.delete({
        where: {
          id: id,
        },
      });

      if (!userDeleted) {
        throw new NotFoundException('User not found');
      }
      return { message: 'User deleted' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async changeUserRole(userId: string, role: Role): Promise<User> {
    try {
      const user = await this.findById(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const updatedUser = await this.databaseService.user.update({
        where: {
          id: userId,
        },
        data: {
          role: role,
        },
      });

      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
