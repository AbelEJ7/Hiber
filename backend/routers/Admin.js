import {Router} from 'express';
import {waitingReequest } from '../controller/Assistant.controller.js';
import {AddBranch, ApproveSupplier, Districts, Employee, Suppliers, addEmployee} from '../controller/Admin.controller.js';
import { branch } from '../controller/general.conntroller.js';
import verifyToken from '../verifyToken.js'
import { sanitizeRequestData } from '../controller/RemoveSpecialCharacters.js';

const router = Router();

  router.post('/addbranch',verifyToken,sanitizeRequestData,AddBranch);

  router.get('/employee',verifyToken,sanitizeRequestData,Employee);
  router.get('/suppliers',verifyToken,sanitizeRequestData,Suppliers);
  router.get('/district',verifyToken,sanitizeRequestData,Districts);
  router.get('/branch',verifyToken,sanitizeRequestData,branch);

  router.post('/addemployee',verifyToken,sanitizeRequestData,addEmployee);
  router.put("/approvesupplier",verifyToken,sanitizeRequestData,ApproveSupplier);
  router.put("/approveemployee",verifyToken,sanitizeRequestData,ApproveSupplier);
  router.get('/waiting-requests/:user_id',verifyToken,sanitizeRequestData,waitingReequest);

export default router;