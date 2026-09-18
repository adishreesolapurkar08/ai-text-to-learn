import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    creator: { type: String, required: true },
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
