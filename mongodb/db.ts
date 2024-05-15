import mongoose from "mongoose";

const connectionString = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@braulio-tier-tier.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`;

if (!connectionString) {
  // Check if the connection string is defined
  throw new Error( // If not, throw an error
    "Please define the MONGO_DB_USERNAME and MONGO_DB_PASSWORD environment variables inside .env.local"
  );
}

const connectDB = async () => {
  // Create a function to connect to the database and export it as a default function to be used in other files
  if (mongoose.connection?.readyState >= 1) {
    //console.log("Already connected to the database");
    return; // If the connection is already open, return and do nothing else
  }

  try {
    // Try to connect to the database
    console.log("Connecting to the database");
    await mongoose.connect(connectionString); // Connect to the database using the connection string
  } catch (error) {
    console.log("Error connecting to the database: ", error);
  }
};

export default connectDB;
