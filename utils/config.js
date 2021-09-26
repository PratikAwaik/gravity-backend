require("dotenv").config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_PROD_URI
    : process.env.MONGODB_DEV_URI;

module.exports = {
  PORT,
  MONGODB_URI,
};
