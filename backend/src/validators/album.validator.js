import { body } from 'express-validator';

export const createAlbumValidator = [
  body('title').trim().notEmpty().withMessage('Album title is required'),
  body('artist').isMongoId().withMessage('Valid artist ID is required'),
];

export const updateAlbumValidator = [
  body('title').optional().trim().notEmpty().withMessage('Album title cannot be empty'),
];
