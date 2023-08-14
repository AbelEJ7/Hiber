import {Router} from 'express';
import { pendingRequest,ApproveRequstes,RejectRequests } from '../controller/BranchManager.controller.js';
import verifyToken from '../verifyToken.js';
import { sanitizeRequestData } from '../controller/RemoveSpecialCharacters.js';

  const router = Router();

  router.get('/manrequests/:branch_id',verifyToken,sanitizeRequestData,pendingRequest);
  
  router.put('/requests/approve',verifyToken,sanitizeRequestData,ApproveRequstes);
  
  router.put('/requests/reject',verifyToken,sanitizeRequestData,RejectRequests);

export default router;