let datos = [];
let bloqueSeleccionado = null;
let preguntas = [];
let indicePregunta = 0;
let respuestasUsuario = [];

const inicioDiv = document.getElementById('inicio');
const selectBloque = document.getElementById('selectBloque');
const btnComenzar = document.getElementById('btnComenzar');

const quizDiv = document.getElementById('quiz');
const textoCita = document.getElementById('textoCita');
const opcionesLibroDiv = document.getElementById('opcionesLibro');
const opcionesCapituloDiv = document.getElementById('opcionesCapitulo');
const btnSiguiente = document.getElementById('btnSiguiente');

const resultadoDiv = document.getElementById('resultado');
const porcentajeP = document.getElementById('porcentaje');
const mensajeP = document.getElementById('mensaje');
const btnReiniciar = document.getElementById('btnReiniciar');
const btnVolver = document.getElementById('btnVolver');

const audioCorrecto = document.getElementById('audioCorrecto');
const audioIncorrecto = document.getElementById('audioIncorrecto');

// Habilitar botón comenzar solo si se selecciona bloque
selectBloque.addEventListener('change', () => {
  btnComenzar.disabled = !selectBloque.value;
});

// Comenzar quiz
btnComenzar.addEventListener('click', () => {
  bloqueSeleccionado = parseInt(selectBloque.value);
  preguntas = datos.filter(p => p.bloque === bloqueSeleccionado);
  if (preguntas.length === 0) {
    alert('No hay preguntas para ese bloque');
    return;
  }
  inicioDiv.classList.add('oculto');
  quizDiv.classList.remove('oculto');
  indicePregunta = 0;
  respuestasUsuario = [];
  mostrarPregunta();
  btnSiguiente.disabled = true;
});

// Mostrar pregunta actual
function mostrarPregunta() {
  btnSiguiente.disabled = true;
  resetearOpciones();

  const p = preguntas[indicePregunta];
  textoCita.textContent = `"${p.cita}"`;

  // Mostrar opciones libro
  opcionesLibroDiv.innerHTML = '';
  p.opciones_libro.forEach((libro, i) => {
    const btn = document.createElement('button');
    btn.textContent = libro;
    btn.addEventListener('click', () => seleccionarOpcion('libro', libro, btn));
    opcionesLibroDiv.appendChild(btn);
  });

  // Mostrar opciones capitulo
  opcionesCapituloDiv.innerHTML = '';
  p.opciones_capitulo.forEach((cap, i) => {
    const btn = document.createElement('button');
    btn.textContent = cap;
    btn.addEventListener('click', () => seleccionarOpcion('capitulo', cap, btn));
    opcionesCapituloDiv.appendChild(btn);
  });
}

let seleccionLibro = null;
let seleccionCapitulo = null;

function seleccionarOpcion(tipo, valor, boton) {
  if (tipo === 'libro') {
    seleccionLibro = valor;
    // Marcar seleccionado y desmarcar otros
    [...opcionesLibroDiv.children].forEach(b => b.classList.remove('seleccionado'));
    boton.classList.add('seleccionado');
  } else {
    seleccionCapitulo = valor;
    [...opcionesCapituloDiv.children].forEach(b => b.classList.remove('seleccionado'));
    boton.classList.add('seleccionado');
  }
  btnSiguiente.disabled = !(seleccionLibro && seleccionCapitulo);
}

// Resetear selección
function resetearOpciones() {
  seleccionLibro = null;
  seleccionCapitulo = null;
  [...opcionesLibroDiv.children].forEach(b => {
    b.classList.remove('seleccionado', 'correcto', 'incorrecto');
    b.disabled = false;
  });
  [...opcionesCapituloDiv.children].forEach(b => {
    b.classList.remove('seleccionado', 'correcto', 'incorrecto');
    b.disabled = false;
  });
}

// Al hacer click en Siguiente
btnSiguiente.addEventListener('click', () => {
  evaluarRespuesta();
  indicePregunta++;
  if (indicePregunta < preguntas.length) {
    mostrarPregunta();
  } else {
    mostrarResultados();
  }
  btnSiguiente.disabled = true;
});

// Evaluar respuesta actual y marcar colores + reproducir sonido
function evaluarRespuesta() {
  const p = preguntas[indicePregunta];
  respuestasUsuario.push({
    libro: seleccionLibro,
    capitulo: seleccionCapitulo,
    correctoLibro: seleccionLibro === p.libro,
    correctoCapitulo: seleccionCapitulo === p.capitulo
  });

  // Marcar colores y bloquear botones
  [...opcionesLibroDiv.children].forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === p.libro) {
      btn.classList.add('correcto');
    } else if (btn.textContent === seleccionLibro) {
      btn.classList.add('incorrecto');
    }
  });
  [...opcionesCapituloDiv.children].forEach(btn => {
    btn.disabled = true;
    if (parseInt(btn.textContent) === p.capitulo) {
      btn.classList.add('correcto');
    } else if (parseInt(btn.textContent) === seleccionCapitulo) {
      btn.classList.add('incorrecto');
    }
  });

  // Sonidos
  if (seleccionLibro === p.libro && seleccionCapitulo === p.capitulo) {
    audioCorrecto.play();
  } else {
    audioIncorrecto.play();
  }
}

// Mostrar resultados finales
function mostrarResultados() {
  quizDiv.classList.add('oculto');
  resultadoDiv.classList.remove('oculto');

  const total = respuestasUsuario.length;
  const correctosLibro = respuestasUsuario.filter(r => r.correctoLibro).length;
  const correctosCapitulo = respuestasUsuario.filter(r => r.correctoCapitulo).length;

  const porcentajeLibro = Math.round((correctosLibro / total) * 100);
  const porcentajeCapitulo = Math.round((correctosCapitulo / total) * 100);
  const promedio = Math.round((porcentajeLibro + porcentajeCapitulo) / 2);

  porcentajeP.textContent = `Libro: ${porcentajeLibro}% | Capítulo: ${porcentajeCapitulo}% | Promedio: ${promedio}%`;

  let mensaje = '';
  if (promedio >= 90) {
    mensaje = '¡Excelente conocimiento bíblico!';
  } else if (promedio >= 70) {
    mensaje = 'Buen trabajo, sigue practicando.';
  } else if (promedio >= 50) {
    mensaje = 'Puedes mejorar, sigue estudiando.';
  } else {
    mensaje = 'Necesitas más práctica, ¡ánimo!';
  }
  mensajeP.textContent = mensaje;
}

// Botón reiniciar bloque
btnReiniciar.addEventListener('click', () => {
  resultadoDiv.classList.add('oculto');
  quizDiv.classList.remove('oculto');
  indicePregunta = 0;
  respuestasUsuario = [];
  mostrarPregunta();
});

// Botón volver al inicio
btnVolver.addEventListener('click', () => {
  resultadoDiv.classList.add('oculto');
  inicioDiv.classList.remove('oculto');
  selectBloque.value = '';
  btnComenzar.disabled = true;
});

// Cargar JSON datos
fetch('citas.json')
  .then(res => {
    if (!res.ok) throw new Error('Error cargando JSON');
    return res.json();
  })
  .then(data => {
    datos = data;
  })
  .catch(err => {
    alert('Error cargando datos: ' + err.message);
  });
