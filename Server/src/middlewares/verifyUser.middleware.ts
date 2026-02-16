import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors, JwtPayload } from "jsonwebtoken";
import { UserPayload } from "../types/index";

function verifyUser(req: Request, res: Response, next: NextFunction) {
  const { authToken } = req.cookies;
  if (!authToken) {
    res.status(401).json({ message: "Unauthorized, Please login" });
    return;
  }

  jwt.verify(
    authToken,
    process.env.JWT_SECRET!,
    (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err) {
        res.status(401).json({ message: "Unauthorized, Please login" });
        return;
      }
      req.user = decoded as UserPayload;
      next()
    }
  );
}

export default verifyUser;