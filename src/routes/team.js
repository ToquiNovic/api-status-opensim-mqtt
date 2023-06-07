const teamsRouter = require("express").Router();
const mysqlConnection = require("../database");

teamsRouter.get("/", (req, res) => {

    const query = `
    SELECT 
    team_seminario.id_team,
    team_seminario.name_team,
    GROUP_CONCAT(CONCAT_WS(' ', useraccounts.FirstName, useraccounts.LastName)) as integrantes,
    team_usuario.state_team
FROM 
    team_usuario
INNER JOIN 
    team_seminario
ON
    team_usuario.id_team = team_seminario.id_team
INNER JOIN 
    useraccounts
ON
    team_usuario.id_usuario = useraccounts.PrincipalID
GROUP BY
    team_seminario.name_team
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


teamsRouter.post('/', (req, res) => {
  const nuevoEquipo = req.body;
  const query1 = `
    SELECT MAX(id_team) as max_id FROM team_seminario;
  `;
  mysqlConnection.query(query1, (err1, result1) => {
    if (!err1) {
      const id_team = result1[0].max_id + 1;
      const query2 = `
        INSERT INTO team_seminario (id_team, name_team)
        VALUES ('${id_team}', '${nuevoEquipo.name_team}');
      `;
      mysqlConnection.query(query2, (err2, result2) => {
        if (!err2) {
          let query3 = `
            INSERT INTO team_usuario (id_team, id_usuario, state_team)
            VALUES ('${id_team}', '${nuevoEquipo.integrante1.id_usuario}', '${nuevoEquipo.state_team}');
          `;
          mysqlConnection.query(query3, (err3, result3) => {
            if (!err3) {
              if (nuevoEquipo.integrante2) {
                query3 = `
                  INSERT INTO team_usuario (id_team, id_usuario, state_team)
                  VALUES ('${id_team}', '${nuevoEquipo.integrante2.id_usuario}', '${nuevoEquipo.state_team}');
                `;
                mysqlConnection.query(query3, (err4, result4) => {
                  if (!err4) {
                    res.json({ msg: `Equipo ${nuevoEquipo.name_team} creado correctamente` });
                  } else {
                    console.error(err4);
                    res.status(500).json({ msg: 'Error al crear equipo' });
                  }
                });
              } else {
                res.json({ msg: `Equipo ${nuevoEquipo.name_team} creado correctamente` });
              }
            } else {
              console.error(err3);
              res.status(500).json({ msg: 'Error al crear equipo' });
            }
          });
        } else {
          console.error(err2);
          res.status(500).json({ msg: 'Error al crear equipo' });
        }
      });
    } else {
      console.error(err1);
      res.status(500).json({ msg: 'Error al crear equipo' });
    }
  });
});

module.exports = teamsRouter;