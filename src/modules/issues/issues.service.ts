import { pool } from "../../db";
import type { IIssue } from "./issue.interface";

const createIssueIntoDB = async(payload : IIssue, reportedId : number) =>{

    const {title, description, type} = payload

    const result = await pool.query(`
        INSERT INTO issues(title,description,type,reported_id) VALUES
        ($1,$2,$3,$4) RETURNING *
      
    `,[title,description,type,reportedId])

    return result;

}

export const issueService = {createIssueIntoDB}