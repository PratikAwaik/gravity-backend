import {UserInputError} from "apollo-server";
import {
  ICreateCommunityArgs,
  IGetCommunityDetailsArgs,
  IJoinCommunityArgs,
  ILeaveCommunityArgs,
  IUpdateCommunityArgs,
} from "../models/community";
import {throwError} from "../utils/errors";

export const validateGetCommunityDetailsArgs = (
  args: IGetCommunityDetailsArgs
) => {
  if (!args.name) {
    throwError(UserInputError, "community name is required");
  }
};

export const validateCreateCommunityDetails = (args: ICreateCommunityArgs) => {
  if (args?.name?.length < 3) {
    throwError(
      UserInputError,
      "Community name should be more than 3 characters"
    );
  } else if (args?.name?.length > 21) {
    throwError(
      UserInputError,
      "Community name should be less than 21 characters"
    );
  } else if (args?.description?.length < 10) {
    throwError(
      UserInputError,
      "Description of the community should not be less than 10 characters"
    );
  }
};

export const validateUpdateCommunityArgs = (args: IUpdateCommunityArgs) => {
  if (!args.payload.communityId) {
    throwError(UserInputError, "communityId is required");
  }
};

export const validateJoinCommunityArgs = (args: IJoinCommunityArgs) => {
  if (!args.communityId) {
    throwError(UserInputError, "communityId is required");
  }
};

export const validateLeaveCommunityArgs = (args: ILeaveCommunityArgs) => {
  if (!args.communityId) {
    throwError(UserInputError, "communityId is required");
  }
};
