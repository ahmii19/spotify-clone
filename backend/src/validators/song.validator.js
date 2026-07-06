import { body } from 'express-validator';

export const createSongValidator = [
  body('title').trim().notEmpty().withMessage('Song title is required'),
  body('artist').isMongoId().withMessage('Valid artist ID is required'),
  body('releaseDate').optional({ values: 'falsy' }).isISO8601().withMessage('Invalid release date format'),
];

export const updateSongValidator = [
  body('title').optional().trim().notEmpty().withMessage('Song title cannot be empty'),
  body('releaseDate').optional({ values: 'falsy' }).isISO8601().withMessage('Invalid release date format'),
];
