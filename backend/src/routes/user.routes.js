import { Router } from 'express';
import { getUsers, getUser, updateUser, deleteUser, updateProfile, changePassword, toggleBlockUser } from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { changePasswordValidator } from '../validators/auth.validator.js';

const router = Router();

router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, getUser);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.put('/:id/block', protect, authorize('admin'), toggleBlockUser);

router.put('/profile/me', protect, updateProfile);
router.put('/password/me', protect, changePasswordValidator, validate, changePassword);

export default router;
