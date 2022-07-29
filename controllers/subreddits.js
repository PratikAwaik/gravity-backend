const prisma = require("../utils/prismaClient");

/**
 * get all subreddits
 */
const getAllSubreddits = async (req, res) => {
  const allSubreddits = await prisma.subreddit.findMany();
  res.json(allSubreddits);
};

/**
 * get subreddit by id
 */
const getSubredditById = async (req, res) => {
  const subreddit = await prisma.subreddit.findFirst({
    where: {
      id: req.params.id,
    },
  });

  if (!subreddit) {
    res.status(400).json({ error: "Subreddit does not exist." });
    return;
  }

  res.json(subreddit);
};

/**
 * create new subreddit
 */
const createNewSubreddit = async (req, res) => {
  const { name, description, icon } = req.body;

  // this does not execute because we already have check in middleware
  if (!req.user) {
    res
      .status(401)
      .json({ error: "Please sign-up/log-in to create subreddit." });
    return;
  }

  const subredditWithName = await prisma.subreddit.findFirst({
    where: {
      name,
    },
  });

  if (subredditWithName) {
    res.status(400).json({ error: "Subreddit with this name already exists" });
    return;
  }

  try {
    const newSubreddit = await prisma.subreddit.create({
      data: {
        name,
        prefixedName: `r/${name}`,
        description,
        icon,
        user: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });
    res.json(newSubreddit);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later!" });
  }
};

module.exports = {
  getAllSubreddits,
  getSubredditById,
  createNewSubreddit,
};
