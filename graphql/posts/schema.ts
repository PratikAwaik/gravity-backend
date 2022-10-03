import { gql } from "apollo-server-core";

export const typeDef = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    authorId: String!
    communityId: String
    type: PostType!
    comments: [Comment]!
    createdAt: String!
    updatedAt: String!
  }

  enum PostType {
    TEXT
    MEDIA
    LINK
  }

  extend type Query {
    allPosts: [Post]!
  }
`;
