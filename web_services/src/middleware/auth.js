const jwt = require ('jsonwebtoken');

function auth(req, res, next) {
    const hdr = req.headers ['authorization'] || '';
    const token = hdr.startsWith ('Bearer') ? hdr.slice(7) : null;
    
    if (!token) return res.status(401).json({ error: 'Token Requerido' });
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        return next();
    } catch (error) {
    return res.status(401).json({ error: 'Token Inválido o Expirado' });
    }
}

module.exports = { auth };
