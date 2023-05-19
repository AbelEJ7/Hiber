import express from 'express'
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet'
import morgan from "morgan";
//route
import clientRoutes from './routes/client.js';
import generalRoutes from './routes/general.js';
import managmentRoutes from './routes/managment.js';

// data 
import User from './models/user.model.js';
import Product from './models/product.model.js';
import ProductStat from './models/productStat.model.js';
import Transaction from './models/Transaction.model.js';
import {dataUser, dataProduct,dataProductStat,dataTransaction} from "./data/data.js"

// config 
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin'}));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

// Routes 

app.use('/client',clientRoutes);
app.use('/general', generalRoutes);
app.use('/managment',managmentRoutes);

// mongoose
const PORT = process.env.PORT || 9000;
mongoose
.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() =>{
    app.listen(PORT,() => console.log(`Server Port: ${PORT}`));
    // ONLT ADD ONE TIMe le inject becha
    // Product.insertMany(dataProduct);
    // ProductStat.insertMany(dataProductStat);
    // Transaction.insertMany(dataTransaction);
}).catch((error) =>console.log(`${error} di not connect`));

