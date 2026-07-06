import Playlist from '../models/Playlist.js';
import { sendResponse, sendPaginated, sendError } from '../utils/response.js';

export const getPlaylists = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { search, userId } = req.query;

    const filter = { user: userId || req.user._id };
    if (search) filter.name = { $regex: search, $options: 'i' };

    const playlists = await Playlist.find(filter)
      .populate('songs', 'title duration')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Playlist.countDocuments(filter);

    sendPaginated(res, 200, playlists, page, limit, total);
  } catch (error) {
    next(error);
  }
};

export const getAllPlaylists = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { search } = req.query;

    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };

    const playlists = await Playlist.find(filter)
      .populate('user', 'name email')
      .populate('songs', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Playlist.countDocuments(filter);

    sendPaginated(res, 200, playlists, page, limit, total);
  } catch (error) {
    next(error);
  }
};

export const getPlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate({
        path: 'songs',
        populate: [
          { path: 'artist', select: 'name image' },
          { path: 'album', select: 'title coverImage' },
        ],
      })
      .populate('user', 'name');
    if (!playlist) return sendError(res, 404, 'Playlist not found');
    sendResponse(res, 200, { playlist });
  } catch (error) {
    next(error);
  }
};

export const createPlaylist = async (req, res, next) => {
  try {
    const { name, description, coverImage, isPublic } = req.body;
    const playlist = await Playlist.create({
      name,
      description,
      coverImage: coverImage || '',
      user: req.user._id,
      isPublic: isPublic !== undefined ? isPublic : true,
    });
    sendResponse(res, 201, { playlist }, 'Playlist created');
  } catch (error) {
    next(error);
  }
};

export const updatePlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return sendError(res, 404, 'Playlist not found');
    if (playlist.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 403, 'Not authorized');
    }

    const fields = ['name', 'description', 'coverImage', 'isPublic'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) playlist[f] = req.body[f];
    });
    await playlist.save();

    sendResponse(res, 200, { playlist }, 'Playlist updated');
  } catch (error) {
    next(error);
  }
};

export const deletePlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return sendError(res, 404, 'Playlist not found');
    if (playlist.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 403, 'Not authorized');
    }
    await playlist.deleteOne();
    sendResponse(res, 200, null, 'Playlist deleted');
  } catch (error) {
    next(error);
  }
};

export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { songId } = req.body;
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return sendError(res, 404, 'Playlist not found');
    if (playlist.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 403, 'Not authorized');
    }
    if (playlist.songs.includes(songId)) {
      return sendError(res, 400, 'Song already in playlist');
    }
    playlist.songs.push(songId);
    await playlist.save();
    sendResponse(res, 200, { playlist }, 'Song added to playlist');
  } catch (error) {
    next(error);
  }
};

export const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { songId } = req.body;
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return sendError(res, 404, 'Playlist not found');
    if (playlist.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 403, 'Not authorized');
    }
    playlist.songs = playlist.songs.filter((s) => s.toString() !== songId);
    await playlist.save();
    sendResponse(res, 200, { playlist }, 'Song removed from playlist');
  } catch (error) {
    next(error);
  }
};
