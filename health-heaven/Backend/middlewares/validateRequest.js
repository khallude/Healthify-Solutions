const validateRequest = (req, res, next) => {
  const { email, token, newPassword } = req.body;

  if (req.path === '/forgot-password' && !email) {
    return res.status(400).send('Email is required.');
  }
  if (req.path === '/verify-token' && !token) {
    return res.status(400).send('Token is required.');
  }
  if (req.path === '/reset-password' && (!token || !newPassword)) {
    return res.status(400).send('Token and new password are required.');
  }

  next();
};

module.exports = validateRequest;

  