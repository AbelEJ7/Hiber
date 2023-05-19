import express from 'express';
import { getProducts, getCustomers, getTransactions } from '../controllers/client.controller.js';
import { authenticateUser } from '../controllers/Auth.controller.js';

const clientRoutes = express.Router();
clientRoutes.get('/products', getProducts);
clientRoutes.get('/customers', getCustomers);
clientRoutes.get('/transactions', getTransactions);
clientRoutes.post('/login', authenticateUser);

export default clientRoutes;