
let fields = [
    null,
    'cross',
    null,
    null,
    null,
    'circle',
    null,
    null,
    null
]

let currentPlayer = 'circle'; // Startspieler (Kreis beginnt)

function init() {
    render();
}

function render() {
    const container = document.getElementById('content');
    let tableHTML = '<table>';

    for (let i = 0; i < 3; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            tableHTML += `<td onclick="handleCellClick(${index})">`;
            if (fields[index] === 'circle') {
                tableHTML += generateAnimatedCircleSVG();
            } else if (fields[index] === 'cross') {
                tableHTML += generateAnimatedXSvg();
            }
            tableHTML += '</td>';
        }
        tableHTML += '</tr>';
    }

    tableHTML += '</table>';
    container.innerHTML = tableHTML;
}

function generateAnimatedCircleSVG() {
    const circleHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70">
            <circle cx="35" cy="35" r="30" fill="none" stroke="#00B0EF" stroke-width="5">
                <animate attributeName="r" from="0" to="30" dur="1s" begin="0s" fill="freeze" />
                <animate attributeName="stroke-dasharray" from="0, 188" to="188, 0" dur="1s" begin="0s" fill="freeze" />
            </circle>
        </svg>
    `;

    return circleHTML;
}

// Beispiel: Den generierten SVG-Code in ein HTML-Element einfügen
// const svgContainer = document.getElementById('svg-container');
// svgContainer.innerHTML = generateAnimatedCircleSVG();

function generateAnimatedXSvg() {
    const xHTML = `
        <svg width="70" height="70" xmlns="http://www.w3.org/2000/svg">
            <line x1="10" y1="10" x2="60" y2="60" stroke="#FF0000" stroke-width="5">
                <animate attributeName="x1" from="10" to="60" dur="1s" begin="0s" fill="freeze" />
                <animate attributeName="y1" from="10" to="60" dur="1s" begin="0s" fill="freeze" />
                <animate attributeName="x2" from="60" to="10" dur="1s" begin="0s" fill="freeze" />
                <animate attributeName="y2" from="60" to="10" dur="1s" begin="0s" fill="freeze" />
            </line>
            <line x1="10" y1="60" x2="60" y2="10" stroke="#FF0000" stroke-width="5">
                <animate attributeName="x1" from="10" to="60" dur="1s" begin="0s" fill="freeze" />
                <animate attributeName="y1" from="60" to="10" dur="1s" begin="0s" fill="freeze" />
                <animate attributeName="x2" from="60" to="10" dur="1s" begin="0s" fill="freeze" />
                <animate attributeName="y2" from="10" to="60" dur="1s" begin="0s" fill="freeze" />
            </line>
        </svg>
    `;
    return xHTML;
}

function handleCellClick(index) {
    if (!fields[index]) {
        fields[index] = currentPlayer;
        const cell = document.getElementsByTagName('td')[index];
        cell.innerHTML = currentPlayer === 'circle' ? generateAnimatedCircleSVG() : generateAnimatedXSvg();
        cell.onclick = null; // Entferne den Event-Listener

        // Überprüfe den Gewinner
        const winner = checkWinner();
        if (winner) {
            alert(`Spieler ${winner} gewinnt!`);
            drawWinningLine(winner); // Zeichne die Gewinnerlinie

            // Hier kannst du weitere Aktionen nach dem Gewinn ausführen, z.B. das Spiel zurücksetzen.
        } else {
            // Wechsle den Spieler
            currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
        }
    }
}

function checkWinner() {
    // Überprüfe Reihen
    for (let i = 0; i < 3; i++) {
        if (fields[i * 3] && fields[i * 3] === fields[i * 3 + 1] && fields[i * 3 + 1] === fields[i * 3 + 2]) {
            return fields[i * 3]; // Der Spieler gewinnt
        }
    }

    // Überprüfe Spalten
    for (let i = 0; i < 3; i++) {
        if (fields[i] && fields[i] === fields[i + 3] && fields[i + 3] === fields[i + 6]) {
            return fields[i]; // Der Spieler gewinnt
        }
    }

    // Überprüfe Diagonalen
    if (fields[0] && fields[0] === fields[4] && fields[4] === fields[8]) {
        return fields[0]; // Der Spieler gewinnt
    }
    if (fields[2] && fields[2] === fields[4] && fields[4] === fields[6]) {
        return fields[2]; // Der Spieler gewinnt
    }

    // Wenn kein Gewinner gefunden wurde
    return null;
}

function drawWinningLine(winner) {
    const cells = document.getElementsByTagName('td');
    const cellWidth = cells[0].offsetWidth; // Breite einer Zelle
    const cellHeight = cells[0].offsetHeight; // Höhe einer Zelle

    if (winner === 'circle' || winner === 'cross') {
        // Überprüfe Reihen
        for (let i = 0; i < 3; i++) {
            if (fields[i * 3] === winner && fields[i * 3 + 1] === winner && fields[i * 3 + 2] === winner) {
                const lineHeight = 5; // Dicke der Linie
                const lineColor = '#00FF00'; // Farbe der Linie

                const lineElement = document.createElement('div');
                lineElement.classList.add('winner-line');
                lineElement.style.width = cellWidth * 3 + 'px'; // Berechne die Breite der Linie
                lineElement.style.height = lineHeight + 'px';
                lineElement.style.backgroundColor = lineColor;

                const row = document.createElement('div');
                row.classList.add('winner-row');
                row.style.height = cellHeight + 'px'; // Setze die Höhe des Zeilen-Containers
                row.appendChild(lineElement);

                cells[i * 3].parentNode.insertBefore(row, cells[i * 3].parentNode.firstChild); // Füge die Zeile oben in die Tabelle ein
                return;
            }
        }

        // Überprüfe Spalten
        for (let i = 0; i < 3; i++) {
            if (fields[i] === winner && fields[i + 3] === winner && fields[i + 6] === winner) {
                for (let j = 0; j < 3; j++) {
                    const cell = cells[i + j * 3];
                    cell.classList.add('winner');
                }
                return;
            }
        }

        // Überprüfe Diagonalen
        if (fields[0] === winner && fields[4] === winner && fields[8] === winner) {
            for (let i = 0; i < 3; i++) {
                const cell = cells[i * 4];
                cell.classList.add('winner');
            }
            return;
        }
        if (fields[2] === winner && fields[4] === winner && fields[6] === winner) {
            for (let i = 0; i < 3; i++) {
                const cell = cells[2 + i * 2];
                cell.classList.add('winner');
            }
            return;
        }
    }
}




const winner = checkWinner();
if (winner) {
    alert(`Spieler ${winner} gewinnt!`);
    drawWinningLine(winner);
    // Hier kannst du weitere Aktionen nach dem Gewinn ausführen, z.B. das Spiel zurücksetzen.
}


