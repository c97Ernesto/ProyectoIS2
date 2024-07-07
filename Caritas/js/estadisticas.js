document.getElementById('statisticsForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    fetch('http://localhost:3000/estadisticas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ startDate, endDate })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Agrega un log para verificar los datos recibidos
        if (data.error) {
            console.error(`Error from server: ${data.error}`);
            return;
        }

        Object.keys(data).forEach(key => {
            if (!Array.isArray(data[key])) {
                console.error(`Expected array for ${key}, but got:`, data[key]);
                data[key] = [];
            }
        });

        displayStatistics(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function displayStatistics(data) {
    const statisticsDiv = document.getElementById('statisticsResults');

    statisticsDiv.innerHTML = '';

    // Sección de estadísticas totales
    const totalSection = document.createElement('div');
    totalSection.classList.add('statistics-section');
    totalSection.innerHTML = `<h2>Estadísticas Totales</h2>`;

    const totalRow = document.createElement('div');
    totalRow.classList.add('statistics-row');

    for (const key in data) {
        if (data.hasOwnProperty(key) && !key.includes('PorEstadoYFilial') && !key.includes('donacionesPorFilial')) {
            const card = document.createElement('div');
            card.classList.add('statistics-card');

            const section = document.createElement('div');
            section.innerHTML = `<h3>${key}</h3>`;

            const table = document.createElement('table');
            table.classList.add('statistics-table');
            const headerRow = document.createElement('tr');

            if (data[key].length > 0) {
                Object.keys(data[key][0]).forEach(header => {
                    const th = document.createElement('th');
                    th.innerText = header;
                    headerRow.appendChild(th);
                });
                table.appendChild(headerRow);
            }

            data[key].forEach(item => {
                const row = document.createElement('tr');
                Object.values(item).forEach(value => {
                    const td = document.createElement('td');
                    td.innerText = value;
                    row.appendChild(td);
                });
                table.appendChild(row);
            });

            section.appendChild(table);
            card.appendChild(section);
            totalRow.appendChild(card);
        }
    }

    totalSection.appendChild(totalRow);
    statisticsDiv.appendChild(totalSection);

    // Sección de estadísticas por filial
    const filialSection = document.createElement('div');
    filialSection.classList.add('statistics-section');
    filialSection.innerHTML = `<h2>Estadísticas por Filial</h2>`;

    const filialRow = document.createElement('div');
    filialRow.classList.add('statistics-row');

    for (const key in data) {
        if (data.hasOwnProperty(key) && (key.includes('PorEstadoYFilial') || key.includes('donacionesPorFilial'))) {
            const card = document.createElement('div');
            card.classList.add('statistics-card');

            const section = document.createElement('div');
            section.innerHTML = `<h3>${key}</h3>`;

            const table = document.createElement('table');
            table.classList.add('statistics-table');
            const headerRow = document.createElement('tr');

            if (data[key].length > 0) {
                Object.keys(data[key][0]).forEach(header => {
                    const th = document.createElement('th');
                    th.innerText = header;
                    headerRow.appendChild(th);
                });
                table.appendChild(headerRow);
            }

            data[key].forEach(item => {
                const row = document.createElement('tr');
                Object.values(item).forEach(value => {
                    const td = document.createElement('td');
                    td.innerText = value;
                    row.appendChild(td);
                });
                table.appendChild(row);
            });

            section.appendChild(table);
            card.appendChild(section);
            filialRow.appendChild(card);
        }
    }

    filialSection.appendChild(filialRow);
    statisticsDiv.appendChild(filialSection);
}
