import Profile from "../models/gitHubProfiles.js";

const createProfile = async (req, res) => {
  const { profileId, githubId } = req.body;
  let username = githubId.substring(19);

  try {
    const newUser = new Profile({ profileId, githubId: username });
    newUser.save();

    if (newUser) {
      console.log(newUser);
    }

    return res.json({ message: newUser });
  } catch (err) {
    console.log("Error: ", err.message);
  }
};

const getProfile = async (req, res) => {
  const { profileId } = req.body;

  try {
    let user = await Profile.findOne({ profileId });

    if (user) {
      const response = await fetch(
        `https://api.github.com/users/${user.githubId}`
      );
      const data = await response.json();

      const response2 = await fetch(
        `https://api.github.com/users/${user.githubId}/repos`
      );
      const data2 = await response2.json();

      return res.status(200).json({ success: true, data, data2 });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "User Not Found" });
    }
  } catch (error) {
    console.error("Error fetching profile: ", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export { createProfile, getProfile };
