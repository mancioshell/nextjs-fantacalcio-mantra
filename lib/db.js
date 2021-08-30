import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  socketTimeoutMS: 1000,
};

let client;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to env variable");
}

client = new MongoClient(uri, options);

const getConnection = async () => {
  await client.connect();
  const database = client.db(process.env.DB_NAME);
  return { database, client };
};

export { getConnection, ObjectId };

export default getConnection;
