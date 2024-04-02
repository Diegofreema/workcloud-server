import { getOne } from '@/controllers/request';
import {
  assignWorkspace,
  createWorkspace,
  deleteWorkspace,
  getAllWorkspaces,
  getPersonal,
} from '@/controllers/workspace';
import { Router } from 'express';

const router = Router();

router.post('/create', createWorkspace);
router.post('/delete', deleteWorkspace);

router.get('/all/:id', getPersonal);
router.get('/all', getAllWorkspaces);
router.post('/assign', assignWorkspace);

router.get('/:id', getOne);

export default router;
