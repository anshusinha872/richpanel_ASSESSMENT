const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const app = express();
var serviceAccount = require("./serviceAccountKeys.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const morgan = require("morgan");
const pool = require("./config/dbConfig.js");
const cors = require("cors");
var bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const port = 3443;
const routes = require("./routes");
app.use(cors());
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(
  express.json({
    limit: "2mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions)); // Use this
app.use(express.json({ limit: "50mb" }));
app.use(
  fileupload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);
app.use(
  morgan("dev", {
    skip: function (req, res) {
      return res.statusCode >= 400;
    },
    stream: process.stdout,
  })
);
const userController = routes.userController;
const accountController = routes.accountController;
const conversationController = routes.conversationController;
const webhookController = routes.webhookController;
const API_URL = '/api/v1/';
app.use(API_URL, userController);
app.use(API_URL, accountController);
app.use(API_URL, conversationController);
app.use(API_URL, webhookController);
exports.app = functions.https.onRequest(app);
