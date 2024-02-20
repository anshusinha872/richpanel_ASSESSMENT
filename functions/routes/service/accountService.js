const axios = require("axios");
const jwt = require("jsonwebtoken");
const { connect } = require("../../config/dbConfig");

const resultdb = (statusCode, data = null, error = null) => {
  return {
    statusCode: statusCode,
    data: data,
    error: error,
  };
};
const extractBearerToken = (authorizationHeader) => {
  if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
    const token = authorizationHeader.split(" ")[1];
    return token;
  }
  return null;
};
const authenticate = async (req, res) => {
  try {
    const data = req.body;
    const bearerToken = extractBearerToken(req.headers.authorization);
    const decoded = jwt.decode(bearerToken);
    const { _id } = decoded;
    const { userID, accessToken } = req.body;
    const url = `https://graph.facebook.com/${userID}/accounts?fields=name,access_token&access_token=${accessToken}`;
    const user_auth_url = `https://graph.facebook.com/v8.0/me?access_token=${accessToken}`;
    const user_auth_response = await axios.get(user_auth_url);
    const user_auth_data = user_auth_response.data;
    const response = await axios.get(url);
    let pages = response.data.data;
    data.pages = pages;
    data._id = _id;
    const db = await connect();
    const authenticateaccounts = db.collection("authenticateaccounts");
    const user = await authenticateaccounts.findOne({ _id: _id });
    if (!user) {
      await authenticateaccounts.insertOne(data);
    } else {
      await authenticateaccounts.updateOne({ _id: _id }, { $set: data });
    }
    return resultdb(200, data);
  } catch (err) {
    console.log(err);
    return resultdb(500, null, err);
  }
};
const checkIfAuthenticated = async (req, res) => {
  try {
    const bearerToken = extractBearerToken(req.headers.authorization);
    const decoded = jwt.decode(bearerToken);
    const { _id } = decoded;
    const db = await connect();
    const authenticateaccounts = db.collection("authenticateaccounts");
    const user = await authenticateaccounts.findOne({ _id: _id });
    if (!user) {
      return resultdb(401, null, "User not authenticated");
    }
    return resultdb(200, user);
  } catch (err) {
    console.log(err);
    return resultdb(500, null, err);
  }
};
const deleteIntegration = async (req, res) => {
  try {
    const bearerToken = extractBearerToken(req.headers.authorization);
    const decoded = jwt.decode(bearerToken);
    const { _id } = decoded;
    const db = await connect();
    const authenticateaccounts = db.collection("authenticateaccounts");
    const user = await authenticateaccounts.findOne({ _id: _id });
    if (!user) {
      return resultdb(401, null, "User not authenticated");
    }
    const pages = user.pages;
    for(let i=0;i<pages.length;i++){
      const page_id = pages[i].id;
      const messages = db.collection("messages");
      await messages.deleteMany({ page_id: page_id });
    }
    await authenticateaccounts.deleteOne({ _id: _id });
    return resultdb(200, "Integration deleted", null);
  } catch (err) {
    console.log(err);
    return resultdb(500, null, err);
  }
};
module.exports = {
  authenticate,
  checkIfAuthenticated,
  deleteIntegration,
};
