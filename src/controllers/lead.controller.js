import Lead from '../models/Lead.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createLeadSchema } from '../validations/lead.validation.js';

// Public: Create an enquiry (lead)
export const createPublicLead = asyncHandler(async (req, res) => {
  const { error, value } = createLeadSchema.validate(req.body);
  if (error) throw new ApiError(400, error.message);

  const lead = await Lead.create({ ...value });
  res.status(201).json(new ApiResponse(lead, 'Lead created'));
});

// Auth: Get all unclaimed (public) leads
export const getUnclaimedLeads = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20')));
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Lead.find({ isClaimed: false }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Lead.countDocuments({ isClaimed: false })
  ]);

  res.json(new ApiResponse({ items, page, limit, total }));
});

// Auth: Claim a lead atomically (only if still unclaimed)
export const claimLead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const employeeId = req.user._id;

  const updated = await Lead.findOneAndUpdate(
    { _id: id, isClaimed: false },
    { $set: { isClaimed: true, claimedBy: employeeId, claimedAt: new Date() } },
    { new: true }
  );

  if (!updated) throw new ApiError(409, 'Lead already claimed or not found');

  res.json(new ApiResponse(updated, 'Lead claimed'));
});

// Auth: Get leads claimed by current employee
export const getMyLeads = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20')));
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Lead.find({ isClaimed: true, claimedBy: req.user._id })
      .sort({ claimedAt: -1 })
      .skip(skip)
      .limit(limit),
    Lead.countDocuments({ isClaimed: true, claimedBy: req.user._id })
  ]);

  res.json(new ApiResponse({ items, page, limit, total }));
});
