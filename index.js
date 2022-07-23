/**
 * Module Imports
 */
const express = require("express");

/**
 * Router Imports
 */
const usersRouter = require("./routes/users");
const subredditsRouter = require("./routes/subreddits");

/**
 * General Imports
 */
const middleware = require("./utils/middleware");

/**
 * Initialization
 */
const app = express();

/**
 * default middlewares
 */
app.use(express.json());

/**
 * custom middlewares
 */
app.use(middleware.tokenExtractor);

/**
 * Register Routes
 */
app.use("/api/v2/users", usersRouter);
app.use("/api/v2/subreddits", subredditsRouter);

/**
 * Run the server
 */
const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
