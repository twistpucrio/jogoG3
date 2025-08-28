let isDragging = false;
let selectedCells = [];
let startRow = null;
let startCol = null;
let dRow = null;
let dCol = null;

function addGridListeners(container) {
    container.addEventListener('mousedown', e => {
        if (e.target.classList.contains('grid-cell')) {
            isDragging = true;
            selectedCells = [];

            startRow = parseInt(e.target.dataset.row);
            startCol = parseInt(e.target.dataset.col);
            dRow = null;
            dCol = null;

            selectCell(e.target);
        }
    });

    container.addEventListener('mouseover', e => {
        if (isDragging && e.target.classList.contains('grid-cell')) {
            const row = parseInt(e.target.dataset.row);
            const col = parseInt(e.target.dataset.col);

            // Última célula adicionada
            const last = selectedCells[selectedCells.length - 1];
            const lastRow = parseInt(last.dataset.row);
            const lastCol = parseInt(last.dataset.col);

            // Se ainda não temos direção (primeiro movimento)
            if (dRow === null && dCol === null) {
                dRow = Math.sign(row - startRow);
                dCol = Math.sign(col - startCol);

                // Se o movimento não for linha, coluna ou diagonal -> ignora
                if (!(dRow === 0 || dCol === 0 || Math.abs(dRow) === Math.abs(dCol))) {
                    return;
                }
            }

            // Verifica se está na próxima posição da direção
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

    // Chama a função para riscar na lista
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


function marcarPalavra(palavra) {
    const lista = document.querySelectorAll(".bpal p");
    lista.forEach(el => {
        if (el.textContent.toLowerCase() === palavra.toLowerCase()) {
            el.style.textDecoration = "line-through";
            el.style.color = "gray"; // opcional
        }
    });
}