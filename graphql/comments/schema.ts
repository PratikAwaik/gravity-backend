import { gql } from "apollo-server-core";

export const typeDef = gql`
  type Comment {
    id: ID!
    content: String!
    authorId: String!
    author: User!
    postId: String!
    parentId: String
    children: [Comment]
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    allComments(postId: String!): [Comment]!
  }

  extend type Mutation {
    createComment(content: String!, postId: String!, parentId: String): Comment
  }
`;
