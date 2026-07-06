import { Router } from 'express';
import { getAlbums, getAlbum, createAlbum, updateAlbum, deleteAlbum } from '../controllers/album.controller.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createAlbumValidator, updateAlbumValidator } from '../validators/album.validator.js';
import { upload } from '../config/multer.js';

const router = Router();

router.get('/', getAlbums);
router.get('/:id', getAlbum);
router.post('/', protect, authorize('admin'), upload.single('coverImage'), createAlbumValidator, validate, createAlbum);
router.put('/:id', protect, authorize('admin'), upload.single('coverImage'), updateAlbumValidator, validate, updateAlbum);
router.delete('/:id', protect, authorize('admin'), deleteAlbum);

export default router;
