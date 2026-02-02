const validator = require("validator");

/* ================= SIGNUP VALIDATION ================= */
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || firstName.length < 4) {
    throw new Error("First Name must be at least 4 characters long!");
  }

  if (!lastName || lastName.length < 4) {
    throw new Error("Last Name must be at least 4 characters long!");
  }

  if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  }

  if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough!");
  }
};

/* ================= PROFILE EDIT VALIDATION ================= */
const validateEditProfileData = (req) => {
  const allowedUpdates = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  const updates = Object.keys(req.body);

  // ❌ Check for invalid fields
  const isUpdateAllowed = updates.every((field) =>
    allowedUpdates.includes(field)
  );

  if (!isUpdateAllowed) {
    throw new Error("Update not allowed for some fields");
  }

  const { gender, photoUrl, age } = req.body;

  if (gender && !["Male", "Female", "Other"].includes(gender)) {
    throw new Error("Gender must be Male, Female, or Other");
  }

  if (photoUrl && !validator.isURL(photoUrl)) {
    throw new Error("Invalid photo URL");
  }

  if (age && (isNaN(age) || age < 18)) {
    throw new Error("Age must be a number >= 18");
  }

  // ✅ No return needed — if invalid, error is thrown
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
