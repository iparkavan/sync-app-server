import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("You are not authenticated!");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.JWT_KEY as string,
    (err: VerifyErrors | null, decoded: any) => {
      if (err) return res.status(403).send("Token is not valid");

      const payload = decoded as JwtPayload & { id?: string };
      req.userId = payload.userId || ""; // 👈 attaches userId to request
      next();
    }
  );
};
