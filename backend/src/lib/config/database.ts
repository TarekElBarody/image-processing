import dotenv from 'dotenv';
import { Pool, types } from 'pg';

types.setTypeParser(1700, function (val) {
  return parseFloat(val);
});

dotenv.config();
let db: Pool;

if (process.env.ENV == 'test') {
  const { POSTGRES_HOST, POSTGRES_DB_TEST, POSTGRES_USER, POSTGRES_PASSWORD } =
    process.env;
  db = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB_TEST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD
  });
} else {
  const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD } =
    process.env;
  db = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD
  });
}

export default db;
