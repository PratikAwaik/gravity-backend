import { Community } from "@prisma/client";
import { Context } from "apollo-server-core";
import {
  ICommunityController,
  ICreateCommunityArgs,
} from "../models/community";
import { IApolloContext } from "../models/context";
import { handleAuthenticationError, handleError } from "../utils/errors";
import prisma from "../utils/prisma";
import { validateCreateCommunityDetails } from "../validations/community";

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
  ): Promise<Community | void> => {
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
        },
      });
      return community;
    } catch (error) {
      handleError(error);
    }
  };
}
