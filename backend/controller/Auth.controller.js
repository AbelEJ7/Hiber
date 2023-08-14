import { Supplier, User} from '../model/Auth/Auth.model.js';
import  jwt  from "jsonwebtoken";
import path from "path";
import { expressjwt } from "express-jwt";
import md5 from "md5";
import dotenv from 'dotenv';
import sequelize from '../connection/database.js';
import fs from 'fs'

dotenv.config({path: 'connections.env'});
const secret =process.env.ACCESS_TOKEN_SECRET;
const protect= expressjwt({ secret: secret?process.env.ACCESS_TOKEN_SECRET:"akdjflkadajsfkdjsfkladsjlfkjdalskfjaklds",algorithms: ['HS256'] });

export const AuthRegister = async (req, res) => {
  try {
    // Get input from user
    console.log(req.body);
    const { First_Name, Last_Name, position, branch_id, username, 
      password, tin_number, spec, email } = req.body;
    if (req.body == null) {
      return;
    }
    const hashedPassword = md5(password);

    console.log("Files: ", req.body);
    let registerParams;
    let model;

    registerParams = {
      First_Name,
      Last_Name,
      email,
      tin_number,
      username,
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
    } 
    const newUser = await model.create(registerParams);

    if (newUser) {
      const userDir = path.join('uploads', username);
      if (position === 'supplier') {
        createFolder(userDir, res);
      } else {
        res.status(200).json({
          error: '200',
          message: 'Registration Successful',
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(200).json({
      error: '400',
      message: err.message,
    });
  }
};

const createFolder = (userDir,res)=>{
  if (fs.existsSync(userDir)) {
    console.log('Folder Already Exists');
    } else {
    fs.mkdir(userDir, (err) => {
        if (err) {
        console.error('Error While Creating Folder', err);
        res.json({
            error: '500',
            message: 'Internal Server Error',
        });
        } else {
        console.log('Folder Created Successfully');
        res.status(200).json({
            error: '200',
            message: 'Registration Successful',
        });
        }
    });
    }
}

export const AuthLogin = async (req, res) => {
    try {
      const { username } = req.body;
      const password = md5(req.body.password);
  
      if (!username || !password) {
        return res.json({
          user: {},
          error: '400',
          message: 'Empty credentials',
        });
      }
  
      const user = await sequelize.query(
        `SELECT user_id,position,username,First_Name,b.branch_id,Branch_Name FROM user u LEFT JOIN branch b 
        ON b.Branch_id = u.branch_id WHERE username = :username and password = :password`,
        {
          replacements: { username: username, password: password },
          type: sequelize.QueryTypes.SELECT,
        }
      );
  
      if (user.length > 0) {
        const userData = user[0];
        const token = jwt.sign(
          {
            user_id: userData.user_id,
            username: userData.username,
            position: userData.position,
          },
          secret,
          { expiresIn: '30min', algorithm: 'HS256' }
        );
  
        res.status(200).json({
          ...userData,
          error: '200',
          message: 'Login Success',
          token,
        });
        console.log('Login Success');
        return;
      } 
        const supplier = await sequelize.query(
          `SELECT supplier_id,First_Name,Last_Name,email,username from supplier WHERE 
          username = :username and password = :password`,
          {
            replacements: { username: username, password: password },
            type: sequelize.QueryTypes.SELECT,
          }
        );

          if(supplier.length>0){
            const userData = supplier[0];
            const token = jwt.sign(
              {
                user_id: userData.supplier_id,
                First_Name: userData.First_Name,
                Last_Name: userData.Last_Name,
                username: userData.username,
                position: "supplier",
              },
              secret,
              { expiresIn: '30min', algorithm: 'HS256' }
            );
      
            res.json({
              ...userData,
              position: "supplier",
              error: '200',
              message: 'Login Success',
              token,
            });
            console.log('Login Success');
          }else{
             res.json({
                error: '400',
                message: 'Login Error',
              });
          }
       
    } catch (error) {
      console.log('error: ', error);
      res.status(500).json({
        error: '500',
        message: 'Internal Server Error',
      });
    }
  };
  

