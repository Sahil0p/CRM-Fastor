import jwt from 'jsonwebtoken';
import Employee from '../models/Employee.js';
import ApiError from '../utils/ApiError.js';

export const auth = async (req, res, next) => {
  try {
    const hdr = req.headers.authorization || '';
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
    if (!token) throw new ApiError(401, 'Authentication required');

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Employee.findById(payload.id).select('-password');
    if (!user) throw new ApiError(401, 'Invalid token');

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token expired'));
    }
    next(err);
  }
};

export const signToken = (employee) => {
  return jwt.sign(
    { id: employee._id, email: employee.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};
