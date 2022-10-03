import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDef as userSchema } from "./users/schema";
import { resolver as userResolver } from "./users/resolver";
import { typeDef as communitySchema } from "./community/schema";
import { resolver as communityResolver } from "./community/resolver";
import { typeDef as postSchema } from "./posts/schema";
import { resolver as postResolver } from "./posts/resolver";
import { typeDef as commentSchema } from "./comments/schema";
import { resolver as commentResolver } from "./comments/resolver";

const resolvers = {};

export const executableSchema = makeExecutableSchema({
  typeDefs: [userSchema, communitySchema, postSchema, commentSchema],
  resolvers: Object.assign(
    resolvers,
    userResolver,
    communityResolver,
    postResolver,
    commentResolver
  ),
});
