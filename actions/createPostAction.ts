"use server";

import { AddPostRequestBody } from "@/app/api/posts/route";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";

export default async function createPostAction(formData: FormData) {
  const user = await currentUser();
  // TODO //Read about implementing this from clerk auth().protect();

  if (!user) {
    throw new Error("You must be logged in to create a post");
  }

  const postInput = formData.get("postInput") as string;
  const image = formData.get("image") as File;
  let imageUrl: string | undefined;

  if (!postInput) {
    throw new Error("You must provide a post input");
  }

  // define the user
  const userDB: IUser = {
    userID: user.id,
    userImage: user.imageUrl,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
  };

  //upload the image IF it exists

  try {
    if (image.size > 0) {
      //1. upload the image if it exists
      //2. create the post in the database
    } else {
      //1. create the post in the database without the image

      const body: AddPostRequestBody  = {
        user: userDB,
        text: postInput,
      };

      await Post.create(body);
      // create the post in the database without the image
      //create is a mongoose method that creates a new document in the database
      //Post is the model we imported from mongodb/models/post.ts that represents the Post collection in the database and provides methods to interact with the collection
    }
  } catch (error: any) {
    throw new Error(`Failed to create post: ${error}.`);
  }
  //revaidatePath
}
