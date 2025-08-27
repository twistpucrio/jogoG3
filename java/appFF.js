const palavras = ["PrettyWoman", "LegallyBlonde", "Barbie", "StarWars"];

document.addEventListener("DOMContentLoaded", () => {
  // render inicial
  let grade = criaMatrizComPalavras(13, palavras);
  exibeMatriz(grade, "matriz");

  // agora o botão existe -> podemos registrar o listener
  const btn = document.getElementById("btnGerar");
  btn.addEventListener("click", () => {
    grade = criaMatrizComPalavras(13, palavras);
    exibeMatriz(grade, "matriz");
  });
});

let timerInterval;
const COUNTDOWN_DURATION = 3 * 60 * 1000 + 30 * 1000;

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
      alert("Tempo esgotado!");
      return;
    }
    const minutes= Math.floor(remaining / 60000).toString().padStart(2,'0');
    const seconds= Math.floor((remaining % 60000) / 1000).toString().padStart(2,'0');
    document.getElementById("time").textContent=`${minutes}:${seconds}`;
  }, 1000);
}

function resetTimer()
{
  clearInterval(timerInterval);
  document.getElementById("time").textContent="03:30";
}

document.addEventListener("DOMContentLoaded", () => {
  // render inicial
  let grade = criaMatrizComPalavras(13, palavras);
  exibeMatriz(grade, "matriz");
  startTimer();

  // agora o botão existe -> podemos registrar o listener
  const btn = document.getElementById("btnGerar");
  btn.addEventListener("click", () => {
    grade = criaMatrizComPalavras(13, palavras);
    exibeMatriz(grade, "matriz");
    startTimer();
  });
});