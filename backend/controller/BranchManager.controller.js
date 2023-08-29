import RequestApprove from "../model/BranchManager/ApproveRequest.model.js";
import sequelize from "../connection/database.js";
import { validateToken } from "./TokenValidator.js";

const position = "manager";
    export const pendingRequest = async (req, res) => {
      try {
            try {
                  const tokenvalidate = validateToken(req.headers,position);
                  const valid = tokenvalidate.split('.')[0];
                  const status = tokenvalidate.split('.')[1];
                  const message = tokenvalidate.split('.')[2];
                  if(valid !== "true"){
                    res.status(status).json({ error: message });
                    return;
                  }
                  if (req.params.branch_id == null) {
                    res.status(400).json({message: "Prameter missing"});
                    return;
                  }
                  const branch_id = req.params.branch_id;
                  if (!branch_id) {
                    return res.status(403).json({
                      user: {},
                      error: '403',
                      message: 'UnAuthorized user',
                    });
                  }
                const pendingRequestsQuery = `
                  SELECT ra.req_id AS request_id, 
                    b.branch_name, b.branch_id, u.user_id,a.other_reason, i.item_name, i.item_id, 
                    i.price, a.quantity, 'Additional' AS purpose, a.time_of_purchase,
                    ra.req_app_id, ra.user_id AS approved_by_user_id, ra.req_status
                  FROM request_approve ra 
                  JOIN additional_request a ON a.add_id = ra.req_id 
                  JOIN item i ON a.item_id = i.item_id 
                  JOIN user u ON a.user_id = u.user_id 
                  JOIN branch b ON u.branch_id = b.branch_id 
                  AND b.branch_id = ?
                  UNION
                  SELECT ra.req_id AS request_id, 
                    b.branch_name, b.branch_id, u.user_id,'none' AS other_reason, i.item_name, i.item_id, 
                    i.price, a.quantity, 'Replacement' AS purpose, a.time_of_purchase,
                    ra.req_app_id, ra.user_id AS approved_by_user_id, ra.req_status
                  FROM request_approve ra 
                  JOIN replacement a ON a.rep_id = ra.req_id 
                  JOIN item i ON a.item_id = i.item_id 
                  JOIN user u ON a.user_id = u.user_id 
                  JOIN branch b ON u.branch_id = b.branch_id 
                  AND b.branch_id = ?; `;
              
                const result = await sequelize.query(pendingRequestsQuery, {
                  replacements: [branch_id, branch_id],
                  type: sequelize.QueryTypes.SELECT,
                });
            
                res.status(200).send({
                  result,
                });
            }catch (error) {
              console.error(error);
              res.status(500).send({
                message: error,
              });
            }
        } catch (error) {
        console.error(error);
        res.status(500).send({
            message: error
        });
        }
    }

    export const ApproveRequstes = async (req, res) => {
        try {
              const tokenvalidate = validateToken(req.headers,position);
              const valid = tokenvalidate.split('.')[0];
              const status = tokenvalidate.split('.')[1];
              const message = tokenvalidate.split('.')[2];
              if(valid !== "true"){
                res.status(status).json({ error: message });
return;
              }
              if (req.body.user_id == null || req.body.requestId == null) {
                res.status(400).json({message: "Prameter missing"});
return;
              }
                const requestId = req.body.requestId;
                const man_id = req.body.user_id;
                const router = 'Approve';

                if (!requestId || !man_id || !router) {
                  return res.json({
                    user: {},
                    error: '400',
                    message: 'Invalide Input',
                  });
                }

              const result = await RequestApprove.update({
                  user_id: man_id,
                  req_status: router,
                },
                {
                  where: {
                    req_app_id: requestId,
                  },
                });
              if (result[0] > 0) {
                res.status(200).json({
                  error: '200',
                  message: 'Approve Successfully',
                });
              }
              else{
                res.status(400).json({
                  error: '400',
                  message: 'Approve UnSuccessfully',
                });
            }
          } catch (err) {
            res.json(err);
          }
    }

    export const RejectRequests = async (req, res) => {
      try {
            const tokenvalidate = validateToken(req.headers,position);
            const valid = tokenvalidate.split('.')[0];
            const status = tokenvalidate.split('.')[1];
            const message = tokenvalidate.split('.')[2];
            if(valid !== "true"){
              res.status(status).json({ error: message });
return;
            }
            if (req.body.requestId == null || req.body.user_id == null) {
              res.status(400).json({message: "Prameter missing"});
return;
            }

            const requestId = req.body.requestId;
            const man_id = req.body.user_id;
            const router = "Reject";
            if (!requestId || !man_id || !router) {
              return res.status(400).json({
                user: {},
                error: '400',
                message: 'Invalide Input',
              });
            }
            const result = await RequestApprove.update(
              { user_id: man_id, req_status: router },
              { where: { req_app_id: requestId } }
            );

            if (result[0] > 0) {
              res.status(200).json({
                error: "200",
                message: "Reject Successfully",
              });
            } else {
              res.status(404).json({
                error: "404",
                message: "Request not found",
              });
        }
      } catch (err) {
        res.json(err);
      }
    }