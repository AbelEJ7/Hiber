import sequelize from '../connection/database.js';
import { User } from '../model/Auth/Auth.model.js';
import { sendEmail } from './MarketOfficer.controller.js';
import md5 from "md5";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config({path: 'connections.env'});
  export const branch = async(req,res,next)=>{
      try {
            const secreteKey = process.env.ACCESS_TOKEN_SECRET;
            const token = req.headers.authorization.split(' ')[1]; // Get token from header
            const decodedToken = jwt.verify(token,secreteKey);
            console.log("🚀 ~ file: general.conntroller.js:15 ~ branch ~ decodedToken:", decodedToken.position)
            
            if(decodedToken.position !== "admin"){
              res.status(403).json({ error: 'access_denied', message: 'You do not have permission to access this resource' });
            }else{
                const branchQuery = "select Branch_id,Branch_Name from branch";
                const branch = await sequelize.query(branchQuery, {
                type: sequelize.QueryTypes.SELECT,
              });
              res.status(200).json(branch);
            }
            
      } catch (error) {
        console.log("/branch=>",error);
        next(error);
        res.json(error);
      }
    }

    export const UpdatePassword = async(req,res,next)=>{
      try {
        const code = req.body.verification;
        const pass = md5(req.body.password);
        const email = req.body.email;

        const result = await User.update(
          { password: pass },
          { where: { email } }
        );
     console.log(result)
        if (result[0] > 0) {
          res.send({message: "Password Update Sucessfully",error: "200"});
        }else{
          res.send({message: "Password Update Faild",error: "400"});
        }
        
      } catch (error) {
        console.log("/branch=>",error);
        next(error);
        res.json(error);
      }
    }

    export const ForgetPassword = async(req,res,next)=>{
      try {
        
        const {email} = req.body;
        console.log(email)
        const subject = "Reset Password";

        const generateRandomNumber = () => {
          const min = 100000; // Minimum 6-digit number
          const max = 999999; // Maximum 6-digit number
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        
        const message = "Verification Code is =>"+generateRandomNumber();
        if(sendEmail(email, subject, message)){
          res.status(200).json({"message": "Verify Your Email"})
        }else{
          res.status(200).json({"message": "Verification Not Sent Try again later"})
        }
      } catch (error) {
        console.log("/branch=>",error);
        next(error);
        res.json(error);
      }
    }

  export const branchname = async(req,res)=>{
    try{
      const user_id = req.params.user_id;
      console.log("/branchname/userid ",user_id);
      const branchname = `SELECT b.branch_name,b.Branch_id FROM branch b 
      JOIN user m ON b.branch_id = m.branch_id WHERE b.branch_id = m.branch_id 
      AND m.user_id = ?;`;
      const filesParams = [];
      filesParams.push(user_id);
      const branch = await sequelize.query(branchname, {
        type: sequelize.QueryTypes.SELECT,
        replacements: filesParams,
      });

      res.status(200).send({
        branch
      });
    }catch(err){
      console.error(err);
      res.status(500).send({
        message: "Error occurred while fetching the pending requests"
      });
    } 
  }

  export const items = async(req,res)=>{
    try {
      console.log(req.headers);
      console.log("items")
      const itemQuery = "select item_id,item_name,c.cat_id,cata_Name,price from item i left join catagory c on c.cat_id = i.cat_id";
      const items = await sequelize.query(itemQuery,{type: sequelize.QueryTypes.SELECT});
      res.status(200).json(items);
    } catch (error) {
      res.json(err);
    }
  }

  export const oneitem = async(req,res)=>{
    try {
      const itemQuery = "select `item_id`,`item_name`,`price`,item.cat_id,cata_Name from item Left JOIN catagory c ON item.cat_id = c.cat_id WHERE item.cat_id = ?";
      const itemQuerys = "select `item_id`,`item_name`,`price`,item.cat_id,cata_Name from item Left JOIN catagory ON item.cat_id =catagory.cat_id";
      const cat_id = req.params.cat_id;
      const filesParams = [];

      if(cat_id ==-1){
        const item = await sequelize.query(itemQuerys, {
          type: sequelize.QueryTypes.SELECT,
        });
        res.status(200).jsonjson(item);
      }else{

      filesParams.push(cat_id);
      const items = await sequelize.query(itemQuery, {
        type: sequelize.QueryTypes.SELECT,
        replacements: filesParams,
      });
        res.json(items);
      }
    } catch (error) {
      res.json(error);
    }
  }

  export const cats = async(req,res)=>{
    try {
      const catQuery = "select *from catagory";

      const cats = await sequelize.query(catQuery, {
        type: sequelize.QueryTypes.SELECT,
      });
      res.json(cats);
    } catch (error) {
      res.json(err);
    }
  }

//ASSITATNT
  
  export const TotalRequest = async (req, res, next) => {
    try {
      const user_id = req.params.user_id;
      const totalrequest = `SELECT (ar_count + replacement_count) AS total_request
                            FROM
                            (
                              SELECT COUNT(*) AS ar_count
                              FROM additional_request ar
                              WHERE ar.user_id = :user_id
                            ) subquery1,
                            (
                              SELECT COUNT(*) AS replacement_count
                              FROM replacement
                              WHERE user_id = :user_id
                            ) subquery2;`;
        

      const [total_request] = await sequelize.query(totalrequest, {
        replacements: { user_id: user_id },
        type: sequelize.QueryTypes.SELECT,
      });

      res.json(total_request);
    } catch (error) {
      console.log("/asssistant=>", error);
      next(error);
    }
  };

  export const TotalPendings = async (req, res, next) => {
    try {
      const user_id = req.params.user_id;
      const totalrequest = `SELECT (ar_count + replacement_count) AS total_request
                                FROM
                                (
                                  SELECT COUNT(*) AS ar_count
                                  FROM additional_request ar
                                  INNER JOIN request_approve ra ON ra.req_id = ar.add_id
                                  WHERE ar.user_id = 32  AND ra.req_status = 'Pending'
                                ) subquery1,
                                (
                                  SELECT COUNT(*) AS replacement_count
                                  FROM replacement rp
                                  INNER JOIN request_approve ra ON ra.req_id = rp.rep_id
                                  WHERE rp.user_id = 32 AND ra.req_status = 'Pending'
                                ) subquery2;`;
        

      const [total_request] = await sequelize.query(totalrequest, {
        replacements: { user_id: user_id },
        type: sequelize.QueryTypes.SELECT,
      });

      res.send(total_request);
    } catch (error) {
      console.log("/asssistant=>", error);
      next(error);
    }
  };

  export const TotalApprove = async (req, res, next) => {
    try {
      const user_id = req.params.user_id;
      const totalrequest = `SELECT (ar_count + replacement_count) AS total_request
                                FROM
                                (
                                  SELECT COUNT(*) AS ar_count
                                  FROM additional_request ar
                                  INNER JOIN request_approve ra ON ra.req_id = ar.add_id
                                  WHERE ar.user_id = 32  AND ra.req_status = 'Approve'
                                ) subquery1,
                                (
                                  SELECT COUNT(*) AS replacement_count
                                  FROM replacement rp
                                  INNER JOIN request_approve ra ON ra.req_id = rp.rep_id
                                  WHERE rp.user_id = 32 AND ra.req_status = 'Approve'
                                ) subquery2;`;
        

      const [total_request] = await sequelize.query(totalrequest, {
        replacements: { user_id: user_id },
        type: sequelize.QueryTypes.SELECT,
      });

      res.send(total_request);
    } catch (error) {
      console.log("/asssistant=>", error);
      next(error);
    }
  };

//MARKET OFFICER
  export const TotalTask = async (req, res, next) => {
    try {
      const emp_id = req.params.user_id;
      const totaltask = `select count(*) as tasks from task where emp_id = :emp_id`;
        

      const [tasks] = await sequelize.query(totaltask, {
        replacements: { emp_id: emp_id },
        type: sequelize.QueryTypes.SELECT,
      });

      res.send(tasks);
    } catch (error) {
      console.log("/asssistant=>", error);
      next(error);
    }
  };

  export const TotalBIdParticipants = async (req, res, next) => {
    try {
      const bid_id = req.params.bid_id;
      const parti = `select count(*) as participants from bid_participants where bid_id = :bid_id`;
      
      const [participants] = await sequelize.query(parti, {
        replacements: { bid_id: bid_id },
        type: sequelize.QueryTypes.SELECT,
      });

      res.send(participants);
    } catch (error) {
      console.log("/asssistant=>", error);
      next(error);
    }
  };

  export const TotalRequests = async (req, res, next) => {
    try {
      const req = `SELECT (ar_count + replacement_count) AS total_request
                    FROM
                    (
                      SELECT COUNT(*) AS ar_count
                      FROM additional_request ar
                    ) subquery1,
                    (
                      SELECT COUNT(*) AS replacement_count
                      FROM replacement
                    ) subquery2;`;
      
      const [requests] = await sequelize.query(req, {
        type: sequelize.QueryTypes.SELECT,
      });

      res.send(requests);
    } catch (error) {
      console.log("/asssistant=>", error);
      next(error);
    }
  };
//BRANCH MANAGER 

  export const TotalBranchRequests = async (req, res, next) => {
    try {
      const branch_id = req.params.branch_id;
      console.log(branch_id)
      const reqeuest = `SELECT SUM(request_count) AS total_count
                    FROM (
                        SELECT COUNT(*) AS request_count
                        FROM request_approve ra 
                        JOIN additional_request a ON a.add_id = ra.req_id 
                        JOIN item i ON a.item_id = i.item_id 
                        JOIN user u ON a.user_id = u.user_id 
                        JOIN branch b ON u.branch_id = b.branch_id 
                        AND b.branch_id = ?
                        UNION
                    
                        SELECT COUNT(*) AS request_count
                        FROM request_approve ra 
                        JOIN replacement a ON a.rep_id = ra.req_id 
                        JOIN item i ON a.item_id = i.item_id 
                        JOIN user u ON a.user_id = u.user_id 
                        JOIN branch b ON u.branch_id = b.branch_id 
                        AND b.branch_id = ? 
                    ) AS counts; `;
      
      const [branch_requests] = await sequelize.query(reqeuest, {
        replacements: [branch_id,branch_id],
        type: sequelize.QueryTypes.SELECT,
      });

      res.send(branch_requests);
    } catch (error) {
      console.log("/asssistant=>", error);
      next(error);
    }
  };

  export const TotalBranchApprovedRequests = async (req, res, next) => {
    try {
      const branch_id = req.params.branch_id;
      const reqeuest = `SELECT SUM(request_count) AS total_count
                    FROM (
                        SELECT COUNT(*) AS request_count
                        FROM request_approve ra 
                        JOIN additional_request a ON a.add_id = ra.req_id 
                        JOIN item i ON a.item_id = i.item_id 
                        JOIN user u ON a.user_id = u.user_id 
                        JOIN branch b ON u.branch_id = b.branch_id 
                        AND b.branch_id = ? AND ra.req_status = 'Approve'
                        UNION
                    
                        SELECT COUNT(*) AS request_count
                        FROM request_approve ra 
                        JOIN replacement a ON a.rep_id = ra.req_id 
                        JOIN item i ON a.item_id = i.item_id 
                        JOIN user u ON a.user_id = u.user_id 
                        JOIN branch b ON u.branch_id = b.branch_id 
                        AND b.branch_id = ? AND ra.req_status = 'Approve'
                    ) AS counts; `;
      
      const [branch_requessts] = await sequelize.query(reqeuest, {
        replacements: [branch_id,branch_id],
        type: sequelize.QueryTypes.SELECT,
      });

      res.send(branch_requessts);
    } catch (error) {
      console.log("/asssistant=>", error);
      next(error);
    }
  };

  export const TotalBranchPendingRequests = async (req, res, next) => {
    try {
      const branch_id = req.params.branch_id;
      const reqeuest = `SELECT SUM(request_count) AS total_count
                    FROM (
                        SELECT COUNT(*) AS request_count
                        FROM request_approve ra 
                        JOIN additional_request a ON a.add_id = ra.req_id 
                        JOIN item i ON a.item_id = i.item_id 
                        JOIN user u ON a.user_id = u.user_id 
                        JOIN branch b ON u.branch_id = b.branch_id 
                        AND b.branch_id = ? AND ra.req_status = 'Pending'
                        UNION
                    
                        SELECT COUNT(*) AS request_count
                        FROM request_approve ra 
                        JOIN replacement a ON a.rep_id = ra.req_id 
                        JOIN item i ON a.item_id = i.item_id 
                        JOIN user u ON a.user_id = u.user_id 
                        JOIN branch b ON u.branch_id = b.branch_id 
                        AND b.branch_id = ? AND ra.req_status = 'Pending'
                    ) AS counts; `;
      
      const [branch_requessts] = await sequelize.query(reqeuest, {
        replacements: [branch_id,branch_id],
        type: sequelize.QueryTypes.SELECT,
      });

      res.send(branch_requessts);
    } catch (error) {
      console.log("/asssistant=>", error);
      next(error);
    }
  };