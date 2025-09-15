// === MANTER LOGIN ATIVO E MOSTRAR BOTÃO DE LOGOUT ===
window.addEventListener("DOMContentLoaded", () => {
    const emailLogado = localStorage.getItem("usuarioLogado");
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};
    const usuario = usuarios[emailLogado];

    const btnLogin = document.querySelector(".btnLogin-popup");
    const wrapper = document.querySelector(".wrapper");

    if (usuario && btnLogin) {
        btnLogin.textContent = `Olá, ${usuario.usuario} (Sair)`;
        btnLogin.removeEventListener("click", abrirPopup);

        btnLogin.addEventListener("click", () => {
            if (confirm("Deseja sair da sua conta?")) {
                localStorage.removeItem("usuarioLogado");
                window.location.reload();
            }
        });

        wrapper?.classList.remove("active-popup");
    }

    const nomeUsuario = document.getElementById("nomeUsuario");
    if (nomeUsuario && usuario) {
        nomeUsuario.textContent = usuario.usuario;
    }
});

// === PROTEGER QUESTIONÁRIO SEM LOGIN ===
if (window.location.pathname.includes("questionario.html")) {
    const emailLogado = localStorage.getItem("usuarioLogado");
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};
    const usuario = usuarios[emailLogado];

    if (!usuario) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = "index.html";
    }
}

// === LOGIN E REGISTRO ===
const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector("#login-link");
const registerLink = document.querySelector("#register-link");
const btnPopup = document.querySelector(".btnLogin-popup");
const iconClose = document.querySelector(".icon-close");

registerLink?.addEventListener("click", (e) => {
    e.preventDefault();
    wrapper.classList.add("active");
});
loginLink?.addEventListener("click", (e) => {
    e.preventDefault();
    wrapper.classList.remove("active");
});
btnPopup?.addEventListener("click", abrirPopup);
iconClose?.addEventListener("click", () => {
    wrapper.classList.remove("active-popup");
});
function abrirPopup() {
    const wrapper = document.querySelector(".wrapper");
    wrapper.classList.add("active-popup");
}

// === TOAST ===
function showToast(mensagem) {
    const toast = document.getElementById("toast");
    toast.textContent = mensagem;
    toast.className = "toast show";
    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
    }, 3000);
}

// === REGISTRO ===
const registroForm = document.querySelector(".form-box.registro form");
registroForm?.addEventListener("submit", function (e) {
    e.preventDefault();

    const usuario = document.getElementById("registro-usuario").value;
    const email = document.getElementById("registro-email").value;
    const senha = document.getElementById("registro-senha").value;

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};
    if (usuarios[email]) {
        showToast("Este email já está registrado!");
        return;
    }

    usuarios[email] = {
        usuario,
        email,
        senha,
        info: {},
        diario: {}
    };

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioLogado", email);
    showToast("Registro efetuado com sucesso!");
    registroForm.reset();

    setTimeout(() => {
        window.location.href = "questionario.html";
    }, 1000);
});

// === LOGIN ===
const loginForm = document.querySelector(".form-box.login form");
loginForm?.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const senha = document.getElementById("login-senha").value;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};
    const usuario = usuarios[email];

    if (usuario && usuario.senha === senha) {
        localStorage.setItem("usuarioLogado", email);
        showToast("Você está logado!");
        setTimeout(() => {
            window.location.href = "questionario.html";
        }, 1000);
    } else {
        showToast("Email ou senha incorretos!");
    }
});

// === LOGOUT MANUAL (em páginas internas)
document.getElementById("logout")?.addEventListener("click", function () {
    localStorage.removeItem("usuarioLogado");
    alert("Você foi desconectado.");
    window.location.href = "index.html";
});
