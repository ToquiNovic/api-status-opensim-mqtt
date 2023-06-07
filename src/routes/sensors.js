const sensorsRouter = require("express").Router();
const mysqlConnection = require("../database");

sensorsRouter.get("/", (req, res) => {
  const id_team = req.query.id_team;
  const id_sensor = req.query.id_sensor; // Agregar el parámetro id_sensor
  let query = `
  SELECT 
      ts.id_team, 
      ts.name_team, 
      iot.id_sensor, 
      iot.name_sensor, 
      iot.value_data,
      GROUP_CONCAT(DISTINCT CONCAT(ua.FirstName, ' ', ua.LastName) SEPARATOR ', ') AS team_members
  FROM 
      team_seminario ts
  JOIN 
      iot 
  ON 
      ts.id_team = iot.fk_team
  JOIN 
      team_usuario tu 
  ON 
      ts.id_team = tu.id_team
  JOIN 
      useraccounts ua 
  ON 
      tu.id_usuario = ua.PrincipalID`;

  // Modificar la cláusula WHERE para incluir el parámetro id_sensor
  let whereClause = [];
  if (id_team) {
    whereClause.push(`ts.id_team = '${id_team}'`);
  }
  if (id_sensor) {
    whereClause.push(`iot.id_sensor = '${id_sensor}'`);
  }
  if (whereClause.length > 0) {
    query += ` WHERE ${whereClause.join(' AND ')}`;
  }

  query += ` GROUP BY iot.id_sensor;`;

  mysqlConnection.query(query, (err, rows, fields) => {
    if (!err) {
      if (rows.length !== 0) {
        res.json({ msg: rows });
      } else {
        res.status(200).json({ msg: [] });
      }
    } else {
      res.status(500).json({ msg: "Error de servidor" });
    }
  });
});

sensorsRouter.post('/', (req, res) => {
  const { name_sensor, value_data, fk_team } = req.body;

  const query1 = `
    SELECT MAX(id_sensor) as max_id FROM iot;
  `;

  mysqlConnection.query(query1, (err1, result1) => {
    if (!err1) {
      const id_sensor = result1[0].max_id + 1;

      const query2 = `
        INSERT INTO iot (id_sensor, name_sensor, value_data, fk_team)
        VALUES (?, ?, ?, ?);
      `;

      mysqlConnection.query(query2, [id_sensor, name_sensor, value_data, fk_team], (err2, result2) => {
        if (!err2) {
          res.status(201).json({ msg: 'Datos del sensor insertados exitosamente', id_sensor: id_sensor });
        } else {
          res.status(500).json({ msg: 'Error de servidor' });
        }
      });
    } else {
      res.status(500).json({ msg: 'Error de servidor' });
    }
  });
});

sensorsRouter.put("/", (req, res) => {
  const id_team = req.query.id_team;
  const id_sensor = req.query.id_sensor;
  const value_data = req.body.value_data; // Asumiendo que el nuevo valor se envía en el cuerpo de la solicitud

  if (!id_team || !id_sensor || !value_data) {
    res.status(400).json({ msg: "Parámetros inválidos" });
    return;
  }

  let query = `
    UPDATE iot
    SET value_data = ?
    WHERE fk_team = ? AND id_sensor = ?`;

  mysqlConnection.query(query, [value_data, id_team, id_sensor], (err, result) => {
    if (!err) {
      if (result.affectedRows > 0) {
        res.json({ msg: "Dato actualizado correctamente" });
      } else {
        res.status(404).json({ msg: "No se encontró el sensor para el equipo especificado" });
      }
    } else {
      res.status(500).json({ msg: "Error de servidor" });
    }
  });
});


module.exports = sensorsRouter;
