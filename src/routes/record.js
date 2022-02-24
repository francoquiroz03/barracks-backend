const express = require("express");
const router = express.Router();

const { recordAll } = require("../controllers/record");
const { requireSignIn } = require("../controllers/auth");

router.get("/record/all", requireSignIn, recordAll);

module.exports = router;