import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    objectives: [{ type: String }],
    content: { type: [mongoose.Schema.Types.Mixed], default: [] },
    isEnriched: { type: Boolean, default: false },
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Lesson', lessonSchema);
