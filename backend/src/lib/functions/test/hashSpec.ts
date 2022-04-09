import { hashPassword, hashVerify, createToken, verifyToken } from '../hash';
import { dateNow } from '../general';

const user = {
  id: '0d60a85e-0b90-4482-a14c-108aea2557aa',
  first_name: 'FirstName',
  last_name: 'LastName',
  birthday: new Date('1990-04-01'),
  email: 'name1@example.com',
  password: '123456789',
  mobile: '01256465498',
  role: 1,
  created: dateNow()
};

describe('Test Hash & Token Function (hashSpec)', async (): Promise<void> => {
  it('Should All Function Are defined', async (): Promise<void> => {
    expect(hashPassword).toBeDefined();
    expect(hashVerify).toBeDefined();
    expect(createToken).toBeDefined();
  });

  it('Should Hashing & verifying Password', async (): Promise<void> => {
    const hashed = await hashPassword(user.password);
    const verify = await hashVerify(user.password, hashed.hash);

    expect(hashed.err).toBeFalsy();
    expect(verify.valid).toBeTrue();
  });

  it('Should Generate & verifying Tokens', async (): Promise<void> => {
    const tokenData = {
      exp: dateNow().getTime() + 60 * 60,
      data: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    };
    const SignedToken = await createToken(tokenData);
    const verify = await verifyToken(SignedToken.token);

    expect(SignedToken.success).toBeTrue();
    expect(verify.success).toBeTrue();
  });
});
