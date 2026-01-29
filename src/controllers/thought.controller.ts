import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import ThoughtModel from "../models/thought.model.js";

export const shareThought = asyncHandler(async (req, res) => {
    
    const { thought } = req.body;

    if(!thought) {
        throw new ApiError(400, "Thought cannot be empty or contain only whitespace.");
    }
    
    const newThought = await ThoughtModel.create({
        thought
    })

    if(!newThought) {
        throw new ApiError(500, "Failed to share the thought. Please try again.")
    }

    return res.json(new ApiResponse(201, {}, "Your thought has been shared. Thank you for sharing."));
});