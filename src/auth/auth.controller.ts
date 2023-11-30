import { Controller, Get, Post, Body, UseGuards, Headers } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth, GetUser, RawHeaders } from './decorators';
import { User } from './entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post("login")
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get("check-status")
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ){
    return this.authService.checkAuthStatus( user );
  }

  @Get("private")
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @GetUser(['email', 'fullName']) dataUserArr: string[],
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ){
    return {
      ok: true,
      message: "hello world private",
      user,
      userEmail,
      dataUserArr,
      rawHeaders,
      headers
    }
  }
  
  // @SetMetadata('roles', ['admin','super-user'])

  @Get("private2")
  @RoleProtected( ValidRoles.superUser, ValidRoles.admin )
  @UseGuards( AuthGuard(), UserRoleGuard )
  testingPrivateRoute2(
    @GetUser() user: User,
  ){

    return {
      ok: true,
      message: "hello world private",
      user
    }
  }

  @Get("private3")
  @Auth( ValidRoles.admin, ValidRoles.superUser)
  testingPrivateRoute3(
    @GetUser() user: User,
  ){

    return {
      ok: true,
      message: "hello world private",
      user
    }
  }

}
