import { Supplier, User } from '../model/Auth/Auth.model.js';
import Branch from '../model/General/Branch.model.js'
import md5 from "md5";
import path from "path";
import nodemailer from 'nodemailer'
import sequelize from '../connection/database.js';
import { validateToken } from './TokenValidator.js';

  export const AddBranch = async (req, res, next) => {
      try {
            const tokenvalidate = validateToken(req.headers,"admin");
            const valid = tokenvalidate.split('.')[0];
            const status = tokenvalidate.split('.')[1];
            const message = tokenvalidate.split('.')[2];

            if(!valid){
              res.status(status).json({ error: message });
return;
            }
        
              if(req.body.Branch_Name == null || req.body.District_id == null ){
                res.status(400).json({message: "Prameter missing"});
return;
              }
              const {Branch_Name,District_id} = req.body;
                const branch = {
                  Branch_Name,
                  District_id
                };

              const newbranch = await Branch.create(branch);
              if(newbranch){
                  res.status(200).json({
                      message: `Branch Add Success`,
                      error: "200",
                    });
              }
      } catch (error) {
        console.log("🚀 ~ file: Admin.controller.js:37 ~ AddBranch ~ error:", error)
        next(error);
        res.status(401).json({
          message: "Error occurred while creating the request",
        });
      }
  };

  //THIS ROUTE MAKE BRANCH ADD AGAIN INSTEAD OF ADD DISTRICT CUZ DISTRICT IS NOT INSERTED
  export const AddDistrict = async (req, res, next) => {
      try {

            const tokenvalidate = validateToken(req.headers,"admin");
            const valid = tokenvalidate.split('.')[0];
            const status = tokenvalidate.split('.')[1];
            const message = tokenvalidate.split('.')[2];

            if(!valid){
              res.status(status).json({ error: message });
return;
            }

              if(req.body ==null){
                res.status(400).json({message: "Prameter missing"});
return;
              }
              const {Branch_Name,District_id} = req.body;
                const branch = {
                  Branch_Name,
                  District_id
                };
              const newbranch = await Branch.create(branch);
              if(newbranch){
                  res.status(200).json({
                      message: `Branch Add Success`,
                      error: "200",
                    });
              }
      } catch (error) {
        console.log("🚀 ~ file: Admin.controller.js:72 ~ AddDistrict ~ error:", error)
        next(error);
        res.status(401).json({
          message: "Error occurred while creating the request",
        });
      }
  };

  export const Employee = async (req, res) => {
      try {
            const tokenvalidate = validateToken(req.headers,"admin");
            const valid = tokenvalidate.split('.')[0];
            const status = tokenvalidate.split('.')[1];
            const message = tokenvalidate.split('.')[2];
            if(!valid){
              res.status(status).json({ error: message });
return;
            }
            const emps = `SELECT * from user`;
            const result= await sequelize.query(emps,{type: sequelize.QueryTypes.SELECT});
            res.status(200).send(result);
      } catch (error) {
        console.log("🚀 ~ file: Admin.controller.js:92 ~ Employee ~ error:", error)
        res.status(400).send({
          message: "Error occurred while fetching Employee "+error
        });
      }
  };

  export const Districts = async (req, res) => {
    try {
          const tokenvalidate = validateToken(req.headers,"admin");
          const valid = tokenvalidate.split('.')[0];
          const status = tokenvalidate.split('.')[1];
          const message = tokenvalidate.split('.')[2];
          if(!valid){
            res.status(status).json({ error: message });
return;
          }
        const discrict = `SELECT * from district`;
        const result= await sequelize.query(discrict,{type: sequelize.QueryTypes.SELECT});
        res.status(200).send(result);
    } catch (error) {
      console.log("🚀 ~ file: Admin.controller.js:112 ~ Districts ~ error:", error)
      res.status(400).send({
        message: "Error occurred while fetching District "+error
      });
    }
  };
