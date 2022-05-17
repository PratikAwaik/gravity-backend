const http = require("http");
const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const context = require("./util/context");
const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    context: context,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await connectToDatabase();
  await server.start();

  server.applyMiddleware({
    app,
    path: "/",
  });

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  );
};

start();
