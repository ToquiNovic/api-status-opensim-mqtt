fetch('http://45.71.181.109:3001/api/teams')
  .then(response => response.json())
  .then(data => {
    const equipos = data.msg;
    if (equipos) {
      const tbody = document.querySelector('#equipos-tbody');
      equipos.forEach(equipo => {
        const fila = document.createElement('tr');
        const idEquipo = document.createElement('td');
        idEquipo.textContent = equipo.id_team;
        const nombreEquipo = document.createElement('td');
        nombreEquipo.textContent = equipo.name_team;
        const integrantes = document.createElement('td');
        integrantes.textContent = equipo.integrantes.split(',').join(', ');
        const estado = document.createElement('td');
        estado.textContent = equipo.state_team;
        fila.appendChild(idEquipo);
        fila.appendChild(nombreEquipo);
        fila.appendChild(integrantes);
        fila.appendChild(estado);
        tbody.appendChild(fila);
      });
    } else {
      console.error('No se encontraron equipos');
    }
  })
  .catch(error => console.error(error));
