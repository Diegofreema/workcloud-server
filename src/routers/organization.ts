import {
  createOrgs,
  deleteOrganization,
  getOrganization,
  getOrganizations,
  getOtherOrganizations,
  updateOrganization,
} from '@/controllers/organization';
import { Router } from 'express';

const router = Router();

router.post('/create', createOrgs);
router.post('/update', updateOrganization);
router.post('/delete', deleteOrganization);
router.get('/all', getOrganizations);
router.get('/:id', getOrganization);
router.get('/other/:id', getOtherOrganizations);

export default router;
