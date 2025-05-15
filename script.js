
let citas = [];
let indice = 0;
let aciertosLibro = 0;
let aciertosCapitulo = 0;

const citaElem = document.getElementById("cita");
const opcionesLibro = document.getElementById("opciones-libro");
const opcionesCapitulo = document.getElementById("opciones-capitulo");
const siguienteBtn = document.getElementById("siguiente");
const resultado = document.getElementById("resultado");
const libroScore = document.getElementById("libro-score");
const capituloScore = document.getElementById("capitulo-score");

fetch('citas.json')
  .then(res => res.json())
  .then(data => {
    citas = data;
    mostrarCita();
  });

function mostrarCita() {
  limpiar();
  const actual = citas[indice];
  citaElem.textContent = actual.cita;

  actual.opciones_libro.forEach((op, i) => {
    const btn = document.createElement("button");
    btn.textContent = op;
    btn.onclick = () => seleccionarLibro(btn, op === actual.libro);
    opcionesLibro.appendChild(btn);
  });

  actual.opciones_capitulo.forEach((op, i) => {
    const btn = document.createElement("button");
    btn.textContent = op;
    btn.onclick = () => seleccionarCapitulo(btn, op === actual.capitulo);
    opcionesCapitulo.appendChild(btn);
  });
}

function seleccionarLibro(boton, correcto) {
  const botones = opcionesLibro.querySelectorAll("button");
  botones.forEach(b => b.disabled = true);
  boton.classList.add(correcto ? "correcto" : "incorrecto");
  if (correcto) aciertosLibro++;
  verificarSiguiente();
}

function seleccionarCapitulo(boton, correcto) {
  const botones = opcionesCapitulo.querySelectorAll("button");
  botones.forEach(b => b.disabled = true);
  boton.classList.add(correcto ? "correcto" : "incorrecto");
  if (correcto) aciertosCapitulo++;
  verificarSiguiente();
}

function verificarSiguiente() {
  const libros = opcionesLibro.querySelectorAll("button");
  const capitulos = opcionesCapitulo.querySelectorAll("button");
  const deshabilitados = [...libros, ...capitulos].filter(b => b.disabled);
  if (deshabilitados.length === libros.length + capitulos.length) {
    siguienteBtn.classList.remove("oculto");
  }
}

siguienteBtn.onclick = () => {
  indice++;
  if (indice < citas.length) {
    mostrarCita();
    siguienteBtn.classList.add("oculto");
  } else {
    mostrarResultado();
  }
};

function mostrarResultado() {
  document.getElementById("quiz-box").classList.add("oculto");
  resultado.classList.remove("oculto");
  libroScore.textContent = `Aciertos de libro: ${aciertosLibro} de ${citas.length} (${Math.round((aciertosLibro/citas.length)*100)}%)`;
  capituloScore.textContent = `Aciertos de capítulo: ${aciertosCapitulo} de ${citas.length} (${Math.round((aciertosCapitulo/citas.length)*100)}%)`;
}

function limpiar() {
  opcionesLibro.innerHTML = "";
  opcionesCapitulo.innerHTML = "";
}
