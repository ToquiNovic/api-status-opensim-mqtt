const usersRouter = require("express").Router();
const mysqlConnection = require("../database");

usersRouter.get("/", (req, res) => {

    const query = `
    SELECT 
    useraccounts.PrincipalID,
    CONCAT_WS(' ', useraccounts.FirstName, useraccounts.LastName) as usermane
    FROM 
    useraccounts
;`;

    mysqlConnection.query(query, (err, rows, fields) => {
        if (!err) {
            if (rows.length !== 0) {
                res.json({ msg: rows });
            } else {
                res.status(404).json({ msg: "Equipos no Encontrados" });
            }
        } else {
            res.status(500).json({ msg: "Error de servidor" });
        }
    });
});

module.exports = usersRouter;