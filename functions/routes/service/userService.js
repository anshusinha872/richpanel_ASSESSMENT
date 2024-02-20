const SALT_WORK_FACTOR = 10;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "AnshuSinha";
const { connect } = require("../../config/dbConfig");

const resultdb = (statusCode, data = null, error = null) => {
  return {
    statusCode: statusCode,
    data: data,
    error: error,
  };
};
const loginUser = async (req) => {
  try {
    let { email, password, remember } = req.body;
    const db = await connect();
    const users = db.collection("user");
    const user = await users.findOne({ email: email });
    if (!user) {
      return resultdb(400, null, "User not found");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return resultdb(400, null, "Invalid password");
    }
    const token = jwt.sign({ _id: user._id }, secretKey);
    return resultdb(200, token, "User logged in successfully");
  } catch (err) {
    console.log(err);
    return resultdb(500, null, err);
  }
};
const registerUser = async (req) => {
  try {
    let { name, email, password, remember } = req.body;
    const db = await connect();
    const users = db.collection("user");
    const user = await users.findOne({ email: email });
    if (user) {
      return resultdb(400, null, "User already registered");
    }
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      name: name,
      email: email,
      password: hashedPassword,
    };
    const result = await users.insertOne(newUser);
    const token = jwt.sign({ _id: result.insertedId }, secretKey);
    return resultdb(200, token, "User registered successfully");
  } catch (err) {
    console.log(err);
    return resultdb(500, null, err);
  }
};
const reponseMessage = async (req) => {
  try {
    const pageId = req.body.entry[0].id;
    const senderId = req.body.entry[0].messaging[0].sender.id;
    const recipientId = req.body.entry[0].messaging[0].recipient.id;
    const timeOfMessage = req.body.entry[0].messaging[0].timestamp;
    const message = req.body.entry[0].messaging[0].message.text;
    const messageId = message.mid;
    const db = await connect();
    const messages = db.collection("messages");
    const newMessage = {
      sender_id: senderId,
      recipient_id: recipientId,
      time_of_message: timeOfMessage,
      message: message,
    };
    const result = await messages.insertOne(newMessage);
    if (result.insertedId) {
      return resultdb(200, null, "Message inserted successfully");
    } else {
      return resultdb(400, null, "Message insertion failed");
    }
  } catch (err) {
    console.log(err);
    return resultdb(500, null, err);
  }
};
module.exports = {
  loginUser,
  registerUser,
  reponseMessage,
};
