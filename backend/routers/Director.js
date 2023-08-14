import {Router} from 'express';
import {  ApprovedProposal, CatagoryStatus, SetTasks, getEmployees, getnoneFiltered, proposalCatagroy } from '../controller/Director.controller.js';
import verifyToken from '../verifyToken.js';
import {sanitizeRequestData} from '../controller/RemoveSpecialCharacters.js'
const router = Router();

  router.get('/nonfilterd',verifyToken,sanitizeRequestData,getnoneFiltered);
  router.get('/approved/proposal',verifyToken,sanitizeRequestData,ApprovedProposal);
  router.post('/settasks',verifyToken,sanitizeRequestData,SetTasks);
  router.get('/marketofficer',verifyToken,sanitizeRequestData,getEmployees);
  router.get('/tasks/:prop_id',verifyToken,sanitizeRequestData,CatagoryStatus);
  router.get('/proposal/catagory/:selectecdProposalId',verifyToken,sanitizeRequestData,proposalCatagroy);

  export default router;


 // All catagories by prop id

  // SELECT cata_Name,cat_id,SUM(tot) as total
  //                       FROM (
  //                           SELECT c.cata_Name,c.cat_id,(i.price*ar.quantity) as tot
  //                           FROM proposal p
  //                           LEFT JOIN filter_needs fn ON YEAR(fn.Date) = YEAR(p.date)
  //                           LEFT JOIN request_approve ra ON fn.filter_req_app = ra.req_app_id
  //                           LEFT JOIN additional_request ar ON ar.add_id = ra.req_id
  //                           LEFT JOIN item i ON i.item_id = ar.item_id
  //                           LEFT JOIN catagory c ON c.cat_id = i.cat_id
  //                           WHERE p.prop_id AND c.cata_Name IS NOT NULL
                            
  //                           UNION ALL
                        
  //                           SELECT c.cata_Name,c.cat_id,(i.price*rp.quantity) as tot
  //                           FROM proposal p
  //                           LEFT JOIN filter_needs fn ON YEAR(fn.Date) = YEAR(p.date)
  //                           LEFT JOIN request_approve ra ON fn.filter_req_app = ra.req_app_id
  //                           LEFT JOIN replacement rp ON rp.rep_id = ra.req_id
  //                           LEFT JOIN item i ON i.item_id = rp.item_id
  //                           LEFT JOIN catagory c ON c.cat_id = i.cat_id
  //                           WHERE p.prop_id AND c.cata_Name IS NOT NULL

  //                       ) AS subquery
  //                       GROUP BY subquery.cata_Name




  //Get Assigned tasks
  // SELECT cata_Name,cat_id,SUM(tot) as total,task_id
  //                       FROM (
  //                           SELECT t.task_id,c.cata_Name,c.cat_id,(i.price*ar.quantity) as tot
  //                           FROM proposal p
  //                           LEFT JOIN filter_needs fn ON YEAR(fn.Date) = YEAR(p.date)
  //                           LEFT JOIN request_approve ra ON fn.filter_req_app = ra.req_app_id
  //                           LEFT JOIN additional_request ar ON ar.add_id = ra.req_id
  //                           LEFT JOIN item i ON i.item_id = ar.item_id
  //                           LEFT JOIN catagory c ON c.cat_id = i.cat_id
  //                           LEFT JOIN task t ON t.cat_id = c.cat_id
  //                           WHERE p.prop_id =36 AND t.cat_id IS NOT NULL
                            
  //                           UNION ALL
                        
  //                           SELECT t.task_id,c.cata_Name,c.cat_id,(i.price*rp.quantity) as tot
  //                           FROM proposal p
  //                           LEFT JOIN filter_needs fn ON YEAR(fn.Date) = YEAR(p.date)
  //                           LEFT JOIN request_approve ra ON fn.filter_req_app = ra.req_app_id
  //                           LEFT JOIN replacement rp ON rp.rep_id = ra.req_id
  //                           LEFT JOIN item i ON i.item_id = rp.item_id
  //                           LEFT JOIN catagory c ON c.cat_id = i.cat_id
  //                           LEFT JOIN task t ON t.cat_id = c.cat_id
  //                           WHERE p.prop_id =36 AND t.cat_id IS NOT NULL

  //                       ) AS subquery
  //                       GROUP BY subquery.cata_Name