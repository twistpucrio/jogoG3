const palavras = ["Mickey", "Minnie", "Cinderella", "Aurora", "Tiana", "ToyStory", "HannahMontana", "Wish", "DetonaRalph" ];

document.addEventListener("DOMContentLoaded", () => {
  // render inicial
  let grade = criaMatrizComPalavras(23, palavras);
  exibeMatriz(grade, "matriz");

  // agora o botão existe -> podemos registrar o listener
  const btn = document.getElementById("btnGerar");
  btn.addEventListener("click", () => {
    grade = criaMatrizComPalavras(23, palavras);
    exibeMatriz(grade, "matriz");
  });
});