import {Router} from 'express';
import multer from "multer";
import { BidRegister, FinancialForm, GetBidPdf, MyDocument, Mytenders, 
    SetFinancial, TenderNews, uploadsTechnical } from '../controller/Supplier.controller.js';
import verifyToken from '../verifyToken.js';
import {sanitizeRequestData} from '../controller/RemoveSpecialCharacters.js';

const router = Router();

const upload = multer({dest: "./uploads/"});

router.get("/tendernews",verifyToken,sanitizeRequestData,TenderNews);

router.get("/mydocument/:bid_id",verifyToken,sanitizeRequestData,MyDocument);

router.post("/tendernews/register",verifyToken,sanitizeRequestData,BidRegister);

router.get("/mytender/:sup_id",verifyToken,sanitizeRequestData,Mytenders);

router.get("/mytender/financialform/:bid_id",verifyToken,sanitizeRequestData,FinancialForm);

router.post("/mytender/technicalform",upload.single("file"),verifyToken,sanitizeRequestData,uploadsTechnical)

router.post("/mytender/financialform",verifyToken,sanitizeRequestData,SetFinancial);

router.post("/mytender/financialform/:sup_id",verifyToken,sanitizeRequestData,SetFinancial);

router.get("/bid-download/:bid_upload_date/:bid_file",verifyToken,sanitizeRequestData,GetBidPdf);

export default router;