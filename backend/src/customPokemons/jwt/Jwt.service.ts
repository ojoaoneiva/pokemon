import * as dotenv from 'dotenv-safe'
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

dotenv.config();

@Injectable()
export class JwtService {
  private secretKey: string;

  constructor() {
    this.secretKey = process.env.JWT_KEY;
  }

  sign(email: string): string {
    const payload = { email: email };
    return jwt.sign(payload, this.secretKey);
  }

  verify(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      return null;
    }
  }
}
