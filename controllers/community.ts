import { handleAuthenticationError, handleError } from "../utils/errors";
import prisma from "../utils/prisma";
import { validateCreateSubredditDetails } from "../validations/community";

export default class CommunityController {
  /**
   * get all communities
   */
  static getAllCommunities = async () => {
    return await prisma.community.findMany({
      include: {
        members: true,
      },
    });
  };

  /**
   * create community
   */
  static createCommunity = async (_: any, args: any, context: any) => {
    handleAuthenticationError(context);
    validateCreateSubredditDetails(args);

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
      console.log(error);
      handleError(error);
    }
  };
}
