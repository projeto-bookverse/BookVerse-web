(() => {
  const paginaAtual = location.pathname.split("/").pop() || "index.html";
  const destino = `${paginaAtual}${location.search}${location.hash}`;

  try {
    const sessao = JSON.parse(localStorage.getItem("bookverse:sessao"));
    window.bookVerseAuthenticated = Boolean(
      sessao &&
      typeof sessao.id === "string" &&
      sessao.id.length > 0 &&
      typeof sessao.nome === "string" &&
      sessao.nome.length > 0 &&
      typeof sessao.email === "string" &&
      sessao.email.length > 0
    );
  } catch {
    window.bookVerseAuthenticated = false;
  }

  if (window.bookVerseAuthenticated) {
    document.documentElement.classList.remove("auth-pending");
    return;
  }

  location.replace(`login.html?redirect=${encodeURIComponent(destino)}`);
})();
