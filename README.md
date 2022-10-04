## Utilização

- Iniciar servidor para desenvolvimento `npm run start:dev`
- Iniciar servidor para produção `npm run start`
- Para usar o cli para commits `npm run prepare` quando iniciar o projeto
- Caso esteja usando VSCode seguir este [tutorial](https://khalilstemmler.com/blogs/tooling/prettier/) para ativar a formatação automática ao salvar com prettier. Caso contrário, rodar `npm run prettier-watch` em um terminal para obter o mesmo resultado.

## Modelo de Negócios

### Organização

1. **Voluntário**
   - Usuários do site que podem participar de cursos[3].
   - Podem realizer um cadastro no site para autenticação futura.
   - Podem marcar presença nas aulas[4].
   - Podem acessar seus cadernos[5].
2. **Voluntário Administrativo**
   - São Voluntários que possuem acesso à mais funcionalidades no site.
   - Podem ver as funcionalidades do site que estão habilitados.
   - Pode analisar os cadernos dos participantes dos cursos
   - Pode analisar as presenças dos participante dos cursos
3. **Curso**
   - São um conjunto de aulas com exatamente 10 aulas com diferentes temas.
4. **Presença nas aulas**
   - A presença na aula é um formulário com algumas perguntas sobre o feedback de uma aula.
   - Atualmente está neste [link](https://www.jotform.com/form/220305634857658).
5. **Caderno**
   - Perguntar

### Exemplo Fluxo no site

- **Novo Voluntariado(exemplo atual):** Uma pessoa se interessou pelos cursos e quer participar. Ela entra em um grupo de Whatsapp, preenche o [formulário](https://form.jotform.com/220305437068653) e recebe um email com um id e o link para a aula. Posteriormente pode preencher a presença no site com o id.

### Dúvidas

- Voluntários normais podem se tornar administrativos?
- Voluntário administrativo possui acesso a todos os módulos?
- Parar assistir os cursos, o usuário deve estar cadastrado?
- Como funciona a questão de habilitação dos módulos?
- O que são os cadernos?
- Como são as aula dos cursos?
