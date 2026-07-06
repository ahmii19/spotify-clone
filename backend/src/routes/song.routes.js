import { Router } from 'express';
import { getSongs, getSong, createSong, updateSong, deleteSong } from '../controllers/song.controller.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createSongValidator, updateSongValidator } from '../validators/song.validator.js';
import { upload } from '../config/multer.js';

const router = Router();

router.get('/', getSongs);
router.get('/:id', getSong);

router.post('/', protect, authorize('admin'), upload.single('audio'), createSongValidator, validate, createSong);
router.put('/:id', protect, authorize('admin'), upload.single('audio'), updateSongValidator, validate, updateSong);
router.delete('/:id', protect, authorize('admin'), deleteSong);

export default router;
