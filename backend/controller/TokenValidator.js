import jwt from 'jsonwebtoken';


export const validateToken = (header,position) =>{
    if (!header || !header.authorization) {
        return "false.401.Authorization header missing";
    }
    const authHeaderParts = header.authorization.split(' ');

    if (authHeaderParts.length !== 2 || authHeaderParts[0] !== 'Bearer') {
        return "false.401.Invalid authorization header format";
    }

    const secreteKey = process.env.ACCESS_TOKEN_SECRET;
    const token = authHeaderParts[1]; // Get token from header
    const decodedToken = jwt.verify(token, secreteKey);

    if (decodedToken.position !== position) {
        return "false.403.You do not have permission to access this resource";
    }

    return "true";
}
