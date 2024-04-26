import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(createAuthDto: Prisma.UserCreateInput) {
    return this.userService.create(createAuthDto);
  }

  async login(loginAuthDto: LoginDto): Promise<any> {
    const user = await this.validateUser(loginAuthDto);
    const tokens = await this.generateTokens(user);

    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async validateUser(loginAuthDto: LoginDto): Promise<User> {
    const userExists = await this.userService.findByEmail(loginAuthDto.email);

    if (!userExists) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const comparePassword = await bcrypt.compare(
      loginAuthDto.password,
      userExists.password,
    );

    if (!comparePassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return userExists;
  }

  async generateTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { email: user.email, sub: user.id, role: user.role };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES'),
      secret: this.configService.get('JWT_SECRET'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES'),
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    return { accessToken, refreshToken };
  }
}
