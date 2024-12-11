import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  profileId: { type: String, required: true },
  githubId: { type: String, required: true },
});

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
