import { Community } from "@prisma/client";
import { Context } from "apollo-server-core";
import {
  ICommunityController,
  ICreateCommunityArgs,
  IJoinCommunityArgs,
  ILeaveCommunityArgs,
  IUpdateCommunityArgs,
} from "../models/community";
import { IApolloContext } from "../models/context";
import {
  handleAuthenticationError,
  handleError,
  throwForbiddenError,
} from "../utils/errors";
import prisma from "../utils/prisma";
import {
  validateCreateCommunityDetails,
  validateJoinCommunityArgs,
  validateLeaveCommunityArgs,
  validateUpdateCommunityArgs,
} from "../validations/community";

export default class CommunityController implements ICommunityController {
  /**
   * get all communities
   */
  public getAllCommunities = async (): Promise<Community[]> => {
    return await prisma.community.findMany({
      include: {
        members: true,
      },
    });
  };

  /**
   * create community
   */
  public createCommunity = async (
    _: unknown,
    args: ICreateCommunityArgs,
    context: Context<IApolloContext>
  ): Promise<Community | Error> => {
    handleAuthenticationError(context);
    validateCreateCommunityDetails(args);

    try {
      const community = await prisma.community.create({
        data: {
          name: args.name,
          prefixedName: "c/" + args.name,
          description: args.description,
          adminId: context.currentUser.id,
          members: {
            connect: {
              id: context.currentUser.id,
            },
          },
          membersCount: 1,
          updatedAt: null,
        },
      });
      return community;
    } catch (error) {
      return handleError(error as Error);
    }
  };

  /**
   * update community
   */
  public updateCommunity = async (
    _: unknown,
    args: IUpdateCommunityArgs,
    context: Context<IApolloContext>
  ) => {
    handleAuthenticationError(context);
    validateUpdateCommunityArgs(args);

    try {
      const community = await prisma.community.findUniqueOrThrow({
        where: {
          id: args.communityId,
        },
      });

      if (community?.adminId !== context.currentUser.id) {
        throwForbiddenError();
      }

      return await prisma.community.update({
        where: {
          id: args.communityId,
        },
        data: {
          description: args.description ?? community.description,
          icon: args.icon ?? community.icon,
        },
      });
    } catch (error) {
      return handleError(error as Error);
    }
  };

  /**
   * join community
   */
  public joinCommunity = async (
    _: unknown,
    args: IJoinCommunityArgs,
    context: Context<IApolloContext>
  ): Promise<Community | Error> => {
    handleAuthenticationError(context);
    validateJoinCommunityArgs(args);

    return await prisma.community.update({
      where: {
        id: args?.communityId,
      },
      data: {
        members: {
          connect: {
            id: context?.currentUser?.id,
          },
        },
        membersCount: {
          increment: 1,
        },
      },
      include: {
        members: {
          where: {
            id: context?.currentUser?.id,
          },
        },
      },
    });
  };

  /**
   * leave community
   */
  public leaveCommunity = async (
    _: unknown,
    args: ILeaveCommunityArgs,
    context: Context<IApolloContext>
  ): Promise<Community | Error> => {
    handleAuthenticationError(context);
    validateLeaveCommunityArgs(args);

    return await prisma.community.update({
      where: {
        id: args?.communityId,
      },
      data: {
        members: {
          disconnect: {
            id: context?.currentUser?.id,
          },
        },
        membersCount: {
          decrement: 1,
        },
      },
      include: {
        members: {
          where: {
            id: context?.currentUser?.id,
          },
        },
      },
    });
  };
}
