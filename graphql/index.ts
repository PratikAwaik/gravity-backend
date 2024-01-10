import merge from "lodash.merge";
import {makeExecutableSchema} from "@graphql-tools/schema";
import {userResolver, userSchema} from "./users";
import {communityResolver, communitySchema} from "./community";
import {postResolver, postSchema} from "./posts";
import {commentSchema, commentResolver} from "./comments";
import {gql} from "apollo-server-core";

const initialSchema = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }

  enum Direction {
    UPVOTE
    UNVOTE
    DOWNVOTE
  }

  type Icon {
    url: String
    publicId: String
  }

  input IconPayload {
    content: String
    publicId: String
  }
`;

const resolvers = {};

export const executableSchema = makeExecutableSchema({
  typeDefs: [
    initialSchema,
    userSchema,
    communitySchema,
    postSchema,
    commentSchema,
  ],
  resolvers: merge(
    resolvers,
    userResolver,
    communityResolver,
    postResolver,
    commentResolver
  ),
});
