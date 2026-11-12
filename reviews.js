const reviewsStorageKey = "bookverse.reviews.demo.v1";
const demoBooks = [
  { id: "hora-da-estrela", titulo: "A Hora da Estrela", autor: "Clarice Lispector", isbn: "9788520925685", tone: "#8b5e55" },
  { id: "torto-arado", titulo: "Torto Arado", autor: "Itamar Vieira Junior", isbn: "9786580309313", tone: "#806b43" },
  { id: "a-vegetariana", titulo: "A Vegetariana", autor: "Han Kang", isbn: "9788535929690", tone: "#71816d" },
  { id: "dom-casmurro", titulo: "Dom Casmurro", autor: "Machado de Assis", isbn: "9788525406958", tone: "#465f72" },
  { id: "o-pequeno-principe", titulo: "O Pequeno Príncipe", autor: "Antoine de Saint-Exupéry", isbn: "9788595081512", tone: "#b58b4b" },
  { id: "quarto-de-despejo", titulo: "Quarto de Despejo", autor: "Carolina Maria de Jesus", isbn: "9788508171279", tone: "#5c665b" }
];
const sampleReviews = [
  {
    id: "sample-harry-potter",
    origem: "demo",
    usuarioId: "sample-reader-1",
    nomeExibicao: "Marina Costa",
    nota: 5,
    tituloResenha: "Uma aventura que nunca envelhece",
    textoResenha: "A entrada de Harry em Hogwarts continua sendo uma das jornadas mais encantadoras da literatura. É impossível não se apegar aos personagens e querer descobrir cada segredo daquele mundo.",
    dataPublicacao: "2026-10-28",
    book: { id: "sample-harry-potter", title: "Harry Potter e a Pedra Filosofal", author: "J.K. Rowling", isbn: "9788532530783", tone: "#243e58" }
  },
  {
    id: "sample-pequeno-principe",
    origem: "demo",
    usuarioId: "sample-reader-2",
    nomeExibicao: "Rafael Mendes",
    nota: 5,
    tituloResenha: "Pequeno no tamanho, imenso no significado",
    textoResenha: "Uma história simples e poética que sempre revela algo novo a cada leitura. As conversas do principezinho lembram a gente de olhar com carinho para as pessoas e coisas que realmente importam.",
    dataPublicacao: "2026-10-25",
    book: { id: "sample-pequeno-principe", title: "O Pequeno Príncipe", author: "Antoine de Saint-Exupéry", isbn: "9788595081512", tone: "#b58b4b" }
  },
  {
    id: "sample-culpa-das-estrelas",
    origem: "demo",
    usuarioId: "sample-reader-3",
    nomeExibicao: "Bia Oliveira",
    nota: 4,
    tituloResenha: "Sensível e cheio de humanidade",
    textoResenha: "Gostei de como o livro mistura humor, afeto e momentos difíceis sem deixar seus personagens virarem apenas uma tragédia. Hazel e Gus ficam na memória muito depois da última página.",
    dataPublicacao: "2026-10-22",
    book: { id: "sample-culpa-das-estrelas", title: "A Culpa é das Estrelas", author: "John Green", isbn: "9788580572261", tone: "#668397" }
  },
  {
    id: "sample-hobbit",
    origem: "demo",
    usuarioId: "sample-reader-4",
    nomeExibicao: "Lucas Ferreira",
    nota: 5,
    tituloResenha: "A aventura perfeita para sair do Condado",
    textoResenha: "Bilbo começa querendo conforto e termina descobrindo uma coragem que nem sabia ter. A jornada é divertida, acolhedora e cheia de cenários que dão vontade de explorar junto com a companhia.",
    dataPublicacao: "2026-10-19",
    book: { id: "sample-hobbit", title: "O Hobbit", author: "J.R.R. Tolkien", isbn: "9788595084742", tone: "#657451" }
  },
  {
    id: "sample-biblioteca-meia-noite",
    origem: "demo",
    usuarioId: "sample-reader-5",
    nomeExibicao: "Camila Rocha",
    nota: 4,
    tituloResenha: "Uma reflexão bonita sobre escolhas",
    textoResenha: "A premissa da biblioteca entre a vida e a morte rende uma leitura envolvente e reflexiva. Acompanhar Nora por tantas possibilidades faz pensar nos caminhos que escolhemos e nos que ainda podemos construir.",
    dataPublicacao: "2026-10-15",
    book: { id: "sample-biblioteca-meia-noite", title: "A Biblioteca da Meia-Noite", author: "Matt Haig", isbn: "9786555603025", tone: "#425e78" }
  },
  {
    id: "sample-e-assim-que-acaba",
    origem: "demo",
    usuarioId: "sample-reader-6",
    nomeExibicao: "Nina Almeida",
    nota: 4,
    tituloResenha: "Uma leitura intensa que provoca conversa",
    textoResenha: "É uma história emocional e difícil de largar, com temas que pedem sensibilidade. Gostei de acompanhar a força da Lily e de como o livro abre espaço para conversar sobre limites e recomeços.",
    dataPublicacao: "2026-10-12",
    book: { id: "sample-e-assim-que-acaba", title: "É Assim que Acaba", author: "Colleen Hoover", isbn: "9788501112514", tone: "#a16d72" }
  }
];

