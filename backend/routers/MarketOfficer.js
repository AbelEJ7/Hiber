import {Router} from 'express';
import { ApprovedProposals, BidInitialize, EvaluateTechnicalDocument, 
        GetBid, 
        GetParticipants,  
        GetTechnicalPdf, 
        ItemDetail, 
        MyTasks, 
        doneTasks, filter_documnet, 
        filterdata, filtered_data, generateProposal, 
        generatedocument, getProposal, getPublished, getWinners, ongoingDetail, quarterPrice, 
        setWinner, 
        setprice, singleTask, taskDetail, technicalDetail, updateBid, updateCatagory, updateItem, uploadBidDocument 
  } from '../controller/MarketOfficer.controller.js';
  import multer from "multer";
  import verifyToken from '../verifyToken.js';
  import {sanitizeRequestData} from '../controller/RemoveSpecialCharacters.js';
  
  const upload = multer({dest: "./uploads/"});  
  const router = Router();


  router.get("/mytasks/:emp_id",verifyToken,sanitizeRequestData,MyTasks);

  router.get("/singletask/:cat_id/:date",singleTask);

  router.get("/mytasks/detail/:cat_id",taskDetail);
  
  router.post("/donetasks",doneTasks);

  router.put("/items/price",setprice);

  router.post("/filterdata", filterdata);
  
  router.get("/filterd-data/:cat_id",filtered_data);

  router.get("/filter-document",filter_documnet);

  router.get("/generated-document",generatedocument);

  router.post("/generateproposal",generateProposal);

  router.get("/proposals",getProposal);

  router.get("/proposalsid",getProposal);

  router.get("/approved-proposals",ApprovedProposals);

  //router.get("/technical-documents",technical_documnets);

  router.post("/procurment/generate",BidInitialize);

  router.get("/tenders/:user_id",GetBid);

  router.post("/uploadbiddoc", upload.single("file"), uploadBidDocument);

  router.put("/updatebid",updateBid);

  router.get("/technicallist/:bid_id",GetParticipants);

  router.get("/technicallist/:bid_id/:sup_id",technicalDetail);

  router.post("/evaluatetechnical",EvaluateTechnicalDocument);

  router.get("/ongoing/:user_id",getPublished);

  router.get("/ongoing/detail/:bid_id",ongoingDetail);

  //winner
  router.post("/winner",setWinner);

  router.get("/winner/:bid_id",getWinners);

  router.get("/winner/item/:bid_id/:item_id",ItemDetail);
  
  router.put("/update-catagory/:cat_id/:cata_Name",updateCatagory);
  
  router.put("/update-item/:item_id/:item_name",updateItem);
  
  router.get("/quarter-price",quarterPrice);

  router.get("/read-technical/:username/:file_names",GetTechnicalPdf);

  
  export default router;