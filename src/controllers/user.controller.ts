import { asyncHandler } from "../utils/asyncHandler.js";
import UserModel from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Types } from "mongoose";
import { generatOTP, hashOTP } from "../utils/otp.js";

type Tokens = {
    accessToken: string;
    refreshToken: string;
}

const generateRefreshAccessToken = async(userId: Types.ObjectId | string): Promise<Tokens> => {
    try {
        const user = await UserModel.findById(userId);

        if(!user) throw new ApiError(400, "User not found while generating tokens");

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return { accessToken, refreshToken };

    } catch(error) {
        throw new ApiError(500, "Error while generating tokens");
    }
};

// const generateEmailVerificationToken = async(userId: Types.ObjectId | string): Promise<string> => {
//     try {
//         const user = await UserModel.findById(userId);
//         if(!user) throw new ApiError(400, "User not found while generating verification token");

//         const otp = generatOTP();
//         const hashedOTP = hashOTP(otp);

//         user.emailVerificationToken = hashedOTP;

//         //Verification token is valid for three days
//         user.emailVerificationExpiry = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

//         await user.save({validateBeforeSave: false});
//         console.log("Verification code: ", otp);

//         return otp;

//     } catch(error) {
//         throw new ApiError(500, "Error while generating verification code");
//     }
// }

 const cookieOptions = {
        httpsOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const
};

const signupUser = asyncHandler(async (req, res) => {
    const { fullname, username, email, password } = req.body;

    if([fullname, username, email, password]
        .some((field) => field?.trim() === "")) {
            throw new ApiError(400, "Missing required fields. Please provide all mandatory details.");
        }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new ApiError(400, "Invalid email format.");
    }

    if(password.length < 7) {
        throw new ApiError(400, "Password must be at least 7 characters long");
    }

    const existedUser =  await UserModel.findOne({
        $or: [{username}, {email}]
    });

    if(existedUser) throw new ApiError(409, "An account with this email or username already exists.");

    const user = await UserModel.create({
        fullname,
        username,
        email,
        password
    });

    const { accessToken, refreshToken } = await generateRefreshAccessToken(user._id);

    // const { otp } = await generateEmailVerificationToken(user._id);

    const createdUser = await UserModel.findById(user._id).select("-password -coverImage -refreshToken -isAcceptingMessage -isVerified -isVisible");
    
    if(!createdUser) throw new ApiError(500, "Something went wrong, try again");

    return res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
        new ApiResponse(201, {user: createdUser},
            "Your account has been created successfully. We’re glad to have you with us."
        )
    )

});

const signinUser = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;

    if(!identifier) throw new ApiError(400, "Please provide your username or email to continue.");

    if(!password) {
        throw new ApiError(400, "Please enter your password to continue.");
    }

    const user = await UserModel.findOne({
        $or: [{email: identifier}, {username: identifier}]
    });

    if(!user) throw new ApiError(401, "Invalid username/email or password.")

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid) throw new ApiError(401, "Invalid username/email or password.");

    const {accessToken, refreshToken } = await generateRefreshAccessToken(user._id);

    const loggedInUser = await UserModel.findById(user._id).select("-password -coverImage -refreshToken -isAcceptingMessage -isVerified -isVisible");

    return res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
        new ApiResponse(200, {user: loggedInUser},
            "Welcome back. You’ve been logged in successfully."
        )
    )
});

const getMeUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if(!userId) {
        throw new ApiError(401, "Please sign in to continue.");
    }

    const user = await UserModel.findById(userId).select("-password refreshToken");

    if(!user) {
        throw new ApiError(401, "Unauthorized");
    }

    return res.json(new ApiResponse(200, user));
});

const logoutUser = asyncHandler(async (req, res) => {
    if(!req.user?._id) throw new ApiError(400, "User not found");
    
    await UserModel.findByIdAndUpdate(req.user._id, {
        $unset: {refreshToken: ""}
    }, {
        new: true
    })
    
    return res.status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User log out successfully"))
});

// const verifyUser = asyncHandler(async (req, res) => {
//     const { email, code } = req.body

//     if(!email || !code) throw new ApiError(500, "Email and verification code are required");

//     const user = await UserModel.findOne(email);

//     if(!user) throw new ApiError(404, "User not found");

//     if(user.isVerified) return new ApiResponse(200, {}, "User alredy verified");

//     if(!user.emailVerificationToken || !user.emailVerificationExpiry) {
//         throw new ApiError(400, "No verification request found");
//     }

//     if(user.emailVerificationExpiry < new Date()) {
//         throw new ApiError(400, "Verification code expired");
//     }

//     const hashedOTP = hashOTP(code);

//     if(hashedOTP !== user.emailVerificationToken) {
//         throw new ApiError(404, "Invalid verification code");
//     }

//     user.isVerified = true;
//     user.emailVerificationToken = null;
//     user.emailVerificationExpiry = null;

//     await user.save({validateBeforeSave: false});

//     return res.json(new ApiResponse(200, {}, "Email verified successfully"));
// });


// const acceptMessage = asyncHandler(async (req, res) => {
//     const { isAccepting } = req.body

//     try {
//         await UserModel.findByIdAndUpdate(
//             req.user?._id,
//             { acceptMessages: isAccepting},
//             {new: true}
//         );

//         return res.json(new ApiResponse(200, {}, "Updated successfully"));

//     } catch(error) {
//         throw new ApiError(200, "Internal server error");
//     }

// });


//Update user password or change user password
// const changePassword = asyncHandler(async (req, res) => {

// });

// Update user's username or email
// const updateAccountDetails = asyncHandler(async (req, res) => {

// });

//Update user cover image
// const updateCoverImage = asyncHandler(async (req, res) => {

// });

//Remove user cover image
// const removeCoverImage = asyncHandler(async (req, res) => {

// })

export {
    signupUser,
    signinUser,
    getMeUser,
    logoutUser,
    // verifyUser,
    // acceptMessage
}