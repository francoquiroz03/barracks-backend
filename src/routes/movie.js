const express = require("express");
const router = express.Router();

const { create, list } = require("../controllers/movie");
const { requireSignIn } = require("../controllers/auth");

router.get("/movies", requireSignIn, list);
router.post("/movies/create", create);

module.exports = router;