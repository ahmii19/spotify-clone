import Song from '../models/Song.js';
import { sendResponse, sendPaginated, sendError } from '../utils/response.js';

export const getSongs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { search, genre, artist, album, sort } = req.query;

    const filter = {};
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (genre) filter.genre = genre;
    if (artist) filter.artist = artist;
    if (album) filter.album = album;

    let sortOption = { createdAt: -1 };
    if (sort === 'title') sortOption = { title: 1 };
    if (sort === '-title') sortOption = { title: -1 };
    if (sort === 'plays') sortOption = { plays: -1 };

    const songs = await Song.find(filter)
      .populate('artist', 'name')
      .populate('album', 'title')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);
    const total = await Song.countDocuments(filter);

    sendPaginated(res, 200, songs, page, limit, total);
  } catch (error) {
    next(error);
  }
};

export const getSong = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id)
      .populate('artist', 'name')
      .populate('album', 'title');
    if (!song) return sendError(res, 404, 'Song not found');
    sendResponse(res, 200, { song });
  } catch (error) {
    next(error);
  }
};

export const createSong = async (req, res, next) => {
  try {
    const { title, artist, album, duration, genre, releaseDate, description } = req.body;
    let audioUrl = '';

    if (req.file) {
      audioUrl = '/uploads/' + req.file.filename;
    }

    const songData = {
      title,
      artist,
      duration: duration || 0,
      genre: genre || '',
      releaseDate: releaseDate || null,
      description: description || '',
      audioUrl,
      createdBy: req.user?._id,
    };
    if (album) songData.album = album;

    console.log('3/5 Validation passed - Saving song to MongoDB...');
    console.log('Song data:', JSON.stringify(songData));

    const song = await Song.create(songData);

    console.log('4/5 Song saved to MongoDB with ID:', song._id);
    console.log('5/5 Sending 201 response');
    sendResponse(res, 201, { song }, 'Song created');
  } catch (error) {
    console.error('Create Song Error:', error.name, error.message);
    console.error('Full stack:', error.stack);
    next(error);
  }
};

export const updateSong = async (req, res, next) => {
  try {
    const updates = {};
    const fields = ['title', 'artist', 'album', 'duration', 'genre', 'releaseDate', 'description'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });
    if (req.file) {
      updates.audioUrl = '/uploads/' + req.file.filename;
    }

    const song = await Song.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!song) return sendError(res, 404, 'Song not found');
    sendResponse(res, 200, { song }, 'Song updated');
  } catch (error) {
    next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return sendError(res, 404, 'Song not found');
    sendResponse(res, 200, null, 'Song deleted');
  } catch (error) {
    next(error);
  }
};
