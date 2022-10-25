import { Post } from "@prisma/client";
import { Context } from "apollo-server-core";
import { IApolloContext } from "./context";
import { Direction, PostType } from "./enums";
export interface ICreatePostArgs {
  title: string;
  content: string;
  type: PostType;
  communityId: string;
}

export interface IUpdatePostArgs {
  postId: string;
  content: string;
}

export interface IDeletePostArgs {
  postId: string;
}

export interface IUpdatePostScoreArgs {
  postId: string;
  direction: Direction;
}

export interface IPostsController {
  getAllPosts(
    _: unknown,
    __: unknown,
    context: Context<IApolloContext>
  ): Promise<Post[]>;
  createPost(
    _: unknown,
    args: ICreatePostArgs,
    context: Context<IApolloContext>
  ): Promise<Post | Error>;
  updatePost(
    _: unknown,
    args: IUpdatePostArgs,
    context: Context<IApolloContext>
  ): Promise<Post | Error>;
  deletePost(
    _: unknown,
    args: IDeletePostArgs,
    context: Context<IApolloContext>
  ): Promise<Post | Error>;
  updatePostScore(
    _: unknown,
    args: IUpdatePostScoreArgs,
    context: Context<IApolloContext>
  ): Promise<Post | Error>;
}
