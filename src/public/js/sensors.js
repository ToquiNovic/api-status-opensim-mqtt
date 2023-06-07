const teamSelect = document.getElementById("team-select");
const sensorTableBody = document.getElementById("sensor-table-body");

// Agregar la opción por defecto "Selecciona tu equipo"
const defaultOption = document.createElement("option");
defaultOption.value = "";
defaultOption.textContent = "Selecciona tu equipo";
defaultOption.disabled = true;
defaultOption.selected = true;
teamSelect.add(defaultOption);

fetch("http://45.71.181.109:3001/api/teams")
  .then((response) => response.json())
  .then((data) => {
    data.msg.forEach((team) => {
      const option = document.createElement("option");
      option.value = team.id_team;
      option.textContent = team.name_team;
      teamSelect.add(option);
    });
    // Cargar sensores del equipo inicialmente seleccionado
    if (teamSelect.value) {
      loadSensors(teamSelect.value);
    }
  })
  .catch((error) => console.error(error));

  function loadSensors(equipoSensor) {
    fetch(`http://45.71.181.109:3001/api/sensors?id_team=${equipoSensor}`)
      .then((response) => response.json())
      .then((data) => {
        sensorTableBody.innerHTML = "";
        data.msg.forEach((sensor) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${sensor.id_sensor}</td>
            <td>${sensor.name_sensor}</td>
            <td>${sensor.value_data}</td>
            <td><button class="btn btn-link" onclick="showAlert(${equipoSensor}, ${sensor.id_sensor})"><i class="fas fa-eye"></i></button></td>
          `;
          sensorTableBody.appendChild(row);
        });
      })
      .catch((error) => console.error(error));
  }
  
  function showAlert(id_team, id_sensor) {
    const url = `http://45.71.181.109:3001/api/sensors?id_team=${id_team}&id_sensor=${id_sensor}`;
    Swal.fire({
      title: url,
      icon: 'info',
      confirmButtonText: 'Copiar',
      preConfirm: () => {
        const clipboard = new ClipboardJS('.swal2-confirm', {
          text: () => url
        });
        clipboard.on('success', () => {
          clipboard.destroy();
          Swal.close();
        });
        clipboard.on('error', () => {
          console.error('La copia al portapapeles ha fallado.');
          clipboard.destroy();
        });
      }
    });
  }
  

teamSelect.addEventListener("change", (event) => {
  loadSensors(event.target.value);
});
