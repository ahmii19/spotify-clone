import User from '../models/User.js';
import { sendResponse, sendPaginated, sendError } from '../utils/response.js';
import { generateAccessToken } from '../utils/token.js';

export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { search, role, sort } = req.query;

    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (role) filter.role = role;

    let sortOption = { createdAt: -1 };
    if (sort === 'name') sortOption = { name: 1 };
    if (sort === '-name') sortOption = { name: -1 };
    if (sort === 'email') sortOption = { email: 1 };

    const users = await User.find(filter).sort(sortOption).skip(skip).limit(limit);
    const total = await User.countDocuments(filter);

    sendPaginated(res, 200, users, page, limit, total);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, 'User not found');
    sendResponse(res, 200, { user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...(name && { name }), ...(avatar && { avatar }) },
      { new: true, runValidators: true }
    );
    if (!user) return sendError(res, 404, 'User not found');
    sendResponse(res, 200, { user }, 'User updated');
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return sendError(res, 404, 'User not found');
    sendResponse(res, 200, null, 'User deleted');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...(name && { name }), ...(avatar && { avatar }) },
      { new: true, runValidators: true }
    );
    sendResponse(res, 200, { user }, 'Profile updated');
  } catch (error) {
    next(error);
  }
};

export const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, 'User not found');
    user.isBlocked = !user.isBlocked;
    await user.save();
    sendResponse(res, 200, { user }, user.isBlocked ? 'User blocked' : 'User unblocked');
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return sendError(res, 400, 'Current password is incorrect');
    user.password = newPassword;
    await user.save();
    sendResponse(res, 200, null, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};
