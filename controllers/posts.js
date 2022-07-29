const prisma = require("../utils/prismaClient");

const getAllPosts = async (req, res) => {
  const allPosts = await prisma.post.findMany();
  res.json(allPosts);
};

const getPostById = async (req, res) => {
  const post = await prisma.post.findFirst({
    where: {
      id: req.params.id,
    },
  });

  if (!post) {
    res.status(400).json({ error: "Post not found!" });
    return;
  }

  res.json(post);
};

const createPost = async (req, res) => {
  const { title, content, subredditId, type } = req.body;

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        type,
        user: {
          connect: {
            id: req.user.id,
          },
        },
        subreddit: {
          connect: {
            id: subredditId,
          },
        },
      },
    });
    res.json(newPost);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later!" });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
};
