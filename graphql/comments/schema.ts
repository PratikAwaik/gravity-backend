import { gql } from "apollo-server-core";

export const typeDef = gql`
  type Comment {
    id: ID!
    content: String!
    authorId: String!
    postId: String!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    allComments: [Comment]!
  }
`;
