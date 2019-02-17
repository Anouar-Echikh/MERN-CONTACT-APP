const mongoose = require("mongoose");

const { Schema } = mongoose;

const ContactSchema = Schema({
  name: { type: String },
  tel: { type: "String", required: true },
  email: { type: "String", required: true },
  created: { type: Date, required: true },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
});

const Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;
