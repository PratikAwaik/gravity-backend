import { Post } from "@prisma/client";
import { Context } from "apollo-server-core";
import { IApolloContext } from "./context";
import { Direction, MediaType, PostType } from "./enums";

export interface IGetAllPostArgs {
  pageNo?: number;
}

export interface IGetPostByIdArgs {
  postId: string;
}

export interface ICreatePostArgs {
  title: string;
  content: any;
  type: PostType;
  mediaType: MediaType;
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
  getPostById(
    _: unknown,
    args: IGetPostByIdArgs,
    context: Context<IApolloContext>
  ): Promise<Post | Error>;
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
