import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    courseInterest: { type: String, required: true },
    notes: { type: String },

    isClaimed: { type: Boolean, default: false, index: true },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null, index: true },
    claimedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

// Optional index to speed common lookups
leadSchema.index({ email: 1, isClaimed: 1 });

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
