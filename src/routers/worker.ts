import {
  createWorker,
  deleteProfile,
  getAll,
  getMyWorkers,
  getProfile,
  updateProfile,
} from '@/controllers/worker';
import { Router } from 'express';

const router = Router();

router.post('/create', createWorker);
router.post('/update', updateProfile);
router.post('/delete', deleteProfile);
router.get('/all/:id', getAll);
router.get('/profile/:id', getProfile);
router.get('/my-workers/:id', getMyWorkers);

export default router;
