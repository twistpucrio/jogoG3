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