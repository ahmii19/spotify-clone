import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
    coverImage: { type: String, default: '' },
    releaseYear: { type: Number },
    genre: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

albumSchema.virtual('songs', {
  ref: 'Song',
  localField: '_id',
  foreignField: 'album',
});

albumSchema.set('toObject', { virtuals: true });
albumSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Album', albumSchema);
