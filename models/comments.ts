import { Comment } from "@prisma/client";

export interface ICommentsController {
  getAllComments(): Promise<Comment[]>;
}
