import db from '../lib/config/database';
import { Thumb, ThumbFind } from '../types/index';

//import { Thumb, ThumbAll, ThumbUpdate } from '../types/index';
export default class ThumbStore {
  async index(image_id: string): Promise<Thumb[]> {
    try {
      const conn = await db.connect();
      const sql = 'SELECT * FROM thumbs WHERE image_id=$1;';
      const result = await conn.query(sql, [image_id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get thumbs. Error: ${err}`);
    }
  }

  async count(user_id: string): Promise<number> {
    try {
      const conn = await db.connect();
      const sql =
        'SELECT COUNT(*) as count FROM thumbs WHERE image_id IN (SELECT id FROM images WHERE user_id=$1);';
      const result = await conn.query(sql, [user_id]);
      conn.release();
      return result.rows[0].count;
    } catch (err) {
      return 0;
    }
  }

  async create(thumbs: Thumb): Promise<Thumb> {
    try {
      const sql =
        'INSERT INTO thumbs (id , image_id, filename, width, height,  format, fit, modified, bucket_key) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;';

      const conn = await db.connect();

      const result = await conn.query(sql, [
        thumbs.id,
        thumbs.image_id,
        thumbs.filename,
        thumbs.width,
        thumbs.height,
        thumbs.format,
        thumbs.fit,
        thumbs.modified,
        thumbs.bucket_key
      ]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add Thumb Error: ${err}`);
    }
  }

  async update(id: string, bucket_key: string): Promise<Thumb> {
    try {
      const sql = 'UPDATE thumbs SET bucket_key=$1 WHERE id=$2 RETURNING *;';

      const conn = await db.connect();

      const result = await conn.query(sql, [bucket_key, id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not update Thumb Error: ${err}`);
    }
  }

  async show(id: string): Promise<Thumb> {
    try {
      const sql = 'SELECT * FROM thumbs WHERE id=$1;';
      const conn = await db.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw Error(`Could not get Thumb Error: ${err}`);
    }
  }

  async find(thumb: ThumbFind): Promise<Thumb | undefined> {
    try {
      const sql =
        'SELECT * FROM thumbs WHERE image_id=$1 AND width=$2 AND height=$3 AND format=$4 AND fit=$5;';

      const conn = await db.connect();
      const result = await conn.query(sql, [
        thumb.image_id,
        thumb.width,
        thumb.height,
        thumb.format,
        thumb.fit
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      return undefined;
    }
  }

  async findByName(filename: string): Promise<Thumb | undefined> {
    try {
      const sql = 'SELECT * FROM thumbs WHERE filename=$1';

      const conn = await db.connect();
      const result = await conn.query(sql, [filename]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      return undefined;
    }
  }

  async delete(id: string): Promise<Thumb> {
    try {
      const sql = 'DELETE FROM thumbs WHERE id=$1 RETURNING *;';

      const conn = await db.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete Thumb # ${id}. Error: ${err}`);
    }
  }

  async truncate(): Promise<boolean> {
    try {
      const sql = 'TRUNCATE TABLE thumbs CASCADE;';

      const conn = await db.connect();

      await conn.query(sql);

      conn.release();

      return true;
    } catch (err) {
      return false;
    }
  }
}
