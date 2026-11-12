// Cadastro de livros - BookVerse
// Por enquanto os dados ficam no localStorage; depois dá para trocar por uma API/banco.

const CHAVE = "bookverse:livros";
const LIMITE_CAPA = 3 * 1024 * 1024; // 3 MB

const $ = (seletor) => document.querySelector(seletor);
const form = $("#form-livro");
const campos = {
  titulo: $("#titulo"),
  autor: $("#autor"),
  genero: $("#genero"),
  isbn: $("#isbn"),
  descricao: $("#descricao"),
};
const inputCapa = $("#capa");
const previewCapa = $("#capa-preview");
const textoCapa = $("#capa-texto");
const btnRemoverCapa = $("#remover-capa");
const btnSalvar = $("#btn-salvar");
const btnLimpar = $("#btn-limpar");
const mensagem = $("#mensagem");
const lista = $("#lista-livros");
const listaVazia = $("#lista-vazia");
const total = $("#total");

let capaAtual = ""; // imagem em base64
let editandoId = null; // id do livro em edição (null = cadastro novo)
let livros = carregar();

/* ---------- Armazenamento ---------- */
function carregar() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || [];
  } catch {
    return [];
  }
}

function salvar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(livros));
    return true;
  } catch {
    return false; // armazenamento cheio ou bloqueado
  }
}

/* ---------- ISBN ---------- */
const GRUPOS_ISBN = {
  13: [3, 2, 3, 4, 1], // 978-85-359-0277-5
  10: [1, 2, 6, 1], // 0-30-640615-2
};

function mascararIsbn(valor) {
  let v = valor.toUpperCase().replace(/[^\dX]/g, "").replace(/X(?=.)/g, "");
  const tipo = /^97[89]/.test(v) ? 13 : 10;
  v = v.slice(0, tipo);

  const partes = [];
  let pos = 0;
  for (const tamanho of GRUPOS_ISBN[tipo]) {
    if (pos >= v.length) break;
    partes.push(v.slice(pos, pos + tamanho));
    pos += tamanho;
  }
  return partes.join("-");
}

campos.isbn.addEventListener("input", () => {
  campos.isbn.value = mascararIsbn(campos.isbn.value);
});

function limparIsbn(valor) {
  return valor.replace(/[\s-]/g, "").toUpperCase();
}

function isbnValido(valor) {
  const isbn = limparIsbn(valor);

  if (/^\d{13}$/.test(isbn)) {
    const soma = [...isbn].reduce((acc, d, i) => acc + Number(d) * (i % 2 === 0 ? 1 : 3), 0);
    return soma % 10 === 0;
  }
  if (/^\d{9}[\dX]$/.test(isbn)) {
    const soma = [...isbn].reduce((acc, d, i) => acc + (d === "X" ? 10 : Number(d)) * (10 - i), 0);
    return soma % 11 === 0;
  }
  return false;
}

/* ---------- Validação ---------- */
function mostrarErro(nome, texto) {
  const alvo = document.querySelector(`[data-erro="${nome}"]`);
  if (!alvo) return;
  alvo.textContent = texto;
  alvo.closest(".field")?.classList.toggle("invalid", Boolean(texto));
}

function validar() {
  const erros = {};
  const titulo = campos.titulo.value.trim();
  const autor = campos.autor.value.trim();

  if (!titulo) erros.titulo = "Informe o título do livro.";
  if (!autor) erros.autor = "Informe o nome do autor.";
  if (!campos.genero.value) erros.genero = "Escolha um gênero.";

  if (!campos.isbn.value.trim()) {
    erros.isbn = "Informe o ISBN.";
  } else if (!isbnValido(campos.isbn.value)) {
    erros.isbn = "ISBN inválido. Use 10 ou 13 dígitos.";
  } else if (livros.some((l) => l.id !== editandoId && l.isbn === limparIsbn(campos.isbn.value))) {
    erros.isbn = "Já existe um livro com esse ISBN.";
  }

  ["titulo", "autor", "genero", "isbn"].forEach((n) => mostrarErro(n, erros[n] || ""));
  return Object.keys(erros).length === 0;
}

/* ---------- Capa ---------- */
function reduzirImagem(arquivo, larguraMax = 400) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(arquivo);
    const img = new Image();
    img.onload = () => {
      const escala = Math.min(1, larguraMax / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * escala);
      canvas.height = Math.round(img.height * escala);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("imagem inválida"));
    };
    img.src = url;
  });
}

function atualizarCapa(dataUrl) {
  capaAtual = dataUrl;
  previewCapa.hidden = !dataUrl;
  btnRemoverCapa.hidden = !dataUrl;
  if (dataUrl) previewCapa.src = dataUrl;
  textoCapa.textContent = dataUrl ? "Trocar imagem" : "Escolher imagem (JPG ou PNG, até 3 MB)";
}

inputCapa.addEventListener("change", async () => {
  const arquivo = inputCapa.files[0];
  mostrarErro("capa", "");
  if (!arquivo) return;

  if (!arquivo.type.startsWith("image/")) {
    mostrarErro("capa", "O arquivo precisa ser uma imagem.");
    inputCapa.value = "";
    return;
  }
  if (arquivo.size > LIMITE_CAPA) {
    mostrarErro("capa", "A imagem passa de 3 MB.");
    inputCapa.value = "";
    return;
  }
  try {
    atualizarCapa(await reduzirImagem(arquivo));
  } catch {
    mostrarErro("capa", "Não foi possível ler essa imagem.");
  }
});

