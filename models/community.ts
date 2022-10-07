import { Community } from "@prisma/client";
import { Context } from "apollo-server-core";
import { IApolloContext } from "./context";

export interface ICreateCommunityArgs {
  name: string;
  description: string;
}

export interface ICommunityController {
  getAllCommunities(): Promise<Community[]>;
  createCommunity(
    _: unknown,
    args: ICreateCommunityArgs,
    context: Context<IApolloContext>
  ): Promise<Community | void>;
}
