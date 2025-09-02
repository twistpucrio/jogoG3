const palavras = ["PrettyWoman", "LegallyBlonde", "Barbie", "StarWars", "Clueless", "Scream", "GrownUps"];

let timerInterval;
const COUNTDOWN_DURATION = 6 * 60 * 1000;

function startTimer()
{
  clearInterval(timerInterval);
  const endTime = Date.now() + COUNTDOWN_DURATION;
  timerInterval = setInterval(() => {
    const remaining=endTime - Date.now();

    if (remaining<=0)
    {
      clearInterval(timerInterval);
      document.getElementById("time").textContent="00:00";
      showTimeoutModal();
      return;
    }
    const minutes= Math.floor(remaining / 60000).toString().padStart(2,'0');
    const seconds= Math.floor((remaining % 60000) / 1000).toString().padStart(2,'0');
    document.getElementById("time").textContent=`${minutes}:${seconds}`;
  }, 1000);
}

function showTimeoutModal() {
  const modal = document.getElementById("timeoutModal");
  modal.style.display = "block";
}

function hideTimeoutModal() {
  const modal = document.getElementById("timeoutModal");
  modal.style.display = "none";
}

function tentarNovamente() {
  location.reload();
}

function irParaMenu() {
  window.location.href = "index.html";
}

function trocarTema() {
  window.location.href = "pag1.html";
}

document.addEventListener("DOMContentLoaded", () => {
   let grade = criaMatrizComPalavras(18, palavras);
  exibeMatriz(grade, "matriz");
  startTimer();

   const btn = document.getElementById("btnGerar");
  btn.addEventListener("click", () => {
    grade = criaMatrizComPalavras(18, palavras);
    exibeMatriz(grade, "matriz");
    startTimer();
      const lista = document.querySelectorAll(".bpal p");
  lista.forEach(el => {
    el.style.textDecoration = "none";
    el.style.color = "black";  
  });

   if (typeof total !== "undefined") {
    total = 0;
  }
  });
});