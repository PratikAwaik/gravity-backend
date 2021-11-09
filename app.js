const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("express-async-errors");

const app = express();

/* utils */
const middleware = require("./utils/middleware");
const config = require("./utils/config");

/* import routes */
const userRouter = require("./routes/user");
const subredditsRouter = require("./routes/subreddit");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");

// connect to database
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

/* default middlewares */
app.use(express.json({ limit: "300kb" }));
app.use(cors());

app.use(middleware.tokenExtractor);

/* register routes */
app.use("/api/users", userRouter);
app.use("/api/r", subredditsRouter);
app.use("/api/forums", postsRouter);
app.use("/api/forums/:id/comments", commentsRouter);

/* error handler middlewares */
app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
