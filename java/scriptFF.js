// direções possíveis: direita, baixo, diagonal
const DIRECOES = [
  [0, 1],  // →
  [1, 0],  // ↓
  [1, 1],  // ↘
/*Aqui sao as direcoes onde tem palavra entao deixar mais direcoes no dificl, menos no facil*/ 
];
window.addEventListener("load",function(){  
    var facil= this.document.getElementById("div1");
});

function criaMatrizComPalavras(tamanho = 12, palavras = []) {
  const grade = Array.from({ length: tamanho }, () => Array(tamanho).fill(''));

  for (let palavra of palavras) {
    palavra = palavra.toUpperCase();

    let colocado = false;
    // tenta várias vezes até achar um lugar
    for (let tent = 0; tent < 1000 && !colocado; tent++) {
      const [dr, dc] = DIRECOES[Math.floor(Math.random() * DIRECOES.length)];
      const linha = Math.floor(Math.random() * tamanho);
      const coluna = Math.floor(Math.random() * tamanho);

      const fimLinha = linha + dr * (palavra.length - 1);
      const fimColuna = coluna + dc * (palavra.length - 1);

      // verifica se cabe
      if (fimLinha < 0 || fimLinha >= tamanho || fimColuna < 0 || fimColuna >= tamanho) continue;

      // verifica colisão
      let cabe = true;
      for (let i = 0; i < palavra.length; i++) {
        const r = linha + dr * i, c = coluna + dc * i;
        if (grade[r][c] !== '' && grade[r][c] !== palavra[i]) {
          cabe = false;
          break;
        }
      }
      if (!cabe) continue;

      // coloca palavra
      for (let i = 0; i < palavra.length; i++) {
        const r = linha + dr * i, c = coluna + dc * i;
        grade[r][c] = palavra[i];
      }
      colocado = true;
    }

    if (!colocado) {
      console.warn(`Não consegui colocar a palavra: ${palavra}`);
    }
  }

  // completa com letras aleatórias
  for (let i = 0; i < tamanho; i++) {
    for (let j = 0; j < tamanho; j++) {
      if (grade[i][j] === '') {
        grade[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }

  return grade;
}


function exibeMatriz(grade, targetId) {
  const container = document.getElementById(targetId);
  container.innerHTML = ''; // limpa o conteúdo anterior

  // configura o container para ser grid
  container.style.display = 'grid';
  container.style.gridTemplateColumns = `repeat(${grade.length}, 30px)`;
  container.style.gridTemplateRows = `repeat(${grade.length}, 30px)`;
  container.style.gap = '2px';
  container.style.userSelect = 'none';

  for (let i = 0; i < grade.length; i++) {
    for (let j = 0; j < grade[i].length; j++) {
      const cell = document.createElement('div');
      cell.classList.add('grid-cell');
      cell.textContent = grade[i][j];
      cell.dataset.row = i;
      cell.dataset.col = j;
      container.appendChild(cell);
    }
  }

  // depois de criar, adiciona os eventos para drag
  addGridListeners(container);
}

window.criaMatrizComPalavras = criaMatrizComPalavras;
window.exibeMatriz = exibeMatriz;
