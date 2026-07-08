import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && /^Bearer\s/i.test(authHeader)) {
      token = authHeader.split(' ')[1];
    }
    if (!token) {
      console.warn('[AUTH] Token Missing. Path:', req.originalUrl, 'Header present:', !!authHeader);
      return res.status(401).json({ success: false, message: 'Token Missing' });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.warn('[AUTH] JWT verify failed:', jwtError.name, jwtError.message, 'Path:', req.originalUrl);
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token Expired' });
      }
      if (jwtError.name === 'JsonWebTokenError') {
        if (jwtError.message.includes('malformed') || jwtError.message.includes('invalid')) {
          return res.status(401).json({ success: false, message: 'Invalid JWT Format' });
        }
        return res.status(401).json({ success: false, message: 'Invalid Signature' });
      }
      if (jwtError.name === 'NotBeforeError') {
        return res.status(401).json({ success: false, message: 'Token not active yet' });
      }
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    req.user = await User.findById(decoded.id).select('-password -refreshToken');
    if (!req.user) {
      console.warn('[AUTH] User not found for id:', decoded.id, 'Path:', req.originalUrl);
      return res.status(401).json({ success: false, message: 'Unauthorized - User not found' });
    }
    if (req.user.isBlocked) {
      console.warn('[AUTH] Blocked user attempted access:', decoded.id, 'Path:', req.originalUrl);
      return res.status(403).json({ success: false, message: 'Unauthorized - Account is blocked' });
    }
    next();
  } catch (error) {
    console.error('[AUTH] Unexpected error:', error.message, 'Path:', req.originalUrl);
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const isAdminRoute = roles.includes('admin');
      const message = isAdminRoute ? 'Admin Access Required' : 'Not authorized for this action';
      return res.status(403).json({ success: false, message });
    }
    next();
  };
};
