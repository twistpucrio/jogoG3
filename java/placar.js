if (!localStorage.getItem("pontos")) {
  localStorage.setItem("pontos", 0);
}

function atualizarPlacar() {
  const pontos = localStorage.getItem("pontos") || 0;
  document.getElementById("pontos").innerText = pontos;
}

function adicionarPontos(qtd) {
  let pontos = 0;
  if (nivel === "facil") pontos = 50;
  if (nivel === "medio") pontos = 100;
  if (nivel === "dificil") pontos = 200;

  let placar = parseInt(localStorage.getItem("pontos")) || 0;
  placar += pontos;
  localStorage.setItem("pontos", placar);
  atualizarPlacar();
}

function zerarPontos() {
  localStorage.setItem("pontos", 0);
  atualizarPlacar();
}

document.addEventListener("DOMContentLoaded", atualizarPlacar);
