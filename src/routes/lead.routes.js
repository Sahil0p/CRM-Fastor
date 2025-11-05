import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import {
  createPublicLead,
  claimLead,
  getUnclaimedLeads,
  getMyLeads
} from '../controllers/lead.controller.js';

const router = Router();

// Public lead creation (no auth)
router.post('/', createPublicLead);

// Protected lead actions
router.get('/unclaimed', auth, getUnclaimedLeads);
router.patch('/:id/claim', auth, claimLead);
router.get('/my', auth, getMyLeads);

export default router;
