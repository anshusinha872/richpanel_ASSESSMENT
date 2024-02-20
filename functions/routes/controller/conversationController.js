const express = require('express');
const router = express.Router();
const conversationService = require('../service/conversationService');

// async function getAllConversations(req, res) {
// 	try {
// 		let returnData = await conversationService.getAllConversations(req);
// 		return res.status(200).json(returnData);
// 	} catch (err) {
// 		console.log(err);
// 	}
// }
async function getAllMessages(req, res) {
    try {
        let returnData = await conversationService.getAllMessages(req);
        return res.status(200).json(returnData);
    } catch (err) {
        console.log(err);
    }
}
async function reponseMessage(req, res) {
    try {
        let returnData = await conversationService.reponseMessage(req);
        return res.status(200).json(returnData);
    } catch (err) {
        console.log(err);
    }
};
async function getConversationUserList(req, res) {
    try {
        let returnData = await conversationService.getConversationUserList(req);
        return res.status(200).json(returnData);
    } catch (err) {
        console.log(err);
    }
};
async function getUsersProfile(req, res) {
    try {
        let returnData = await conversationService.getUsersProfile(req);
        return res.status(200).json(returnData);
    } catch (err) {
        console.log(err);
    }
}
// router.post('/conversation/getAll', getAllConversations);
router.post('/conversation/getAllMessages', getAllMessages);
router.post('/conversation/reponseMessage', reponseMessage);
router.post('/conversations/user/list',getConversationUserList);
router.post('/conversations/user/profile',getUsersProfile);
module.exports = router;
