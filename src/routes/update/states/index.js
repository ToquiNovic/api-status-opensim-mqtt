const router = require("express").Router();

// router.use("/", require("./allstates"));
router.use("/id", require("./state.js"));

module.exports = router;