import { body } from 'express-validator';

export const createArtistValidator = [
  body('name').trim().notEmpty().withMessage('Artist name is required'),
];

export const updateArtistValidator = [
  body('name').optional().trim().notEmpty().withMessage('Artist name cannot be empty'),
];
