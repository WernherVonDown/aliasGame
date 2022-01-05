require('dotenv/config')

const {
    CORS_ORIGIN,
    PORT,
    HOST,
    DB_USER,
    DB_PASS,
    DB_BASE,
    DB_URL,
    DB_PORT,
    JWT_SECRET
} = process.env;

module.exports = {
    corsOrigin: CORS_ORIGIN || "http://localhost:3000",
    port: PORT || 4000,
    host: HOST || "localhost",
    db: {
        user: DB_USER || 'root',
        password: DB_PASS || 'password',
        database: DB_BASE || 'admin',
        url: DB_URL || 'localhost',
        port: DB_PORT || 6666,
    },
    jwtSectret: JWT_SECRET || 'secret'
}