import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IHash } from '../../contracts/IHash';

@Injectable()
export class HashService implements IHash {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
