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
    const statisticsDiv = document.getElementById('statisticsResults'); // Asegúrate de apuntar al elemento correcto

    statisticsDiv.innerHTML = '';

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const section = document.createElement('div');
            section.innerHTML = `<h3>${key}</h3>`;

            data[key].forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.innerText = JSON.stringify(item);
                section.appendChild(itemDiv);
            });

            statisticsDiv.appendChild(section);
        }
    }
}
