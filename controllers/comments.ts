import { Comment } from "@prisma/client";
import { ICommentsController } from "../models/comments";
import prisma from "../utils/prisma";

export default class CommentsController implements ICommentsController {
  /**
   * get all comments
   */
  public getAllComments = async (): Promise<Comment[]> => {
    return await prisma.comment.findMany({});
  };

  /**
   * create comment
   */
  public createComment = async () => {};
}
