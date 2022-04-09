import db from '../lib/config/database';
import { AccessLog } from '../types/index';

//import { AccessLog, AccessLogAll, AccessLogUpdate } from '../types/index';
export default class AccessLogStore {
  async index(): Promise<AccessLog[]> {
    try {
      const conn = await db.connect();
      const sql = 'SELECT * FROM access_log;';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get AccessLogs. Error: ${err}`);
    }
  }

  async create(accessLog: AccessLog): Promise<AccessLog> {
    try {
      const sql =
        'INSERT INTO access_log (remote_addr, visit_date, method, url, status, referrer, user_agent, content_length, response_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;';

      const conn = await db.connect();

      const result = await conn.query(sql, [
        accessLog.remote_addr,
        accessLog.visit_date,
        accessLog.method,
        accessLog.url,
        Number(accessLog.status),
        accessLog.referrer,
        accessLog.user_agent,
        Number(accessLog.content_length),
        Number(accessLog.response_time)
      ]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      console.log(err);
      return {
        remote_addr: accessLog.remote_addr,
        visit_date: accessLog.visit_date,
        method: accessLog.method,
        url: accessLog.url,
        status: accessLog.status,
        referrer: accessLog.referrer,
        user_agent: accessLog.user_agent,
        content_length: accessLog.content_length,
        response_time: accessLog.response_time
      };
      //throw new Error(`Could not add AccessLog Error: ${err}`);
    }
  }

  async show(id: string): Promise<AccessLog> {
    try {
      const sql = 'SELECT * FROM access_log WHERE id=$1;';
      const conn = await db.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw Error(`Could not get AccessLog Error: ${err}`);
    }
  }

  async delete(id: string): Promise<AccessLog> {
    try {
      const sql = 'DELETE FROM access_logs WHERE id=$1 RETURNING *;';

      const conn = await db.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete AccessLog # ${id}. Error: ${err}`);
    }
  }

  async truncate(): Promise<boolean> {
    try {
      const sql = 'TRUNCATE TABLE accessLogs CASCADE;';

      const conn = await db.connect();

      await conn.query(sql);

      conn.release();

      return true;
    } catch (err) {
      return false;
    }
  }
}
