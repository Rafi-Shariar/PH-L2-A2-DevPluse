import bcrypt from "bcryptjs";
import type { IUser } from "./auth.interface";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";


const signupUserIntoDB = async (payload : IUser) =>{

    const {name, email, password, role} = payload

    const hashedPassword = await bcrypt.hash(password,10);

    const result = await pool.query(`
        INSERT INTO users(name,email,password,role) VALUES ($1,$2,$3,$4)
        RETURNING id, name, email, role, created_at, updated_at
    `,[name,email,hashedPassword,role])

    return result;
    

}

const loginUserIntoDB = async (payload : {email : string, password:string}) =>{

    const {email, password} = payload

    const userData = await pool.query(`SELECT * FROM users WHERE email=$1`,[email])

    if(userData.rows.length === 0) throw new Error("Invalid Credentials")
    
    const userInfo = userData.rows[0];

    const matchedPassword = await bcrypt.compare(password,userInfo.password);

    if(!matchedPassword){
        throw new Error("Invalid Credentials")
    }

    const jwtPayload = {
        id : userInfo.id,
        name : userInfo.name,
        email : userInfo.email,
        role : userInfo.role
    }

    const token = jwt.sign(jwtPayload, config.secret as string, {expiresIn:'1d'})
    const user = {
        ...jwtPayload,
        created_at : userInfo.created_at,
        updated_at : userInfo.updated_at,

    }

    return {token,user};


    
}
export const authServices = {signupUserIntoDB, loginUserIntoDB}