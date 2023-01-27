import { Comment, CommentScore, Post, PostScore } from "@prisma/client";
import { IUpdateCommentScoreArgs } from "../models/comments";
import { Direction } from "../models/enums";
import { IUpdatePostScoreArgs } from "../models/posts";

export const getScore = (
  args: IUpdatePostScoreArgs | IUpdateCommentScoreArgs,
  entity: Post | Comment,
  entityScore: PostScore | CommentScore | null,
  userKarma: number
): { score: number; userKarma: number } => {
  if (!entityScore) {
    if (args.direction === Direction.UPVOTE) {
      // upvote
      return { score: (entity?.score ?? 0) + 1, userKarma: userKarma + 1 };
    } else if (args.direction === Direction.DOWNVOTE) {
      // downvote
      return { score: (entity?.score ?? 0) - 1, userKarma: userKarma - 1 };
    }
  } else {
    if (
      entityScore.direction === Direction.UNVOTE &&
      args.direction === Direction.UPVOTE
    ) {
      // upvote
      return { score: (entity?.score ?? 0) + 1, userKarma: userKarma + 1 };
    } else if (
      entityScore.direction === Direction.UNVOTE &&
      args.direction === Direction.DOWNVOTE
    ) {
      // downvote
      return { score: (entity?.score ?? 0) - 1, userKarma: userKarma - 1 };
    } else if (
      entityScore.direction === Direction.UPVOTE &&
      args.direction === Direction.UNVOTE
    ) {
      // unvote
      return { score: (entity?.score ?? 0) - 1, userKarma: userKarma - 1 };
    } else if (
      entityScore.direction === Direction.UPVOTE &&
      args.direction === Direction.DOWNVOTE
    ) {
      // downvote
      return { score: (entity?.score ?? 0) - 2, userKarma: userKarma - 2 };
    } else if (
      entityScore.direction === Direction.DOWNVOTE &&
      args.direction === Direction.UNVOTE
    ) {
      // unvote
      return { score: (entity?.score ?? 0) + 1, userKarma: userKarma + 1 };
    } else if (
      entityScore.direction === Direction.DOWNVOTE &&
      args.direction === Direction.UPVOTE
    ) {
      // upvote
      return { score: (entity?.score ?? 0) + 2, userKarma: userKarma + 2 };
    }
  }
  return { score: entity?.score ?? 0, userKarma };
};

export const getInfiniteNestedCommentsQuery = (
  query: any,
  initialQuery: any,
  depth = 20
): any => {
  if (depth === 0) return query;
  const newQuery = JSON.parse(JSON.stringify(initialQuery));
  newQuery.include.children = query;
  return getInfiniteNestedCommentsQuery(newQuery, initialQuery, depth - 1);
};
