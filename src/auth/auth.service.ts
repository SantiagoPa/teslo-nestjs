import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwTPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  private readonly bcrypt = bcrypt;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({ ...userData, password: this.bcrypt.hashSync(password, 10) });
      await this.userRepository.save(user);
      return {...user, token: this.getJwtToken({ id: user.id }) };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({ where: { email }, select: { email: true, password: true, id: true } });
    if (!user) {
      throw new UnauthorizedException(`Credentials are not valid (email)`);
    }
    
    if ( !bcrypt.compareSync(password, user.password) ) {
      throw new UnauthorizedException(`Credentials are not valid (pass)`);
    }

    return {...user, token: this.getJwtToken({ id: user.id }) };
    //TODO: return jwt
  }

  async checkAuthStatus(user: User){
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }

  private getJwtToken(payload: JwTPayload){
    const token = this.jwtService.sign( payload );
    return token;
  }

  private handleDBError(error: any): never {
    if (error.code === "23505") {
      throw new BadRequestException(error.detail);
    }
    console.log(error);
    throw new InternalServerErrorException("Please check the server logs");
  }

}
