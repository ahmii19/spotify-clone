import { Router } from 'express';
import {
  getPlaylists, getAllPlaylists, getPlaylist, createPlaylist, updatePlaylist, deletePlaylist,
  addSongToPlaylist, removeSongFromPlaylist,
} from '../controllers/playlist.controller.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createPlaylistValidator, updatePlaylistValidator } from '../validators/playlist.validator.js';

const router = Router();

router.get('/', protect, getPlaylists);
router.get('/all', protect, authorize('admin'), getAllPlaylists);
router.get('/:id', protect, getPlaylist);
router.post('/', protect, createPlaylistValidator, validate, createPlaylist);
router.put('/:id', protect, updatePlaylistValidator, validate, updatePlaylist);
router.delete('/:id', protect, deletePlaylist);
router.post('/:id/songs', protect, addSongToPlaylist);
router.delete('/:id/songs', protect, removeSongFromPlaylist);

export default router;
