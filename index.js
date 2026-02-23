// 1. BIBLIOTECA DE CANCIONES (Pre-guardadas)
const playlist = [
    {
        titulo: "Fuel",
        artista: "Metallica",
        archivo: "./multimedia/audio/Fuel.mp3",
        portada: "./multimedia/imagenes/portada-fuel.jpg"
    },
    {
        titulo: "The Trooper (1998 Remaster)",
        artista: "Iron Maiden",
        archivo: "./multimedia/audio/The Trooper (1998 Remaster).mp3",
        portada: "./multimedia/imagenes/portada-the-trooper.jpg"
    },
    {
        titulo: "Black or White",
        artista: "Michael Jackson",
        archivo: "./multimedia/audio/Black or White.mp3",
        portada: "./multimedia/imagenes/portada-black-or-white.jpeg"
    }
];

let indiceActual = 0;

// 2. ELEMENTOS DEL DOM (IDs del HTML)
const audio = document.getElementById('mi-reproductor');
const imgPortada = document.getElementById('img-portada');
const nombreCancion = document.getElementById('nombre-cancion');
const nombreArtista = document.getElementById('artista');
const mensajeEstado = document.querySelector('#status-box h1');

// Controles de reproducción
const btnReproducir = document.getElementById('reproducir');
const btnPausar = document.getElementById('pausar');
const btnSiguiente = document.getElementById('siguiente');
const btnAnterior = document.getElementById('anterior');

// Barra de progreso y Volumen
const barraProgreso = document.getElementById('barra-progreso');
const tiempoActualTxt = document.getElementById('tiempo-actual');
const tiempoTotalTxt = document.getElementById('tiempo-total');
const controlVolumen = document.getElementById('control-volumen');

// Modal y Selección
const modal = document.getElementById('modal-seleccion');
const btnPrincipal = document.getElementById('seleccionar-musica');
const btnOpcionLocal = document.getElementById('opcion-local');
const btnOpcionBiblioteca = document.getElementById('opcion-biblioteca');
const btnCerrarModal = document.getElementById('cerrar-modal');
const inputArchivo = document.getElementById('input-archivo');
const listaBibliotecaUI = document.getElementById('lista-biblioteca');
const ulCanciones = document.getElementById('ul-canciones');

// 3. FUNCIONES DE INTERFAZ

// Alternar visibilidad de botones Play y Pause
function actualizarInterfazBotones() {
    if (audio.paused) {
        btnReproducir.style.display = 'inline-block';
        btnPausar.style.display = 'none';
    } else {
        btnReproducir.style.display = 'none';
        btnPausar.style.display = 'inline-block';
    }
}

// Cargar datos de la canción en los elementos HTML
function cargarCancion(indice) {
    const cancion = playlist[indice];
    audio.src = cancion.archivo;
    imgPortada.src = cancion.portada;
    nombreCancion.innerText = cancion.titulo;
    nombreArtista.innerText = cancion.artista;
    actualizarInterfazBotones();
}

// 4. LÓGICA DEL MODAL Y ARCHIVOS

// Abrir modal
btnPrincipal.addEventListener('click', () => {
    modal.style.display = 'flex';
});

// Cerrar modal (Botón Cancelar)
btnCerrarModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Cerrar modal (Tecla ESC)
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        modal.style.display = 'none';
    }
});

// Opción: Archivo Local de la PC
btnOpcionLocal.addEventListener('click', () => {
    modal.style.display = 'none';
    inputArchivo.click();
});

inputArchivo.addEventListener('change', (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
        const urlTemporal = URL.createObjectURL(archivo);
        audio.src = urlTemporal;
        nombreCancion.innerText = archivo.name;
        nombreArtista.innerText = "Archivo Local";
        imgPortada.src = "./multimedia/imagenes/yes-cat-thumbs-up.png"; // Imagen de éxito
        audio.play();
        actualizarInterfazBotones();
    }
});

// Opción: Biblioteca Guardada
btnOpcionBiblioteca.addEventListener('click', () => {
    modal.style.display = 'none';
    mostrarBiblioteca();
});

function mostrarBiblioteca() {
    ulCanciones.innerHTML = ""; 
    playlist.forEach((cancion, indice) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${cancion.titulo}</strong> - ${cancion.artista}`;
        li.style.cursor = "pointer";
        li.onclick = () => {
            indiceActual = indice;
            cargarCancion(indiceActual);
            audio.play();
            listaBibliotecaUI.style.display = 'none';
            actualizarInterfazBotones();
        };
        ulCanciones.appendChild(li);
    });
    listaBibliotecaUI.style.display = 'block';
}

// 5. CONTROLES DE AUDIO

btnReproducir.addEventListener('click', () => {
    if (audio.src) {
        audio.play();
        actualizarInterfazBotones();
    }
});

btnPausar.addEventListener('click', () => {
    audio.pause();
    actualizarInterfazBotones();
});

btnSiguiente.addEventListener('click', () => {
    indiceActual = (indiceActual + 1) % playlist.length;
    cargarCancion(indiceActual);
    audio.play();
    actualizarInterfazBotones();
});

btnAnterior.addEventListener('click', () => {
    indiceActual = (indiceActual - 1 + playlist.length) % playlist.length;
    cargarCancion(indiceActual);
    audio.play();
    actualizarInterfazBotones();
});

// 6. PROGRESO, VOLUMEN Y TIEMPO

function formatearTiempo(segundos) {
    const min = Math.floor(segundos / 60);
    const seg = Math.floor(segundos % 60);
    return `${min}:${seg < 10 ? '0' : ''}${seg}`;
}

// Actualizar barra y números mientras suena
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const porcentaje = (audio.currentTime / audio.duration) * 100;
        barraProgreso.value = porcentaje;
        tiempoActualTxt.innerText = formatearTiempo(audio.currentTime);
        tiempoTotalTxt.innerText = formatearTiempo(audio.duration);
    }
});

// Saltar a una parte de la canción
barraProgreso.addEventListener('input', () => {
    const nuevoTiempo = (barraProgreso.value / 100) * audio.duration;
    audio.currentTime = nuevoTiempo;
});

// Control de volumen
controlVolumen.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

// Pasar a la siguiente automáticamente
audio.addEventListener('ended', () => {
    btnSiguiente.click();
});

// INICIALIZACIÓN
cargarCancion(indiceActual);
audio.volume = 0.5; // Volumen por defecto al 50%