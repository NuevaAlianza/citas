// Datos de ejemplo, después podrías cargar datos JSON o CSV externos
const datos = [
  { tema: "Fe", tipo: "reflexion", pregunta: "¿Qué significa tener fe?", respuesta: "Confiar plenamente en Dios." },
  { tema: "Fe", tipo: "quiz", pregunta: "¿Quién fue Abraham?", opciones: ["Un profeta", "Un rey", "Un apóstol", "Un juez"], correcta: 0 },
  { tema: "Amor", tipo: "reflexion", pregunta: "¿Cómo podemos demostrar amor en el matrimonio?", respuesta: "Con paciencia y respeto mutuo." },
  { tema: "Amor", tipo: "quiz", pregunta: "¿Cuál es el mandamiento principal?", opciones: ["Amar a Dios", "Ser rico", "Tener poder", "Ser sabio"], correcta: 0 }
];

// Elementos DOM
const selectTemas = document.getElementById("temas");
const selectTipo = document.getElementById("tipo");
const btnIniciar = document.getElementById("btn-iniciar");
const areaPreguntas = document.getElementById("area-preguntas");
const preguntaEl = document.getElementById("pregunta");
const opcionesEl = document.getElementById("opciones");
const temporizadorEl = document.getElementById("barra");
const btnRespuesta = document.getElementById("btn-respuesta");
const resultadoEl = document.getElementById("resultado");
const mensajeFinal = document.getElementById("mensaje-final");
const btnReiniciar = document.getElementById("btn-reiniciar");

let preguntasFiltradas = [];
let indicePregunta = 0;
let tiempo = 58;
let intervalo;

function cargarTemas() {
  // Obtener temas únicos del arreglo datos
  const temasUnicos = [...new Set(datos.map(d => d.tema))];
  temasUnicos.forEach(tema => {
    const option = document.createElement("option");
    option.value = tema;
    option.textContent = tema;
    selectTemas.appendChild(option);
  });
}

function iniciarJuego() {
  // Obtener temas seleccionados (máx 3)
  const temasSeleccionados = Array.from(selectTemas.selectedOptions).map(opt => opt.value);
  if (temasSeleccionados.length === 0) {
    alert("Por favor, selecciona al menos un tema.");
    return;
  }
  if (temasSeleccionados.length > 3) {
    alert("Puedes seleccionar máximo 3 temas.");
    return;
  }
  const tipoSeleccionado = selectTipo.value;

  // Filtrar preguntas según temas y tipo
  preguntasFiltradas = datos.filter(p => temasSeleccionados.includes(p.tema) && p.tipo === tipoSeleccionado);
  if (preguntasFiltradas.length === 0) {
    alert("No hay preguntas para la selección realizada.");
    return;
  }

  // Preparar UI
  indicePregunta = 0;
  btnIniciar.classList.add("oculto");
  selectTemas.disabled = true;
  selectTipo.disabled = true;
  areaPreguntas.classList.remove("oculto");
  resultadoEl.classList.add("oculto");
  btnRespuesta.classList.add("oculto");

  mostrarPregunta();
  iniciarTemporizador();
}

function mostrarPregunta() {
  const p = preguntasFiltradas[indicePregunta];
  preguntaEl.textContent = p.pregunta;
  opcionesEl.innerHTML = "";

  if (p.tipo === "reflexion") {
    btnRespuesta.classList.remove("oculto");
    btnRespuesta.textContent = "Mostrar respuesta";
  } else if (p.tipo === "quiz") {
    btnRespuesta.classList.add("oculto");
    p.opciones.forEach((opcion, i) => {
      const btn = document.createElement("button");
      btn.textContent = opcion;
      btn.onclick = () => evaluarRespuesta(i);
      opcionesEl.appendChild(btn);
    });
  }
}

function evaluarRespuesta(indice) {
  const p = preguntasFiltradas[indicePregunta];
  const botones = opcionesEl.querySelectorAll("button");

  botones.forEach((btn, i) => {
    btn.disabled = true;
    if (i === p.correcta) {
      btn.style.backgroundColor = "#4caf50";
    } else if (i === indice) {
      btn.style.backgroundColor = "#f44336";
    }
  });

  clearInterval(intervalo);
  siguientePregunta();
}

function mostrarRespuesta() {
  const p = preguntasFiltradas[indicePregunta];
  alert(p.respuesta);
}

function iniciarTemporizador() {
  tiempo = 58;
  temporizadorEl.style.width = "100%";
  temporizadorEl.style.backgroundColor = "#4caf50";
  intervalo = setInterval(() => {
    tiempo--;
    const porcentaje = (tiempo / 58) * 100;
    temporizadorEl.style.width = porcentaje + "%";

    if (tiempo <= 20) {
      temporizadorEl.style.backgroundColor = "#ff9800";
    }
    if (tiempo <= 10) {
      temporizadorEl.style.backgroundColor = "#f44336";
    }
    if (tiempo <= 0) {
      clearInterval(intervalo);
      siguientePregunta();
    }
  }, 1000);
}

function siguientePregunta() {
  indicePregunta++;
  if (indicePregunta < preguntasFiltradas.length) {
    mostrarPregunta();
    iniciarTemporizador();
  } else {
    terminarJuego();
  }
}

function terminarJuego() {
  areaPreguntas.classList.add("oculto");
  resultadoEl.classList.remove("oculto");
  mensajeFinal.textContent = "¡Has terminado! Gracias por participar.";
  btnIniciar.classList.remove("oculto");
  selectTemas.disabled = false;
  selectTipo.disabled = false;
}

btnIniciar.addEventListener("click", iniciarJuego);
btnRespuesta.addEventListener("click", mostrarRespuesta);
btnReiniciar.addEventListener("click", () => location.reload());

cargarTemas();
