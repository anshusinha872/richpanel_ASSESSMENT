const express = require('express');
const router = express.Router();
const userService = require('../service/userService');
async function registerUser(req, res) {
	try {
		console.log('registerUser');
		let returnData = await userService.registerUser(req);
		return res.status(200).json(returnData);
	} catch (err) {
		console.log(err);
	}
}
async function loginUser(req, res) {
	try {
		console.log('loginUser');
		let returnData = await userService.loginUser(req);
		return res.status(200).json(returnData);
	} catch (err) {
		console.log(err);
	}
}

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/webhook', async (req, res) => {
	let reponseMessage = await userService.reponseMessage(req);
	res.status(200).send('EVENT_RECEIVED');
});
module.exports = router;
