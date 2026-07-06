import { body } from 'express-validator';

export const createPlaylistValidator = [
  body('name').trim().notEmpty().withMessage('Playlist name is required'),
];

export const updatePlaylistValidator = [
  body('name').optional().trim().notEmpty().withMessage('Playlist name cannot be empty'),
];
