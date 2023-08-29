import { ReplacementRequest,AdditionalRequest } from '../model/Asisttant/Request.model.js';
import sequelize from '../connection/database.js';
import { validateToken } from './TokenValidator.js';

const position = "assistant";

export const requests = async (req, res, next) => {
    try {
            const tokenvalidate = validateToken(req.headers,position);
            const valid = tokenvalidate.split('.')[0];
            const status = tokenvalidate.split('.')[1];
            const message = tokenvalidate.split('.')[2];
            if(valid !== "true"){
              res.status(status).json({ error: message });
              return;
            }
            else{
              if(req.body.table == null  || req.body.user_id == null ||req.body.time_of_purchase == null
                ||  req.body.item_id == null ){
                  res.status(400).json({message: "Prameter missing"});
                  return;
              }
      
              const { user_id, table, item_id, quantity, time_of_purchase, title_of_post, 
                other_reason, tag_no, service_year, frequency_of_rep, book_value } = req.body;
              
            let model;
      
            if (table === 'replacement') {
              if(req.body.tag_no == null || req.body.service_year == null || req.body.frequency_of_rep == null || req.body.book_value == null){
                res.status(400).json({message: "Prameter missing"});
                return;
             }
              model = ReplacementRequest;
      
            } 
      
            else if (table === 'additional_request') {
              if(req.body.title_of_post == null || req.body.other_reason == null || req.body.quantity == null){
                res.status(400).json({message: "Prameter missing"});
                return;;
            }
              model = AdditionalRequest;
            } else {
              throw new Error(`Invalid table type: ${table}`);
            }
      
            const request = await model.create({
              user_id,
              item_id,
              quantity,
              time_of_purchase,
              title_of_post,
              other_reason,
              tag_no,
              service_year,
              frequency_of_rep,
              book_value,
            }, {
              fields: ['user_id', 'item_id', 'quantity', 
              'time_of_purchase', 'title_of_post', 
              'other_reason', 'tag_no', 'service_year', 
              'frequency_of_rep', 'book_value'],
            });
      
            res.status(200).json({
              message: `Successfully created ${table} request with ID ${request.id}`,
              error: "200",
              request_id: request.id,
            });
          }
    } catch (error) {
      console.log("Request Error:", error);
      next(error);
      res.json({
        message: "Error occurred while creating the request",
      });
    }
}

export const approveRequest = async (req, res) => {
  try {
          const tokenvalidate = validateToken(req.headers,position);
          const valid = tokenvalidate.split('.')[0];
          const status = tokenvalidate.split('.')[1];
          const message = tokenvalidate.split('.')[2];

          if(valid !== "true"){
            res.status(status).json({ error: message });
return;
          }

        if(req.params.user_id == null){
          res.status(400).json({message: "Prameter missing"});
return;
        }
        let Assistant_id = req.params.user_id;
      
        const result = await sequelize.query(`
          SELECT ra.req_id AS request_id,a.title_of_post,
          b.branch_name, b.branch_id, u.user_id, i.item_name, 
          i.item_id, i.price, a.quantity, 'Additional' AS purpose, a.time_of_purchase,
          ra.req_app_id, ra.user_id, ra.req_status
          FROM request_approve ra 
          JOIN additional_request a ON a.add_id = ra.req_id 
          JOIN item i ON a.item_id = i.item_id 
          JOIN user u ON a.user_id = u.user_id 
          JOIN branch b ON u.branch_id = b.branch_id 
          
          AND u.user_id = :assistant_id
          
          UNION
          
          SELECT ra.req_id AS request_id,'' as title_of_post,
          b.branch_name, b.branch_id, u.user_id, i.item_name,
          i.item_id, i.price, a.quantity, 'Replacement' AS purpose, a.time_of_purchase,
          ra.req_app_id, ra.user_id, ra.req_status
          FROM request_approve ra 
          JOIN replacement a ON a.rep_id = ra.req_id 
          JOIN item i ON a.item_id = i.item_id 
          JOIN user u ON a.user_id = u.user_id 
          JOIN branch b ON u.branch_id = b.branch_id 
        
          AND u.user_id = :assistant_id`, 
          {
          replacements: { assistant_id: Assistant_id },
          type: sequelize.QueryTypes.SELECT
        });
        res.status(200).json({
          result
        });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error occurred while fetching the pending requests"
    });
  }
}

export const waitingReequest = async (req, res) => {
  try {
          const tokenvalidate = validateToken(req.headers,position);
          const valid = tokenvalidate.split('.')[0];
          const status = tokenvalidate.split('.')[1];
          const message = tokenvalidate.split('.')[2];

          if(valid !== "true"){
            res.status(status).json({ error: message });
return;
          }

        if(req.params.user_id == null){
          res.status(400).json({message: "Prameter missing"});
return;
        }
        const Assistant_id = req.params.user_id;
        const ApproveQuery = `SELECT ra.req_id AS request_id, 
              b.branch_name, b.branch_id, u.user_id, i.item_name, 
              i.item_id, i.price, a.quantity, 'Additional' AS purpose, a.time_of_purchase,
              ra.req_app_id, ra.user_id, ra.req_status
              FROM request_approve ra 
              JOIN additional_request a ON a.add_id = ra.req_id 
              JOIN item i ON a.item_id = i.item_id 
              JOIN user u ON a.user_id = u.user_id 
              JOIN branch b ON u.branch_id = b.branch_id 
              WHERE ra.req_status = 'Pending'
              AND u.user_id = :assistant_id
              
              union
              
              SELECT ra.req_id AS request_id, 
              b.branch_name, b.branch_id, u.user_id, i.item_name, 
              i.item_id, i.price, a.quantity, 'Replacement' AS purpose, a.time_of_purchase,
              ra.req_app_id, ra.user_id, ra.req_status
              FROM request_approve ra 
              JOIN replacement a ON a.rep_id = ra.req_id 
              JOIN item i ON a.item_id = i.item_id 
              JOIN user u ON a.user_id = u.user_id 
              JOIN branch b ON u.branch_id = b.branch_id 
              WHERE ra.req_status = 'Pending'
              AND u.user_id = :assistant_id`
    
      const result = await sequelize.query(ApproveQuery,{
      replacements: { assistant_id: Assistant_id },
      type: sequelize.QueryTypes.SELECT
    })
  
    res.status(200).send({
      approved: result
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: error
    });
  }
}


