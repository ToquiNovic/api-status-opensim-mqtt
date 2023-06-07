// Obtener los select de integrantes
const integrante1Select = document.getElementById('integrante1');
const integrante2Select = document.getElementById('integrante2');

// Crear la opción por defecto para el integrante 1
const option1Default = document.createElement('option');
option1Default.textContent = 'Seleccione el integrante 1';
option1Default.selected = true;
integrante1Select.appendChild(option1Default);

// Crear la opción por defecto para el integrante 2
const option2Default = document.createElement('option');
option2Default.textContent = 'Seleccione el integrante 2';
option2Default.selected = true;
integrante2Select.appendChild(option2Default);

// Hacer una petición a la API de usuarios
fetch('http://45.71.181.109:3001/api/users')
    .then(response => response.json())
    .then(data => {
        // Obtener el array de usuarios de la respuesta
        const usuarios = data.msg;

        // Construir las opciones del select con los datos obtenidos
        usuarios.forEach(usuario => {
            const option = document.createElement('option');
            option.value = usuario.PrincipalID;
            option.textContent = usuario.usermane;
            integrante1Select.appendChild(option);

            const option2 = document.createElement('option');
            option2.value = usuario.PrincipalID;
            option2.textContent = usuario.usermane;
            integrante2Select.appendChild(option2);
        });
    })
    .catch(error => console.error(error));

//------------------------------------------------------------------

// Función para obtener la lista de equipos
const obtenerEquipos = async () => {
    try {
        const response = await fetch('http://45.71.181.109:3001/api/teams');
        const data = await response.json();

        // Acceder a la propiedad "msg" y retornar el array de equipos
        console.log(data.msg);
        return Array.isArray(data.msg) ? data.msg : [];
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Obtener el formulario y el botón de crear equipo
const crearEquipoForm = document.getElementById('crear-equipo-form');
const crearEquipoBtn = document.getElementById('crear-equipo');

// Obtener la lista de equipos
const listaEquipos = document.getElementById('lista-equipos');

// Agregar un evento click al botón de crear equipo
crearEquipoBtn.addEventListener('click', async () => {
    // Obtener los valores de los campos del formulario
    const nombreEquipo = document.getElementById('nombre-equipo').value;
    const integrante1 = integrante1Select.value;
    const integrante2 = integrante2Select.value;

    // Verificar si los campos obligatorios están vacíos
    if (nombreEquipo === '' || integrante1 === '') {
        // Mostrar un mensaje de alerta utilizando SweetAlert
        swal.fire({
            title: 'Campos obligatorios',
            text: 'Los campos del nombre del equipo e integrante 1 son obligatorios.',
            icon: 'warning'
        });
        return; // Finalizar la ejecución para evitar el envío de datos
    }

    // Verificar si el nombre del equipo ya existe
    const equipos = await obtenerEquipos();
    console.log('Equipos:', equipos);

    let nombreExiste = false;

    for (let i = 0; i < equipos.length; i++) {
        if (equipos[i].name_team.toLowerCase() === nombreEquipo.toLowerCase()) {
            nombreExiste = true;
            break;
        }
    }

    if (nombreExiste) {
        // Mostrar un mensaje de alerta utilizando SweetAlert
        swal.fire({
            title: 'Nombre de equipo en uso',
            text: 'El nombre del equipo ya está en uso. Por favor, elige otro nombre.',
            icon: 'warning'
        });
        return; // Finalizar la ejecución para evitar el envío de datos
    }

    // Crear el objeto de datos a enviar al servidor
    const equipo = {
        name_team: nombreEquipo,
        state_team: 'Activo',
        integrante1: {
            id_usuario: integrante1
        }
    };

    // Verificar si el valor de integrante2 es válido
    if (integrante2 !== '' && integrante2 !== 'Seleccione el integrante 2') {
        equipo.integrante2 = {
            id_usuario: integrante2
        };
    }

    // Enviar los datos al servidor utilizando fetch
    fetch('http://45.71.181.109:3001/api/teams', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(equipo)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Cerrar el modal después de crear el equipo
            const modal = document.getElementById('crear-equipo-modal');
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();

            // Mostrar un mensaje de éxito utilizando SweetAlert
            swal.fire({
                title: 'Equipo creado',
                text: 'El equipo se ha creado correctamente',
                icon: 'success'
            }).then(() => {
                // Aquí agregamos la actualización de la página
                location.reload();
            });

            // Actualizar la lista de equipos
            fetch('http://45.71.181.109:3001/api/teams')
                .then(response => response.json())
                .then(data => {
                    // Verificar que el elemento listaEquipos exista en el DOM
                    if (listaEquipos) {
                        // Limpiar la lista de equipos
                        listaEquipos.innerHTML = '';

                        // Agregar cada equipo a la lista
                        data.forEach(equipo => {
                            const li = document.createElement('li');
                            li.textContent = equipo.name_team;
                            listaEquipos.appendChild(li);
                        });
                    }
                })
                .catch(error => console.error(error));
        })
        .catch(error => {
            console.error(error);
            // Mostrar un mensaje de error utilizando SweetAlert
            swal.fire({
                title: 'Error',
                text: 'No se pudo crear el equipo',
                icon: 'error'
            });
        });
});


