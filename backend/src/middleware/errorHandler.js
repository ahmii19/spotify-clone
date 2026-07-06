export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File too large. Max 10MB for images, 50MB for audio.';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = `Unexpected file field: ${err.field}`;
    } else {
      message = `Upload error: ${err.message}`;
    }
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    if (err.errors && typeof err.errors === 'object') {
      const messages = Object.values(err.errors).map((val) => val.message || val).filter(Boolean);
      message = messages.length ? messages.join(', ') : message;
    }
  }

  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  console.error(`[${statusCode}] ${message}`, err.stack || '');

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
