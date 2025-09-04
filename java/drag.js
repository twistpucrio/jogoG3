// ---------------------------------------------------
// script-fix.js  (cole inteiro substituindo seu script atual)
// ---------------------------------------------------

/* Seleção de palavras (arraste) + modal vencedor + confetti robusto
   - Espera DOMContentLoaded
   - Cria/garante canvas de confetti e z-index
   - Usa canvas-confetti se presente (CDN que você já carrega)
   - Garante disparo único (confettiFired)
   - Proteções contra erros (modal/fade não encontrados)
*/

let isDragging = false;
let selectedCells = [];
let startRow = null;
let startCol = null;
let dRow = null;
let dCol = null;

let total = 0;                // contador de palavras encontradas
let confettiFired = false;    // garante só 1 disparo por vitória
let confettiInstance = null;  // instância da lib canvas-confetti (se disponível)

/* ------------------ Inicialização ------------------ */
document.addEventListener('DOMContentLoaded', () => {
  // elementos do modal (IDs que aparecem no seu HTML)
  window.modal = document.getElementById('modal');   // deixo global para compatibilidade
  window.fade = document.getElementById('fadee');

  if (!window.modal) console.warn('Aviso: elemento #modal não encontrado no DOM.');
  if (!window.fade)  console.warn('Aviso: elemento #fadee não encontrado no DOM.');

  // garante o canvas de confetti
  let confettiCanvas = document.getElementById('confettiCanvas');
  if (!confettiCanvas) {
    confettiCanvas = document.createElement('canvas');
    confettiCanvas.id = 'confettiCanvas';
    confettiCanvas.className = 'confetti-canvas';
    document.body.appendChild(confettiCanvas);
    console.info('Canvas de confetti criado dinamicamente.');
  }

  // força estilos inline (caso CSS não seja carregado corretamente)
  Object.assign(confettiCanvas.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '99999'
  });

  // tenta criar instância da biblioteca canvas-confetti (você carrega via CDN)
  try {
    if (typeof confetti === 'function') {
      confettiInstance = confetti.create(confettiCanvas, { resize: true, useWorker: true });
      console.info('canvas-confetti inicializado com canvas existente.');
    } else {
      console.warn('Biblioteca canvas-confetti não encontrada. Usarei fallback caso necessário.');
    }
  } catch (err) {
    console.warn('Erro ao inicializar canvas-confetti:', err);
    confettiInstance = null;
  }

  // adiciona listeners ao container da grade; se não existir, usa delegação no document
  const gridContainer = document.getElementById('grid') || document.getElementById('div1') || document;
  addGridListeners(gridContainer);

  // função pública para resetar estado do confetti (chame em tentarNovamente / zerarPontos)
  window.resetConfetti = function() {
    confettiFired = false;
    total = 0;
    // limpa marcação visual da lista de palavras (se desejar)
    document.querySelectorAll('.bpal p').forEach(el => {
      el.classList.remove('marked');
      el.style.textDecoration = '';
      el.style.color = '';
    });
  };

}); // end DOMContentLoaded


/* ------------------ Drag / seleção ------------------ */
function addGridListeners(container) {
  // mousedown
  container.addEventListener('mousedown', e => {
    if (e.target.classList && e.target.classList.contains('grid-cell')) {
      isDragging = true;
      selectedCells = [];

      startRow = parseInt(e.target.dataset.row, 10);
      startCol = parseInt(e.target.dataset.col, 10);
      dRow = null;
      dCol = null;

      selectCell(e.target);
    }
  });

  // mouseover (arrastando)
  container.addEventListener('mouseover', e => {
    if (isDragging && e.target.classList && e.target.classList.contains('grid-cell')) {
      const row = parseInt(e.target.dataset.row, 10);
      const col = parseInt(e.target.dataset.col, 10);

      // Última célula adicionada
            const last = selectedCells[selectedCells.length - 1];
            const lastRow = parseInt(last.dataset.row);
            const lastCol = parseInt(last.dataset.col);

      // primeira determinação de direção
      if (dRow === null && dCol === null) {
        dRow = Math.sign(row - startRow);
        dCol = Math.sign(col - startCol);

        // se movimento inválido (não ortogonal nem diagonal) -> ignora
        if (!(dRow === 0 || dCol === 0 || Math.abs(dRow) === Math.abs(dCol))) {
          return;
        }
      }

      // verifica se a célula está exatamente na próxima posição válida
      if (row === lastRow + dRow && col === lastCol + dCol) {
        selectCell(e.target);
      }
    }
  });

  // mouseup - fim da seleção (aplica lógica)
  // adicionamos somente uma vez (document)
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      const palavra = selectedCells.map(cell => cell.textContent).join('').toUpperCase();

      if (palavras.map(p => p.toUpperCase()).includes(palavra)) {
              selectedCells.forEach(cell => {
                cell.classList.remove('selected');
            cell.classList.add('found');
             });

        // chama função que marca na lista e conta pontos
        marcarPalavra(palavra);
        
        } else {
        clearSelection();
      }

      selectedCells = [];
    }
  });
}

