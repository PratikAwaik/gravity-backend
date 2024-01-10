import {Community} from "@prisma/client";
import {Context} from "apollo-server-core";
import {
  ICommunityController,
  ICreateCommunityArgs,
  IGetCommunityDetailsArgs,
  IGetSearchedCommunitiesArgs,
  IJoinCommunityArgs,
  ILeaveCommunityArgs,
  IUpdateCommunityArgs,
} from "../models/community";
import {IApolloContext} from "../models/context";
import {PAGINATION_LIMIT} from "../utils/constants";
import {
  handleAuthenticationError,
  handleError,
  throwForbiddenError,
} from "../utils/errors";
import prisma from "../utils/prisma";
import {
  validateCreateCommunityDetails,
  validateGetCommunityDetailsArgs,
  validateJoinCommunityArgs,
  validateLeaveCommunityArgs,
  validateUpdateCommunityArgs,
} from "../validations/community";
import cloudinary from "../utils/cloudinary";

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
   * get searched communities
   */
  public getSearchCommunities = async (
    _: unknown,
    args: IGetSearchedCommunitiesArgs
  ): Promise<Community[] | null> => {
    return await prisma.community.findMany({
      where: {
        name: {
          contains: args.search ?? "",
          mode: "insensitive",
        },
      },
      orderBy: {
        membersCount: "desc",
      },
      skip: (args.pageNo ?? 0) * PAGINATION_LIMIT,
      take: args.limit ?? PAGINATION_LIMIT,
    });
  };

  /**
   * get community details
   */
  public getCommunityDetails = async (
    _: unknown,
    args: IGetCommunityDetailsArgs,
    context: Context<IApolloContext>
  ): Promise<Community | null> => {
    validateGetCommunityDetailsArgs(args);
    return await prisma.community.findUnique({
      where: {
        name: args.name,
      },
      include: {
        admin: true,
        members: {
          where: {
            id: context?.currentUser?.id,
          },
        },
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
          adminId: context?.currentUser?.id,
          members: {
            connect: {
              id: context?.currentUser?.id,
            },
          },
          membersCount: 1,
          updatedAt: null,
        },
      });

      await prisma.user.update({
        where: {
          id: context?.currentUser?.id,
        },
        data: {
          karma: {
            increment: 10,
          },
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

    const payload = args.payload;

    try {
      const community = await prisma.community.findUniqueOrThrow({
        where: {
          id: payload.communityId,
        },
      });

      if (community?.adminId !== context.currentUser.id) {
        throwForbiddenError();
      }

      let uploadedMedia;

      if (payload?.icon?.content) {
        if (payload.icon.publicId) {
          await cloudinary.uploader.destroy(payload.icon.publicId);
        }

        uploadedMedia = await cloudinary.uploader.upload(
          payload?.icon.content,
          {
            resource_type: "auto",
            folder: "gravityuploads",
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
          }
        );
      }

      // dont update in database if the file is already uploaded in DB, since we are just updating the same asset in cloudinary
      return await prisma.community.update({
        where: {
          id: payload.communityId,
        },
        data: {
          description: payload.description ?? community.description,
          icon: payload.icon?.content && {
            url: uploadedMedia?.secure_url,
            publicId: uploadedMedia?.public_id,
          },
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
