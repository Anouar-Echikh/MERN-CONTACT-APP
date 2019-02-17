const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator"); //is to validate  duplicated field
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

const UserSchema = Schema({
  name: { type: String },
  email: { type: "String", required: true, index: true, unique: true },
  password: { type: String, required: true },
  joined: { type: Date, default: new Date() }
});

UserSchema.pre("save", async function(next) {
  //Check if password is not modified
  if (!this.isModified("password")) {
    return next();
  }

  //Encrypt the password
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (e) {
    return next(e);
  }
});

UserSchema.methods.isPasswordMatch = function(password, hash, callback) {
  bcrypt.compare(password, hash, (err, sucess) => {
    if (err) {
      return callback(err);
    }
    callback(null, sucess);
  });
};
//for security :override toJSON() in order to remove password from response object
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

//UserSchema.plugin(validator); we don't need to this plugin because the error is already undled in the controller
const User = mongoose.model("User", UserSchema);

module.exports = User;
