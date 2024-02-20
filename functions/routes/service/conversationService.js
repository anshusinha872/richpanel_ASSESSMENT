const axios = require("axios");
const { connect } = require("../../config/dbConfig");

const resultdb = (statusCode, data = null, error = null) => {
  return {
    statusCode: statusCode,
    data: data,
    error: error,
  };
};
const getAllMessages = async (req, res) => {
  try {
    const conversationId = req.body.conversationId;
    const access_token = req.body.access_token;
    const url = `https://graph.facebook.com/v11.0/${conversationId}?fields=messages&access_token=${access_token}`;
    const response = await axios.get(url);
    const messagesId = response.data.messages.data;
    let messages = [];
    for (let i = 0; i < messagesId.length; i++) {
      let messageUrl = `https://graph.facebook.com/v11.0/${messagesId[i].id}?fields=message,from,created_time&access_token=${access_token}`;
      let messageResponse = await axios.get(messageUrl);
      messages.push(messageResponse.data);
    }
    messages.sort((a, b) => {
      const timeA = new Date(a.created_time).getTime();
      const timeB = new Date(b.created_time).getTime();
      return timeA - timeB;
    });
    return resultdb(200, messages, null);
  } catch (err) {
    console.log(err);
    return resultdb(500, null, err);
  }
};
const reponseMessage = async (req, res) => {
  try {
    const sender_id = req.body.sender_id;
    const access_token = req.body.access_token;
    const pageId = req.body.pageId;
    const messageText = req.body.message;
    const apiVersion = "v13.0";
    const apiUrl = `https://graph.facebook.com/${apiVersion}/${pageId}/messages?recipient={'id':'${sender_id}'}&messaging_type=RESPONSE&message={'text':"${messageText}"}&access_token=${access_token}`;

    const response = await axios.post(apiUrl);
    const time = new Date().getTime();
    const db = await connect();
    const messages = db.collection("messages");
    const result = await messages.updateOne(
      {
        sender_id: response.data.recipient_id,
        recipient_id: pageId,
        page_id: pageId,
      },
      {
        $push: {
          message: {
            text: messageText,
            mid: response.data.message_id,
            time: time,
            sender_id: pageId,
            recipient_id: response.data.recipient_id,
          },
        },
      }
    );
    if (result.modifiedCount) {
      return resultdb(200, null, "Message inserted successfully");
    }
    return resultdb(400, null, "Message insertion failed");
  } catch (err) {
    console.log(err);
    return resultdb(500, null, err);
  }
};

async function getConversationUserList(req, res) {
  try {
    const { pageId, access_token } = req.body;
    const db = await connect();
    const messages = db.collection("messages");
    const conversationList = await messages.find({
      page_id: pageId,
    }).toArray();
    let conversationUserList = [];
    for (let i = 0; i < conversationList.length; i++) {
      try{
        let profileurl = `https://graph.facebook.com/v11.0/${conversationList[i].sender_id}?fields=first_name,last_name,profile_pic,email&access_token=${access_token}`;
        let profileresponse = await axios.get(profileurl);
        let conversation = {
          id: conversationList[i]._id,
          sender_id: conversationList[i].sender_id,
          recipient_id: conversationList[i].recipient_id,
          first_name: profileresponse.data.first_name,
          last_name: profileresponse.data.last_name,
          profile_pic: profileresponse.data.profile_pic,
          page_id: conversationList[i].page_id,
          messages: conversationList[i].message,
        };
        conversationUserList.push(conversation);
      }
      catch(err){
        console.log(err);
      }
    }
    return resultdb(200, conversationUserList, null);
  } catch (err) {
    console.log(err);
  }
};
async function getUsersProfile(req, res) {
  try {
    const { userId, access_token } = req.body;
    const profileurl = `https://graph.facebook.com/v11.0/${userId}?fields=first_name,last_name,profile_pic,email&access_token=${access_token}`;
    const profileresponse = await axios.get(profileurl);
    return resultdb(200, profileresponse.data, null);
  } catch (err) {
    console.log(err);
  }
}
module.exports = {
  // getAllConversations,
  getAllMessages,
  reponseMessage,
  getConversationUserList,
  getUsersProfile
};
