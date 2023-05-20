const allstateRouter = require("express").Router();

allstateRouter.get("/", (req, res) => {
    const mysqlConnection = require("../../../database");
    const { dni } = req.body;

    const query = `
    SELECT 
      * 
    FROM 
      iot 
   ;`;

    mysqlConnection.query(query, (err, rows, fields) => {
        if (!err) {
            if (rows.length !== 0) {
                res.json({ msg: rows});
            } else {
                res.status(404).json({ msg: "Objeto IoT no encontrado" });
            }
        } else {
            res.status(500).json({ msg: "Error de servidor" });
        }
    });
});

module.exports = allstateRouter;