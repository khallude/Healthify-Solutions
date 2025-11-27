// Error handling middleware
function errorHandler(err, req, res, next) {
    if (err.message.includes('Invalid file type')) {
      return res.status(400).json({ message: 'Invalid file type. Only PDF, JPEG, and PNG files are allowed.' });
    }
    
    // Generic error handler
    res.status(500).json({ message: 'An unexpected error occurred.', error: err.message });
  }
  
  module.exports = errorHandler;
  