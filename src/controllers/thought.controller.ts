import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import ThoughtModel from "../models/thought.model.js";

export const shareThought = asyncHandler(async (req, res) => {
    
    const { thought } = req.body;

    if(!thought || !thought.trim()) {
        throw new ApiError(400, "Thought cannot be empty or contain only whitespace.");
    }

    const thoughtInfo: any = {
        thought: thought.trim(),
    }

    if(req.user?._id) {
        thoughtInfo.sharedBy = req.user._id;
    }    

    await ThoughtModel.create(thoughtInfo);

    return res.json(new ApiResponse(201, {}, "Your thought has been shared. Thank you for sharing."));
});