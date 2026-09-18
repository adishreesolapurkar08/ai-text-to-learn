export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  // OpenRouter / OpenAI SDK errors
  if (err.status === 401 && err.name !== 'JsonWebTokenError') {
    return res.status(502).json({
      error: 'AI provider authentication failed. Check OPENROUTER_API_KEY in server/.env',
    });
  }

  const status = err.status || err.statusCode || 500;
  res.status(status >= 400 && status < 600 ? status : 500).json({
    error: err.message || 'Internal server error',
  });
};
