import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { OneService } from '../one/one.service';
import { schemaUser } from 'src/config/ldap-client';
import { schemaGroup } from 'src/config/ldap-client';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService,
              private readonly oneService: OneService,
  ){}

  async login(loginDto: LoginAuthDto) {
    const username = await this.oneService.findOne(schemaUser,'posixAccount','uid',loginDto.username);
    if (!username) {
      throw new NotFoundException('Usuario no existe');
    }

    const ldapFilter = `(&(cn=administradores)(memberUid=${loginDto.username}))`
    const userAdmin = await this.oneService.findFilter(schemaGroup,ldapFilter);
    if (!userAdmin) {
      throw new UnauthorizedException('El usuario existe pero no tiene permiso de acceso');
    }

    let isValidPassword = await this.isMatch(loginDto.password,username.userPassword);

    if (isValidPassword) {
      const token = this.getAccesToken(username)
      return {
        msg: 'Sesión iniciada',
        status: 200,
        fullname: username.cn,
        rol: username.title,
        token: token,
      };
    } else {
      throw new UnauthorizedException('Contraseña incorrecta');
    }
  }

  private getAccesToken(username: any) {
    try {
      const accessToken = this.jwtService.sign({
        id: username.dn,
        username: username.uid,
        email: username.mail,
      });
      return accessToken;
    } catch (err) {
      console.error(err); throw new InternalServerErrorException('Error al crear el token');
    }
  }

  async isMatch(password: string,hash: string) {
    return await bcrypt.compare(password,hash);
  }
}
