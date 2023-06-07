const select = document.getElementById("equipo-sensor");

fetch('http://45.71.181.109:3001/api/teams')
  .then(response => response.json())
  .then(data => {
    data.msg.forEach(team => {
      const option = document.createElement("option");
      option.value = team.id_team;
      option.textContent = team.name_team;
      select.add(option);
    });
  })
  .catch(error => console.error(error));

//------------------------------------------------------------------

const formElement = document.getElementById('sensor-form');
formElement.addEventListener('submit', (event) => {
  event.preventDefault();

  const nombreSensor = document.getElementById('nombre-sensor').value;
  const equipoSensor = select.value;

  // Obtener la lista de sensores del equipo seleccionado
  fetch(`http://45.71.181.109:3001/api/sensors?id_team=${equipoSensor}`)
    .then((response) => response.json())
    .then((data) => {
      let sensorsData = data.msg;

      // Verificar si 'msg' es un objeto y convertirlo en un array
      if (typeof sensorsData === 'object' && !Array.isArray(sensorsData)) {
        sensorsData = [sensorsData];
      }

      // Si no hay sensores en el equipo, crear el nuevo sensor
      if (sensorsData.length === 0) {
        createSensor(nombreSensor, equipoSensor);
      } else {
        // Filtrar la lista de sensores por nombre para comprobar si ya existe un sensor con el mismo nombre
        const sensoresRepetidos = sensorsData.filter(
          (sensor) => sensor.name_sensor === nombreSensor
        );

        if (sensoresRepetidos.length > 0) {
          // Mostrar un mensaje de error si ya existe un sensor con el mismo nombre
          Swal.fire('Error', 'Ya existe un sensor con el mismo nombre', 'error');
        } else {
          // Crear el nuevo sensor
          createSensor(nombreSensor, equipoSensor);
        }
      }
    })
    .catch((error) => {
      Swal.fire('Error', 'Error al obtener los sensores del equipo', 'error');
    });
});

function createSensor(nombreSensor, equipoSensor) {
  // Crear el nuevo sensor mediante una petición POST a la API
  const data = {
    name_sensor: nombreSensor,
    value_data: '0',
    fk_team: equipoSensor,
  };

  fetch('http://45.71.181.109:3001/api/sensors', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      Swal.fire('Éxito', 'Sensor creado exitosamente', 'success');
    })
    .catch((error) => {
      Swal.fire('Error', 'Error al crear el sensor', 'error');
    });
}

