import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    req.user = decoded; // store user in request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};