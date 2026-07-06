import User from '../models/User.js';
import Song from '../models/Song.js';
import Artist from '../models/Artist.js';
import Album from '../models/Album.js';
import Playlist from '../models/Playlist.js';
import { sendResponse } from '../utils/response.js';

export const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSongs = await Song.countDocuments();
    const totalArtists = await Artist.countDocuments();
    const totalAlbums = await Album.countDocuments();
    const totalPlaylists = await Playlist.countDocuments();

    const recentSongs = await Song.find()
      .populate('artist', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    sendResponse(res, 200, {
      totalUsers,
      totalSongs,
      totalArtists,
      totalAlbums,
      totalPlaylists,
      recentSongs,
    });
  } catch (error) {
    next(error);
  }
};
