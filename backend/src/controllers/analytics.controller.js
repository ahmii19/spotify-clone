import User from '../models/User.js';
import Song from '../models/Song.js';
import Artist from '../models/Artist.js';
import Album from '../models/Album.js';
import Playlist from '../models/Playlist.js';
import History from '../models/History.js';
import { sendResponse } from '../utils/response.js';

export const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSongs = await Song.countDocuments();
    const totalArtists = await Artist.countDocuments();
    const totalAlbums = await Album.countDocuments();
    const totalPlaylists = await Playlist.countDocuments();

    const totalPlaysResult = await Song.aggregate([
      { $group: { _id: null, total: { $sum: '$plays' } } },
    ]);
    const totalPlays = totalPlaysResult[0]?.total || 0;

    const recentSongs = await Song.find()
      .populate('artist', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const currentYear = new Date().getFullYear();
    const songsPerMonth = await Song.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const songsPerMonthData = months.map((m) => {
      const found = songsPerMonth.find((item) => item._id === m);
      return {
        month: new Date(currentYear, m - 1).toLocaleString('default', { month: 'short' }),
        songs: found?.count || 0,
      };
    });

    const topPlayedSongs = await Song.find()
      .populate('artist', 'name')
      .sort({ plays: -1 })
      .limit(5)
      .lean();

    const userRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const userRegistrationsData = months.map((m) => {
      const found = userRegistrations.find((item) => item._id === m);
      return {
        month: new Date(currentYear, m - 1).toLocaleString('default', { month: 'short' }),
        users: found?.count || 0,
      };
    });

    sendResponse(res, 200, {
      totalUsers,
      totalSongs,
      totalArtists,
      totalAlbums,
      totalPlaylists,
      totalPlays,
      recentSongs,
      songsPerMonth: songsPerMonthData,
      topPlayedSongs,
      userRegistrations: userRegistrationsData,
    });
  } catch (error) {
    next(error);
  }
};
