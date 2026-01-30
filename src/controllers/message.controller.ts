import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import UserModel from "../models/user.model.js";
import MessageModel from "../models/message.model.js";
import type{ Request, Response } from "express";

interface AuthRequest extends Request {
    user?: {
        _id: string;
    };
}

export const sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { username, message } = req.body;
    if(!username || !message) {
        throw new ApiError(400, "Please provide a username and a message to continue");
    }
    
    const cleanContent = message.trim();
    if(!cleanContent) {
        throw new ApiError(400, "Please enter a message before continuing.");
    }
    if(cleanContent?.length > 300) {
        throw new ApiError(400, "Please keep your message under 300 characters.");
    }

    const user = await UserModel.findOne({username});

    if(!user) {
        throw new ApiError(404, "User not found");
    }
     
    const messageInfo: any = {
        receiver: user._id,
        message,
    };
    
    if(req.user?._id) {
        messageInfo.sender = req.user._id;
    }

    await MessageModel.create(messageInfo);
    
    return res
        .status(201)
        .json(new ApiResponse(201,{}, "Your message has been sent successfully."));
});