// Criar conta - BookVerse
const form = $("#form-conta");
const btnCriar = $("#btn-criar");

function validar() {
  const nome = $("#nome").value.trim();
  const email = $("#email").value.trim().toLowerCase();
  const senha = $("#senha").value;
  const confirmar = $("#confirmar").value;

  const erros = {
    nome: !nome ? "Informe seu nome." : nome.length < 2 ? "O nome está muito curto." : "",
    email: !email
      ? "Informe seu e-mail."
      : !emailValido(email)
      ? "Digite um e-mail válido."
      : carregarUsuarios().some((u) => u.email === email)
      ? "Já existe uma conta com esse e-mail."
      : "",
    senha: !senha ? "Crie uma senha." : !senhaForte(senha) ? "Use 8 ou mais caracteres, com letras e números." : "",
    confirmar: !confirmar ? "Repita a senha." : confirmar !== senha ? "As senhas não são iguais." : "",
  };

  Object.entries(erros).forEach(([campo, texto]) => mostrarErro(campo, texto));
  return Object.values(erros).every((t) => !t);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  avisar("");
  if (!validar()) return;

  btnCriar.disabled = true;
  btnCriar.textContent = "Criando...";
  try {
    const usuarios = carregarUsuarios();
    const usuario = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      nome: $("#nome").value.trim(),
      email: $("#email").value.trim().toLowerCase(),
      senhaHash: await hashSenha($("#senha").value),
      criadoEm: new Date().toISOString(),
    };
    usuarios.push(usuario);

    if (!salvarUsuarios(usuarios)) {
      avisar("Não foi possível salvar a conta neste navegador.", "erro");
      return;
    }
    try {
      iniciarSessao(usuario);
    } catch {
      avisar("Conta criada, mas não foi possível iniciar sua sessão. Entre com seus dados.", "erro");
      return;
    }
    avisar("Conta criada. Entrando no BookVerse...", "ok");
    setTimeout(() => (window.location.href = destinoAposAcesso()), 900);
  } catch {
    avisar("Não foi possível criar a conta agora. Tente novamente.", "erro");
  } finally {
    btnCriar.disabled = false;
    btnCriar.textContent = "Criar conta";
  }
});