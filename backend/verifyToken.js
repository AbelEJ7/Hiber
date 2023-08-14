import  Jwt  from "jsonwebtoken";
import { expressjwt } from "express-jwt";

function verifyToken(req, res, next) {
  const secret = process.env.ACCESS_TOKEN_SECRET;
    const protect = expressjwt({
        secret: secret,
        algorithms: ['HS256'],
        credentialsRequired: true
    });

    protect(req, res, (err) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
            }
            return res.status(401).json({ message: 'Authentication error.' });
        }
        next();
    });
}

export default verifyToken;
