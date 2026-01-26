import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import UserModel from "../models/user.model.js";
import MessageModel from "../models/message.model.js";

export const sendMessageAnonymously = asyncHandler(async (req, res) => {
    const { username, content } = req.body;

    try {
        if(!username || !content) throw new ApiError(400, "Username and message are requied");

        if(!content?.trim()) throw new ApiError(400, "Message cannot be empty");

        if(content?.length > 500) throw new ApiError(400, "Message to long");

        const user = await UserModel.findOne({username});

        if(!user) throw new ApiError(404, "Invalid username");

        const newMessage = await MessageModel.create({
            receiverId: user._id,
            content,
            isAnonymous: true
        });

        if(!newMessage) throw new ApiError(500, "Error while sending message, try again");

        return res.json(new ApiResponse(200,{}, "Message sent successfully"));

    } catch(error) {

        return res.status(500).json(new ApiError(500, "Error while sending message"));
    }
});