const form = document.getElementById("reviewForm");
const bookSelect = document.getElementById("bookSelect");
const bookSearch = document.getElementById("bookSearch");
const bookSearchResults = document.getElementById("bookSearchResults");
const reviewEditor = document.getElementById("reviewEditor");
const reviewsList = document.getElementById("reviewsList");
const reviewsStatus = document.getElementById("reviewsStatus");
const formMessage = document.getElementById("formMessage");
const submitButton = document.getElementById("submitReview");
const cancelButton = document.getElementById("cancelEdit");
const reviewTitle = document.getElementById("reviewTitle");
const reviewText = document.getElementById("reviewText");
const bookReviewSearch = document.getElementById("reviewBookSearch");
const authorReviewSearch = document.getElementById("reviewAuthorSearch");
const ratingFilter = document.getElementById("ratingFilter");
const reviewSort = document.getElementById("reviewSort");
const loadMoreButton = document.getElementById("loadMoreReviews");
const communityRealReviews = document.getElementById("communityRealReviews");
const reviewDetailDialog = document.getElementById("reviewDetailDialog");
const reviewDetailContent = document.getElementById("reviewDetailContent");

let currentUserId = "";
let editingId = null;
let allReviews = [];
let books = [];
let reviewPage = 1;
const reviewsPerPage = 6;

function getCurrentUserId() {
  return "demo-reader";
}

function readStoredReviews() {
  const stored = window.localStorage.getItem(reviewsStorageKey);
  if (!stored) return [];
  let parsed;
  try {
    parsed = JSON.parse(stored);
  } catch {
    throw new Error("As avaliações salvas estão inválidas. Limpe os dados do site e tente novamente.");
  }
  if (!Array.isArray(parsed)) {
    throw new Error("Não foi possível ler as avaliações salvas neste navegador.");
  }
  return parsed;
}

function persistReviews() {
  window.localStorage.setItem(reviewsStorageKey, JSON.stringify(allReviews));
}

function bookIdOf(book) {
  return book?.id ?? book?.livroId ?? book?.codigo;
}

function reviewIdOf(review) {
  return review?.id ?? review?.avaliacaoId ?? review?.idAvaliacao ?? review?.codigoAvaliacao;
}

function reviewBookId(review) {
  return review?.livroId ?? review?.livro?.id ?? review?.livro?.livroId ??
    review?.bookId ?? review?.book?.id;
}

function reviewUserId(review) {
  return review?.usuarioId ?? review?.usuario?.id ?? review?.usuario?.usuarioId ??
    review?.userId ?? review?.user?.id;
}

function reviewRating(review) {
  return Number(review?.nota ?? review?.rating);
}

function reviewTextOf(review) {
  return review?.textoResenha ?? review?.resenha ?? review?.texto ??
    review?.text ?? review?.comment ?? "";
}

function reviewTitleOf(review) {
  return review?.tituloResenha ?? review?.titulo ?? review?.title ?? "";
}

function reviewAuthorName(review) {
  return review?.nomeExibicao ?? review?.nomeUsuario ??
    review?.usuario?.nomeExibicao ?? review?.usuario?.nome ??
    review?.userName ?? review?.user?.name ?? "Leitor";
}

