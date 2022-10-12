import { gql } from "apollo-server-core";

export const typeDef = gql`
  type PostScore {
    id: ID!
    postId: String!
    post: Post!
    userId: String!
    user: User!
    direction: Int!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    authorId: String!
    author: User!
    communityId: String!
    community: Community!
    type: PostType!
    comments: [Comment]!
    postScores: [PostScore]!
    score: Int!
    deleted: Boolean!
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

  extend type Mutation {
    createPost(
      title: String!
      content: String!
      type: PostType!
      communityId: String!
    ): Post!
    updatePostScore(postId: String!, direction: Int!): Post!
  }
`;
