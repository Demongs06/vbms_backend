const jwt = require('jsonwebtoken');
const authenticate = (req, res, next) => {
try {
const authHeader = req.header('Authorization');
if (!authHeader) {
return res.status(401).json({
success: false,
message: 'Authorization header is missing'
});
}
// Extract token from "Bearer &lt;token&gt;" format
const parts = authHeader.split(' ');
if (parts.length !== 2 || parts[0] !== 'Bearer') {
return res.status(401).json({
success: false,
message: 'Invalid authorization format. Use "Bearer &lt;token&gt;"'
});
}
const token = parts[1];
// Verify JWT token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded;
next();
} catch (error) {
if (error.name === 'JsonWebTokenError') {
return res.status(401).json({
success: false,
message: 'Invalid token'
});
}
if (error.name === 'TokenExpiredError') {
return res.status(401).json({
success: false,
message: 'Token has expired'
});
}
res.status(500).json({
success: false,
message: 'Authentication failed'
});
}
};
module.exports = authenticate;