import Song from '../models/Song.js';
import Artist from '../models/Artist.js';
import Album from '../models/Album.js';
import { sendResponse } from '../utils/response.js';

export const search = async (req, res, next) => {
  try {
    const { q, type } = req.query;
    if (!q) {
      return sendResponse(res, 200, { songs: [], artists: [], albums: [] });
    }

    const regex = new RegExp(q, 'i');
    const limit = parseInt(req.query.limit) || 10;

    let songs = [];
    let artists = [];
    let albums = [];

    if (!type || type === 'songs' || type === 'all') {
      songs = await Song.find({ title: regex })
        .populate('artist', 'name image')
        .populate('album', 'title coverImage')
        .limit(limit);
    }

    if (!type || type === 'artists' || type === 'all') {
      artists = await Artist.find({ name: regex }).limit(limit);
    }

    if (!type || type === 'albums' || type === 'all') {
      albums = await Album.find({ title: regex })
        .populate('artist', 'name image')
        .limit(limit);
    }

    sendResponse(res, 200, { songs, artists, albums });
  } catch (error) {
    next(error);
  }
};
