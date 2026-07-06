import { Router } from 'express';
import { addToHistory, getHistory, clearHistory, getRecentlyPlayed } from '../controllers/history.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getHistory);
router.post('/', protect, addToHistory);
router.delete('/', protect, clearHistory);
router.get('/recently-played', protect, getRecentlyPlayed);

export default router;
