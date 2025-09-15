// Seletores
const form = document.getElementById("infoForm");
const resultado = document.getElementById("resultado");
const pesoIdealElem = document.getElementById("pesoIdeal");
const diferencaPesoElem = document.getElementById("diferencaPeso");
const checkboxDiario = document.getElementById("checkboxDiario");

// Identificar usuário logado
const emailLogado = localStorage.getItem("usuarioLogado");
const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};
const usuario = usuarios[emailLogado];

// Proteção extra
if (!usuario) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "index.html";
}

// Evento de envio do formulário
form?.addEventListener("submit", handleFormSubmit);

function handleFormSubmit(e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const idade = parseInt(document.getElementById("idade").value);
    const peso = parseFloat(document.getElementById("peso").value);
    const alturaCm = parseFloat(document.getElementById("altura").value);

    if (!nome || isNaN(idade) || isNaN(peso) || isNaN(alturaCm)) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    const vicios = Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);

    // Salvar no usuário atual
    usuario.info = { nome, idade, peso, altura: alturaCm, vicios };
    usuarios[emailLogado] = usuario;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // Calcular peso ideal
    const pesoIdeal = alturaCm - 100 - ((alturaCm - 150) / 4);
    const diferenca = peso - pesoIdeal;

    pesoIdealElem.textContent = `Peso ideal estimado: ${pesoIdeal.toFixed(2)} kg`;
    diferencaPesoElem.textContent = diferenca === 0
        ? "Você está exatamente no seu peso ideal!"
        : `Você está ${Math.abs(diferenca).toFixed(2)} kg ${diferenca > 0 ? 'acima' : 'abaixo'} do peso ideal.`;

    resultado.style.display = "block";

    checkboxDiario.innerHTML = '<p>Hoje você evitou:</p><div class="diario-container">' +
        vicios.map(v => `
            <label class="diario-checkbox">
                <input type="checkbox" value="${v}">
                ${v.charAt(0).toUpperCase() + v.slice(1)}
            </label>
        `).join('') +
    '</div>';

    setTimeout(() => {
        document.querySelector('.left-panel').classList.remove('ativo');
        document.querySelector('.right-panel').classList.add('ativo');
    }, 4000);
}

// Salvar diário
function salvarDiario() {
    const viciosEvitados = Array.from(checkboxDiario.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    const relato = document.getElementById("relato").value;
    const dataHoje = new Date().toLocaleDateString();
    const pesoAtual = parseFloat(document.getElementById("pesoAtual").value);

    if (!pesoAtual || isNaN(pesoAtual)) {
        alert("Por favor, preencha seu peso atual.");
        return;
    }

    if (!relato.trim()) {
        alert("Escreva um relato antes de salvar.");
        return;
    }

    usuario.diario[dataHoje] = {
        viciosEvitados,
        relato,
        pesoAtual
    };

    usuarios[emailLogado] = usuario;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Diário salvo com sucesso!");
    document.getElementById("relato").value = "";
    document.getElementById("pesoAtual").value = "";
    checkboxDiario.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
}

// Mostrar registros
let paginaAtual = 1;
const registrosPorPagina = 4;

function mostrarRegistros(pagina = 1) {
    const registrosDiv = document.getElementById("registros");
    const diario = usuario.diario || {};
    const datas = Object.keys(diario).sort((a, b) => new Date(b) - new Date(a));
    const totalPaginas = Math.ceil(datas.length / registrosPorPagina);

    if (datas.length === 0) {
        registrosDiv.innerHTML = "<p>Nenhum registro salvo ainda.</p>";
        return;
    }

    const inicio = (pagina - 1) * registrosPorPagina;
    const fim = inicio + registrosPorPagina;
    const registrosPagina = datas.slice(inicio, fim);

    let html = "<h4>Registros anteriores:</h4>";
    for (const data of registrosPagina) {
        const entrada = diario[data];
        html += `<div><strong>${data}</strong><br>
            Peso registrado: ${entrada.pesoAtual} kg<br>
            Vícios evitados: ${entrada.viciosEvitados.join(", ")}<br>
            Relato: ${entrada.relato}</div><hr>`;
    }

    html += `<div class="paginacao">`;
    for (let i = 1; i <= totalPaginas; i++) {
        html += `<button onclick="mostrarRegistros(${i})" ${i === pagina ? "disabled" : ""}>${i}</button>`;
    }
    html += `</div>`;

    registrosDiv.innerHTML = html;
}

// Voltar para o painel de informações
document.getElementById('voltarBtn')?.addEventListener('click', function () {
    document.querySelector('.right-panel').classList.remove('ativo');
    document.querySelector('.left-panel').classList.add('ativo');
    resultado.style.display = "none";
});

// Limpar registros (apenas do usuário atual)
function limparRegistros() {
    usuario.diario = {};
    usuarios[emailLogado] = usuario;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    mostrarRegistros();
}

// Carregar dados ao iniciar
window.onload = function () {
    const info = usuario.info || {};
    if (info.nome && info.idade && info.peso && info.altura) {
        document.querySelector(".left-panel").classList.remove("ativo");
        document.querySelector(".right-panel").classList.add("ativo");

        const vicios = info.vicios || [];
        checkboxDiario.innerHTML = '<p>Hoje você evitou:</p><div class="diario-container">' +
            vicios.map(v => `
                <label class="diario-checkbox">
                    <input type="checkbox" value="${v}">
                    ${v.charAt(0).toUpperCase() + v.slice(1)}
                </label>
            `).join('') +
        '</div>';

        const pesoIdeal = info.altura - 100 - ((info.altura - 150) / 4);
        document.querySelector(".right-panel").insertAdjacentHTML("afterbegin", `
            <div class="section">
                <p><strong>Peso quando iniciei:</strong> ${info.peso} kg</p>
                <p><strong>Meta do peso ideal:</strong> ${pesoIdeal.toFixed(2)} kg</p>
            </div>
        `);
    } else {
        document.querySelector(".left-panel").classList.add("ativo");
    }

    mostrarRegistros(paginaAtual);
};