function reviewAuthorImage(review) {
  return review?.fotoPerfilUrl ?? review?.fotoUrl ?? review?.avatarUrl ??
    review?.imagemPerfil ?? review?.usuario?.fotoPerfilUrl ??
    review?.usuario?.fotoUrl ?? review?.usuario?.avatarUrl ??
    review?.user?.avatarUrl ?? review?.user?.imageUrl ?? "";
}

function reviewHasSpoilers(review) {
  return Boolean(review?.flagSpoiler ?? review?.spoiler ?? review?.containsSpoilers);
}

function reviewDate(review) {
  return review?.dataPublicacao ?? review?.dataCriacao ?? review?.dataAvaliacao ??
    review?.createdAt ?? review?.creationDate;
}

function bookTitle(book) {
  return book?.titulo ?? book?.title ?? book?.nome ?? "Livro";
}

function bookAuthor(book) {
  const author = book?.autor ?? book?.author ?? book?.autores;
  return Array.isArray(author) ? author.map((item) => item.nome ?? item.name ?? item).join(", ") :
    author?.nome ?? author?.name ?? author ?? "";
}

function findBook(id) {
  return books.find((book) => String(bookIdOf(book)) === String(id));
}

function bookForReview(review) {
  const catalogBook = findBook(reviewBookId(review));
  if (catalogBook) return catalogBook;
  const reviewBook = review?.livro ?? review?.book ?? {};
  const title = review?.livro?.titulo ?? review?.book?.title ?? review?.bookTitle ?? "";
  return {
    ...reviewBook,
    title: title || bookTitle(reviewBook) || "Livro",
    author: review?.livro?.autor ?? review?.book?.author ?? review?.bookAuthor ?? ""
  };
}

function getBookTitle(review) {
  return bookTitle(bookForReview(review));
}

function imageUrl(book) {
  return book?.capaUrl ?? book?.urlCapa ?? book?.capa ?? book?.coverUrl ??
    (book?.isbn ? `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(book.isbn)}-M.jpg` : "");
}

function createCover(book, large = false) {
  const coverData = book || {};
  const cover = document.createElement("div");
  cover.className = `book-cover${large ? " book-cover-large" : ""}`;
  cover.style.setProperty("--cover-tone", coverData.tone || "#365366");
  const src = imageUrl(coverData) || (coverData.isbn
    ? `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(coverData.isbn)}-M.jpg`
    : "");
  if (src) {
    const image = document.createElement("img");
    image.src = src;
    image.alt = `Capa de ${bookTitle(coverData)}`;
    image.loading = "lazy";
    image.addEventListener("error", () => image.remove());
    cover.append(image);
  }
  const fallback = document.createElement("span");
  fallback.className = "book-cover-fallback";
  fallback.textContent = bookTitle(coverData);
  cover.append(fallback);
  return cover;
}

function createStars(value) {
  const rating = Number(value);
  const stars = document.createElement("span");
  stars.className = "review-rating";
  const validRating = Number.isInteger(rating) && rating >= 1 && rating <= 5;
  stars.textContent = validRating ? `${"★".repeat(rating)}${"☆".repeat(5 - rating)}` : "☆☆☆☆☆";
  stars.setAttribute("aria-label", validRating ? `${rating} de 5 estrelas` : "Nota indisponível");
  return stars;
}

function createReaderAvatar(review) {
  const name = reviewAuthorName(review);
  const avatar = document.createElement("span");
  avatar.className = "author-avatar";
  avatar.setAttribute("aria-label", `Foto de ${name}`);
  const imageUrl = reviewAuthorImage(review);
  if (imageUrl) {
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = "";
    image.loading = "lazy";
    image.addEventListener("error", () => {
      avatar.textContent = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
    }, { once: true });
    avatar.append(image);
  } else {
    avatar.textContent = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  }
  return avatar;
}

