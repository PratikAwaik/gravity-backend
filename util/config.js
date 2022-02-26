require("dotenv").config();

module.exports = {
    DATABASE_URL: process.env.NODE_ENV === 'production' ? process.env.PROD_DATABASE_URL : process.env.DEV_DATABASE_URL,
    PORT: process.env.PORT || 3001,
    JWT_SECRET: process.env.JWT_SECRET,
}