btnRemoverCapa.addEventListener("click", () => {
  inputCapa.value = "";
  atualizarCapa("");
});

/* ---------- Lista ---------- */
function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function renderizar() {
  total.textContent = livros.length;
  listaVazia.hidden = livros.length > 0;

  lista.innerHTML = livros
    .map((l) => {
      const capa = l.capa
        ? `<img class="book-cover" src="${l.capa}" alt="Capa de ${escapar(l.titulo)}">`
        : `<div class="book-cover book-cover-vazia" aria-hidden="true">${escapar(l.titulo[0].toUpperCase())}</div>`;
      const desc = l.descricao ? `<p class="book-desc">${escapar(l.descricao)}</p>` : "";
      const classe = l.id === editandoId ? "book-item editando" : "book-item";
      return `
        <li class="${classe}" data-id="${l.id}">
          ${capa}
          <div class="book-info">
            <h3>${escapar(l.titulo)}</h3>
            <p class="book-author">${escapar(l.autor)}</p>
            <p class="book-meta">${escapar(l.genero)} • ISBN ${escapar(mascararIsbn(l.isbn))}</p>
            ${desc}
          </div>
          <div class="book-actions">
            <button type="button" class="book-edit" aria-label="Editar ${escapar(l.titulo)}">Editar</button>
            <button type="button" class="book-delete" aria-label="Excluir ${escapar(l.titulo)}">Excluir</button>
          </div>
        </li>`;
    })
    .join("");
}

lista.addEventListener("click", (e) => {
  const item = e.target.closest(".book-item");
  if (!item) return;
  const id = item.dataset.id;

  if (e.target.closest(".book-edit")) {
    iniciarEdicao(id);
  } else if (e.target.closest(".book-delete")) {
    const livro = livros.find((l) => l.id === id);
    if (!confirm(`Excluir "${livro.titulo}"?`)) return;
    livros = livros.filter((l) => l.id !== id);
    salvar();
    if (id === editandoId) form.reset(); // estava editando este livro
    renderizar();
    avisar("Livro excluído.", "ok");
  }
});

/* ---------- Edição ---------- */
function iniciarEdicao(id) {
  const livro = livros.find((l) => l.id === id);
  if (!livro) return;

  editandoId = id;
  campos.titulo.value = livro.titulo;
  campos.autor.value = livro.autor;
  campos.genero.value = livro.genero;
  campos.isbn.value = mascararIsbn(livro.isbn);
  campos.descricao.value = livro.descricao;
  $("#contador").textContent = `${livro.descricao.length}/500`;
  inputCapa.value = "";
  atualizarCapa(livro.capa);

  document.querySelectorAll(".field-error").forEach((el) => (el.textContent = ""));
  document.querySelectorAll(".field.invalid").forEach((el) => el.classList.remove("invalid"));

  btnSalvar.textContent = "Salvar alterações";
  btnLimpar.textContent = "Cancelar edição";
  renderizar();
  avisar(`Editando "${livro.titulo}".`);
  form.scrollIntoView({ behavior: "smooth", block: "start" });
  campos.titulo.focus({ preventScroll: true });
}

function sairDaEdicao() {
  editandoId = null;
  btnSalvar.textContent = "Salvar livro";
  btnLimpar.textContent = "Limpar";
  renderizar();
}

/* ---------- Formulário ---------- */
function avisar(texto, tipo = "") {
  mensagem.textContent = texto;
  mensagem.className = `form-message ${tipo}`.trim();
}

campos.descricao.addEventListener("input", () => {
  $("#contador").textContent = `${campos.descricao.value.length}/500`;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  avisar("");
  if (!validar()) {
    avisar("Corrija os campos destacados.", "erro");
    return;
  }

  const dados = {
    titulo: campos.titulo.value.trim(),
    autor: campos.autor.value.trim(),
    genero: campos.genero.value,
    isbn: limparIsbn(campos.isbn.value),
    descricao: campos.descricao.value.trim(),
    capa: capaAtual,
  };

  const antes = [...livros];
  const editando = editandoId !== null;

  if (editando) {
    livros = livros.map((l) =>
      l.id === editandoId ? { ...l, ...dados, atualizadoEm: new Date().toISOString() } : l
    );
  } else {
    livros.unshift({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      ...dados,
      criadoEm: new Date().toISOString(),
    });
  }

  if (!salvar()) {
    livros = antes;
    avisar("Sem espaço para salvar. Tente uma capa menor ou remova livros.", "erro");
    return;
  }

  form.reset(); // também sai do modo de edição
  atualizarCapa("");
  avisar(editando ? "Alterações salvas." : "Livro salvo com sucesso.", "ok");
  campos.titulo.focus();
});

form.addEventListener("reset", () => {
  document.querySelectorAll(".field-error").forEach((el) => (el.textContent = ""));
  document.querySelectorAll(".field.invalid").forEach((el) => el.classList.remove("invalid"));
  atualizarCapa("");
  $("#contador").textContent = "0/500";
  avisar("");
  sairDaEdicao();
});

renderizar();