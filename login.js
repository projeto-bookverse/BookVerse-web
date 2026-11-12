// Login - BookVerse
const form = $("#form-login");
const campoEmail = $("#email");
const campoSenha = $("#senha");
const btnEntrar = $("#btn-entrar");
const LOGIN_DEMO = "teste";

// Mensagens vindas das outras telas (?conta=criada / ?senha=alterada)
const params = new URLSearchParams(location.search);
if (params.get("conta") === "criada") avisar("Conta criada. Entre com seu e-mail e senha.", "ok");
if (params.get("senha") === "alterada") avisar("Senha alterada. Entre com a nova senha.", "ok");
if (params.has("redirect")) {
  document.querySelectorAll('a[href="cadastro.html"]').forEach((link) => {
    link.href = `cadastro.html?redirect=${encodeURIComponent(destinoAposAcesso())}`;
  });
}

function validar() {
  const email = campoEmail.value.trim();
  const erroEmail = !email
    ? "Informe seu e-mail."
    : email !== LOGIN_DEMO && !emailValido(email)
    ? "Digite um e-mail válido."
    : "";
  const erroSenha = campoSenha.value ? "" : "Informe sua senha.";
  mostrarErro("email", erroEmail);
  mostrarErro("senha", erroSenha);
  return !erroEmail && !erroSenha;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  avisar("");
  if (!validar()) return;

  btnEntrar.disabled = true;
  btnEntrar.textContent = "Entrando...";
  try {
    const email = campoEmail.value.trim().toLowerCase();
    const senha = campoSenha.value;
    let usuario;

    if (email === LOGIN_DEMO && senha === LOGIN_DEMO) {
      usuario = { id: LOGIN_DEMO, nome: "Teste", email: LOGIN_DEMO };
    } else {
      const hash = await hashSenha(senha);
      usuario = carregarUsuarios().find((u) => u.email === email && u.senhaHash === hash);
    }

    if (!usuario) {
      // mensagem única: não revela se foi o e-mail ou a senha que errou
      avisar("E-mail ou senha incorretos.", "erro");
      campoSenha.value = "";
      campoSenha.focus();
      return;
    }
    iniciarSessao(usuario);
    avisar("Login feito. Redirecionando...", "ok");
    window.location.href = destinoAposAcesso();
  } catch {
    avisar("Não foi possível entrar agora. Tente novamente.", "erro");
  } finally {
    btnEntrar.disabled = false;
    btnEntrar.textContent = "Entrar";
  }
});