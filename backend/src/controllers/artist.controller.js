import Artist from '../models/Artist.js';
import Album from '../models/Album.js';
import Song from '../models/Song.js';
import { sendResponse, sendPaginated, sendError } from '../utils/response.js';

export const getArtists = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { search, genre, sort } = req.query;

    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (genre) filter.genre = genre;

    let sortOption = { createdAt: -1 };
    if (sort === 'name') sortOption = { name: 1 };
    if (sort === '-name') sortOption = { name: -1 };

    const artists = await Artist.find(filter).sort(sortOption).skip(skip).limit(limit);
    const total = await Artist.countDocuments(filter);

    sendPaginated(res, 200, artists, page, limit, total);
  } catch (error) {
    next(error);
  }
};

export const getArtist = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return sendError(res, 404, 'Artist not found');

    const albums = await Album.find({ artist: artist._id });
    const songs = await Song.find({ artist: artist._id });

    sendResponse(res, 200, { artist, albums, songs });
  } catch (error) {
    next(error);
  }
};

export const createArtist = async (req, res, next) => {
  try {
    const { name, bio, genre, verified } = req.body;
    const image = req.file ? req.file.path : '';
    const artist = await Artist.create({ name, bio, image, genre, verified });
    sendResponse(res, 201, { artist }, 'Artist created');
  } catch (error) {
    next(error);
  }
};

export const updateArtist = async (req, res, next) => {
  try {
    const updates = {};
    const fields = ['name', 'bio', 'genre', 'verified'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });
    if (req.file) updates.image = req.file.path;

    const artist = await Artist.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!artist) return sendError(res, 404, 'Artist not found');
    sendResponse(res, 200, { artist }, 'Artist updated');
  } catch (error) {
    next(error);
  }
};

export const deleteArtist = async (req, res, next) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id);
    if (!artist) return sendError(res, 404, 'Artist not found');
    await Album.deleteMany({ artist: artist._id });
    await Song.deleteMany({ artist: artist._id });
    sendResponse(res, 200, null, 'Artist deleted');
  } catch (error) {
    next(error);
  }
};
