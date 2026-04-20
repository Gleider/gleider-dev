import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: (() => {
        if (!process.env.API_JWT_SECRET) throw new Error('API_JWT_SECRET não configurado');
        return process.env.API_JWT_SECRET;
      })(),
    });
  }

  async validate(payload: { sub: string; role: string }) {
    return { username: payload.sub, role: payload.role };
  }
}
