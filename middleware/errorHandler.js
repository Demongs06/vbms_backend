const errorHandler = (err, req, res, next) => {
// Log error to console (in production, use a logging service)
console.error('Error:', {
message: err.message,
stack: err.stack,
timestamp: new Date().toISOString()
});
// Set default values
let statusCode = err.statusCode || 500;
let message = err.message || 'Internal Server Error';
// Handle specific error types
if (err.name === 'ValidationError') {
statusCode = 400;
const messages = Object.values(err.errors).map(e => e.message);
message = messages.join(', ');
}
if (err.name === 'CastError') {
statusCode = 400;
message = 'Invalid ID format';
}
if (err.code === 11000) {
statusCode = 409;
const field = Object.keys(err.keyPattern)[0];
message = `${field} already exists`;
}
if (err.name === 'MongoServerError') {
statusCode = 500;
message = 'Database connection error';
}
// Send error response
res.status(statusCode).json({
success: false,
error: message,
...(process.env.NODE_ENV === 'development' && { stack: err.stack })
});
};
module.exports = errorHandler;