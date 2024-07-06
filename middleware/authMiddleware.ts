import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({ message: "Token error" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: "Token malformatted" });
  }

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token invalid" });

    // Check if decoded is an object and has property id
    if (typeof decoded === "object" && "id" in decoded) {
      // If the token is valid, you can add user information to the request
      req.userId = (decoded as JwtPayload).id;
    }

    return next();
  });
};

export default authMiddleware;
