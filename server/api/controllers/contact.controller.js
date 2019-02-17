const Contact = require("../models/contact.model");
const jwt = require("jsonwebtoken");
const contactController = {};

contactController.get = async (req, res, next) => {
  const user = req.user;
  const query = {
    owner: user._id
  };
  try {
    const contact = await Contact.find(query);
    return res.send({
      contact
    });
  } catch (e) {
    next(e);
  }
};

contactController.create = async (req, res, next) => {
  const { name, tel, email, created } = req.body;
  const newContact = new Contact({
    name,
    tel,
    email,
    created,
    owner: req.user
  });

  try {
    const savedContact = await newContact.save();
    return res.send({
      success: true,
      contact: savedContact
    });
  } catch (e) {
    next(e);
  }
};
contactController.destroy = async (req, res, next) => {
  const contact_id = req.params.contact_id;

  try {
    await Contact.deleteOne({ _id: contact_id });
    return res.send({
      success: true,
      message: "contact deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};
contactController.update = async (req, res, next) => {
  const { name, tel, email, created } = req.body;
  const contact_id = req.params.contact_id;

  try {
    const updatedContact = await Contact.updateOne(
      { _id: contact_id },
      { name, tel, email, created }
    );
    return res.send({
      success: true,
      updatedContact
    });
  } catch (e) {
    next(e);
  }
};

module.exports = contactController;
