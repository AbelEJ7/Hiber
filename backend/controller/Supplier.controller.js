import mime from 'mime-types';
import fs from 'fs';
import FinanceDetail from '../model/supplier/financial_detail.model.js';
import TechnicalDocment from '../model/supplier/technical_detail.model.js';
import sequelize from '../connection/database.js';
import Bidreg from '../model/supplier/bid_participant.model.js';
import path from 'path';
import { fileURLToPath } from 'url';

const position = "supplier";
  export const TenderNews = async(req,res)=>{
    try {
          const tokenvalidate = validateToken(req.headers,position);
          const valid = tokenvalidate.split('.')[0];
          const status = tokenvalidate.split('.')[1];
          const message = tokenvalidate.split('.')[2];
          if(!valid){
            res.status(status).json({ error: message });
          }
          const tendernews = `SELECT b.bid_title,b.bid_id,b.bid_file,b.bid_price as price,b.date FROM bid b WHERE b.bid_done = 0 AND b.publish = 1`;
          const result= await sequelize.query(tendernews, {
          type: sequelize.QueryTypes.SELECT
        });
        res.status(200).send(result);
    } catch (error) {
      console.log("🚀 ~ file: Supplier.controller.js:25 ~ TenderNews ~ error:", error)
      res.status(400).send({
        message: "Error occurred while fetching proposals"
      });
    }
  }

  export const BidRegister = async(req,res)=>{
    try { 
          const tokenvalidate = validateToken(req.headers,position);
          const valid = tokenvalidate.split('.')[0];
          const status = tokenvalidate.split('.')[1];
          const message = tokenvalidate.split('.')[2];
          if(!valid){
            res.status(status).json({ error: message });
          }
          if (req.body.sup_id === null || req.body.bid_id == null) {
            res.status(400).json({message: "Prameter missing"})
          }
          const {sup_id,bid_id} = req.body;
          const bidreg = {
            sup_id,
            bid_id,
            date: new Date(),
          };
          const newTask = await Bidreg.create(bidreg)
          if(newTask){
            res.status(200).json({"message": "Register Success"});
          }
    } catch (error) {
      console.log("🚀 ~ file: Supplier.controller.js:55 ~ BidRegister ~ error:", error)
      res.status(400).json({
        "error": error.message
      })
    }
  }

  export const Mytenders = async(req,res)=>{
    try {
            const tokenvalidate = validateToken(req.headers,position);
            const valid = tokenvalidate.split('.')[0];
            const status = tokenvalidate.split('.')[1];
            const message = tokenvalidate.split('.')[2];
            if(!valid){
              res.status(status).json({ error: message });
            }
            if (req.params.sup_id === null) {
              res.status(400).json({message: "Prameter missing"})
            }
            const sup_id = req.params.sup_id;
            const mytender = `SELECT bp.bid_participate_id,b.date,b.bid_id,bid_done,b.deadline_date,b.bid_file,b.bid_title FROM bid_participants bp
                          LEFT JOIN bid b on b.bid_id = bp.bid_id WHERE bp.sup_id = :sup_id`;
        
            const result= await sequelize.query(mytender,{
              replacements: { sup_id: sup_id },
              type: sequelize.QueryTypes.SELECT
            });
            res.status(200).send(result);
    } catch (error) {
      console.log("🚀 ~ file: Supplier.controller.js:83 ~ Mytenders ~ error:", error)
      res.status(400).send({
        message: "Error occurred while fetching proposals"
      });
    }
  }

  export const FinancialForm = async(req,res)=>{
   
    try { 
            const tokenvalidate = validateToken(req.headers,position);
            const valid = tokenvalidate.split('.')[0];
            const status = tokenvalidate.split('.')[1];
            const message = tokenvalidate.split('.')[2];
            if(!valid){
              res.status(status).json({ error: message });
            }
            if (req.params.bid_id === null) {
              res.status(400).json({message: "Prameter missing"})
            }
            const bid_id = req.params.bid_id;
            const financialForm = `SELECT bi.*,i.item_name FROM bid_items bi LEFT JOIN item i
                            ON i.item_id = bi.item_id WHERE bid_id = :bid_id`;
     
            const result= await sequelize.query(financialForm, {
              replacements: { bid_id: bid_id },
              type: sequelize.QueryTypes.SELECT
            });
            res.status(200).send(result);
    } catch (error) {
      console.log("🚀 ~ file: Supplier.controller.js:113 ~ FinancialForm ~ error:", error)
      res.status(400).send({
        message: "Error occurred while fetching proposals"
      });
    }
  }

  export const MyDocument = async(req,res)=>{
    try {
          const tokenvalidate = validateToken(req.headers,position);
          const valid = tokenvalidate.split('.')[0];
          const status = tokenvalidate.split('.')[1];
          const message = tokenvalidate.split('.')[2];
          if(!valid){
            res.status(status).json({ error: message });
          }
          if (req.params.bid_id === null) {
            res.status(400).json({message: "Prameter missing"})
          }
          const bid_id = req.params.bid_id;
          const myDocument = `select *from bid where bid_id = :bid_id`;
          const result= await sequelize.query(myDocument, {
            replacements: { bid_id: bid_id },
            type: sequelize.QueryTypes.SELECT
          });
          res.status(200).send(result);
    } catch (error) {
      console.log("🚀 ~ file: Supplier.controller.js:140 ~ MyDocument ~ error:", error)
      res.status(500).send({
        message: "Error occurred while fetching proposals"
      });
    }
  }

  export const uploadsTechnical = async (req, res) => {
    try {
          const tokenvalidate = validateToken(req.headers,position);
          const valid = tokenvalidate.split('.')[0];
          const status = tokenvalidate.split('.')[1];
          const message = tokenvalidate.split('.')[2];
          if(!valid){
            res.status(status).json({ error: message });
          }
          if (req.body.file === null) {
            res.status(400).json({message: "Prameter missing"})
          }
          const { bid_participate_id, username } = req.body;
          const file = req.file;
          const size = file.size;
          console.log("🚀 ~ file: Supplier.controller.js:163 ~ uploadsTechnical ~ size:", size)
          const fileType = mime.extension(file.mimetype);
          if (fileType !== 'pdf') {
            throw new Error('Only PDF files are allowed.');
          }
      
          const oldname = file.filename;
          const newname = file.originalname;
          const timestamp = Date.now();
          const uniqueFilename = `${newname}_${timestamp}`;
          const userUploadsPath = path.join('./uploads', username);
          const uploadPath = path.join(userUploadsPath, newname);
      
          const techparams = {
            bid_participate_id,
            file_name: uniqueFilename, // Add file_name value
            file_type: fileType, // Add file_type value
            date: new Date(),
          };
      
          try {
                const newFile = await TechnicalDocment.create(techparams);
                if (newFile) {
                  // Create the user's uploads folder if it doesn't exist
                  if (!fs.existsSync(userUploadsPath)) {
                    fs.mkdirSync(userUploadsPath, { recursive: true });
                  }
          
                  fs.rename(`./uploads/${oldname}`, uploadPath, (err) => {
                    if (err) {
                      throw err;
                    } else {
                      res.status(200).json({
                        error: '200',
                        message: 'upload success',
                      });
                    }
                  });
                }
          } catch (error) {
            console.log("🚀 ~ file: Supplier.controller.js:203 ~ uploadsTechnical ~ error:", error)
            throw new Error(error.message);
          }
    } catch (error) {
      console.log("🚀 ~ file: Supplier.controller.js:207 ~ uploadsTechnical ~ error:", error)
      res.status(400).json({
        error: error.message,
      });
    }
  };
  
  export const SetFinancial = async (req, res) => {
      try {
              const tokenvalidate = validateToken(req.headers,position);
              const valid = tokenvalidate.split('.')[0];
              const status = tokenvalidate.split('.')[1];
              const message = tokenvalidate.split('.')[2];
              if(!valid){
                res.status(status).json({ error: message });
              }
              if (req.body.price === null || req.body.bid_participate_id == null ||
                  req.body.bid_item_id == null) {
                res.status(400).json({message: "Prameter missing"})
              }
              const financialDetails = req.body; 
              const tasks = await Promise.all(
              financialDetails.map(async (detail) => {
                const { bid_item_id, bid_participate_id, price } = detail;
                const financeParam = {
                  bid_participate_id,
                  bid_item_id,
                  price,
                  date: new Date(),
                };
                return await FinanceDetail.create(financeParam);
              })
            );
            res.status(200).json({ message: "Financial posts success", tasks });
      } catch (error) {
        console.log("🚀 ~ file: Supplier.controller.js:243 ~ SetFinancial ~ error:", error)
        res.status(400).json({ error: error.message });
      }
    };

  export const GetBidPdf = async (req, res) => {
    try {
            const tokenvalidate = validateToken(req.headers,"manager");
            const valid = tokenvalidate.split('.')[0];
            const status = tokenvalidate.split('.')[1];
            const message = tokenvalidate.split('.')[2];
            if(!valid){
              res.status(status).json({ error: message });
            }
            if (req.params.bid_file === null) {
              res.status(400).json({message: "Prameter missing"})
            }
            const {bid_file} = req.params;
            const __filename = fileURLToPath(import.meta.url);
            const pdfFilePath = path.resolve(__filename, `../../uploads/bids/${bid_file}.pdf`)
            // Check if the file exists
            if (!fs.existsSync(pdfFilePath)) {
              return res.status(404).send('File not found');
            }
            const filecontent = fs.readFileSync(pdfFilePath);
            res.status(200).json(filecontent)
    } catch (err) {
      console.log("🚀 ~ file: Supplier.controller.js:264 ~ GetBidPdf ~ err:", err)
      res.status(400).send('Internal server error.');
    }
  };
    