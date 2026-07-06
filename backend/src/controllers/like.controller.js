import LikedSong from '../models/LikedSong.js';
import Song from '../models/Song.js';
import { sendResponse, sendError } from '../utils/response.js';

export const likeSong = async (req, res, next) => {
  try {
    const { songId } = req.body;
    const song = await Song.findById(songId);
    if (!song) return sendError(res, 404, 'Song not found');

    const existing = await LikedSong.findOne({ user: req.user._id, song: songId });
    if (existing) return sendError(res, 400, 'Song already liked');

    await LikedSong.create({ user: req.user._id, song: songId });
    sendResponse(res, 201, null, 'Song liked');
  } catch (error) {
    next(error);
  }
};

export const unlikeSong = async (req, res, next) => {
  try {
    const { songId } = req.params;
    const liked = await LikedSong.findOneAndDelete({ user: req.user._id, song: songId });
    if (!liked) return sendError(res, 404, 'Song not found in liked songs');
    sendResponse(res, 200, null, 'Song unliked');
  } catch (error) {
    next(error);
  }
};

export const getLikedSongs = async (req, res, next) => {
  try {
    const likedSongs = await LikedSong.find({ user: req.user._id })
      .populate({
        path: 'song',
        populate: [
          { path: 'artist', select: 'name image' },
          { path: 'album', select: 'title coverImage' },
        ],
      })
      .sort({ createdAt: -1 });

    const songs = likedSongs.map((l) => l.song).filter(Boolean);
    sendResponse(res, 200, { songs });
  } catch (error) {
    next(error);
  }
};

export const checkLiked = async (req, res, next) => {
  try {
    const { songId } = req.params;
    const liked = await LikedSong.findOne({ user: req.user._id, song: songId });
    sendResponse(res, 200, { isLiked: !!liked });
  } catch (error) {
    next(error);
  }
};
