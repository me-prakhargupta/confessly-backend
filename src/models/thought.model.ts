import mongoose, {Schema, Document} from "mongoose";

export interface IThought extends Document {
    sharedBy?: mongoose.Types.ObjectId;
    thought: string;
    isDeleted: boolean;
};

const thoughtSchema = new Schema<IThought>({
    sharedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    thought: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});


const ThoughtModel = mongoose.model<IThought>("Thought", thoughtSchema);

export default ThoughtModel;