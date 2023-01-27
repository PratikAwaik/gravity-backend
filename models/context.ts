import { User } from "@prisma/client";

export interface IApolloContext {
  currentUser: User;
}
