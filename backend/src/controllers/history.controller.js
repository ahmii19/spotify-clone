import History from '../models/History.js';
import Song from '../models/Song.js';
import { sendResponse, sendError } from '../utils/response.js';

export const addToHistory = async (req, res, next) => {
  try {
    const { songId } = req.body;
    const song = await Song.findById(songId);
    if (!song) return sendError(res, 404, 'Song not found');

    song.plays += 1;
    await song.save();

    await History.create({ user: req.user._id, song: songId });
    sendResponse(res, 201, null, 'Added to history');
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const history = await History.find({ user: req.user._id })
      .populate({
        path: 'song',
        populate: [
          { path: 'artist', select: 'name image' },
          { path: 'album', select: 'title coverImage' },
        ],
      })
      .sort({ playedAt: -1 })
      .skip(skip)
      .limit(limit);

    const songs = history.map((h) => h.song).filter(Boolean);
    const total = await History.countDocuments({ user: req.user._id });

    sendResponse(res, 200, {
      songs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

export const clearHistory = async (req, res, next) => {
  try {
    await History.deleteMany({ user: req.user._id });
    sendResponse(res, 200, null, 'History cleared');
  } catch (error) {
    next(error);
  }
};

export const getRecentlyPlayed = async (req, res, next) => {
  try {
    const history = await History.find({ user: req.user._id })
      .populate({
        path: 'song',
        populate: [
          { path: 'artist', select: 'name image' },
          { path: 'album', select: 'title coverImage' },
        ],
      })
      .sort({ playedAt: -1 })
      .limit(20);

    const songs = [];
    const seen = new Set();
    for (const h of history) {
      if (h.song && !seen.has(h.song._id.toString())) {
        seen.add(h.song._id.toString());
        songs.push(h.song);
      }
    }

    sendResponse(res, 200, { songs });
  } catch (error) {
    next(error);
  }
};
