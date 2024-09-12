import mongoose, { Schema } from "mongoose";

const UsersSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: false },
    image: { type: String, required: false },
  },
  { timestamps: true }
);

const Users = mongoose.models.Users || mongoose.model("Users", UsersSchema);
export default Users