function searchKey(value) {
  return String(value || "").trim().toLocaleLowerCase("pt-BR")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function formatDate(value) {
  if (!value) return "Data não informada";
  const dateOnly = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = dateOnly
    ? new Date(Number(value.slice(0, 4)), Number(value.slice(5, 7)) - 1, Number(value.slice(8, 10)))
    : new Date(value);
  return Number.isNaN(date.getTime()) ? "Data não informada" :
    `Publicado em ${new Intl.DateTimeFormat("pt-BR").format(date)}`;
}

function getBookAverage(id) {
  if (id == null) return null;
  const ratings = allReviews
    .filter((review) => String(reviewBookId(review)) === String(id))
    .map(reviewRating)
    .filter((rating) => Number.isInteger(rating) && rating >= 1 && rating <= 5);
  if (!ratings.length) return null;
  return {
    rating: ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length,
    count: ratings.length
  };
}

function createReviewCard(review, { actions = false } = {}) {
  const book = bookForReview(review);
  const card = document.createElement("article");
  card.className = "review-card-item";
  card.append(createCover(book));

  const content = document.createElement("div");
  content.className = "review-card-content";
  const top = document.createElement("div");
  top.className = "review-card-top";
  const author = document.createElement("div");
  author.className = "review-author";
  const authorName = document.createElement("strong");
  authorName.className = "author-name";
  authorName.textContent = reviewAuthorName(review);
  const date = document.createElement("span");
  date.className = "review-date";
  date.textContent = formatDate(reviewDate(review));
  author.append(createReaderAvatar(review), authorName, date);
  top.append(author, createStars(reviewRating(review)));
  content.append(top);

  const title = document.createElement("h3");
  title.className = "review-title";
  title.textContent = reviewTitleOf(review) || "Resenha";
  content.append(title);
  const bookName = document.createElement("p");
  bookName.className = "review-book-name";
  bookName.textContent = bookTitle(book);
  content.append(bookName);
  const authorLine = document.createElement("p");
  authorLine.className = "review-book-author";
  authorLine.textContent = `por ${bookAuthor(book) || "Autor não informado"}`;
  content.append(authorLine);

  const average = getBookAverage(reviewBookId(review));
  if (average) {
    const summary = document.createElement("p");
    summary.className = "review-book-average";
    summary.textContent = `Média ${average.rating.toFixed(1)}/5 · ${average.count} ${average.count === 1 ? "avaliação" : "avaliações"}`;
    content.append(summary);
  }

  const text = document.createElement("p");
  text.className = "review-body";
  const fullText = reviewTextOf(review);
  text.textContent = fullText.length > 240 ? `${fullText.slice(0, 240).trimEnd()}…` : fullText;
  if (reviewHasSpoilers(review)) {
    const spoiler = document.createElement("details");
    spoiler.className = "spoiler-box";
    const label = document.createElement("summary");
    label.textContent = "Esta avaliação contém spoilers";
    spoiler.append(label, text);
    content.append(spoiler);
  } else {
    content.append(text);
  }

  const readButton = document.createElement("button");
  readButton.type = "button";
  readButton.className = "read-review-button";
  readButton.textContent = "Ler avaliação completa";
  readButton.addEventListener("click", () => showReviewDetails(review, false));
  content.append(readButton);

  if (actions && currentUserId && String(currentUserId) === String(reviewUserId(review))) {
    const footer = document.createElement("div");
    footer.className = "review-bottom";
    const actionGroup = document.createElement("div");
    actionGroup.className = "review-actions";
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Editar";
    editButton.addEventListener("click", () => editReview(review));
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-review";
    deleteButton.textContent = "Excluir";
    deleteButton.addEventListener("click", () => deleteReview(review));
    actionGroup.append(editButton, deleteButton);
    footer.append(actionGroup);
    content.append(footer);
  }

  card.append(content);
  return card;
}

function loadBooks() {
  books = demoBooks;
  if (form) {
    const options = [new Option("Selecione um livro", ""), ...books.map((book) =>
      new Option(`${bookTitle(book)}${bookAuthor(book) ? ` — ${bookAuthor(book)}` : ""}`, bookIdOf(book))
    )];
    bookSelect.replaceChildren(...options);
    renderBookSearchResults();
  }

  const bookFilter = document.getElementById("bookFilter");
  if (bookFilter) {
    bookFilter.replaceChildren(new Option("Todos os livros", ""));
    books.forEach((book) => bookFilter.add(new Option(bookTitle(book), bookIdOf(book))));
  }

  const selectedBookId = new URLSearchParams(window.location.search).get("livroId");
  if (selectedBookId && findBook(selectedBookId)) {
    if (form) selectBook(findBook(selectedBookId));
    if (bookFilter) bookFilter.value = selectedBookId;
  }
}

function renderBookSearchResults() {
  if (!bookSearchResults) return;
  const query = searchKey(bookSearch.value);
  const matches = books.filter((book) => {
    const searchable = searchKey(`${bookTitle(book)} ${bookAuthor(book)}`);
    return searchable.includes(query);
  }).slice(0, 40);

  if (!matches.length) {
    const empty = document.createElement("p");
    empty.className = "book-search-status";
    empty.textContent = "Nenhum livro encontrado.";
    bookSearchResults.replaceChildren(empty);
    return;
  }

  const results = matches.map((book) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "book-search-result";
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", String(String(bookIdOf(book)) === bookSelect.value));
    option.append(createCover(book));
    const info = document.createElement("span");
    info.className = "book-search-info";
    const title = document.createElement("strong");
    title.textContent = bookTitle(book);
    const author = document.createElement("span");
    author.textContent = bookAuthor(book) || "Autor não informado";
    info.append(title, author);
    option.append(info);
    option.addEventListener("click", () => selectBook(book));
    return option;
  });
  bookSearchResults.replaceChildren(...results);
}

