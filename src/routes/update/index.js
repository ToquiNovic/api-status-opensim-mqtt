const router = require("express").Router();

router.use("/states", require("./states"));

module.exports = router;