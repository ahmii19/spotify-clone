import { Router } from 'express';
import { likeSong, unlikeSong, getLikedSongs, checkLiked } from '../controllers/like.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getLikedSongs);
router.post('/', protect, likeSong);
router.delete('/:songId', protect, unlikeSong);
router.get('/:songId/check', protect, checkLiked);

export default router;