function selectBook(book) {
  if (!book || !bookSelect) return;
  bookSelect.value = bookIdOf(book);
  const cover = document.getElementById("selectedBookCover");
  cover.replaceChildren(createCover(book));
  const label = document.getElementById("selectedBookLabel");
  label.textContent = `${bookTitle(book)} · ${bookAuthor(book) || "Autor não informado"}`;
  document.getElementById("selectedBook").hidden = false;
  bookSearch.hidden = true;
  bookSearchResults.hidden = true;
  reviewEditor.hidden = false;
  setFormMessage("");
  renderBookSearchResults();
  updateSubmitAvailability();
}

function clearSelectedBook() {
  if (!bookSelect) return;
  bookSelect.value = "";
  document.getElementById("selectedBookCover").replaceChildren();
  document.getElementById("selectedBook").hidden = true;
  bookSearch.hidden = false;
  bookSearchResults.hidden = false;
  reviewEditor.hidden = true;
  bookSearch.value = "";
  renderBookSearchResults();
  updateSubmitAvailability();
  bookSearch.focus();
}

function setFormMessage(message, type = "error") {
  formMessage.textContent = message;
  formMessage.classList.toggle("success", type === "success");
  formMessage.hidden = !message;
}

function renderLanding() {
  if (!communityRealReviews) return;
  const cards = [...sampleReviews, ...allReviews].map(createLandingReviewCard);
  communityRealReviews.replaceChildren(...cards);
}

function createLandingReviewCard(review) {
  const title = getBookTitle(review);
  const book = bookForReview(review);
  const authorName = reviewAuthorName(review);
  const card = document.createElement("article");
  card.className = "landing-review-card landing-community-card";
  card.append(createCover(book, true));

  const details = document.createElement("div");
  details.className = "landing-book-details";
  const header = document.createElement("div");
  header.className = "landing-reader-header";
  const avatar = document.createElement("span");
  avatar.className = "landing-reader-avatar";
  avatar.style.setProperty("--avatar-tone", "#758b7c");
  const profileImage = reviewAuthorImage(review);
  if (profileImage) {
    const image = document.createElement("img");
    image.src = profileImage;
    image.alt = "";
    image.loading = "lazy";
    image.addEventListener("error", () => {
      avatar.textContent = authorName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
    }, { once: true });
    avatar.append(image);
  } else {
    avatar.textContent = authorName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  }
  const reader = document.createElement("div");
  reader.className = "landing-reader-info";
  const name = document.createElement("strong");
  name.textContent = authorName;
  const date = document.createElement("time");
  date.dateTime = reviewDate(review) || "";
  date.textContent = formatDate(reviewDate(review));
  reader.append(name, date);
  header.append(avatar, reader);

  const heading = document.createElement("h3");
  heading.className = "landing-review-book";
  heading.textContent = reviewTitleOf(review) || "Resenha";
  const bookAuthorLine = document.createElement("p");
  bookAuthorLine.className = "landing-review-book-author";
  bookAuthorLine.textContent = `${title} · ${bookAuthor(book) || "Autor não informado"}`;
  const body = document.createElement("p");
  body.className = "landing-review-body";
  const reviewText = reviewTextOf(review) || "Avaliação sem comentário.";
  body.textContent = reviewText.length > 180 ? `${reviewText.slice(0, 177).trimEnd()}…` : reviewText;
  details.append(header, createStars(reviewRating(review)), heading, bookAuthorLine, body);

  const average = getBookAverage(reviewBookId(review));
  if (average) {
    const official = document.createElement("p");
    official.className = "landing-review-average";
    official.textContent = `Média do livro: ${average.rating.toFixed(1)}/5 · ${average.count} ${average.count === 1 ? "avaliação" : "avaliações"}`;
    details.append(official);
  }

  if (reviewHasSpoilers(review)) {
    const spoiler = document.createElement("span");
    spoiler.className = "landing-card-spoiler";
    spoiler.textContent = "Contém spoilers";
    details.append(spoiler);
  }

  const actions = document.createElement("div");
  actions.className = "landing-review-actions";
  const readButton = document.createElement("button");
  readButton.type = "button";
  readButton.className = "landing-book-link";
  readButton.textContent = "Ler avaliação completa";
  readButton.addEventListener("click", () => showReviewDetails(review));
  actions.append(readButton);
  if (review.origem !== "demo") {
    const writeLink = document.createElement("a");
    writeLink.className = "landing-book-link";
    const bookId = reviewBookId(review);
    writeLink.href = bookId == null
      ? "reviews.html"
      : `reviews.html?livroId=${encodeURIComponent(bookId)}`;
    writeLink.textContent = "Avaliar livro";
    actions.append(writeLink);
  }
  details.append(actions);
  card.append(details);
  return card;
}

