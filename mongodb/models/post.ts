import { IUser } from "@/types/user";
import mongoose, { Schema, Document, models, Model } from "mongoose";
import { IComment, ICommentBase, Comment } from "./comment";

export interface IPostBase {
  //Define the base properties of a post (without the timestamps)
  user: IUser;
  text: string;
  imageUrl?: string;
  comments?: IComment[];
  likes?: string[];
}

export interface IPost extends IPostBase, Document {
  //Define the properties of a post (with the timestamps)
  createdAt: Date;
  updatedAt: Date;
}

// Define the document method (for each instance of a post);
interface IPostMethods {
  likePost(userId: string): Promise<void>;
  //The method returns a Promise that resolves to void, indicating an asynchronous operation that doesn't return a value.
  unlikePost(userId: string): Promise<void>;
  commentOnPost(comment: IComment): Promise<void>;
  getAllComments(): Promise<IComment[]>;
  //It doesn't take any parameters and returns a Promise that resolves to an array of IComment objects.
  removePost(): Promise<void>;
}

interface IPostStatics {
  getAllPosts(): Promise<IPostDocument[]>;
  //It doesn't take any parameters and returns a Promise that resolves to an array of IPostDocument objects. This method is a static method, which means it's called on the model itself, not on an instance of the model.
}

export interface IPostDocument extends IPost, IPostMethods {} //Singular instance of a post

interface IPostModel extends IPostStatics, Model<IPostDocument> {} //all posts

const PostSchema = new Schema<IPostDocument>(
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
    imageUrl: {
      type: String,
    },
    comments: {
      type: [Schema.Types.ObjectId],
      //An array of ObjectIds that reference the Comment model (the _id field of the Comment model) to establish a relationship between the Post and Comment models.
      ref: "Comment",
      default: [],
    },
    likes: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

PostSchema.methods.likePost = async function (userId: string) {
  try {
    await this.updateOne({ $addToSet: { likes: userId } });
    // $addToSet adds a value to an array if it doesn't already exist in the array
  } catch (error) {
    console.log("Error liking post: ", error);
  }
};

PostSchema.methods.unlikePost = async function (userId: string) {
  try {
    await this.updateOne({ $pull: { likes: userId } });
    // $pull removes all instances of a value from an array
  } catch (error) {
    console.log("Error unliking post: ", error);
  }
};

PostSchema.methods.removePost = async function () {
  // removePost method to delete a post from the database
  try {
    await this.model("Post").deleteOne({ _id: this._id }); //deleteOne method to delete the post with the _id of the current instance
  } catch (error) {
    console.log("Error removing post: ", error);
  }
};

PostSchema.methods.commentOnPost = async function (commentToAdd: IComment) {
  try {
    const comment = await Comment.create(commentToAdd);
    //create a new comment using the Comment model and the commentToAdd object passed as an argument
    this.comments.push(comment._id); //push the _id of the newly created comment to the comments array of the current post
    await this.save(); //save the changes to the post document
  } catch (error) {
    console.log("Error commenting on post: ", error);
  }
};

PostSchema.methods.getAllComments = async function () {
  //getAllComments method to get all comments associated with a post
  try {
    await this.populate({
      // populate comments field with comments data from the Comment model
      path: "comments",

      options: { sort: { createdAt: -1 } }, //sort comments by newest first to oldest
    });
    return this.comments;
  } catch (error) {
    console.log("Error getting all comments: ", error);
  }
};

PostSchema.statics.getAllPosts = async function () {
  try {
    const posts = await this.find() //  find all posts in the database and sort them by createdAt date in descending order
      .sort({ createdAt: -1 })
      .populate({
        path: "comments",

        options: { sort: { createdAt: -1 } }, //sort comments by newest first});
      })
      .lean();
    //Step 1: lean() covert mongoose objects to plain JavaScript objects
    //Step 2: This is done to ensure that the _id and comments fields are converted to strings before returning the data to the client.
    //Step 3: We are gonna map (over each post) to convert (the _id and comments) from javascript objects fields to strings.
    return posts.map((post: IPostDocument) => ({
      //map over each post and return a new object with the _id and comments fields converted to strings
      ...post,
      _id: post._id.toString(),
      comments: post.comments?.map((comment: IComment) => ({
        //map over each comment in the comments array and return a new object with the _id field
        //converted to a string

        ...comment,
        _id: comment._id.toString(),
      })),
    }));
  } catch (error) {
    console.log("Error getting all posts: ", error);
  }
};

export const Post =
  (models.Post as IPostModel) ||
  mongoose.model<IPostDocument, IPostModel>("Post", PostSchema);
//the model name ("Post") and the PostSchema.
//This prevents the model from being redefined if it has already been defined in the application.
//Prevent hot-reloading issues when the model is imported in multiple files.
