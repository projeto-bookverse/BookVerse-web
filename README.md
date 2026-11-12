# BookVerse-web

O BookVerse é um espaço para quem gosta de ler. Aqui dá para criar uma conta, conhecer as páginas do projeto e compartilhar opiniões sobre livros.

## Páginas

### Início — `index.html`

Na página inicial você encontra os links para explorar o site, ver as resenhas da comunidade e conhecer o BookVerse. O botão “Explorar livros” leva a uma apresentação da área de livros, mas não abre uma lista de títulos.

### Criar conta — `cadastro.html`

Para criar uma conta, preencha seu nome, e-mail e senha; depois, confirme a senha. Ela deve ter pelo menos oito caracteres, com letras e números. O cadastro também verifica se o e-mail já está sendo usado.

Ao terminar, sua conta fica salva no navegador e você entra no BookVerse. Como o projeto ainda não usa um serviço de cadastro, esses dados não são compartilhados entre dispositivos.

### Livros — `cadastro_livro.html`

Não há um catálogo público separado. A página de livros reúne o formulário de cadastro e a lista dos títulos salvos naquele navegador. Na lista, você pode consultar os dados de cada obra e editar ou excluir um livro.

Para cadastrar um livro, informe título, autor, gênero e ISBN. A descrição e a imagem da capa são opcionais. O ISBN é validado e não pode se repetir. Depois de salvar, o livro aparece na lista dessa página e pode ser usado nas resenhas.

Essa página é restrita a administradores e pede uma confirmação de acesso.

### Entrar — `login.html`

Use o e-mail e a senha da sua conta para entrar. Se ainda não tiver uma conta, a própria página dá acesso ao cadastro.

### Recuperar senha — `esqueci_senha.html`

Informe o e-mail da conta e escolha uma nova senha. No momento, a alteração acontece na própria página: o projeto não envia e-mail de recuperação.

### Resenhas — `reviews.html`

Veja e filtre as avaliações, escolha um livro do catálogo e publique sua nota e opinião sobre a leitura.

## Onde os dados ficam

Contas, sessões e livros são salvos no navegador (`localStorage`). Por isso, não aparecem automaticamente em outro navegador ou dispositivo. A página de resenhas usa a integração configurada no módulo para carregar livros e avaliações.