function showReviewDetails(review) {
  if (!reviewDetailDialog || !reviewDetailContent) return;
  renderReviewDetails(review);
  reviewDetailDialog.showModal();
}

function renderReviewDetails(review, statusMessage = "") {
  const book = bookForReview(review);
  const readerName = review?.nomeExibicao ?? review?.nomeUsuario ??
    review?.usuario?.nomeExibicao ?? review?.usuario?.nome ?? review?.userName ??
    review?.user?.name ?? "Leitor";

  const header = document.createElement("div");
  header.className = "review-detail-header";
  header.append(createCover(book, true));
  const summary = document.createElement("div");
  const heading = document.createElement("h2");
  heading.id = "reviewDetailTitle";
  heading.textContent = reviewTitleOf(review) || "Resenha";
  const bookHeading = document.createElement("p");
  bookHeading.className = "review-detail-book-title";
  bookHeading.textContent = bookTitle(book);
  const author = document.createElement("p");
  author.className = "review-detail-book-author";
  author.textContent = bookAuthor(book) || "Autor não informado";
  const reviewer = document.createElement("p");
  reviewer.className = "review-detail-reader";
  reviewer.textContent = `Resenha de ${readerName}`;
  const date = document.createElement("time");
  date.className = "review-detail-date";
  date.dateTime = reviewDate(review) || "";
  date.textContent = formatDate(reviewDate(review));
  summary.append(heading, bookHeading, author, createStars(reviewRating(review)), reviewer, date);
  header.append(summary);

  const comment = document.createElement("p");
  comment.className = "review-detail-comment";
  comment.textContent = reviewTextOf(review);
  reviewDetailContent.replaceChildren(header);
  if (reviewHasSpoilers(review)) {
    const spoiler = document.createElement("details");
    spoiler.className = "review-detail-spoiler";
    const label = document.createElement("summary");
    label.textContent = "Esta avaliação contém spoilers. Mostrar comentário";
    spoiler.append(label, comment);
    reviewDetailContent.append(spoiler);
  } else {
    reviewDetailContent.append(comment);
  }
  if (statusMessage) {
    const status = document.createElement("p");
    status.className = "review-detail-status";
    status.setAttribute("role", "status");
    status.textContent = statusMessage;
    reviewDetailContent.append(status);
  }
}

