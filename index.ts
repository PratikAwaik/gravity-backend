import {ApolloServer} from "apollo-server";
import {executableSchema} from "./graphql";
import {ApolloServerPluginLandingPageLocalDefault} from "apollo-server-core";
import {context} from "./graphql/context";
import {config} from "dotenv";

// load env variables
config();

console.log(process.env.NODE_ENV);

const server = new ApolloServer({
  schema: executableSchema,
  context: context,
  csrfPrevention: true,
  cors: {
    credentials: true,
    origin: [
      (process.env.NODE_ENV === "development"
        ? process.env.GRAVITY_FRONTEND_DEV_URL
        : process.env.GRAVITY_FRONTEND_PROD_URL) as string,
    ],
  },
  cache: "bounded",
  plugins: [ApolloServerPluginLandingPageLocalDefault({embed: true})],
});

server.listen().then(({url}: {url: string}) => {
  console.log(`🚀  Server ready at ${url}`);
});
