import { makeExecutableSchema } from "@graphql-tools/schema";
import { merge } from "lodash";
import { userResolver, userSchema } from "./users";
import { communityResolver, communitySchema } from "./community";
import { postResolver, postSchema } from "./posts";
import { commentSchema, commentResolver } from "./comments";

const query = `type Query {
  _empty: String
}`;

const resolvers = {};

export const executableSchema = makeExecutableSchema({
  typeDefs: [query, userSchema, communitySchema, postSchema, commentSchema],
  resolvers: merge(
    resolvers,
    userResolver,
    communityResolver,
    postResolver,
    commentResolver
  ),
});
