import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL, // uses Supabase URL to connect
  ssl: { rejectUnauthorized: false }, // required for Supabase
});

db.connect();
export default db;