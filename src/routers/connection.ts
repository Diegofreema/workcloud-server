import { createConnection, getConnections } from '@/controllers/connections';
import { Router } from 'express';

const router = Router();

router.post('/create', createConnection);
router.get('/all/:id', getConnections);

export default router;
