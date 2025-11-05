import Joi from 'joi';

export const createLeadSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow('', null),
  courseInterest: Joi.string().min(2).max(120).required(),
  notes: Joi.string().allow('', null)
});
