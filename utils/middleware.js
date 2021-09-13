const jwt = require('jsonwebtoken');
const User = require('../models/user');

const tokenExtractor = (req, res, next) => {
  const authHeader = req.get('authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    req.token = authHeader.substring(7);
  }
  next();
}

const userExtractor = async (req, res, next) => {
  if (req.token) {
    const verifiedUser = jwt.verify(req.token, process.env.JWT_SECRET);
    req.user = verifiedUser.id && await User.findById(verifiedUser.id);
    next();
  } else {
    res.status(401).send({ error: 'Signup or Login to create a post' });
  }
}

const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err.name === 'ValidationError') {
    res.status(400).send({ error: err.errors });
  } else if (err.name === 'JsonWebTokenError') {
    res.status(401).send({ error: 'Missing or invalid token' });
  } else if (err.name === 'TokenExpiredError') {
    res.status(401).send({ error: 'Token expired' });
  }
  next();
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown Endpoint' });
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}