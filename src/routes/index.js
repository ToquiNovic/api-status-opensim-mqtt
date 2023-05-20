const router = require("express").Router();

router.use("/select", require("./select"));
router.use("/update", require("./update"));

module.exports = router;