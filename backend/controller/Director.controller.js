import sequelize from '../connection/database.js';
import { filterdata } from './MarketOfficer.controller.js';
import SetTask from '../model/Director/SetTask.model.js';
import {validateToken} from './TokenValidator.js';

  const position = "director"
    export const getnoneFiltered = async(req,res)=>{
          try {
                  const tokenvalidate = validateToken(req.headers,position);
                  const valid = tokenvalidate.split('.')[0];
                  const status = tokenvalidate.split('.')[1];
                  const message = tokenvalidate.split('.')[2];
                  if(!valid){
                    res.status(status).json({ error: message });
return;
                  }
                  
                const noneFiltered = `CALL GetNonFilteredRequests()`;
                const result = await sequelize.query(noneFiltered, {
                  type: sequelize.QueryTypes.PROCEDURE,
                });

                res.status(200).json(result);
          } catch (error) {
            console.log("🚀 ~ file: Director.controller.js:23 ~ getnoneFiltered ~ error:", error)
            res.status(400).json({ message: error.message });
          }

      };

    export const CatagoryStatus = async (req, res) => {
      try {
            const tokenvalidate = validateToken(req.headers,position);
            const valid = tokenvalidate.split('.')[0];
            const status = tokenvalidate.split('.')[1];
            const message = tokenvalidate.split('.')[2];
            if(!valid){
              res.status(status).json({ error: message });
return;
            }
            if (req.params.prop_id == null) {
              res.status(400).json({message: "Prameter missing"});
return;
            }
            const prop_id = req.params.prop_id;
            const catagoryStatus = `CALL GetCategoryStatus(:prop_id)`; 
            const result = await sequelize.query(catagoryStatus, {
              replacements: {prop_id: prop_id},
              type: sequelize.QueryTypes.PROCEDURE,
            });
        
            res.status(200).json(result);
      } catch (error) {
        console.log("🚀 ~ file: Director.controller.js:50 ~ CatagoryStatus ~ error:", error)
        res.json({error: "400", message: error.message });
      }
    };

    export const proposalCatagroy = async (req, res) => {
      try {
            const tokenvalidate = validateToken(req.headers,position);
            const valid = tokenvalidate.split('.')[0];
            const status = tokenvalidate.split('.')[1];
            const message = tokenvalidate.split('.')[2];
            if(!valid){
              res.status(status).json({ error: message });
return;
            }
            if (req.params.selectecdProposalId == null) {
              res.status(400).json({message: "Prameter missing"});
return;
            }
            const prop_id = req.params.selectecdProposalId;
            const proposalCatagroys = `SELECT cata_Name,cat_id,SUM(tot) as total
            FROM (
                SELECT c.cata_Name,c.cat_id,(i.price*ar.quantity) as tot
                FROM proposal p
                LEFT JOIN filter_needs fn ON YEAR(fn.Date) = YEAR(p.date)
                LEFT JOIN request_approve ra ON fn.filter_req_app = ra.req_app_id
                LEFT JOIN additional_request ar ON ar.add_id = ra.req_id
                LEFT JOIN item i ON i.item_id = ar.item_id
                LEFT JOIN catagory c ON c.cat_id = i.cat_id
                WHERE p.prop_id = :prop_id AND c.cata_Name IS NOT NULL
                
                UNION ALL
            
                SELECT c.cata_Name,c.cat_id,(i.price*rp.quantity) as tot
                FROM proposal p
                LEFT JOIN filter_needs fn ON YEAR(fn.Date) = YEAR(p.date)
                LEFT JOIN request_approve ra ON fn.filter_req_app = ra.req_app_id
                LEFT JOIN replacement rp ON rp.rep_id = ra.req_id
                LEFT JOIN item i ON i.item_id = rp.item_id
                LEFT JOIN catagory c ON c.cat_id = i.cat_id
                WHERE p.prop_id = :prop_id AND c.cata_Name IS NOT NULL

            ) AS subquery
            GROUP BY subquery.cata_Name`;
            const result = await sequelize.query(proposalCatagroys, {
              replacements: {prop_id: prop_id},
              type: sequelize.QueryTypes.SELECT,
            });
        
            res.status(200).json(result);
      } catch (error) {
        console.log("🚀 ~ file: Director.controller.js:91 ~ proposalCatagroy ~ error:", error)
        res.status(400).json({error: "400", message: error.message });
      }
    };
    
    export const ApprovedProposal = async(req,res)=>{
      try {
            const tokenvalidate = validateToken(req.headers,position);
            const valid = tokenvalidate.split('.')[0];
            const status = tokenvalidate.split('.')[1];
            const message = tokenvalidate.split('.')[2];
            if(!valid){
              res.status(status).json({ error: message });
return;
            }
            const approvedProposal = `select * from proposal where status = 1`;
            const result = await sequelize.query(approvedProposal, {
              type: sequelize.QueryTypes.SELECT,
            });
          
            res.status(200).json({
              result,
            });
      }catch (error) {
        console.log("🚀 ~ file: Director.controller.js:117 ~ ApprovedProposal ~ error:", error)
        res.status(400).send({
          message: error,
        });
    }
  }

    export const getEmployees = async(req,res)=>{
      try {
            const tokenvalidate = validateToken(req.headers,position);
            const valid = tokenvalidate.split('.')[0];
            const status = tokenvalidate.split('.')[1];
            const message = tokenvalidate.split('.')[2];
            if(!valid){
              res.status(status).json({ error: message });
return;
            }
            const getEmp = `select * from user where position = 'marketofficer'`;
            const result = await sequelize.query(getEmp, {
              type: sequelize.QueryTypes.SELECT,
            });
          
            res.status(200).send({
              result,
            });
      }catch (error) {
        console.log("🚀 ~ file: Director.controller.js:141 ~ getEmployees ~ error:", error)
        res.status(400).send({
          message: error,
        });
    }
  }

    export const SetTasks = async(req,res)=>{
  
      try {
            const tokenvalidate = validateToken(req.headers,position);
            const valid = tokenvalidate.split('.')[0];
            const status = tokenvalidate.split('.')[1];
            const message = tokenvalidate.split('.')[2];
            if(!valid){
              res.status(status).json({ error: message });
return;
            }
            if (req.body.dire_id == null || req.body.emp_id == null || req.body.cat_id == null ||
                req.body.task_desc == null || req.body.prop_id == null) {
              res.status(400).json({message: "Prameter missing"});
return;
            }
            const {dire_id,emp_id,cat_id,task_desc,prop_id} = req.body;
            const taskParams = {
              dire_id,
              emp_id,
              cat_id,
              prop_id,
              task_desc,
              status: 0, // Provide the default status value here
              date: new Date(),
            };
            const newTask = await SetTask.create(taskParams)
            if(newTask){
              res.status(200).json({"status":"200","message": "Task Set"});
            }
      } catch (error) {
        console.log("🚀 ~ file: Director.controller.js:183 ~ SetTasks ~ error:", error)
        res.status(400).json({
          "error": error.message
        })
      }
    }

  export const filterdatas = filterdata;