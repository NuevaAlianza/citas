// Datos simulados (puedes cargar desde un archivo JSON real con fetch)
const datos = [
  {
    "id": 1,
    "bloque": 1,
    "cita": "El Señor es mi pastor, nada me falta.",
    "libro": "Salmos",
    "capitulo": 23,
    "opciones_libro": [
      "Salmos",
      "Proverbios",
      "Isaías",
      "Mateo"
    ],
    "opciones_capitulo": [
      23,
      1,
      91,
      3
    ]
  },
  {
    "id": 2,
    "bloque": 1,
    "cita": "Porque tanto amó Dios al mundo que dio a su Hijo unigénito...",
    "libro": "Juan",
    "capitulo": 3,
    "opciones_libro": [
      "Juan",
      "Mateo",
      "Romanos",
      "Génesis"
    ],
    "opciones_capitulo": [
      3,
      1,
      5,
      2
    ]
  },
  // Agrega más datos según bloques
];

const bloqueSelect = document.getElementById('bloque-select');
const btnIniciar = document.getElementById('btn-iniciar');
const quizContainer = document.getElementById('quiz-container');
const preguntaNumero = document.getElementById('pregunta-numero');
const citaTexto = document.getElementById('cita-texto');
const opcionesLibroDiv = document.getElementById('opciones-libro');
const opcionesCapituloDiv = document.getElementById('opciones-capitulo');
const btnSiguiente = document.getElementById('btn-siguiente');
const resultadoContainer = document.getElementById('resultado-container');
const mensajeResultado = document.getElementById('mensaje-resultado');
const porcentajeLibroSpan = document.getElementById('porcentaje-libro');
const porcentajeCapituloSpan = document.getElementById('porcentaje-capitulo');
const btnReiniciar = document.getElementById('btn-reiniciar');
const btnCambiarBloque = document.getElementById('btn-cambiar-bloque');

let preguntasBloque = [];
let indicePregunta = 0;
let respuestasLibro = [];
let respuestasCapitulo = [];

function obtenerBloques() {
  const bloquesUnicos = [...new Set(datos.map(d => d.bloque))];
  return bloquesUnicos.sort((a,b) => a-b);
}

function llenarSelectBloques() {
  const bloques = obtenerBloques();
  bloques.forEach(bloque => {
    const option = document.createElement('option');
    option.value = bloque;
    option.textContent = `Bloque ${bloque}`;
    bloqueSelect.appendChild(option);
  });
}

function mostrarPregunta() {
  const pregunta = preguntasBloque[indicePregunta];
  preguntaNumero.textContent = `Pregunta ${indicePregunta + 1} de ${preguntasBloque.length}`;
  citaTexto.textContent = `"${pregunta.cita}"`;

  // Limpiar opciones
  opcionesLibroDiv.innerHTML = '';
  opcionesCapituloDiv.innerHTML = '';

  // Crear botones para opciones libro
  pregunta.opciones_libro.forEach(opcion => {
    const btn = document.createElement('button');
    btn.textContent = opcion;
    btn.addEventListener('click', () => {
      seleccionarOpcion(opcionesLibroDiv, btn);
    });
    opcionesLibroDiv.appendChild(btn);
  });

  // Crear botones para opciones capitulo
  pregunta.opciones_capitulo.forEach(opcion => {
    const btn = document.createElement('button');
    btn.textContent = opcion;
    btn.addEventListener('click', () => {
      seleccionarOpcion(opcionesCapituloDiv, btn);
    });
    opcionesCapituloDiv.appendChild(btn);
  });
}

function seleccionarOpcion(contenedor, botonSeleccionado) {
  // Deseleccionar todos
  const botones = contenedor.querySelectorAll('button');
  botones.forEach(btn => btn.classList.remove('selected'));
  // Seleccionar este
  botonSeleccionado.classList.add('selected');
}

function validarSeleccion() {
  const seleccionLibro = opcionesLibroDiv.querySelector('button.selected');
  const seleccionCapitulo = opcionesCapituloDiv.querySelector('button.selected');

  if (!seleccionLibro || !seleccionCapitulo) {
    alert('Por favor selecciona una opción para libro y capítulo.');
    return false;
  }
  return true;
}

function guardarRespuesta() {
  const pregunta = preguntasBloque[indicePregunta];
  const seleccionLibro = opcionesLibroDiv.querySelector('button.selected').textContent;
  const seleccionCapitulo = Number(opcionesCapituloDiv.querySelector('button.selected').textContent);

  respuestasLibro.push(seleccionLibro === pregunta.libro);
  respuestasCapitulo.push(seleccionCapitulo === pregunta.capitulo);
}

function mostrarResultadoFinal() {
  quizContainer.classList.add('hidden');
  resultadoContainer.classList.remove('hidden');

  const correctosLibro = respuestasLibro.filter(r => r).length;
  const correctosCapitulo = respuestasCapitulo.filter(r => r).length;
  const total = preguntasBloque.length;

  const porcentajeLibro = Math.round((correctosLibro / total) * 100);
  const porcentajeCapitulo = Math.round((correctosCapitulo / total) * 100);

  porcentajeLibroSpan.textContent = porcentajeLibro;
  porcentajeCapituloSpan.textContent = porcentajeCapitulo;

  let mensaje = '';
  if (porcentajeLibro >= 80 && porcentajeCapitulo >= 80) {
    mensaje = '¡Excelente conocimiento bíblico!';
  } else if (porcentajeLibro >= 50 && porcentajeCapitulo >= 50) {
    mensaje = 'Buen trabajo, pero puedes mejorar.';
  } else {
    mensaje = 'Sigue estudiando la Biblia, ¡ánimo!';
  }
  mensajeResultado.textContent = mensaje;
}

function iniciarQuiz() {
  const bloqueSeleccionado = bloqueSelect.value;
  if (!bloqueSeleccionado) return;

  preguntasBloque = datos.filter(d => d.bloque == bloqueSeleccionado);
  indicePregunta = 0;
  respuestasLibro = [];
  respuestasCapitulo = [];

  // UI
  document.getElementById('seleccion-bloque').classList.add('hidden');
  resultadoContainer.classList.add('hidden');
  quizContainer.classList.remove('hidden');

  mostrarPregunta();
}

function siguientePregunta() {
  if (!validarSeleccion()) return;

  guardarRespuesta();
  indicePregunta++;

  if (indicePregunta >= preguntasBloque.length) {
    mostrarResultadoFinal();
  } else {
    mostrarPregunta();
  }
}

function reiniciarQuiz() {
  indicePregunta = 0;
  respuestasLibro = [];
  respuestasCapitulo = [];

  resultadoContainer.classList.add('hidden');
  quizContainer.classList.remove('hidden');

  mostrarPregunta();
}

function cambiarBloque() {
  resultadoContainer.classList.add('hidden');
  document.getElementById('seleccion-bloque').classList.remove('hidden');
  bloqueSelect.value = '';
  btnIniciar.disabled = true;
}

bloqueSelect.addEventListener('change', () => {
  btnIniciar.disabled = !bloqueSelect.value;
});

btnIniciar.addEventListener('click', iniciarQuiz);
btnSiguiente.addEventListener('click', siguientePregunta);
btnReiniciar.addEventListener('click', reiniciarQuiz);
btnCambiarBloque.addEventListener('click', cambiarBloque);

// Inicializamos el select
llenarSelectBloques();
