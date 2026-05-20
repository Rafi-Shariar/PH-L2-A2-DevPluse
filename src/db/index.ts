import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
  connectionString: config.conection_string,
});

export const initDB = async () => {
  try {
    //users table
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(30) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'contributer' NOT NULL CHECK (role IN ('contributer','maintainer')),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            

    )`);
    
    //issues table
    await pool.query(`
            CREATE TABLE IF NOT EXISTS issues(
            id SERIAL PRIMARY KEY,
            title VARCHAR(150) NOT NULL,
            description TEXT NOT NULL CHECK (LENGTH(description) >= 20),
            type VARCHAR(50) NOT NULL CHECK (type IN ('bug','feature_request')),
            status VARCHAR(50) DEFAULT 'open' NOT NULL CHECK (status IN ('open', 'in_progress', 'resolve')),
            reported_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()


    )`)

      
    console.log("DB connected!");

  } catch (error) {
    console.log(error);
  }
};