import { gql } from "apollo-server-core";

export const typeDef = gql`
  type CommentScore {
    id: ID!
    commentId: String!
    comment: Comment!
    userId: String!
    user: User!
    direction: Int!
  }

  type Comment {
    id: ID!
    content: String!
    authorId: String!
    author: User!
    postId: String!
    parentId: String
    children: [Comment]
    commentScores: [CommentScore]!
    score: Int!
    deleted: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    allComments(postId: String!): [Comment]!
  }

  extend type Mutation {
    createComment(content: String!, postId: String!, parentId: String): Comment!
    updateCommentScore(commentId: String!, direction: Int!): Comment!
  }
`;
