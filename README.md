# Notion Graph Visualization

Este projeto NodeJS e D3.js para criar visualizações interativas de grafos baseados em dados da plataforma Notion. As visualizações representam páginas e suas conexões, permitindo uma navegação visual e interativa.

## Funcionalidades

- **Visualização Interativa de Grafos**: Mostra grafos dinâmicos com dados das páginas do Notion.
- **Interação com Nós**: Permite arrastar e soltar nós, com ajuste automático dos links.
- **Links Diretos para Páginas**: Cada nó é um hyperlink que abre a página correspondente no Notion em nova aba.

## Tecnologias Utilizadas

- **D3.js**: Usado para a renderização e manipulação dos gráficos.
- **Express.js**: Framework de back-end usado para criar a API que interage com o Notion.
- **Notion API**: Usada para obter dados das páginas e blocos.

## Configuração do Projeto

### Pré-requisitos

- Node.js
- PNPM, NPM ou Yarn
- Conta no Notion com acesso à API de Integração

### Instalação

1. Clone o repositório:
   ```bash
   git clone [URL_DO_REPOSITÓRIO]
   cd [NOME_DO_REPOSITÓRIO]
   ```

2. Instale as dependências:

    ```bash
    npm install
    ```
3. Configure as variáveis de ambiente:

    Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

    ```bash
    PORT=3000
    NOTION_API_KEY=SUA_CHAVE_DE_API_DO_NOTION
    API_URL=URL_DA_API_DO_NOTION
    ```

4. Liberar a integração para as páginas do Notion
    Sua página no Notion precisa de 

### Troubleshooting
* Não funciona 100% com multi-colunas, mas é funcional para lista de páginas no geral.