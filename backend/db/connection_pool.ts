import pg from "pg";

export default function Connection_pool() {
  return new pg.Pool({
    connectionString: process.env.DATABASE_URL
  });
}
