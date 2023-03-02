import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJwtToken(user: any) {
    const { username, id } = user;
    const payload = { username, id };

    return this.jwtService.sign(payload);
  }
}
