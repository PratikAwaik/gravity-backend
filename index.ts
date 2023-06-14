import { ApolloServer } from "apollo-server";
import { executableSchema } from "./graphql";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { context } from "./graphql/context";

const server = new ApolloServer({
  schema: executableSchema,
  context: context,
  csrfPrevention: false,
  cors: {
    origin: "*",
    credentials: true,
  },
  cache: "bounded",
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});

server.listen().then(({ url }: { url: string }) => {
  console.log(`🚀  Server ready at ${url}`);
});
