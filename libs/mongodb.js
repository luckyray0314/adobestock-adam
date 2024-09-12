import { mongoose } from "mongoose"

export async function connect() {
  const client =  await mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI)
  return client.connection;
}