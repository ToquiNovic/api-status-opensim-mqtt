const stateRouter = require("express").Router();

stateRouter.get("/:id", (req, res) => {
    const mysqlConnection = require("../../../database");
    const { id } = req.params;

    const query = `
    SELECT 
      Id_iot, Nombre_iot, Estado_iot
    FROM 
      iot
    WHERE Id_iot LIKE ?;`;

    mysqlConnection.query(query, [id], (err, rows, fields) => {
        if (!err) {
          if (rows.length !== 0) {
            const estadoActual = rows[0].Estado_iot;
            let nuevoEstado = 0;
            if (estadoActual === 0) {
              nuevoEstado = 1;
            }
            const updateQuery = `
              UPDATE iot
              SET Estado_iot = ?
              WHERE Id_iot = ?;
            `;
            mysqlConnection.query(updateQuery, [nuevoEstado, id], (err, result) => {
              if (!err) {
                res.json({ msg: `Se actualizó el estado a ${nuevoEstado}` });
              } else {
                res.status(500).json({ msg: "Error de servidor" });
              }
            });
          } else {
            res.status(404).json({ msg: "Objeto IoT no encontrado" });
          }
        } else {
          res.status(500).json({ msg: "Error de servidor" });
        }
      });
    });
    
    module.exports = stateRouter;