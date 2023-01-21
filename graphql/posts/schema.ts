import { gql } from "apollo-server-core";

export const typeDef = gql`
  type PostScore {
    id: ID!
    postId: String!
    post: Post!
    userId: String!
    user: User!
    direction: Direction!
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
    mediaType: MediaType
    articleImage: String
    comments: [Comment]!
    postScores: [PostScore]
    score: Int!
    commentsCount: Int!
    deleted: Boolean!
    createdAt: Float!
    updatedAt: Float
  }

  enum PostType {
    TEXT
    MEDIA
    ARTICLE
  }

  enum MediaType {
    image
    video
  }

  extend type Query {
    allPosts(pageNo: Int, communityId: String): [Post]!
    getPostById(postId: String!): Post!
  }

  extend type Mutation {
    createPost(
      title: String!
      content: String!
      type: PostType!
      communityId: String!
    ): Post!
    updatePost(postId: String!, content: String!): Post!
    deletePost(postId: String!): Post!
    updatePostScore(postId: String!, direction: Direction!): Post!
  }
`;
