const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const prisma = require("../utils/prismaClient");

/**
 * get all users
 */
const getAllUsers = async (req, res) => {
  const allUsers = await prisma.user.findMany();
  res.json(allUsers);
};

/**
 * register new user
 */
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // check if username or email already exists
  const userWithUsernameOrEmail = await prisma.user.findFirst({
    where: {
      OR: [{ username: username }, { email: email }],
    },
  });

  if (userWithUsernameOrEmail) {
    res.status(409).json({
      error: "User with this username or email already exists.",
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        prefixedUsername: `u/${username}`,
        email,
        password: hashedPassword,
      },
    });

    const userForToken = {
      id: newUser.id,
      username: newUser.username,
    };

    const token = jwt.sign(userForToken, process.env.JWT_SECRET || "");

    res.json({ token, ...userForToken });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later!" });
  }
};

/**
 * login user
 */
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const userWithUsername = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  const isPasswordCorrect = userWithUsername
    ? await bcrypt.compare(password, userWithUsername.password)
    : false;

  if (!userWithUsername || !isPasswordCorrect) {
    res.status(400).json({ error: "Invalid Username or Password." });
    return;
  }

  const userForToken = {
    id: userWithUsername.id,
    username: userWithUsername.username,
  };

  const token = jwt.sign(userForToken, process.env.JWT_SECRET || "");

  res.json({
    token,
    ...userForToken,
  });
};

/**
 * get single user with id
 */
const getUserById = async (req, res) => {
  // hide password
  const user = await prisma.user.findFirst({
    where: {
      id: req.params.id,
    },
  });

  if (!user) {
    res.status(400).json({ error: "User does not exist" });
  } else {
    res.json(user);
  }
};

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  getUserById,
};
