import {Router} from 'express';
import { approveRequest, requests, waitingReequest } from '../controller/Assistant.controller.js';
import verifyToken from '../verifyToken.js';
import { sanitizeRequestData } from '../controller/RemoveSpecialCharacters.js';

const router = Router();

  router.post('/request',verifyToken,sanitizeRequestData,requests);

  router.get('/requests/:user_id',verifyToken,sanitizeRequestData,approveRequest);
  
  router.get('/waiting-requests/:user_id',verifyToken,sanitizeRequestData,waitingReequest);

export default router;