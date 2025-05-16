// Datos estáticos para prueba, similar a citas.json
const datos = [
  {
    id: 1,
    bloque: 1,
    cita: "El Señor es mi pastor, nada me falta.",
    libro: "Salmos",
    capitulo: 23,
    opciones_libro: ["Salmos", "Proverbios", "Isaías", "Mateo"],
    opciones_capitulo: [22, 23, 24, 25]
  },
  {
    id: 2,
    bloque: 1,
    cita: "En el principio creó Dios los cielos y la tierra.",
    libro: "Génesis",
    capitulo: 1,
    opciones_libro: ["Génesis", "Éxodo", "Levítico", "Números"],
    opciones_capitulo: [1, 2, 3, 4]
  },
  {
    id: 3,
    bloque: 2,
    cita: "Yo soy el camino, la verdad y la vida.",
    libro: "Juan",
    capitulo: 14,
    opciones_libro: ["Mateo", "Marcos", "Lucas", "Juan"],
    opciones_capitulo: [12, 13, 14, 15]
  }
];

let bloqueSeleccionado = null;
let preguntasBloque = [];
let preguntaIndex = 0;
let correctasLibro = 0;
let correctasCapitulo = 0;

const selectBloque = document.getElementById('selectBloque');
const btnComenzar = document.getElementById('btnComenzar');
const inicioDiv = document.getElementById('inicio');
const quizDiv = document.getElementById('quiz');
const resultadoDiv = document.getElementById('resultado');

const preguntaActualDiv = document.getElementById('preguntaActual');
const citaDiv = document.getElementById('cita');
const opcionesLibroDiv = document.getElementById('opcionesLibro');
const opcionesCapituloDiv = document.getElementById('opcionesCapitulo');

const btnSiguiente = document.getElementById('btnSiguiente');
const porcentajeP = document.getElementById('porcentaje');
const mensajeP = document.getElementById('mensaje');
const btnReiniciar = document.getElementById('btnReiniciar');
const btnVolver = document.getElementById('btnVolver');

// Inicializa select con bloques únicos
function llenarSelectBloques() {
  const bloquesUnicos = [...new Set(datos.map(d => d.bloque))].sort((a,b)=>a-b);
  bloquesUnicos.forEach(bloque => {
    const option = document.createElement('option');
    option.value = bloque;
    option.textContent = `Bloque ${bloque}`;
    selectBloque.appendChild(option);
  });
}

// Habilita botón comenzar si bloque seleccionado
selectBloque.addEventListener('change', () => {
  btnComenzar.disabled = !selectBloque.value;
});

// Comenzar quiz
btnComenzar.addEventListener('click', () => {
  bloqueSeleccionado = Number(selectBloque.value);
  preguntasBloque = datos.filter(p => p.bloque === bloqueSeleccionado);
  preguntaIndex = 0;
  correctasLibro = 0;
  correctasCapitulo = 0;

  inicioDiv.classList.add('hidden');
  resultadoDiv.classList.add('hidden');
  quizDiv.classList.remove('hidden');

  mostrarPregunta();
  btnSiguiente.disabled = true;
});

function mostrarPregunta() {
  btnSiguiente.disabled = true;
  const p = preguntasBloque[preguntaIndex];
  preguntaActualDiv.textContent = `Pregunta ${preguntaIndex + 1} de ${preguntasBloque.length}`;
  citaDiv.textContent = `"${p.cita}"`;

  // Limpia opciones
  opcionesLibroDiv.innerHTML = '';
  opcionesCapituloDiv.innerHTML = '';

  // Mostrar opciones libro
  p.opciones_libro.forEach(op => {
    const btn = document.createElement('button');
    btn.textContent = op;
    btn.addEventListener('click', () => seleccionarRespuesta(btn, op, 'libro', p.libro));
    opcionesLibroDiv.appendChild(btn);
  });

  // Mostrar opciones capítulo
  p.opciones_capitulo.forEach(op => {
    const btn = document.createElement('button');
    btn.textContent = op;
    btn.addEventListener('click', () => seleccionarRespuesta(btn, op, 'capitulo', p.capitulo));
    opcionesCapituloDiv.appendChild(btn);
  });
}

let libroRespondido = false;
let capituloRespondido = false;

function seleccionarRespuesta(button, opcion, tipo, correcta) {
  if ((tipo === 'libro' && libroRespondido) || (tipo === 'capitulo' && capituloRespondido)) {
    return; // no permitir cambiar respuesta ya dada
  }

  if (tipo === 'libro') {
    libroRespondido = true;
  } else if (tipo === 'capitulo') {
    capituloRespondido = true;
  }

  // Verificar si es correcta
  const correcto = (opcion == correcta);
  if (correcto) {
    button.classList.add('correcto');
    if (tipo === 'libro') correctasLibro++;
    else if (tipo === 'capitulo') correctasCapitulo++;
  } else {
    button.classList.add('incorrecto');
  }

  // Deshabilitar botones de esa sección para que no cambie la respuesta
  const container = (tipo === 'libro') ? opcionesLibroDiv : opcionesCapituloDiv;
  Array.from(container.children).forEach(btn => btn.disabled = true);

  // Si ya respondieron ambos, habilitar siguiente
  if (libroRespondido && capituloRespondido) {
    btnSiguiente.disabled = false;
  }
}

btnSiguiente.addEventListener('click', () => {
  preguntaIndex++;
  libroRespondido = false;
  capituloRespondido = false;

  if (preguntaIndex < preguntasBloque.length) {
    mostrarPregunta();
  } else {
    mostrarResultado();
  }
});

function mostrarResultado() {
  quizDiv.classList.add('hidden');
  resultadoDiv.classList.remove('hidden');

  const total = preguntasBloque.length;
  const porcentajeLibro = Math.round((correctasLibro / total) * 100);
  const porcentajeCapitulo = Math.round((correctasCapitulo / total) * 100);
  const promedio = Math.round((porcentajeLibro + porcentajeCapitulo) / 2);

  porcentajeP.textContent = `Libro: ${porcentajeLibro}% | Capítulo: ${porcentajeCapitulo}% | Promedio: ${promedio}%`;

  let mensaje = '';
  if (promedio >= 80) {
    mensaje = '¡Excelente! Gran conocimiento bíblico.';
  } else if (promedio >= 50) {
    mensaje = 'Buen trabajo, pero puedes mejorar.';
  } else {
    mensaje = 'Necesitas estudiar más la Biblia.';
  }
  mensajeP.textContent = mensaje;
}

btnReiniciar.addEventListener('click', () => {
  preguntaIndex = 0;
  correctasLibro = 0;
  correctasCapitulo = 0;
  libroRespondido = false;
  capituloRespondido = false;

  resultadoDiv.classList.add('hidden');
  quizDiv.classList.remove('hidden');

  mostrarPregunta();
  btnSiguiente.disabled = true;
});

btnVolver.addEventListener('click', () => {
  resultadoDiv.classList.add('hidden');
  quizDiv.classList.add('hidden');
  inicioDiv.classList.remove('hidden');

  selectBloque.value = "";
  btnComenzar.disabled = true;
});

llenarSelectBloques();
