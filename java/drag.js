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


/* Drag / seleção  */
function addGridListeners(container) {

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

  container.addEventListener('mouseover', e => {
    if (isDragging && e.target.classList && e.target.classList.contains('grid-cell')) {
      const row = parseInt(e.target.dataset.row, 10);
      const col = parseInt(e.target.dataset.col, 10);

            const last = selectedCells[selectedCells.length - 1];
            const lastRow = parseInt(last.dataset.row);
            const lastCol = parseInt(last.dataset.col);

     
        if (dRow === null && dCol === null) {
        dRow = Math.sign(row - startRow);
        dCol = Math.sign(col - startCol);

        
        if (!(dRow === 0 || dCol === 0 || Math.abs(dRow) === Math.abs(dCol))) {
          return;
        }
      }

      
      if (row === lastRow + dRow && col === lastCol + dCol) {
        selectCell(e.target);
      }
    }
  });

    document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      const palavra = selectedCells.map(cell => cell.textContent).join('').toUpperCase();

      if (palavras.map(p => p.toUpperCase()).includes(palavra)) {
              selectedCells.forEach(cell => {
                cell.classList.remove('selected');
            cell.classList.add('found');
             });

       
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

/*  Modal vencedor e confetti */

function marcarPalavra(palavra) {
  const lista = document.querySelectorAll(".bpal p");
  const quantidade = lista.length;

  lista.forEach(el => {
    if (el.textContent.toLowerCase() === palavra.toLowerCase()) {
   
     
            el.style.textDecoration = "line-through";
            el.style.color = "gray"; 
            total +=1;
      

      if (total === quantidade) {
        if (window.modal && window.fade) {
          window.modal.classList.remove('hide');
          window.fade.classList.remove('hide');
        } 
        
        dispararConfete();
      }
    }
  });
}


function dispararConfete() {
  if (confettiFired) {
    console.info('Confetti já disparado nesta rodada; ignorando novo disparo.');
    return;
  }
  confettiFired = true;
  console.info('Disparando confetti...');

 
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
}

 

