import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    bio: { type: String, default: '' },
    image: { type: String, default: '' },
    genre: { type: String, default: '' },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

artistSchema.virtual('albums', {
  ref: 'Album',
  localField: '_id',
  foreignField: 'artist',
});

artistSchema.virtual('songs', {
  ref: 'Song',
  localField: '_id',
  foreignField: 'artist',
});

artistSchema.set('toObject', { virtuals: true });
artistSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Artist', artistSchema);
