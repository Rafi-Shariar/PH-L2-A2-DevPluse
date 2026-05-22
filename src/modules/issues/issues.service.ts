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

const deleteIssueintoDB = async(id: string) =>{

    const result = await pool.query(`DELETE FROM issues WHERE id=$1 `,[id])
    return result;
}

const getAllIssuesFromDB = async(sort:string, type:string, status:string) =>{

    const sortType = sort === "oldest" ? "ASC" : "DESC";

    const query1 = await pool.query(`
      SELECT * FROM issues 
      WHERE ($1::text IS NULL OR type=$1)
      AND ($2:: text IS NULL OR status=$2)
      ORDER BY created_at ${sortType}
    `,[type||null, status||null] )

    const issues = query1.rows;

    if(issues.length === 0) return [];

    const reporter_ids = issues.map((issue)=> issue.reported_id)

    const query2 = await pool.query(`SELECT id,name,role FROM users WHERE id=ANY($1)`, [reporter_ids])
    const reporters = query2.rows;

    const formattedIssues = issues.map((issue)=>{

        const matchingReport = reporters.find((reporter) => reporter.id === issue.reported_id)

        const {reported_id, ...data} = issue;

        const updatedData = {
            ...data,
            reporter : matchingReport
        }

        return updatedData;

    })


    return formattedIssues;




}
export const issueService = {createIssueIntoDB, getSingleIssueFromDB,updateIssueIntoDB,deleteIssueintoDB,getAllIssuesFromDB}