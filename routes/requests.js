const express = require("express");
const router = express.Router();
const requestsController = require("../controllers/requests");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Requests Routes - simplified for now
// router.get("/:id", ensureAuth, postsController.getPost);

router.post("/createRequest/:id", requestsController.createRequest);

router.put("requestSlot/:id", requestsController.requestSlot);

// router.delete("/deletePost/:id", postsController.deletePost);

module.exports = router;
