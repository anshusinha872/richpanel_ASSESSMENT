const express = require("express");
const router = express.Router();
const accountService = require("../service/accountService");

async function authenticate(req, res) {
  try {
    let returnData = await accountService.authenticate(req);
    return res.status(200).json(returnData);
  } catch (err) {
    console.log(err);
  }
};
async function checkIfAuthenticated(req, res) {
  try {
    let returnData = await accountService.checkIfAuthenticated(req);
    return res.status(200).json(returnData);
  } catch (err) {
    console.log(err);
  }
};
async function deleteIntegration(req, res) {
  try {
	let returnData = await accountService.deleteIntegration(req);
	return res.status(200).json(returnData);
  } catch (err) {
	console.log(err);
  }
};

router.post("/accounts/authenticate", authenticate);
router.get("/accounts/authenticate", checkIfAuthenticated);
router.delete("/accounts/authenticate", deleteIntegration);
module.exports = router;
