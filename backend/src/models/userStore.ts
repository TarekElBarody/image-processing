import db from '../lib/config/database';
import { User, UserAll, UserUpdate } from '../types/index';
import { hashPassword } from '../lib/functions/hash';

export default class UserStore {
  async index(): Promise<UserAll[]> {
    try {
      const conn = await db.connect();
      const sql = 'SELECT * FROM user_view;';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get Users. Error: ${err}`);
    }
  }

  async create(user: User): Promise<User> {
    try {
      const sql =
        'INSERT INTO users (first_name, last_name, birthday, email, password, mobile, role, created) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;';

      const conn = await db.connect();
      const hash = await hashPassword(user.password);

      const result = await conn.query(sql, [
        user.first_name,
        user.last_name,
        user.birthday,
        user.email,
        hash.hash,
        user.mobile,
        user.role,
        user.created
      ]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add User ${user.first_name}. Error: ${err}`);
    }
  }

  async show(id: string): Promise<UserAll> {
    try {
      const sql = 'SELECT * FROM user_view WHERE id=$1;';
      const conn = await db.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw Error(`Could not get User Error: ${err}`);
    }
  }

  async password(id: string): Promise<string> {
    try {
      const sql = 'SELECT password FROM users WHERE id=$1;';
      const conn = await db.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return String(result.rows[0].password);
    } catch (err) {
      throw Error(`Could not get User Error: ${err}`);
    }
  }

  async update(user: UserUpdate): Promise<User> {
    try {
      const valuesArray = [];
      let innerSql = '';
      let count = 0;

      if (user.first_name) {
        count++;
        valuesArray.push(user.first_name);
        innerSql += 'first_name=$' + count + ',';
      }

      if (user.last_name) {
        count++;
        valuesArray.push(user.last_name);
        innerSql += 'last_name=$' + count + ',';
      }

      if (user.birthday) {
        count++;
        valuesArray.push(user.birthday);
        innerSql += 'birthday=$' + count + ',';
      }

      if (user.email) {
        count++;
        valuesArray.push(user.email);
        innerSql += 'email=$' + count + ',';
      }

      if (user.password) {
        count++;
        const hash = await hashPassword(user.password);
        valuesArray.push(hash.hash);
        innerSql += 'password=$' + count + ',';
      }

      if (user.mobile) {
        count++;
        valuesArray.push(user.mobile);
        innerSql += 'mobile=$' + count + ',';
      }

      if (count >= 1) {
        count++;
        valuesArray.push(user.id);
        innerSql = innerSql.slice(0, innerSql.length - 1);
        innerSql += ' WHERE id=$' + count;
        const sql = 'UPDATE users SET ' + innerSql + ' RETURNING *;';

        const conn = await db.connect();

        const result = await conn.query(sql, valuesArray);

        conn.release();

        return result.rows[0];
      } else {
        throw new Error(
          `There is no data to update is provided for User ${user.id}`
        );
      }
    } catch (err) {
      throw new Error(`Could not update User ${user.id}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const sql = 'DELETE FROM users WHERE id=$1 RETURNING *;';

      const conn = await db.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete User # ${id}. Error: ${err}`);
    }
  }

  async truncate(): Promise<boolean> {
    try {
      const sql = 'TRUNCATE TABLE users CASCADE;';

      const conn = await db.connect();

      await conn.query(sql);

      conn.release();

      return true;
    } catch (err) {
      return false;
    }
  }

  async showByEmail(email: string): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE email=$1;';
      const conn = await db.connect();
      const result = await conn.query(sql, [email]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw Error(`Could not get User Password Error: ${err}`);
    }
  }
}
