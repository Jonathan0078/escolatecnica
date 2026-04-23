# Plataforma de Cursos de Manutenção Industrial

Uma plataforma estática para cursos técnicos de manutenção industrial, com vídeos do YouTube, progresso salvo localmente e sistema de planos.

## Funcionalidades

### Autenticação
- Login simples com nome e email (salvo no localStorage).
- Validação de email.
- Logout.

### Cursos
- Lista de cursos com thumbnails, descrições, instrutores, níveis e durações.
- Busca por título, descrição ou instrutor.
- Filtro por nível (Iniciante, Intermediário, Avançado).
- Assistir vídeos do YouTube em modal.
- Marcar cursos como completados.
- Certificados para cursos concluídos.

### Planos
- Gratuito: Acesso a cursos grátis.
- Básico: Acesso a todos os cursos.
- Premium: Acesso a todos + material extra.

### Perfil
- Visualizar progresso dos cursos.
- Material extra para usuários Premium.

### Responsividade
- Design responsivo para desktop e mobile.

## Como Usar

1. Abra `index.html` em um navegador ou sirva com um servidor HTTP.
2. Faça login com nome e email.
3. Navegue pelos cursos, assista e marque como completos.
4. Escolha um plano para acessar mais conteúdo.

## Arquivos

- `index.html`: Estrutura da página.
- `styles.css`: Estilos CSS.
- `app.js`: Lógica JavaScript.
- `courses.json`: Dados dos cursos.

## Desenvolvimento

Para adicionar mais cursos, edite `courses.json`.
Para modificar estilos, edite `styles.css`.
Para lógica, edite `app.js`.