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

const getSingleIssueFromDB = async(id:string) =>{

    const result = await pool.query(`
            SELECT * FROM issues WHERE id=$1
        `,[id])
    
    
        if(result.rows.length === 0) throw new Error("Issue Not Found!")
        
        const issue = result.rows[0];

    const result2 = await pool.query(`SELECT id,name,role FROM users WHERE id=$1 `,[issue.reported_id])
    
    const reporterInfo = result2.rows[0];

    const {reported_id, ...data} = issue;
    const resData = {
        ...data,
        reporter : reporterInfo
    }

    return resData;


}

const updateIssueIntoDB = async(id : string, payload : IIssue) =>{

    const {title, description, type} = payload;

    const result = await pool.query(`
        UPDATE issues SET
        title=COALESCE($1, title),
        description=COALESCE($2, description),
        type=COALESCE($3,type),
        updated_at=NOW()
        WHERE id=$4
        RETURNING *
    `,[title,description,type,id])

   
    return result;

}
export const issueService = {createIssueIntoDB, getSingleIssueFromDB,updateIssueIntoDB}