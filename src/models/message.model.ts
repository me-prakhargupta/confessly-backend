import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
    sender?: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    message: string;

    status: "sent" | "delivered" | "read";
    readAt?: Date;

    isDeleted: boolean;
    deletedAt?: Date;
};

const messageSchema = new Schema<IMessage>({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxLength: 500
    },
    status: {
        type: String,
        default: "sent"
    },
    readAt: {
        type: Date,
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