import { User, UserRoles, SignedToken } from '../../types/index';
import { dateNow } from './general';
import UserStore from '../../models/userStore';
import { createToken } from './hash';

const store = new UserStore();

const createTestUser = async (): Promise<SignedToken> => {
  await store.truncate();
  const admin: User = {
    first_name: 'AdminFName',
    last_name: 'AdminLName',
    birthday: new Date('1990-04-01'),
    email: 'admin@admin.com',
    password: '987654321',
    mobile: '01298654374',
    role: UserRoles.Admin,
    created: dateNow()
  };

  const res = await store.create(admin);

  const tokenData = {
    exp: dateNow().getTime() + 60 * 60,
    data: {
      id: res.id as string,
      first_name: res.first_name,
      last_name: res.last_name,
      role: res.role
    }
  };
  const adminSignedToken = await createToken(tokenData);
  return adminSignedToken;
};

export default createTestUser;
