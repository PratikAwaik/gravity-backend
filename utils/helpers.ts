import { Comment, CommentScore, Post, PostScore } from "@prisma/client";
import { Context } from "apollo-server-core";
import { IUpdateCommentScoreArgs } from "../models/comments";
import { IApolloContext } from "../models/context";
import { Direction } from "../models/enums";
import { IUpdatePostScoreArgs } from "../models/posts";

export const getScore = (
  args: IUpdatePostScoreArgs | IUpdateCommentScoreArgs,
  entity: Post | Comment,
  entityScore: PostScore | CommentScore | null
): number => {
  if (!entityScore) {
    if (args.direction === Direction.UPVOTE) {
      // upvote
      return (entity?.score ?? 0) + 1;
    } else if (args.direction === Direction.DOWNVOTE) {
      // downvote
      return (entity?.score ?? 0) - 1;
    }
  } else {
    if (
      entityScore.direction === Direction.UNVOTE &&
      args.direction === Direction.UPVOTE
    ) {
      // upvote
      return (entity?.score ?? 0) + 1;
    } else if (
      entityScore.direction === Direction.UNVOTE &&
      args.direction === Direction.DOWNVOTE
    ) {
      // downvote
      return (entity?.score ?? 0) - 1;
    } else if (
      entityScore.direction === Direction.UPVOTE &&
      args.direction === Direction.UNVOTE
    ) {
      // unvote
      return (entity?.score ?? 0) - 1;
    } else if (
      entityScore.direction === Direction.UPVOTE &&
      args.direction === Direction.DOWNVOTE
    ) {
      // downvote
      return (entity?.score ?? 0) - 2;
    } else if (
      entityScore.direction === Direction.DOWNVOTE &&
      args.direction === Direction.UNVOTE
    ) {
      // unvote
      return (entity?.score ?? 0) + 1;
    } else if (
      entityScore.direction === Direction.DOWNVOTE &&
      args.direction === Direction.UPVOTE
    ) {
      // upvote
      return (entity?.score ?? 0) + 2;
    }
  }
  return 0;
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
