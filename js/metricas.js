window.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuarioLogado) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "index.html";
    return;
  }

  const nomeUsuario = document.getElementById("nomeUsuario");
  const diasLogin = document.getElementById("diasLogin");
  const pesoInicial = document.getElementById("pesoInicial");
  const pesoAtual = document.getElementById("pesoAtual");
  const perdaPeso = document.getElementById("perdaPeso");
  const listaVicios = document.getElementById("listaVicios");

  nomeUsuario.textContent = `Olá, ${usuarioLogado.usuario}`;

  // Histórico por usuário
  const email = usuarioLogado.email;
  const historicoKey = `historico_${email}`;
  const historico = JSON.parse(localStorage.getItem(historicoKey) || "{}");

  // Atualizar contagem de dias de login
  const hoje = new Date().toLocaleDateString();
  if (!historico.diasLogin) historico.diasLogin = [];
  if (!historico.diasLogin.includes(hoje)) {
    historico.diasLogin.push(hoje);
    localStorage.setItem(historicoKey, JSON.stringify(historico));
  }

  // Dados de diário
  const diario = JSON.parse(localStorage.getItem("diario") || "{}");
  const datas = Object.keys(diario).sort((a, b) => new Date(a) - new Date(b));
  if (datas.length > 0) {
    const primeiroDia = diario[datas[0]];
    const ultimoDia = diario[datas[datas.length - 1]];

    pesoInicial.textContent = primeiroDia.pesoAtual;
    pesoAtual.textContent = ultimoDia.pesoAtual;

    const perda = (primeiroDia.pesoAtual - ultimoDia.pesoAtual).toFixed(1);
    perdaPeso.textContent = perda;
  }

  diasLogin.textContent = historico.diasLogin.length;

  // Contador de vícios evitados
  const vicioContagem = {};
  for (const data of datas) {
    const entrada = diario[data];
    if (entrada.viciosEvitados) {
      entrada.viciosEvitados.forEach(v => {
        vicioContagem[v] = (vicioContagem[v] || 0) + 1;
      });
    }
  }

  listaVicios.innerHTML = Object.keys(vicioContagem).length > 0
    ? Object.entries(vicioContagem)
        .map(([vicio, vezes]) => `<li>${vicio}: ${vezes}x</li>`)
        .join("")
    : "<li>Nenhum vício evitado ainda.</li>";
});
