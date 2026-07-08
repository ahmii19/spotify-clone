import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token.js';
import { sendResponse, sendError } from '../utils/response.js';
import { setRefreshTokenCookie, clearRefreshTokenCookie } from '../services/tokenService.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 400, 'Email already registered');
    }
    const user = await User.create({ name, email, password });
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    setRefreshTokenCookie(res, refreshToken);
    sendResponse(res, 201, { user, accessToken }, 'Registration successful');
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, 401, 'Invalid email or password');
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid email or password');
    }
    if (user.isBlocked) {
      return sendError(res, 403, 'Your account has been blocked');
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    setRefreshTokenCookie(res, refreshToken);
    sendResponse(res, 200, { user, accessToken }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }
    clearRefreshTokenCookie(res);
    sendResponse(res, 200, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      console.warn('[REFRESH] No refresh token in cookies. Cookies:', JSON.stringify(req.cookies));
      return sendError(res, 401, 'No refresh token');
    }
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (jwtError) {
      console.error('[REFRESH] JWT verify failed:', jwtError.name, jwtError.message);
      if (jwtError.name === 'TokenExpiredError') {
        return sendError(res, 401, 'Refresh token expired');
      }
      if (jwtError.name === 'JsonWebTokenError') {
        return sendError(res, 401, 'Invalid refresh token signature');
      }
      return sendError(res, 401, 'Invalid refresh token');
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      console.warn('[REFRESH] User not found for id:', decoded.id);
      return sendError(res, 401, 'Invalid refresh token');
    }
    if (user.refreshToken !== refreshToken) {
      console.warn('[REFRESH] Token mismatch. Stored:', user.refreshToken?.slice(0, 20) + '...', 'Received:', refreshToken?.slice(0, 20) + '...');
      return sendError(res, 401, 'Invalid refresh token');
    }
    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshToken = newRefreshToken;
    await user.save();
    setRefreshTokenCookie(res, newRefreshToken);
    console.log('[REFRESH] Token refreshed successfully for user:', user._id.toString());
    sendResponse(res, 200, { accessToken }, 'Token refreshed');
  } catch (error) {
    console.error('[REFRESH] Unexpected error:', error.message);
    return sendError(res, 401, 'Invalid refresh token');
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    sendResponse(res, 200, { user });
  } catch (error) {
    next(error);
  }
};
