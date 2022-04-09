import db from '../lib/config/database';
import { Image } from '../types/index';

//import { Image, ImageAll, ImageUpdate } from '../types/index';
export default class ImageStore {
  async index(user_id: string): Promise<Image[]> {
    try {
      const conn = await db.connect();
      const sql = 'SELECT * FROM images where user_id=$1;';
      const result = await conn.query(sql, [user_id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get images. Error: ${err}`);
    }
  }

  async count(user_id: string): Promise<number> {
    try {
      const conn = await db.connect();
      const sql = 'SELECT COUNT(*) as count FROM images WHERE user_id=$1;';
      const result = await conn.query(sql, [user_id]);
      conn.release();
      return result.rows[0].count;
    } catch (err) {
      return 0;
    }
  }

  async create(images: Image): Promise<Image> {
    try {
      const sql =
        'INSERT INTO images (id , user_id, filename, width, height, created, bucket_key, access) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;';

      const conn = await db.connect();

      const result = await conn.query(sql, [
        images.id,
        images.user_id,
        images.filename,
        images.width,
        images.height,
        images.created,
        images.bucket_key,
        images.access
      ]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add Image Error: ${err}`);
    }
  }

  async update(id: string, bucket_key: string): Promise<Image> {
    try {
      const sql = 'UPDATE images SET bucket_key=$1 WHERE id=$2 RETURNING *;';

      const conn = await db.connect();

      const result = await conn.query(sql, [bucket_key, id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not update Image Error: ${err}`);
    }
  }

  async show(id: string): Promise<Image> {
    try {
      const sql = 'SELECT * FROM images WHERE id=$1;';
      const conn = await db.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw Error(`Could not get Image Error: ${err}`);
    }
  }

  async find(filename: string): Promise<Image> {
    try {
      const sql = 'SELECT * FROM images WHERE filename=$1;';
      const conn = await db.connect();
      const result = await conn.query(sql, [filename]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw Error(`Could not get Image Error: ${err}`);
    }
  }

  async delete(id: string): Promise<Image> {
    try {
      const sql = 'DELETE FROM images WHERE id=$1 RETURNING *;';

      const conn = await db.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete Image # ${id}. Error: ${err}`);
    }
  }

  async truncate(): Promise<boolean> {
    try {
      const sql = 'TRUNCATE TABLE images CASCADE;';

      const conn = await db.connect();

      await conn.query(sql);

      conn.release();

      return true;
    } catch (err) {
      return false;
    }
  }
}
