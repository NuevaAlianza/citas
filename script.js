let datosQuiz = [];
let preguntasFiltradas = [];
let indicePregunta = 0;
let preguntandoLibro = true;
let aciertosLibro = 0;
let aciertosCapitulo = 0;

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
  let copia = array.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function mostrarPregunta() {
  if (indicePregunta >= preguntasFiltradas.length) {
    mostrarResultadoFinal();
    return;
  }

  const p = preguntasFiltradas[indicePregunta];
  document.getElementById('progreso').textContent = `Pregunta ${indicePregunta + 1} de ${preguntasFiltradas.length}`;

  const contenedorCita = document.getElementById('cita');
  contenedorCita.textContent = `"${p.cita}"`;

  const contenedorOpciones = document.getElementById('opciones');
  contenedorOpciones.innerHTML = '';

  let opciones = preguntandoLibro ? mezclarArray(p.opciones_libro) : mezclarArray(p.opciones_capitulo);
  opciones.forEach(opcion => {
    const btn = document.createElement('button');
    btn.textContent = opcion;
    btn.addEventListener('click', () => evaluarRespuesta(opcion));
    contenedorOpciones.appendChild(btn);
  });
}

function evaluarRespuesta(opcionElegida) {
  const p = preguntasFiltradas[indicePregunta];
  if (preguntandoLibro) {
    if (opcionElegida === p.libro) {
      aciertosLibro++;
      alert('✅ ¡Correcto! Ahora responde el capítulo.');
    } else {
      alert(`❌ Incorrecto. La respuesta correcta era: ${p.libro}. Ahora intenta con el capítulo.`);
    }
    preguntandoLibro = false;
    mostrarPregunta();
  } else {
    if (parseInt(opcionElegida) === p.capitulo) {
      aciertosCapitulo++;
      alert('✅ ¡Correcto! Pasamos a la siguiente cita.');
    } else {
      alert(`❌ Incorrecto. La respuesta correcta era: ${p.capitulo}.`);
    }
    indicePregunta++;
    preguntandoLibro = true;
    mostrarPregunta();
  }
}

function mostrarResultadoFinal() {
  document.getElementById('quiz').style.display = 'none';
  const total = preguntasFiltradas.length;
  const mensaje = `
    <h2>¡Has terminado el bloque!</h2>
    <p>✅ Aciertos en LIBROS: ${aciertosLibro} / ${total}</p>
    <p>✅ Aciertos en CAPÍTULOS: ${aciertosCapitulo} / ${total}</p>
    <button onclick="reiniciar()">Reiniciar</button>
  `;
  const contenedorFinal = document.getElementById('mensaje-final');
  contenedorFinal.innerHTML = mensaje;
  contenedorFinal.style.display = 'block';
}

function comenzarQuiz() {
  const selector = document.getElementById('selector-bloques');
  const bloqueElegido = selector.value;
  if (!bloqueElegido) {
    alert('Por favor selecciona un bloque');
    return;
  }

  preguntasFiltradas = datosQuiz.filter(p => p.bloque == bloqueElegido);

  indicePregunta = 0;
  aciertosLibro = 0;
  aciertosCapitulo = 0;
  preguntandoLibro = true;

  selector.style.display = 'none';
  document.getElementById('btn-comenzar').style.display = 'none';
  document.getElementById('mensaje-final').style.display = 'none';
  document.getElementById('quiz').style.display = 'block';

  mostrarPregunta();
}

function reiniciar() {
  document.getElementById('selector-bloques').style.display = 'inline';
  document.getElementById('btn-comenzar').style.display = 'inline';
  document.getElementById('mensaje-final').style.display = 'none';
  document.getElementById('quiz').style.display = 'none';
}

document.getElementById('btn-comenzar').addEventListener('click', comenzarQuiz);

cargarDatos();
