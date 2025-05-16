let datos = [];
let preguntas = [];
let bloqueActual = null;
let indicePregunta = 0;

let seleccionLibro = null;
let seleccionCapitulo = null;

let aciertosLibro = 0;
let aciertosCapitulo = 0;

const selectBloque = document.getElementById('select-bloque');
const btnIniciar = document.getElementById('btn-iniciar');
const quizDiv = document.getElementById('quiz');
const citaElem = document.getElementById('cita');
const opcionesLibroDiv = document.getElementById('opciones-libro');
const opcionesCapituloDiv = document.getElementById('opciones-capitulo');
const btnConfirmar = document.getElementById('btn-confirmar');
const feedback = document.getElementById('feedback');
const progreso = document.getElementById('progreso');
const resultadoDiv = document.getElementById('resultado');
const mensajeFinal = document.getElementById('mensaje-final');
const btnReiniciar = document.getElementById('btn-reiniciar');
const btnCambiarBloque = document.getElementById('btn-cambiar-bloque');
const menuBloques = document.getElementById('menu-bloques');

function cargarDatos() {
  fetch('citas.json')
    .then(response => {
      if (!response.ok) throw new Error("Error al cargar citas.json");
      return response.json();
    })
    .then(data => {
      datos = data;
      llenarSelectorBloques();
    })
    .catch(err => {
      alert("No se pudieron cargar las citas.");
      console.error(err);
    });
}

function llenarSelectorBloques() {
  const bloques = [...new Set(datos.map(d => d.bloque))];
  selectBloque.innerHTML = '';
  bloques.forEach(b => {
    const option = document.createElement('option');
    option.value = b;
    option.textContent = `Bloque ${b}`;
    selectBloque.appendChild(option);
  });
}

function iniciarQuiz() {
  bloqueActual = parseInt(selectBloque.value);
  preguntas = datos.filter(p => p.bloque === bloqueActual);
  indicePregunta = 0;
  aciertosLibro = 0;
  aciertosCapitulo = 0;

  menuBloques.style.display = 'none';
  resultadoDiv.style.display = 'none';
  quizDiv.style.display = 'block';

  mostrarPregunta();
}

function mostrarPregunta() {
  seleccionLibro = null;
  seleccionCapitulo = null;
  btnConfirmar.disabled = true;
  feedback.textContent = '';
  progreso.textContent = `Pregunta ${indicePregunta + 1} de ${preguntas.length}`;

  const p = preguntas[indicePregunta];
  citaElem.textContent = `"${p.cita}"`;

  // Mostrar opciones libro
  opcionesLibroDiv.innerHTML = '';
  p.opciones_libro.forEach((libro, i) => {
    const btn = document.createElement('button');
    btn.textContent = libro;
    btn.addEventListener('click', () => {
      seleccionLibro = libro;
      marcarSeleccion(opcionesLibroDiv, btn);
      habilitarConfirmar();
    });
    opcionesLibroDiv.appendChild(btn);
  });

  // Mostrar opciones capítulo
  opcionesCapituloDiv.innerHTML = '';
  p.opciones_capitulo.forEach((cap, i) => {
    const btn = document.createElement('button');
    btn.textContent = cap;
    btn.addEventListener('click', () => {
      seleccionCapitulo = cap;
      marcarSeleccion(opcionesCapituloDiv, btn);
      habilitarConfirmar();
    });
    opcionesCapituloDiv.appendChild(btn);
  });
}

function marcarSeleccion(contenedor, btnSeleccionado) {
  [...contenedor.children].forEach(btn => {
    btn.classList.remove('selected');
  });
  btnSeleccionado.classList.add('selected');
}

function habilitarConfirmar() {
  btnConfirmar.disabled = !(seleccionLibro && seleccionCapitulo);
}

btnConfirmar.addEventListener('click', () => {
  const p = preguntas[indicePregunta];
  let correctoLibro = seleccionLibro === p.libro;
  let correctoCapitulo = seleccionCapitulo === p.capitulo;

  if (correctoLibro) aciertosLibro++;
  if (correctoCapitulo) aciertosCapitulo++;

  if (correctoLibro && correctoCapitulo) {
    feedback.textContent = '¡Correcto!';
    feedback.style.color = 'green';
  } else {
    feedback.textContent = `Incorrecto. Libro: ${p.libro}, Capítulo: ${p.capitulo}`;
    feedback.style.color = 'red';
  }

  btnConfirmar.disabled = true;

  // Pasar a la siguiente pregunta después de 1.5 segundos
  setTimeout(() => {
    indicePregunta++;
    if (indicePregunta < preguntas.length) {
      mostrarPregunta();
    } else {
      mostrarResultado();
    }
  }, 1500);
});

function mostrarResultado() {
  quizDiv.style.display = 'none';
  resultadoDiv.style.display = 'block';

  const total = preguntas.length;
  const porcentajeLibro = Math.round((aciertosLibro / total) * 100);
  const porcentajeCapitulo = Math.round((aciertosCapitulo / total) * 100);

  mensajeFinal.innerHTML = `
    Aciertos en libro: ${aciertosLibro} de ${total} (${porcentajeLibro}%)<br/>
    Aciertos en capítulo: ${aciertosCapitulo} de ${total} (${porcentajeCapitulo}%)
  `;
}

btnReiniciar.addEventListener('click', () => {
  iniciarQuiz();
});

btnCambiarBloque.addEventListener('click', () => {
  resultadoDiv.style.display = 'none';
  menuBloques.style.display = 'block';
});

// Inicio carga datos al cargar la página
cargarDatos();
