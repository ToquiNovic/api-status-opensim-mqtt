const router = require("express").Router();

router.use("/teams", require("./team"));
router.use("/sensors", require("./sensors"));
router.use("/users", require("./users"));

module.exports = router;