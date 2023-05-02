# Guia de contribuição para o backend do website Palavras de Paz

## Instalação

Os detalhes de como instalar e executar o projeto podem ser encontrados no README.md

## Padronização de código e Commits

Por convenção, commits, pull requests, labels devem ser escritos em inglês.

### Linting

Esse repositório usa [ESLint](https://eslint.org/) e [Prettier](https://prettier.io/) para lint e formatação de código.

```bash
# Para fazer o lint do código todo rode o comando
$ npm run lint

```

Caso esteja usando VSCode seguir este tutorial para ativar a formatação automática ao salvar com prettier. Caso contrário, rodar `npm run prettier-watch` em um terminal para obter o mesmo resultado.

### Commits

Este projeto segue a especificação [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

A configuração do Conventional Commits no repositório é feita com [CommitLint + Husky](https://github.com/conventional-changelog/commitlint)

Você também pode configurar o [Commitizen](https://github.com/commitizen/cz-cli) para automatizar a padronização dos seus commits

**Estrutura da mensagem de commmit**

<pre>
<b><a href="#types">&lt;type&gt;</a></b></font>(<b><a href="#scope">&lt;optional scope&gt;</a></b>): <b><a href="#subject">&lt;subject&gt;</a></b>
<sub>empty separator line</sub>
<b><a href="#body">&lt;optional body&gt;</a></b>
<sub>empty separator line</sub>
<b><a href="#footer">&lt;optional footer&gt;</a></b>
</pre>

### Types

Descreve a categoria do commit. **Obrigatótio**.

- **`feat`** - Um commit do tipo "feat" inclui ou até mesmo remove (em casos específicos) um recurso no projeto.

- **`fix`** - Um commit do tipo "fix" soluciona um problema/bug.

- **`refactor`** - Um commit do tipo "refactor" reescrevem/reestruturam o código, porém não alteram nenhum comportamento.

- **`perf`** - Um commit do tipo "perf" faz uma melhora de performance.

- **`style`** - Um commit do tipo "style" faz mudanças que não afetam o significado do código como (espaço em branco, formatação, ponto e vírgula, etc).

- **`test`** - Um commit do tipo "test" adiciona novos testes ou corrige testes existentes.

- **`docs`** - Um commit do tipo "docs" afeta somente arquivos de documentação.

- **`build`** - Um commit do tipo "build" afeta ferramentas de build, dependências, etc.

- **`ci`** - Um commit do tipo "ci" afeta arquivos de configuração ci, scripts de deploy, etc

- **`chore`** - Um commit do tipo "chore" não se enquadra necessariamente em nenhum dos tipos anteriores, exemplo modificações no `.gitignore`

- **`revert`** - Um commit do tipo "revert" reverte as mudanças de um commit anterior

### Scope

Um escopo pode ser fornecido fornecer informações contextuais adicionais.
**Opcional**.

### Subject

É a mensagem do commit em si que deve conter uma breve descrição sobre as mudanças adicionadas pelo commit. **Obrigatório**.

### Body

Pode incluir uma descrição mais longa sobre o commit. **Opcional**.

### Footer

Caso exista uma "Breaking Change" as informações sobre ela serão inseridas no rodapé do commit com o texto _BREAKING CHANGE:_ . Uma BREAKING CHANGE pode fazer parte de commits de qualquer tipo.
No rodapé também é possível referênciar uma issue pelo seu id. **Opcional**.

### Exemplos

**Mensagem de commit básica com type e subject**

feat: add error classes

**Mensagem de commit com type, scope, subject**

feat(authentication): add add auth to volunteer routes

**Mensagem de commit com type, scope, subject e body**

fix(api): add missing parameter to service call

The error occurred because of the variable x.

**Mensagem de commit com type, subject, footer(sem BREAKING CHANGE)**

refactor: implement calculation method as recursion

ref #13

**Mensagem de commit com type, scope, subject, body e footer(com BREAKING CHANGE)**

feat(api): remove CEP api

The CEP is no longer provide by the public api.

ref #12

BREAKING CHANGES: the form no longer supports CEP list.

## Fluxo de Desenvolvimento

O nosso workflow se baseia no modelo **GitFlow** mas não utilizamos necessariamente sua CLI. Você pode saber mais sobre GitFlow [aqui](https://www.alura.com.br/artigos/git-flow-o-que-e-como-quando-utilizar)

### Branches

**Branches principais** (são branches permanentes que nunca são deletadas):

- **main** - armazena todo o código de produção do projeto
- **develop** - serve para a integração de recursos (as features) ao projeto e armazena as funcionalidades que ainda serão liberadas na próxima realease.

**Branches de suporte** (são branches temporárias que só duram até realizar o merge com as branches principais)

- **feature** ou **feat** - são utilizadas para o desenvolvimento de funcionalidades específicas. São criadas sempre a partir da branch **develop** e quando finalizadas, são removidas após o merge com a mesma branch **develop**. É recomendável que essas branches sigam uma convenção de nome, por exemplo, “feature/nomedafuncionalidade”. Branches **feature**
  não podem ter interação com a branch **main**, apenas com a branch **develop**

- **hotfix** - branch criada a partir da **main** para realizar correções imediatas de bugs encontrados no sistema em produção. Quando finalizada, ela é excluída após realizar o merge com as branches **main** e **develop**. A grande diferença entre **feature** branches e branches de **hotfix** é que as **hotfix** são criados a partir da branch **main** e quando os finalizamos, eles são mesclados tanto na branch **main** quanto na branch **develop**, isso ocorre porque o bug está em ambos os ambientes.
  Além disso, quando fechamos uma **hotfix** branch, temos que criar uma tag com a nova versão do projeto. Isso porque cada mudança que fazemos na branch **main** precisa de uma tag que a represente.

- **realease** - Uma vez que uma etapa de desenvolvimento esteja concluída, teremos em nossa branch **develop** todas as **features** e **hotfix** mescladas. Então, se quisermos ter todas essas novas funcionalidades na branch **main** teremos que criar uma branch de **release**. A branch **release** serve como ponte para fazer o merge da **develop** para a **main**.

### Workflow básico

- Clone ou faça um fork do repositório
- Crie ou assine uma **issue** existente
- Crie a partir da branch develop uma branch **feat** com um nome que faça referência a issue, exemplo:

  para a **issue #22 - Add password hashing to create route**

  a branch pode ser nomeada como algo do tipo **feat/password-hashing-route**

- Depois de finalizar a feature faça um pull request para a branch **develop**
