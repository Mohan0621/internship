// import pg from "pg"
// import dotenv from "dotenv"
// dotenv.config();

// const pool=new pg.Pool({
//     "user":process.env.DB_USER,
//     "password":process.env.DB_PASSWORD,
//     "host":process.env.DB_HOST,
//     "port":Number(process.env.DB_PORT),
//     "database":process.env.DB_NAME
// });

// export default pool;

import "dotenv/config";
import postgres from "postgres";
import {drizzle} from "drizzle-orm/postgres-js";
console.log("DATABASE_URL =", process.env.DATABASE_URL);
const queryClient=postgres(process.env.DATABASE_URL!);

export const db=drizzle(queryClient);