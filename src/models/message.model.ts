import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    content: string;
    isAnonymous: boolean;
    status: string;
    isDeleted: boolean;
    deletedAt: Date;
};

const messageSchema = new Schema<IMessage>({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        trim: true,
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxLength: 500
    },
    isAnonymous: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ["sent", "delivered", "seen"],
        default: "sent"
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
}, {timestamps: true});

const MessageModel = mongoose.model<IMessage>("Message", messageSchema);

export default MessageModel;