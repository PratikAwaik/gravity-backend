import { Post } from "@prisma/client";
import { Context } from "apollo-server-core";
import { IApolloContext } from "./context";

enum PostType {
  TEXT = "TEXT",
  MEDIA = "MEDIA",
  LINK = "LINK",
}

export interface ICreatePostArgs {
  title: string;
  content: string;
  type: PostType;
  communityId: string;
}

export interface IUpdatePostScoreArgs {
  postId: string;
  direction: number;
}

export interface IPostsController {
  getAllPosts(): Promise<Post[]>;
  createPost(
    _: unknown,
    args: ICreatePostArgs,
    context: Context<IApolloContext>
  ): Promise<Post | void>;
  updatePostScore(
    _: unknown,
    args: IUpdatePostScoreArgs,
    context: Context<IApolloContext>
  ): Promise<Post>;
}
