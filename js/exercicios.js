const apiKey = '57df163d02mshc76fff66653ca8fp187167jsn42ce19d7a330';
const host = 'exercisedb.p.rapidapi.com';

const traducaoPartes = {
  back: 'Costas',
  cardio: 'Cardio',
  chest: 'Peito',
  lower_arms: 'Antebraços',
  lower_legs: 'Panturrilhas',
  neck: 'Pescoço',
  shoulders: 'Ombros',
  upper_arms: 'Braços',
  upper_legs: 'Pernas',
  waist: 'Cintura'
};

window.onload = () => {
  fetch(`https://${host}/exercises/bodyPartList`, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': host
    }
  })
    .then(res => res.json())
    .then(partes => {
      const select = document.getElementById('bodyPart');
      select.innerHTML = `<option value="">--Selecione--</option>`; // limpa opções anteriores

      partes.forEach(parte => {
        const traducao = traducaoPartes[parte];
        if (traducao) {
          const option = document.createElement('option');
          option.value = parte; // ainda usa o nome original na API
          option.textContent = traducao;
          select.appendChild(option);
        }
      });
    })
    .catch(err => console.error('Erro ao carregar partes do corpo:', err));
};

function buscarExercicios() {
  const parteSelecionada = document.getElementById('bodyPart').value;
  if (!parteSelecionada) {
    alert('Por favor, selecione uma parte do corpo.');
    return;
  }

  fetch(`https://${host}/exercises/bodyPart/${parteSelecionada}`, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': host
    }
  })
    .then(res => res.json())
    .then(exercicios => {
      const container = document.getElementById('resultados');
      container.innerHTML = '';

      exercicios.slice(0, 8).forEach(ex => {
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
          <h3>${ex.name.charAt(0).toUpperCase() + ex.name.slice(1)}</h3>
          <img src="${ex.gifUrl}" alt="${ex.name}" />
          <p><strong>Equipamento:</strong> ${ex.equipment}</p>
          <p><strong>Grupo muscular:</strong> ${traducaoPartes[ex.bodyPart] || ex.bodyPart}</p>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => console.error('Erro ao buscar exercícios:', err));
}