//WHILE ADDDING EMPLOYEE SPEC OR SPECIALIZATION IS NOT MENTION SO THINK ABOUT IT WHEN YOU FINALIZING USING CLINET PART
  export const addEmployee = async (req, res, next) => {
      try {
            const tokenvalidate = validateToken(req.headers,"admin");
            const valid = tokenvalidate.split('.')[0];
            const status = tokenvalidate.split('.')[1];
            const message = tokenvalidate.split('.')[2];

            if(!valid){
              res.status(status).json({ error: message });
return;
            };

          if (req.body.First_Name == null || req.body.Last_Name == null || 
              req.body.position == null || req.body.branch_id == null || 
              req.body.username == null || req.body.tin_number == null || 
              req.body.email == null) {
              res.status(400).json({message: "Prameter missing"});
return;
            }
          const { First_Name, Last_Name, position, branch_id, username, 
            password, tin_number, spec, email } = req.body;
          
          const hashedPassword = md5(password);
          let registerParams;
          let model;
          registerParams = {
            First_Name,
            Last_Name,
            email,
            tin_number,
            username,
            email,
            password: hashedPassword,
          };
      
          if (position === 'supplier') {
            registerParams = {
              First_Name,
              Last_Name,
              position,
              email,
              tin_number,
              username,
              password: hashedPassword,
            };
            model = Supplier;
          } else if (position === 'concerned_dep') {
            // Handle concerned_dep registration logic if needed
          } else {
            registerParams = {
              First_Name,
              Last_Name,
              position,
              branch_id: branch_id,
              username,
              email,
              password: hashedPassword,
            };
            model = User;
          }
      
          const newUser = await model.create(registerParams);
      
          if (newUser) {
            const userDir = path.join('uploads', username);
      
            if (position === 'supplier') {
              createFolder(userDir, res);
            } else {
              SendPassword(email,password,username)
              res.status(200).json({
                error: '200',
                message: 'Employee Add Successful',
              });
            }
          }
        } catch (err) {
          console.log("🚀 ~ file: Admin.controller.js:190 ~ addEmployee ~ err:", err)
          res.status(401).json({
            error: '400',
            message: err.message,
          });
        }
  }

  export const ApproveSupplier = async (req, res) => {
    try {
            const tokenvalidate = validateToken(req.headers,"admin");
            const valid = tokenvalidate.split('.')[0];
            const statu = tokenvalidate.split('.')[1];
            const messageS = tokenvalidate.split('.')[2];

            if(!valid){
              res.status(statu).json({ error: messageS });
            };

            if (req.body.sup_id == null || req.body.user_id == null || 
                req.body.status == null) {
                res.status(400).json({message: "Prameter missing"});
return;
              }
          const supid = req.body.sup_id;
          const aproved_by = req.body.user_id;
          const status = req.body.status; // 0 or 1
          let message = "";
          if(status == 1){
            message = "Supplier Activate SuccessFully";
          }else{
            message = "Supplier DeActivate SuccessFully";
          }
          const result = await Supplier.update(
            {
              aproved_by: aproved_by,
              status: status,
            },
            {
              where: {
                supplier_id: supid,
              },
            }
          );

          if (result[0] > 0) {
            res.status(200).json({
              error: '200',
              message: message,
            });
          } else {
            res.status(400).json({
              error: '400',
              message: 'Failed to approve. ',
            });
          }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: '500',
        message: 'Internal server error.',
      });
    }
  };
  //WHILE YOU ARE ACCEPTING THE USER_ID FROM CLIENT TAKE IT AS SUP_ID CUZ IT MAY CONFILCT WITH 
  //USER_ID THAT SEND FOR APPROVED_BY SO 
  export const ApproveEmployee = async (req, res) => {
    try {
          const tokenvalidate = validateToken(req.headers,"admin");
          const valid = tokenvalidate.split('.')[0];
          const statu = tokenvalidate.split('.')[1];
          const messages = tokenvalidate.split('.')[2];
          if(!valid){
            res.status(statu).json({ error: messages });
          }
          if (req.body.sup_id == null || req.body.user_id == null || 
            req.body.status == null) {
            res.status(400).json({message: "Prameter missing"});
return;
          }

          const supid = req.body.sup_id;
          const aproved_by = req.body.user_id;
          const status = req.body.status; // 0 or 1
          let message = "";
          if(status == 1){
            message = "User Activate SuccessFully";
          }else{
            message = "User DeActivate SuccessFully";
          }
          const result = await User.update(
            {
              aproved_by: aproved_by,
              status: status,
            },
            {
              where: {
                user_id: supid,
              },
            }
          );

        if (result[0] > 0) {
          res.status(200).json({
            error: '200',
            message: message,
          });
        } else {
          res.status(400).json({
            error: '400',
            message: 'Failed to approve. ',
          });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({
          error: '500',
          message: 'Internal server error.',
        });
      }
  };

  export const Suppliers = async (req, res) => {
    try {
          const tokenvalidate = validateToken(req.headers,"admin");
          const valid = tokenvalidate.split('.')[0];
          const status = tokenvalidate.split('.')[1];
          const message = tokenvalidate.split('.')[2];
          if(!valid){
            res.status(status).json({ error: message });
return;
          }
          const emps = `SELECT supplier_id,First_Name,Last_Name,username,status from supplier`;
          const result= await sequelize.query(emps,{type: sequelize.QueryTypes.SELECT});
          res.status(200).send(result);
    } catch (error) {
      console.log("🚀 ~ file: Admin.controller.js:305 ~ Suppliers ~ error:", error)
      res.status(400).send({
        message: "Error occurred while fetching Employee "+error
      });
    }
  };
 //SEND EMAIL FOR fINANCIAL WINNER SUPPLIER
  export const SendPassword = async(email,Passoword,username)=>{
      try {
            const tokenvalidate = validateToken(req.headers,"admin");
            const valid = tokenvalidate.split('.')[0];
            const status = tokenvalidate.split('.')[1];
            const message = tokenvalidate.split('.')[2];
            if(!valid){
              res.status(status).json({ error: message });
return;
            }
            const recipient = email;
            const subject = 'Congratulations! You are Registered';
            const messages = " Your UserName Is =>"+username+'  Your Passoword is =>'+Passoword;
            sendEmail(recipient, subject, messages);
      } catch (error) {
        console.log("🚀 ~ file: Admin.controller.js:326 ~ SendPassword ~ error:", error)
      } 
  };

  const sendEmail = async(to,subject,text)=>{

    const tranporter = nodemailer.createTransport({
      service: "gmail",
      auth:{
        user: "leulkahssaye1000@gmail.com",
        pass: "csujqjgvhpcwkvnm"
      }
    });

    const mailOptions = {
      from: "leulkahssaye1000@gmail.com",
      to: to,
      subject: subject,
      text: text
    };

    tranporter.sendMail(mailOptions,(error,info)=>{
        if(error){
          console.log(error);
        }else{
          console.log('Email Sent: '+info.response);
        }
    });
  }