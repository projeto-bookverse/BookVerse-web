const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

// Fecha o menu depois que uma opção é selecionada no celular.
mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  });
});

const adminBooksLink = document.getElementById("adminBooksLink");
if (adminBooksLink) {
  adminBooksLink.addEventListener("click", (event) => {
    event.preventDefault();
    window.alert("Esta página é exclusiva para administradores do site.");
    const password = window.prompt("Digite a senha de administrador:");

    if (password === "admin") {
      window.sessionStorage.setItem("bookverse:admin-books-access", "true");
      window.location.href = adminBooksLink.href;
    } else {
      window.alert("Senha incorreta. Acesso não autorizado.");
    }
  });
}
