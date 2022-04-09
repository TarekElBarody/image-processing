import UserStore from '../../models/userStore';
import { User, TokenData } from '../../types/index';
import { dateNow } from './general';
import { createToken } from './hash';
import dotenv from 'dotenv';

dotenv.config();

export async function defaultAdmin(): Promise<void> {
  if (process.env.ENV != 'test') {
    const admin: User = {
      first_name: 'Admin',
      last_name: 'Admin',
      birthday: new Date('1990-03-31'),
      email: 'admin@admin.com',
      password: '123456789',
      mobile: '01111111111',
      role: 1,
      created: dateNow()
    };

    const store = new UserStore();

    const users = await store.index();
    if (users.length === 0) {
      const user = await store.create(admin);
      console.log(
        `1st time Default admin is created with email: ${admin.email} and password: ${admin.password}`
      );

      const tokenData: TokenData = {
        exp: Date.now() / 1000 + 60 * 60,
        data: {
          id: user.id as string,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role
        }
      };

      const token = await createToken(tokenData);
      console.log('TOKEN ', token);
    }
  }
}
