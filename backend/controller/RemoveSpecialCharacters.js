

export const sanitizeRequestData =(req, res, next)=> {
    for (const key in req.body) {
        if (Object.prototype.hasOwnProperty.call(req.body, key)) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].replace(/[^\w\s]/gi, ''); // Replace non-word characters
            }
        }
    }
    for (const key in req.params) {
        if (Object.prototype.hasOwnProperty.call(req.params, key)) {
            if (typeof req.params[key] === 'string') {
                req.params[key] = req.params[key].replace(/[^\w\s]/gi, ''); // Replace non-word characters
            }
        }
    }
    next();
}
