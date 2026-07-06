import Album from '../models/Album.js';
import Song from '../models/Song.js';
import { sendResponse, sendPaginated, sendError } from '../utils/response.js';

export const getAlbums = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { search, genre, artist, sort } = req.query;

    const filter = {};
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (genre) filter.genre = genre;
    if (artist) filter.artist = artist;

    let sortOption = { createdAt: -1 };
    if (sort === 'title') sortOption = { title: 1 };
    if (sort === '-title') sortOption = { title: -1 };
    if (sort === 'year') sortOption = { releaseYear: -1 };

    const albums = await Album.find(filter)
      .populate('artist', 'name image')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);
    const total = await Album.countDocuments(filter);

    sendPaginated(res, 200, albums, page, limit, total);
  } catch (error) {
    next(error);
  }
};

export const getAlbum = async (req, res, next) => {
  try {
    const album = await Album.findById(req.params.id).populate('artist', 'name image');
    if (!album) return sendError(res, 404, 'Album not found');

    const songs = await Song.find({ album: album._id }).populate('artist', 'name image');

    sendResponse(res, 200, { album, songs });
  } catch (error) {
    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, releaseYear, genre, description } = req.body;
    const coverImage = req.file ? req.file.path : '';
    const album = await Album.create({ title, artist, coverImage, releaseYear, genre, description });
    sendResponse(res, 201, { album }, 'Album created');
  } catch (error) {
    next(error);
  }
};

export const updateAlbum = async (req, res, next) => {
  try {
    const updates = {};
    const fields = ['title', 'artist', 'releaseYear', 'genre', 'description'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });
    if (req.file) updates.coverImage = req.file.path;

    const album = await Album.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!album) return sendError(res, 404, 'Album not found');
    sendResponse(res, 200, { album }, 'Album updated');
  } catch (error) {
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);
    if (!album) return sendError(res, 404, 'Album not found');
    await Song.deleteMany({ album: album._id });
    sendResponse(res, 200, null, 'Album deleted');
  } catch (error) {
    next(error);
  }
};