function renderReviews() {
  if (!reviewsList) return;
  const summary = document.getElementById("bookRatingSummary");

  const mineOnly = document.getElementById("reviewFilter").value === "mine";
  const selectedBook = document.getElementById("bookFilter").value;
  const titleQuery = searchKey(bookReviewSearch?.value);
  const authorQuery = searchKey(authorReviewSearch?.value);
  const selectedRating = ratingFilter?.value;
  const source = mineOnly
    ? allReviews.filter((review) => String(reviewUserId(review)) === currentUserId)
    : allReviews;
  const visibleReviews = source.filter((review) => {
    const matchesBook = !selectedBook || String(reviewBookId(review)) === selectedBook;
    const matchesTitle = !titleQuery || searchKey(getBookTitle(review)).includes(titleQuery);
    const matchesAuthor = !authorQuery || searchKey(reviewAuthorName(review)).includes(authorQuery);
    const matchesRating = !selectedRating || String(reviewRating(review)) === selectedRating;
    return matchesBook && matchesTitle && matchesAuthor && matchesRating;
  }).sort((first, second) => {
    const firstDate = new Date(reviewDate(first) || 0).getTime() || 0;
    const secondDate = new Date(reviewDate(second) || 0).getTime() || 0;
    return reviewSort?.value === "oldest" ? firstDate - secondDate : secondDate - firstDate;
  });
  const visiblePage = visibleReviews.slice(0, reviewPage * reviewsPerPage);
  reviewsList.replaceChildren(...visiblePage.map((review) =>
    createReviewCard(review, { actions: true })
  ));
  if (loadMoreButton) loadMoreButton.hidden = visiblePage.length >= visibleReviews.length;
  reviewsStatus.textContent = visibleReviews.length
    ? ""
    : mineOnly && !currentUserId
      ? "Entre na sua conta para consultar suas avaliações."
      : mineOnly
        ? "Você ainda não publicou avaliações."
        : allReviews.length && (titleQuery || authorQuery || selectedRating || selectedBook)
          ? "Nenhuma avaliação corresponde aos filtros selecionados."
          : "A comunidade ainda não tem avaliações. Publique a primeira e ajude outros leitores a descobrir sua próxima história.";

  const average = getBookAverage(selectedBook);
  summary.textContent = !selectedBook
    ? "Selecione um livro para consultar a média e a quantidade de avaliações."
    : average
      ? `Média das avaliações: ${average.rating.toFixed(1)}/5 · ${average.count} ${average.count === 1 ? "avaliação" : "avaliações"}.`
      : "Este livro ainda não possui avaliações para calcular uma média.";
}

function loadAllReviews() {
  allReviews = readStoredReviews();
  renderReviews();
  renderLanding();
}

function refreshReviews() {
  reviewPage = 1;
  try {
    loadAllReviews();
  } catch (error) {
    if (reviewsStatus) reviewsStatus.textContent = error.message || "Não foi possível carregar as avaliações salvas.";
  }
}

function editReview(review) {
  if (!currentUserId || String(currentUserId) !== String(reviewUserId(review))) {
    setFormMessage("Só é possível editar uma avaliação da sua própria conta.");
    return false;
  }
  const book = findBook(reviewBookId(review));
  if (!book) {
    setFormMessage("O livro desta avaliação não está disponível no catálogo.");
    return false;
  }
  selectBook(book);
  reviewTitle.value = reviewTitleOf(review);
  reviewText.value = reviewTextOf(review);
  const rating = document.querySelector(`input[name="rating"][value="${reviewRating(review)}"]`);
  if (!rating) {
    setFormMessage("A avaliação salva tem uma nota inválida.");
    return false;
  }
  editingId = reviewIdOf(review);
  rating.checked = true;
  document.getElementById("spoilerCheck").checked = reviewHasSpoilers(review);
  document.getElementById("formTitle").textContent = "Editar avaliação";
  submitButton.firstChild.textContent = "Salvar alterações ";
  cancelButton.hidden = false;
  updateCharacterCount();
  setFormMessage("");
  form.scrollIntoView({ behavior: "smooth" });
  return true;
}

function resetForm() {
  form.reset();
  clearSelectedBook();
  editingId = null;
  document.getElementById("formTitle").textContent = "Nova avaliação";
  submitButton.firstChild.textContent = "Publicar avaliação ";
  cancelButton.hidden = true;
  setFormMessage("");
  updateCharacterCount();
  updateSubmitAvailability();
}

function deleteReview(review) {
  if (!currentUserId || String(currentUserId) !== String(reviewUserId(review))) {
    setFormMessage("Só é possível excluir uma avaliação da sua própria conta.");
    return;
  }
  if (!window.confirm("Deseja excluir esta avaliação?")) return;
  const previousReviews = allReviews;
  try {
    const remainingReviews = allReviews.filter((item) =>
      String(reviewIdOf(item)) !== String(reviewIdOf(review))
    );
    allReviews = remainingReviews;
    persistReviews();
    refreshReviews();
    setFormMessage("Sua avaliação foi excluída.", "success");
  } catch (error) {
    allReviews = previousReviews;
    setFormMessage(error.message || "Não foi possível excluir a avaliação.");
  }
}

