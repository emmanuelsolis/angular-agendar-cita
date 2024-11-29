const jwt = require('jsonwebtoken');

const jwtConfig = {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    
    // Función para generar token
    generateToken: (payload) => {
        return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    },
    
    // Middleware para verificar token
    verifyToken: (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        
        try {
            const decoded = jwt.verify(token, jwtConfig.secret);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    },

    // Middleware para verificar rol de admin
    isAdmin: (req, res, next) => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
        }
    }
};

module.exports = jwtConfig;
