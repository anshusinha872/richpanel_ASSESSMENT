const express = require("express");
const router = express.Router();
let webhookService = require("../service/webhookService");
router.post("/webhook/fb/msg", async (req, res) => {
  let response = await webhookService.handleMessageFromMessenger(req);
  if(response.statusCode == 200){
      res.status(200).send('EVENT_RECEIVED');
  }
  else{
      res.status(400).send('EVENT_RECEIVED');
  }
  // let mode = req.query["hub.mode"];
  // let token = req.query["hub.verify_token"];
  // let challenge = req.query["hub.challenge"];

  // // Check if a token and mode is in the query string of the request
  // if (mode && token) {
  //   // Check the mode and token sent is correct
  //   if (mode === "subscribe" && token === "123456789") {
  //     // Respond with the challenge token from the request
  //     console.log("WEBHOOK_VERIFIED");
  //     res.status(200).send(challenge);
  //   } else {
  //     // Respond with '403 Forbidden' if verify tokens do not match
  //     res.sendStatus(403);
  //   }
  // }
});
module.exports = router;