function updateCharacterCount() {
  document.getElementById("characterCount").textContent = `${reviewText.value.length}/5000`;
}

function updateSubmitAvailability() {
  if (!submitButton) return;
  currentUserId = getCurrentUserId();
  const authHint = document.getElementById("authHint");
  authHint.hidden = true;
  submitButton.disabled = !bookSelect.value || !books.length;
}

function setupForm() {
  currentUserId = getCurrentUserId();
  updateSubmitAvailability();

  bookSearch.addEventListener("input", renderBookSearchResults);
  document.getElementById("changeBook").addEventListener("click", clearSelectedBook);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setFormMessage("");
    if (!bookSelect.value) {
      setFormMessage("Selecione um livro do catálogo antes de publicar.");
      bookSearch.focus();
      return;
    }
    const rating = Number(form.elements.rating.value);
    const title = reviewTitle.value.trim();
    const text = reviewText.value.trim();
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setFormMessage("Escolha uma nota de 1 a 5 estrelas.");
      return;
    }
    if (!title) {
      setFormMessage("Informe um título para a resenha.");
      reviewTitle.focus();
      return;
    }
    if (!text) {
      setFormMessage("Escreva sua resenha antes de publicar.");
      reviewText.focus();
      return;
    }
    if (text.length > 5000 || title.length > 120) {
      setFormMessage("O título deve ter até 120 caracteres e a resenha até 5.000 caracteres.");
      return;
    }
    if (!form.reportValidity()) return;

    const wasEditing = editingId !== null;
    const timestamp = new Date().toISOString();
    const updatedReview = {
      id: editingId || `review-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      usuarioId: currentUserId,
      livroId: bookSelect.value,
      tituloResenha: title,
      nota: rating,
      textoResenha: text,
      flagSpoiler: document.getElementById("spoilerCheck").checked,
      dataPublicacao: timestamp,
      nomeExibicao: "Leitor BookVerse"
    };
    const previousReviews = allReviews;
    submitButton.disabled = true;
    try {
      if (wasEditing) {
        const index = allReviews.findIndex((review) => String(reviewIdOf(review)) === String(editingId));
        if (index < 0) throw new Error("A avaliação que você está editando não foi encontrada.");
        allReviews = allReviews.map((review) =>
          String(reviewIdOf(review)) === String(editingId) ? updatedReview : review
        );
      } else {
        allReviews = [updatedReview, ...allReviews];
      }
      persistReviews();
      resetForm();
      refreshReviews();
      const successMessage = wasEditing ? "Sua avaliação foi atualizada." : "Sua avaliação foi publicada.";
      if (reviewsStatus) reviewsStatus.textContent = successMessage;
      setFormMessage(successMessage, "success");
      reviewsList?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      allReviews = previousReviews;
      setFormMessage(error.message || "Não foi possível salvar sua avaliação.");
    } finally {
      updateSubmitAvailability();
    }
  });

  reviewText.addEventListener("input", updateCharacterCount);
  cancelButton.addEventListener("click", resetForm);
  document.getElementById("refreshReviews").addEventListener("click", refreshReviews);
  document.getElementById("reviewFilter").addEventListener("change", () => {
    reviewPage = 1;
    renderReviews();
  });
  [bookReviewSearch, authorReviewSearch, ratingFilter, reviewSort,
    document.getElementById("bookFilter")].forEach((control) => {
    control.addEventListener("input", () => {
      reviewPage = 1;
      renderReviews();
    });
    control.addEventListener("change", () => {
      reviewPage = 1;
      renderReviews();
    });
  });
  loadMoreButton.addEventListener("click", () => {
    reviewPage += 1;
    renderReviews();
  });
}

function setupReviewDetails() {
  if (!reviewDetailDialog) return;
  reviewDetailDialog.querySelector(".review-detail-close").addEventListener("click", () =>
    reviewDetailDialog.close()
  );
  reviewDetailDialog.addEventListener("click", (event) => {
    if (event.target === reviewDetailDialog) reviewDetailDialog.close();
  });
}

async function startPage() {
  if (form) setupForm();
  setupReviewDetails();
  loadBooks();
  if (form) updateSubmitAvailability();
  renderLanding();
  refreshReviews();
}

startPage();
