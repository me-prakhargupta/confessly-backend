import mongoose, {Schema, Document} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } from "../config/env.js";

export interface User extends Document {
    fullname: string;
    username: string;
    email: string;
    password: string;
    profileImage: string;
    refreshToken: string;
    thoughtsCount: number;
    isVerified: boolean;
    emailVerificationToken: string | null;
    emailVerificationExpiry: Date | null;
    isPrivate: boolean;

    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): Promise<string>;
    generateRefreshToken(): Promise<string>;
}

const userSchema = new Schema<User>({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[a-z0-9_]+$/, "Username can only contain a-z, 0-9 and _"]
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String, 
        required: true,
        minlength: [7, "Password must be at least 7 characters long"],
        maxlength: [21, "Password must be at most 21 characters long"],
    },
    profileImage: {
        type: String,
        default: ""
    },
    refreshToken: {
        type: String,
        default: ""
    },
    thoughtsCount: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
        default: null
    },
    emailVerificationExpiry: {
        type: Date,
        default: null
    },
    isPrivate: {
        type: Boolean,
        default: false,
    }
    
}, {timestamps: true});

userSchema.pre("save", async function() {
    try {
        if(!this.isModified("password")) return;

        this.password = await bcrypt.hash(this.password, 10);
    } catch(error) {
        console.log("Error while saving password: ", error);
    }
});

userSchema.methods.isPasswordCorrect = async function(password: string) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function() {
    
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email
        }, 
        ACCESS_TOKEN_SECRET, 
        {
            expiresIn: ACCESS_TOKEN_EXPIRY
        }
    );
};

userSchema.methods.generateRefreshToken = async function() {
    return jwt.sign({
        _id: this._id,
    }, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY
    })
};

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;