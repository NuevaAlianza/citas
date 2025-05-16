let datosQuiz = [];
let preguntasFiltradas = [];

let indicePregunta = 0;
let preguntandoLibro = true; // true = preguntando libro, false = preguntando capítulo

async function cargarDatos() {
  try {
    const response = await fetch('citas.json');
    if (!response.ok) throw new Error('No se pudo cargar citas.json');
    datosQuiz = await response.json();

    const bloquesUnicos = [...new Set(datosQuiz.map(q => q.bloque))];
    const selector = document.getElementById('selector-bloques');
    selector.innerHTML = '<option value="">-- Elige un bloque --</option>';
    bloquesUnicos.forEach(b => {
      const option = document.createElement('option');
      option.value = b;
      option.textContent = `Bloque ${b}`;
      selector.appendChild(option);
    });
  } catch (error) {
    alert('Error cargando datos: ' + error.message);
  }
}

function mezclarArray(array) {
  // Mezcla Fisher-Yates
  let copia = array.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function mostrarPregunta() {
  if (indicePregunta >= preguntasFiltradas.length) {
    // Fin del quiz
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('mensaje-final').textContent = '¡Has terminado el bloque!';
    document.getElementById('mensaje-final').style.display = 'block';
    return;
  }

  const p = preguntasFiltradas[indicePregunta];
  const contenedorPreguntas = document.getElementById('preguntas');
  contenedorPreguntas.innerHTML = '';

  const preguntaTexto = document.createElement('p');
  preguntaTexto.textContent = `Cita: "${p.cita}"`;

  contenedorPreguntas.appendChild(preguntaTexto);

  let opciones = [];
  if (preguntandoLibro) {
    opciones = mezclarArray(p.opciones_libro);
  } else {
    opciones = mezclarArray(p.opciones_capitulo);
  }

  opciones.forEach(opcion => {
    const btn = document.createElement('button');
    btn.textContent = opcion;
    btn.style.margin = '5px';
    btn.addEventListener('click', () => {
      evaluarRespuesta(opcion);
    });
    contenedorPreguntas.appendChild(btn);
  });
}

function evaluarRespuesta(opcionElegida) {
  const p = preguntasFiltradas[indicePregunta];

  if (preguntandoLibro) {
    if (opcionElegida === p.libro) {
      alert('Correcto! Ahora responde el capítulo.');
      preguntandoLibro = false;
      mostrarPregunta();
    } else {
      alert(`Incorrecto. La respuesta correcta es: ${p.libro}. Intenta el capítulo ahora.`);
      preguntandoLibro = false;
      mostrarPregunta();
    }
  } else {
    // Preguntando capítulo
    if (parseInt(opcionElegida) === p.capitulo) {
      alert('Correcto! Pasamos a la siguiente cita.');
    } else {
      alert(`Incorrecto. La respuesta correcta es: ${p.capitulo}. Pasamos a la siguiente cita.`);
    }
    // Avanzamos a la siguiente pregunta
    indicePregunta++;
    preguntandoLibro = true;
    mostrarPregunta();
  }
}

function comenzarQuiz() {
  const selector = document.getElementById('selector-bloques');
  const bloqueElegido = selector.value;
  if (!bloqueElegido) {
    alert('Por favor selecciona un bloque');
    return;
  }

  preguntasFiltradas = datosQuiz.filter(p => p.bloque == bloqueElegido);

  selector.style.display = 'none';
  document.getElementById('btn-comenzar').style.display = 'none';

  indicePregunta = 0;
  preguntandoLibro = true;

  document.getElementById('mensaje-final').style.display = 'none';
  document.getElementById('quiz').style.display = 'block';

  mostrarPregunta();
}

document.getElementById('btn-comenzar').addEventListener('click', comenzarQuiz);

cargarDatos();
