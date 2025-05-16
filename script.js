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

let seleccionLibro = null;
let seleccionCapitulo = null;

// Llena selectBloque dinámicamente con bloques únicos ordenados
function llenarSelectBloques() {
  const bloquesUnicos = [...new Set(datos.map(d => d.bloque))].sort((a,b)=>a-b);
  bloquesUnicos.forEach(bloque => {
    const option = document.createElement('option');
    option.value = bloque;
    option.textContent = `Bloque ${bloque}`;
    selectBloque.appendChild(option);
  });
}

selectBloque.addEventListener('change', () => {
  btnComenzar.disabled = !selectBloque.value;
});

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

function mostrarPregunta() {
  btnSiguiente.disabled = true;
  resetearOpciones();

  const p = preguntas[indicePregunta];
  textoCita.textContent = `"${p.cita}"`;

  // Opciones libro
  opcionesLibroDiv.innerHTML = '';
  p.opciones_libro.forEach(libro => {
    const btn = document.createElement('button');
    btn.textContent = libro;
    btn.addEventListener('click', () => seleccionarOpcion('libro', libro, btn, p.libro));
    opcionesLibroDiv.appendChild(btn);
  });

  // Opciones capitulo
  opcionesCapituloDiv.innerHTML = '';
  p.opciones_capitulo.forEach(cap => {
    const btn = document.createElement('button');
    btn.textContent = cap;
    btn.addEventListener('click', () => seleccionarOpcion('capitulo', cap, btn, p.capitulo));
    opcionesCapituloDiv.appendChild(btn);
  });

  seleccionLibro = null;
  seleccionCapitulo = null;
}

function seleccionarOpcion(tipo, valor, boton, respuestaCorrecta) {
  if (tipo === 'libro') {
    seleccionLibro = valor;
    // Quitar clases previas
    [...opcionesLibroDiv.children].forEach(b => {
      b.classList.remove('seleccionado', 'correcto', 'incorrecto');
    });
    // Marcar el elegido
    boton.classList.add('seleccionado');
    // Feedback inmediato
    if(valor === respuestaCorrecta){
      boton.classList.add('correcto');
      audioCorrecto.play();
    } else {
      boton.classList.add('incorrecto');
      audioIncorrecto.play();
    }
  } else {
    seleccionCapitulo = valor;
    [...opcionesCapituloDiv.children].forEach(b => {
      b.classList.remove('seleccionado', 'correcto', 'incorrecto');
    });
    boton.classList.add('seleccionado');
    if (valor === respuestaCorrecta) {
      boton.classList.add('correcto');
      audioCorrecto.play();
    } else {
      boton.classList.add('incorrecto');
      audioIncorrecto.play();
    }
  }
  // Habilitar botón siguiente solo si ya seleccionó ambos
  btnSiguiente.disabled = !(seleccionLibro && seleccionCapitulo);
}

btnSiguiente.addEventListener('click', () => {
  // Guardar respuestas
  respuestasUsuario.push({
    libro: seleccionLibro,
    capitulo: seleccionCapitulo,
    correctoLibro: seleccionLibro === preguntas[indicePregunta].libro,
    correctoCapitulo: seleccionCapitulo === preguntas[indicePregunta].capitulo,
  });

  indicePregunta++;
  if (indicePregunta < preguntas.length) {
    mostrarPregunta();
  } else {
    mostrarResultado();
  }
});

btnReiniciar.addEventListener('click', () => {
  indicePregunta = 0;
  respuestasUsuario = [];
  resultadoDiv.classList.add('oculto');
  quizDiv.classList.remove('oculto');
  mostrarPregunta();
  btnSiguiente.disabled = true;
});

btnVolver.addEventListener('click', () => {
  resultadoDiv.classList.add('oculto');
  inicioDiv.classList.remove('oculto');
  selectBloque.value = '';
  btnComenzar.disabled = true;
});

// Mostrar resultado final con mensaje personalizado
function mostrarResultado() {
  quizDiv.classList.add('oculto');
  resultadoDiv.classList.remove('oculto');

  const total = respuestasUsuario.length;
  const correctosLibro = respuestasUsuario.filter(r => r.correctoLibro).length;
  const correctosCapitulo = respuestasUsuario.filter(r => r.correctoCapitulo).length;

  const porcentajeLibro = Math.round((correctosLibro / total) * 100);
  const porcentajeCapitulo = Math.round((correctosCapitulo / total) * 100);

  porcentajeP.textContent = `Aciertos - Libro: ${porcentajeLibro}%. Capítulo: ${porcentajeCapitulo}%.`;

  let mensaje = '';
  if (porcentajeLibro > 80 && porcentajeCapitulo > 80) {
    mensaje = '¡Excelente conocimiento bíblico!';
  } else if (porcentajeLibro > 50 && porcentajeCapitulo > 50) {
    mensaje = 'Buen trabajo, sigue practicando.';
  } else {
    mensaje = 'Te recomendamos estudiar más las citas bíblicas.';
  }

  mensajeP.textContent = mensaje;
}

// Cargar JSON de datos

fetch('citas.json')
  .then(res => res.json())
  .then(json => {
    datos = json;
    llenarSelectBloques();
  })
  .catch(err => {
    alert('Error al cargar los datos: ' + err);
  });
