import mongoose from 'mongoose';

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
    album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', set: (v) => v === '' || v === 'null' || v === 'undefined' ? undefined : v },
    duration: { type: Number, default: 0 },
    genre: { type: String, default: '' },
    releaseDate: { type: Date },
    description: { type: String, default: '' },
    audioUrl: { type: String, default: '' },
    plays: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

songSchema.index({ title: 'text', genre: 'text' });

export default mongoose.model('Song', songSchema);
