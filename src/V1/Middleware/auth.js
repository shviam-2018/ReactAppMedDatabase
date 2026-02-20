const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Henter token fra "Authorization" header (Format: Bearer <token>)
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ success: false, error: "Ingen token oppgitt" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Legger brukerinfo (id og rolle) inn i req-objektet
        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: "Ugyldig eller utløpt token" });
    }
};

const checkRole = (role) => {
    return (req, res, next) => {
        if (req.user.rolle !== role && req.user.rolle !== 'admin') {
            return res.status(403).json({ success: false, error: "Du har ikke riktig rolle-tilgang" });
        }
        next();
    };
};

module.exports = { verifyToken, checkRole };