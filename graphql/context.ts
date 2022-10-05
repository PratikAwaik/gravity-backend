/* Apollo Server Context */
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../utils/prisma";

export const context = async ({ req }: { req: any }) => {
  const auth = req ? req.headers.authorization : null;
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    const decodedToken = jwt.verify(
      auth.substring(7),
      process.env.JWT_SECRET || ""
    );
    const currentUser = await prisma.user.findFirst({
      where: {
        id: (decodedToken as JwtPayload).id,
      },
    });
    return { currentUser };
  }
};