function selectCell(cell) {
  if (!selectedCells.includes(cell)) {
    selectedCells.push(cell);
    if (!cell.classList.contains('found')) {
      cell.classList.add('selected');
    }
  }
}

function clearSelection() {
  selectedCells.forEach(c => c.classList.remove('selected'));
}

/* ------------------ Modal vencedor e confetti ------------------ */

function marcarPalavra(palavra) {
  const lista = document.querySelectorAll(".bpal p");
  const quantidade = lista.length;

  lista.forEach(el => {
    if (el.textContent.toLowerCase() === palavra.toLowerCase()) {
      // evita contar a mesma palavra duas vezes
     
            el.style.textDecoration = "line-through";
            el.style.color = "gray"; // opcional
            total +=1;
      

      // se todas encontradas -> abre modal e dispara confetti apenas uma vez
      if (total === quantidade) {
        if (window.modal && window.fade) {
          window.modal.classList.remove('hide');
          window.fade.classList.remove('hide');
        } 
        // dispara confetti (garante somente 1 vez)
        dispararConfete();
      }
    }
  });
}

/* Função que dispara o confetti usando canvas-confetti (se disponível).
   Caso a lib NÃO exista, mantém um fallback simples (desenho próprio).
*/
function dispararConfete() {
  if (confettiFired) {
    console.info('Confetti já disparado nesta rodada; ignorando novo disparo.');
    return;
  }
  confettiFired = true;
  console.info('Disparando confetti...');

  // Se a lib estiver disponível, usa-a (recomendado)
  if (confettiInstance) {
    const duration = 2000;
    const end = Date.now() + duration;

    (function frame() {
      // bursts: centro + laterais
      confettiInstance({ particleCount: 25, spread: 55, origin: { x: 0.5, y: 0.25 } });
      confettiInstance({ particleCount: 10, spread: 80, origin: { x: 0.2, y: 0.3 } });
      confettiInstance({ particleCount: 10, spread: 80, origin: { x: 0.8, y: 0.3 } });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    return;
  }

  // Fallback: desenho manual no canvas se a lib não existir
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) {
    console.warn('Nenhum canvas de confetti encontrado para fallback.');
    return;
  }
  const ctx = canvas.getContext("2d");
  // garante tamanho correto
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettis = [];
  const cores = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899"];
  for (let i = 0; i < 150; i++) {
    confettis.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 150,
      color: cores[Math.floor(Math.random() * cores.length)],
      tilt: Math.floor(Math.random() * 20) - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0
    });
  }

  function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettis.forEach(c => {
      ctx.beginPath();
      ctx.lineWidth = c.r;
      ctx.strokeStyle = c.color;
      ctx.moveTo(c.x + c.tilt + c.r / 2, c.y);
      ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 2);
      ctx.stroke();
    });
    update();
  }

  function update() {
    confettis.forEach(c => {
      c.tiltAngle += c.tiltAngleIncremental;
      c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
      c.x += Math.sin(c.d);
      c.tilt = Math.sin(c.tiltAngle - c.d / 3) * 15;

      if (c.y > canvas.height) {
        c.x = Math.random() * canvas.width;
        c.y = -20;
      }
    });
  }

  let frames = 0;
  (function loop() {
    drawConfetti();
    frames++;
    if (frames < 150) {
      requestAnimationFrame(loop);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  })();
}

// ---------------------------------------------------
// fim do arquivo
// ---------------------------------------------------
