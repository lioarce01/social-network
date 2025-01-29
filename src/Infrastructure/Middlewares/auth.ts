import { Request, Response, NextFunction } from "express";
import { expressjwt, GetVerificationKey } from "express-jwt";
import jwks from "jwks-rsa";
import { config } from "dotenv";
import { CustomError } from "../../Shared/CustomError";

config();

const authConfig = {
  auth0Domain: process.env.AUTH0_DOMAIN,
  auth0Audience: process.env.AUTH0_AUDIENCE,
};

declare global {
  namespace Express {
    interface Request {
      auth?: {
        sub: string;
        [key: string]: any;
      };
    }
  }
}

export class AuthMiddleware {
  constructor() {}

  public authenticate() {
    return expressjwt({
      secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${authConfig.auth0Domain}/.well-known/jwks.json`,
      }) as GetVerificationKey,
      audience: authConfig.auth0Audience,
      issuer: `https://${authConfig.auth0Domain}/`,
      algorithms: ["RS256"],
      requestProperty: "auth",
    });
  }

  public handleError(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (err.name === "UnauthorizedError") {
      return res.status(401).json({
        code: 401,
        error: "UNAUTHORIZED",
        message: "Invalid or missing authentication token",
        details: err.inner?.message,
      });
    }

    if (err instanceof CustomError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    next(err);
  }

  public requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.auth?.sub) {
      return res.status(401).json({
        code: 401,
        error: "AUTH_REQUIRED",
        message: "Authentication required to access this resource",
      });
    }
    next();
  }
}
