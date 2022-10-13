import { Comment } from "@prisma/client";
import { Direction } from "./enums";

export interface IGetCommentsArgs {
  postId: string;
}

export interface ICreateCommentArgs {
  content: string;
  postId: string;
  parentId?: string;
}

export interface IUpdateCommentScoreArgs {
  commentId: string;
  direction: Direction;
}

export interface ICommentsController {
  getComments(_: unknown, args: IGetCommentsArgs): Promise<Comment[]>;
}
