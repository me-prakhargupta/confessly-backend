import jwt, { type JwtPayload } from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ACCESS_TOKEN_SECRET } from "../config/env.js";

declare global {
    namespace Express {
        interface Request {
            user?: { _id: string };
        }
    }
}

export const verifyToken = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken;

    if(!token) {
        throw new ApiError(401, "Unauthorized.");
    }

    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload & {_id: string};
        req.user = { _id: decoded._id };
        next();
    } catch(error) {
        throw new ApiError(401, "Unauthorized.");
    }
});

export const optionalVerifyToken = asyncHandler(async (req, resizeBy, next) => {
    const token = req.cookies?.accessToken;

    if(!token) return next();

    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload & { _id: string };

        req.user = { _id: decoded._id };
    } catch(err) {
    }

     next();
})