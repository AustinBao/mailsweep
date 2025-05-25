import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import pg from "pg";

const app = express();
const port = 3000;
env.config();

app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL, // use Supabase URL
  ssl: { rejectUnauthorized: false }, // required for Supabase
});
db.connect();

app.get("/", async (req, res) => {
    const result = await db.query('SELECT * FROM users');
    console.log(result.rows)
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});