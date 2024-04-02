import {
  createRequest,
  deleteRequest,
  getAll,
  getAllTo,
  getOne,
  getReq,
} from '@/controllers/request';
import { Router } from 'express';

const router = Router();

router.post('/create', createRequest);
router.post('/delete', deleteRequest);

router.get('/all/:id', getAll);
router.get('/to/:id', getAllTo);

router.post('/one', getOne);
router.post('/single', getReq);

export default router;
