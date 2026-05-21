import bcrypt from "bcryptjs";
import type { IUser } from "./auth.interface";
import { pool } from "../../db";

const signupUserIntoDB = async (payload : IUser) =>{

    const {name, email, password, role} = payload

    const hashedPassword = bcrypt.hash(password,10);

    const result = await pool.query(`
        INSERT INTO users(name,email,password,role) VALUES ($1,$2,$3,$4)
        RETURNING id, name, email, role, created_at, updated_at
    `,[name,email,hashedPassword,role])

    return result;
    

}

export const authServices = {signupUserIntoDB}