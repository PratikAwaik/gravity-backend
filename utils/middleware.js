const jwt = require("jsonwebtoken");
const prisma = require("./prismaClient");

/**
 * Extract authorization token and set it on request
 */
const tokenExtractor = (req, res, next) => {
  const authHeader = req.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    req.token = authHeader.substring(7);
  }
  next();
};

/**
 * Extract user and set it on request if user exists
 */
const userExtractor = async (req, res, next) => {
  if (req.token) {
    const verifiedUser = jwt.verify(req.token, process.env.JWT_SECRET || "");

    if (verifiedUser.id) {
      req.user = await prisma.user.findFirst({
        where: { id: verifiedUser?.id },
      });
    }
    next();
  } else {
    res.status(401).send({ error: "Signup or Login to create a post" });
  }
};

module.exports = {
  tokenExtractor,
  userExtractor,
};
