import Employee from '../models/Employee.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { signToken } from '../middleware/auth.js';
import { registerSchema, loginSchema } from '../validations/auth.validation.js';

export const register = asyncHandler(async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) throw new ApiError(400, error.message);

  const exists = await Employee.findOne({ email: value.email });
  if (exists) throw new ApiError(409, 'Email already registered');

  const employee = await Employee.create(value);
  const token = signToken(employee);

  res
    .status(201)
    .json(
      new ApiResponse(
        { token, employee: { id: employee._id, name: employee.name, email: employee.email } },
        'Registered'
      )
    );
});

export const login = asyncHandler(async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) throw new ApiError(400, error.message);

  const employee = await Employee.findOne({ email: value.email });
  if (!employee) throw new ApiError(401, 'Invalid email or password');

  const isMatch = await employee.comparePassword(value.password);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password');

  const token = signToken(employee);

  res.json(
    new ApiResponse(
      { token, employee: { id: employee._id, name: employee.name, email: employee.email } },
      'Logged in'
    )
  );
});
