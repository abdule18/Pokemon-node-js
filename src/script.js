$(document).ready(function() {

  let chartInstance = null;

  $('#button').click(function(e) {
      e.preventDefault();
      const pokemonName = $('input[type="text"]').val().trim().toLowerCase();
      
      if (pokemonName) {
          $.get(`/api/pokemon/${pokemonName}`, function(data) {
              $('#hp').text(data.hp);
              $('#attack').text(data.attack);
              $('#defense').text(data.defense);
              $('#speed').text(data.speed);
              $('#type-effectiveness').text(data.types.join(', '));
              $('#evolution-path').text(data.evolution); 
              $('h2').text(data.name);
              $('img').attr('src', data.sprite);
              updateChart(data);
          }).fail(function() {
              alert('Pokémon not found!');
          });
      }
  });


  function updateChart(data) {
    const ctx = document.getElementById('myChart').getContext('2d');

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['HP', 'Attack', 'Defense', 'Speed'],
          datasets: [{
            label: data.name,
            data: [data.hp, data.attack, data.defense, data.speed],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
});






// const express = require('express');
// const path = require('path');
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Serve static files from the "dist" directory
// app.use(express.static(path.join(__dirname, 'dist')));

// // Serve static files from the "src" directory (for development)
// app.use(express.static(path.join(__dirname, 'src')));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'src/index.html'));
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
