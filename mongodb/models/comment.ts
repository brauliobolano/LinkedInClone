import { IUser } from "@/types/user";
import mongoose, { Schema, Document, models } from "mongoose";

export interface ICommentBase {
  // Define the interface for the comment base object
  user: IUser;
  text: string;
}

export interface IComment extends ICommentBase, Document {
  // Define the interface for the comment object, which extends the comment base object and the mongoose Document
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>( // Create a new mongoose schema for the comment object using the IComment interface as the type argument for the Schema class
  {
    user: {
      userId: {
        type: String,
        required: true,
      },
      userImage: {
        type: String,
        required: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
      },
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Comment =
  models.Comment || mongoose.model<IComment>("Comment", commentSchema);
// Export the Comment model using the mongoose model function,
//passing the "Comment" string as the first argument and the commentSchema as the second argument.
//If the model already exists, use the existing model, otherwise create a new model using the commentSchema.
