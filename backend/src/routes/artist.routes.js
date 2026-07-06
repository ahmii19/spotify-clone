import { Router } from 'express';
import { getArtists, getArtist, createArtist, updateArtist, deleteArtist } from '../controllers/artist.controller.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createArtistValidator, updateArtistValidator } from '../validators/artist.validator.js';
import { upload } from '../config/multer.js';

const router = Router();

router.get('/', getArtists);
router.get('/:id', getArtist);
router.post('/', protect, authorize('admin'), upload.single('image'), createArtistValidator, validate, createArtist);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateArtistValidator, validate, updateArtist);
router.delete('/:id', protect, authorize('admin'), deleteArtist);

export default router;
