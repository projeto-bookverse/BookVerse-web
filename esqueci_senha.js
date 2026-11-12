// Esqueci minha senha - BookVerse
// Sem servidor de e-mail ainda: a conta é localizada pelo e-mail e a nova senha é definida na mesma tela.
// Quando houver backend, trocar a etapa 2 por um link enviado ao e-mail da pessoa.

const form = $("#form-recuperar");
const campoEmail = $("#email");
const etapaNova = $("#etapa-nova-senha");
const btn = $("#btn-recuperar");
let usuarioId = null; // preenchido quando o e-mail é encontrado (etapa 2)

function etapaEmail() {
  const email = campoEmail.value.trim().toLowerCase();
  if (!email || !emailValido(email)) {
    mostrarErro("email", !email ? "Informe seu e-mail." : "Digite um e-mail válido.");
    return;
  }
  const usuario = carregarUsuarios().find((u) => u.email === email);
  if (!usuario) {
    mostrarErro("email", "Não encontramos uma conta com esse e-mail.");
    return;
  }

  usuarioId = usuario.id;
  campoEmail.readOnly = true;
  etapaNova.hidden = false;
  btn.textContent = "Salvar nova senha";
  $("#texto-etapa").textContent = "Conta encontrada. Defina a nova senha.";
  $("#senha").focus();
}

async function etapaSenha() {
  const senha = $("#senha").value;
  const confirmar = $("#confirmar").value;
  const erros = {
    senha: !senha ? "Crie uma nova senha." : !senhaForte(senha) ? "Use 8 ou mais caracteres, com letras e números." : "",
    confirmar: !confirmar ? "Repita a senha." : confirmar !== senha ? "As senhas não são iguais." : "",
  };
  Object.entries(erros).forEach(([campo, texto]) => mostrarErro(campo, texto));
  if (Object.values(erros).some(Boolean)) return;

  btn.disabled = true;
  try {
    const usuarios = carregarUsuarios();
    const alvo = usuarios.find((u) => u.id === usuarioId);
    alvo.senhaHash = await hashSenha(senha);
    alvo.senhaAlteradaEm = new Date().toISOString();

    if (!salvarUsuarios(usuarios)) {
      avisar("Não foi possível salvar a nova senha neste navegador.", "erro");
      return;
    }
    avisar("Senha alterada. Indo para o login...", "ok");
    setTimeout(() => (window.location.href = "login.html?senha=alterada"), 900);
  } catch {
    avisar("Não foi possível alterar a senha agora. Tente novamente.", "erro");
  } finally {
    btn.disabled = false;
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  avisar("");
  usuarioId ? etapaSenha() : etapaEmail();
});