const { connect } = require("../../config/dbConfig");

const resultdb = (statusCode, data = null, error = null) => {
  return {
    statusCode: statusCode,
    data: data,
    error: error,
  };
};
const handleMessageFromMessenger = async (req) => {
  try {
    const pageId = req.body.entry[0].id;
    const senderId = req.body.entry[0].messaging[0].sender.id;
    const recipientId = req.body.entry[0].messaging[0].recipient.id;
    const timeOfMessage = req.body.entry[0].messaging[0].timestamp;
    const message = req.body.entry[0].messaging[0].message;
    const messageText = message.text;
    const messageId = message.mid;
    const db = await connect();
    const messages = db.collection("messages");
    const conversation = await messages.findOne({
      sender_id: senderId,
      recipient_id: recipientId,
      page_id: pageId,
    });
    if (conversation) {
      const result = await messages.updateOne(
        {
          sender_id: senderId,
          recipient_id: recipientId,
          page_id: pageId,
        },
        {
          $push: {
            message: {
              text: messageText,
              mid: messageId,
              time: timeOfMessage,
              sender_id: senderId,
              recipient_id: recipientId,
            },
          },
        }
      );
      if (result.modifiedCount) {
        return resultdb(200, null, "Message inserted successfully");
      } else {
        return resultdb(400, null, "Message insertion failed");
      }
    }
    else {
      const newMessage = {
        sender_id: senderId,
        recipient_id: recipientId,
        message: [
          {
            text: messageText,
            mid: messageId,
            time: timeOfMessage,
            sender_id: senderId,
            recipient_id: recipientId,
          },
        ],
        page_id: pageId,
      };
      const result = await messages.insertOne(newMessage);
      if (result.insertedId) {
        return resultdb(200, null, "Message inserted successfully");
      } else {
        return resultdb(400, null, "Message insertion failed");
      }
    }
  } catch (err) {
    console.log(err);
    return resultdb(500, null, err);
  }
};
module.exports = {
  handleMessageFromMessenger,
};
