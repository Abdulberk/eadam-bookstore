import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';
import { LoginDto } from './dto/auth.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() createAuthDto: Prisma.UserCreateInput) {
    return this.authService.register(createAuthDto);
  }

  @Post('/login')
  login(@Body() loginAuthDto: LoginDto) {
    return this.authService.login(loginAuthDto);
  }
}
