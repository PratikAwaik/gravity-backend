import { UserInputError } from "apollo-server";
import {
  ICreateCommunityArgs,
  IUpdateCommunityArgs,
} from "../models/community";
import { throwError } from "../utils/errors";

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
  if (!args.communityId) {
    throwError(UserInputError, "communityId is required");
  }
};
