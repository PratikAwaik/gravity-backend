import { Community } from "@prisma/client";
import { Context } from "apollo-server-core";
import { IApolloContext } from "./context";

export interface IGetCommunityDetailsArgs {
  name: string;
}

export interface ICreateCommunityArgs {
  name: string;
  description: string;
}

export interface IUpdateCommunityArgs {
  communityId: string;
  description?: string;
  icon?: string;
}

export interface IJoinCommunityArgs {
  communityId: string;
}

export interface ILeaveCommunityArgs {
  communityId: string;
}

export interface ICommunityController {
  getAllCommunities(): Promise<Community[]>;
  getCommunityDetails(
    _: unknown,
    args: IGetCommunityDetailsArgs
  ): Promise<Community | null>;
  createCommunity(
    _: unknown,
    args: ICreateCommunityArgs,
    context: Context<IApolloContext>
  ): Promise<Community | Error>;
  joinCommunity(
    _: unknown,
    args: IJoinCommunityArgs,
    context: Context<IApolloContext>
  ): Promise<Community | Error>;
  leaveCommunity(
    _: unknown,
    args: ILeaveCommunityArgs,
    context: Context<IApolloContext>
  ): Promise<Community | Error>;
}
