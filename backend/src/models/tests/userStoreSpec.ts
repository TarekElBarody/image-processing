import UserStore from '../userStore';
import { User, UserUpdate, UserRoles } from '../../types/index';
import { dateNow } from '../../lib/functions/general';
import { hashVerify } from '../../lib/functions/hash';

let userID = '';
const created = dateNow();
const store = new UserStore();

describe('Test Users Model (userStoreSpec)', async (): Promise<void> => {
  it('Should User Model CRUD functions are defined', async (): Promise<void> => {
    expect(store.create).toBeDefined();
    expect(store.index).toBeDefined();
    expect(store.show).toBeDefined();
    expect(store.password).toBeDefined();
    expect(store.update).toBeDefined();
    expect(store.delete).toBeDefined();
    expect(store.showByEmail).toBeDefined();
  });

  it('Should Insert New User', async (): Promise<void> => {
    const user: User = {
      first_name: 'FirstName',
      last_name: 'LastName',
      birthday: new Date('1990-04-01'),
      email: 'name1@example.com',
      password: '123456789',
      mobile: '01256465498',
      role: UserRoles.User,
      created: created
    };

    const userRes = await store.create(user);
    userID = String(userRes.id);

    expect(userRes.first_name).toBe(user.first_name);
  });

  it('Should Return User Data', async (): Promise<void> => {
    const userRes = await store.show(userID);

    expect(userRes.id).toEqual(userID);
  });

  it('Should Return User Hashed Password', async (): Promise<void> => {
    const hash = await store.password(userID);

    expect((await hashVerify('123456789', hash)).valid).toBeTruthy();
  });

  it('Should Return All Users Data', async (): Promise<void> => {
    const users = await store.index();

    const user = await store.show(userID);

    expect(users).toContain(user);
  });

  it('Should update User - Just Email', async (): Promise<void> => {
    // UPDATING THE VALUE
    const user: UserUpdate = {
      id: userID,
      email: 'name2@other.com'
    };
    const userRes = await store.update(user);

    expect(userRes.email).toEqual(String(user.email));
  });

  it('Should Delete User Data', async (): Promise<void> => {
    const userRes = await store.delete(userID);

    expect(userRes.id).toEqual(userID);
  });

  it('Should Truncate User Data', async (): Promise<void> => {
    const res = await store.truncate();

    expect(res).toBeTrue();
  });
});
