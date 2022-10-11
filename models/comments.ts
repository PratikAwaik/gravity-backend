import { Comment } from "@prisma/client";

export interface IGetCommentsArgs {
  postId: string;
}

export interface ICreateCommentArgs {
  content: string;
  postId: string;
  parentId?: string;
}

export interface ICommentsController {
  getComments(_: unknown, args: IGetCommentsArgs): Promise<Comment[]>;
}
