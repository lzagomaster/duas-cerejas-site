# Auditoria de performance - V1.4 Candidata

## Mudanca principal
A abertura e a historia deixaram de ser duas secoes sticky independentes. Toda a home cinematografica usa agora um unico `cinematic-stage` sticky do Hero ao logo final.

Isso remove:
- a pre-visualizacao duplicada de Chocolate/Aerado;
- a entrada fisica de um segundo palco de baixo para cima;
- a necessidade de sobrepor duas secoes de 100vh por margem negativa.

## Movimento
A troca Hero -> boas-vindas -> Chocolate altera somente opacidade e pequenos transforms internos. A coordenada vertical do palco permanece fixa em `top: 0` enquanto a secao cinematografica esta ativa.

Parametros centralizados em `assets/js/conteudo.js`:
- `openingVh`: 54;
- `segmentVh`: 38.

Com 12 categorias visiveis, a secao mede aproximadamente 610vh: 100vh do viewport sticky + 54vh da ponte + 12 x 38vh de progresso dos sabores.

## Carregamento
- Nenhuma imagem ou biblioteca nova foi adicionada.
- Fotografias continuam em WebP responsivo com `srcset`.
- Primeiro Hero continua com preload e `fetchpriority=high`.
- Slider carrega progressivamente o proximo Hero.
- Categorias continuam usando apenas duas superficies de imagem reutilizadas.
- A imagem duas categorias a frente e preparada sob demanda.
- Hero pausa o autoplay apos o usuario iniciar a saida da abertura.
- Sem Lactose segue oculta e nao gera etapa de rolagem.

## Timing preservado
- 0%-16%: produto assentando;
- 16%-32%: titulo entra;
- 32%-56%: produto e titulo no apice;
- 56%-68%: titulo desaparece;
- 68%-94%: crossfade de fotografia.

## QA executada
- `node --check` aprovado em `site.js`, `hero.js`, `experiencia.js` e `conteudo.js`.
- `index.html` e `cardapio.html` passaram pelo parser HTML.
- Nenhuma referencia local ausente em HTML/configuracao.
- Confirmadas 12 categorias visiveis e Sem Lactose oculta.
- Confirmada remocao das estruturas antigas `opening-next-media`, segundo `story-stage` e secoes empilhadas `opening/story`.
- O Chromium headless deste ambiente continua interceptando tanto `file://` quanto `127.0.0.1`, exibindo pagina interna do navegador; portanto a captura visual automatizada nao e considerada valida.

## Teste final necessario
O teste visual final deve ser feito localmente no PC/celular do usuario. Esta candidata nao se torna base oficial sem aprovacao explicita.


## Nota V1.5

A V1.5 substitui apenas quatro imagens de categorias por novos derivados WebP 640/1440. Não houve adição de bibliotecas ou aumento estrutural relevante do projeto.


## V1.7 - trecho Doces
- Removida a solução de múltiplos doces em queda.
- Substituída por 3 fotografias reais em cards otimizados (`640w` + `1080w`).
- Efeito baseado somente em `opacity` e `transform`, mantendo custo de renderização baixo.
- Fundo preto ajuda a mascarar a troca de capítulo e reduz ruído visual.
