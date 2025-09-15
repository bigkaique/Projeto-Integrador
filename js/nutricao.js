const traducaoIngredientes = {
  "tomate": "tomate",
  "ovo": "ovos",
  "batata": "batata",
  "frango": "frango",
  "arroz": "arroz",
  "cenoura": "cenoura",
  "pão": "pão",
  "carne": "carne",
};

function normalizarTexto(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function traduzIngredientes(ingredientes) {
  return ingredientes.map(ing => ing); // Ingredientes já estão em português no JSON
}

async function buscarReceitas() {
  const input = document.getElementById('ingredientes').value.trim().toLowerCase();
  const container = document.getElementById('receitas');
  container.innerHTML = '';

  if (!input) {
    alert('Digite pelo menos um ingrediente.');
    return;
  }

  const ingredienteOriginal = traducaoIngredientes[input] || input;
  const ingredienteNormalizado = normalizarTexto(ingredienteOriginal);

  try {
    const response = await fetch('/receitas.json');
    if (!response.ok) {
      throw new Error('Erro ao buscar receitas');
    }
    const data = await response.json();

    const receitasFiltradas = data.recipes.filter(receita =>
      receita.ingredients.some(ing => normalizarTexto(ing).includes(ingredienteNormalizado))
    );

    if (receitasFiltradas.length === 0) {
      container.innerHTML = '<p class="bloco-nutriente">Nenhuma receita encontrada com esse ingrediente.</p>';
      return;
    }

    receitasFiltradas.slice(0, 5).forEach(receita => {
      const ingredientesTraduzidos = traduzIngredientes(receita.ingredients);

      const div = document.createElement('div');
      div.classList.add('bloco-receita');
      div.innerHTML = `
        <h3>${receita.name}</h3>
        <img src="${receita.image}" alt="${receita.name}" style="width: 100%; max-width: 300px; border-radius: 6px;">
        <p><strong>Ingredientes:</strong> ${ingredientesTraduzidos.join(', ')}</p>
        <p><strong>Instruções:</strong></p>
        <ul>${receita.instructions.map(step => `<li>${step}</li>`).join('')}</ul>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    container.innerHTML = '<p class="bloco-nutriente">Erro ao buscar receitas. Verifique sua conexão.</p>';
  }
}

function limparReceitas() {
  const container = document.getElementById('receitas');
  container.innerHTML = '';
  document.getElementById('ingredientes').value = '';
}
