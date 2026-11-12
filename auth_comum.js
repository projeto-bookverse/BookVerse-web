// Funções compartilhadas pelas telas de login, criar conta e esqueci a senha.
// Sem backend por enquanto: usuários ficam no localStorage.

const CHAVE_USUARIOS = "bookverse:usuarios";
const CHAVE_SESSAO = "bookverse:sessao";
const $ = (seletor) => document.querySelector(seletor);
const PAGINAS_PROTEGIDAS = ["index.html", "reviews.html", "cadastro_livro.html"];

function iniciarSessao(usuario) {
  localStorage.setItem(CHAVE_SESSAO, JSON.stringify({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  }));
}

function destinoAposAcesso() {
  const destino = new URLSearchParams(location.search).get("redirect");
  if (!destino) return "index.html";

  const pagina = destino.split(/[?#]/, 1)[0];
  return PAGINAS_PROTEGIDAS.includes(pagina) && !destino.includes("/") && !destino.includes("\\")
    ? destino
    : "index.html";
}

// A senha nunca é guardada em texto puro: só o hash SHA-256 (precisa de localhost ou https).
async function hashSenha(senha) {
  const bytes = new TextEncoder().encode(senha);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function carregarUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || [];
  } catch {
    return [];
  }
}

function salvarUsuarios(lista) {
  try {
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(lista));
    return true;
  } catch {
    return false;
  }
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function senhaForte(senha) {
  return senha.length >= 8 && /[A-Za-z]/.test(senha) && /\d/.test(senha);
}

function mostrarErro(nome, texto) {
  const alvo = document.querySelector(`[data-erro="${nome}"]`);
  if (!alvo) return;
  alvo.textContent = texto;
  alvo.closest(".field").classList.toggle("invalid", Boolean(texto));
}

function avisar(texto, tipo = "") {
  const caixa = $("#mensagem");
  caixa.textContent = texto;
  caixa.className = `form-message ${tipo}`.trim();
}

// Botões "Mostrar/Ocultar" das senhas (data-alvo = id do campo)
document.querySelectorAll(".toggle-password").forEach((botao) => {
  botao.addEventListener("click", () => {
    const campo = document.getElementById(botao.dataset.alvo);
    const visivel = campo.type === "text";
    campo.type = visivel ? "password" : "text";
    botao.textContent = visivel ? "Mostrar" : "Ocultar";
    botao.setAttribute("aria-label", visivel ? "Mostrar senha" : "Ocultar senha");
    botao.setAttribute("aria-pressed", String(!visivel));
  });
});

// Limpa o erro de um campo assim que a pessoa volta a digitar
document.querySelectorAll(".auth-card input").forEach((campo) =>
  campo.addEventListener("input", () => mostrarErro(campo.name, ""))
);