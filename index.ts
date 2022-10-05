import { ApolloServer } from "apollo-server";
import { executableSchema } from "./graphql";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { context } from "./graphql/context";

const server = new ApolloServer({
  schema: executableSchema,
  context: context,
  csrfPrevention: true,
  cache: "bounded",
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
