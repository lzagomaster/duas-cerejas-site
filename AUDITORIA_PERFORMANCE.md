# Auditoria de Performance - V1.9.4 Candidata

## Hero
- Intervalo reduzido para 2.000 ms.
- Motor do Hero não foi refeito; apenas o tempo de permanência foi alterado, reduzindo risco de regressão.

## Cardápio
- Removida lógica de revista/páginas duplas e gestos horizontais.
- Navegação passa a usar o scroll vertical nativo do navegador.
- Primeira página recebe preload/fetchpriority alto.
- Demais páginas usam lazy loading.
- `conteudo.js` e `site.js` não são mais carregados em `cardapio.html`.

## Preservado
- Coverflow das lojas da V1.9.3.
- Fotos de fachada locais em WebP.
- Home com somente Hero -> Lojas.

---

# Auditoria de Performance - V1.9.3 Candidata

## Escopo desta rodada
- Mantida a home curta com 2 etapas: Hero -> Lojas.
- Acrescentadas somente as fotografias de fachada das 6 unidades, sem reativar catalogos/categorias antigos.

## Medidas adotadas
- Fotos de fachada incorporadas localmente em WebP.
- `loading="lazy"` aplicado nas imagens das lojas.
- Nenhuma biblioteca externa adicionada.
- Carrossel continua baseado em scroll nativo + `transform`/`opacity`.

## Risco observado
- Esta rodada adiciona 6 imagens a secao de lojas. Mesmo otimizadas, pode haver pequeno aumento no uso de rede ao entrar nessa etapa.
- Como contrapartida, as fachadas so sao carregadas sob demanda e o Hero continua sendo a primeira prioridade visual.

---

# Auditoria de performance - V1.9.2 Candidata

## Escopo
Esta candidata e deliberadamente enxuta para comparar desempenho. Ela usa como fonte o ZIP reenviado pelo usuario nesta rodada e nao elimina o trabalho anterior.

## Caminho ativo da home
O `index.html` executa somente:
- Hero;
- tela de Lojas.

Categorias, galeria Doces e final antigo continuam no repositorio, mas nao fazem parte do DOM nem da carga inicial desta home.

## Reducao de trabalho
- `experiencia.js` deixou de ser carregado pelo `index.html`.
- `conteudo.js` completo deixou de ser carregado pela home; `home-conteudo.js` contem somente os 6 slides do Hero e quatro parametros de movimento.
- JavaScript referenciado diretamente pela home caiu de aproximadamente 24,3 KB para 11,8 KB (arquivos brutos, antes de compressao HTTP).
- Nenhuma fotografia de categoria e solicitada pela home.
- Lojas nao adicionam fotografias externas; os cards sao HTML/CSS e o logo final ja e local.
- A navegacao vertical agora possui apenas dois estados, sem calculo continuo por scroll.

## Hero
- Intervalo configurado: 2.600 ms.
- Crossfade existente: aproximadamente 340 ms.
- Permanencia nominal maxima por foto: aproximadamente 2,94 s antes da proxima imagem dominar.
- Autoplay continua pausando quando o Hero sai da tela e retomando ao retornar.

## Carrossel de lojas
A V1.9.2 usa um coverflow leve e navegavel:
- `overflow-x: auto` com viewport realmente limitado ao tamanho da tela;
- `scroll-snap-type: x proximity`, sem snap obrigatorio durante o gesto;
- swipe touch usa scroll e inercia nativos;
- mouse/caneta usam drag por Pointer Events;
- profundidade e atualizada somente enquanto a faixa se move;
- apenas 6 cards sao avaliados por `requestAnimationFrame`;
- atualizacao visual restrita a `transform`, `opacity` e `z-index`;
- sem Canvas, filtros, WebGL ou bibliotecas externas;
- fora do movimento nao existe loop permanente de animacao do carrossel.

## QA executada
- `node --check` em `assets/js/site.js`, `assets/js/hero.js` e `assets/js/home-conteudo.js`.
- Hero confirmado com `heroIntervalMs = 2600`.
- Desktop 1440 px: faixa com `clientWidth=1440` e `scrollWidth=3632`; drag de mouse levou `scrollLeft` de 0 para 877 e card ativo 1 -> 3.
- Mobile 390 px: faixa com `clientWidth=390` e `scrollWidth=1961`; gesto touch levou `scrollLeft` de 0 para 282 e card ativo 1 -> 2.
- Teste de eixos no mobile: swipe vertical Hero -> Lojas; swipe horizontal manteve Lojas; swipe vertical inverso Lojas -> Hero.
- Paginacao criada com 6 pontos e sincronizada com o card ativo.
- Nenhum erro JavaScript registrado nos testes de interacao.
- Como a politica do Chromium deste ambiente bloqueia navegacao direta para `localhost` e `file://`, o QA interativo foi executado injetando o mesmo HTML/CSS/JS da candidata em uma pagina Chromium isolada. As referencias de arquivos locais sao conferidas separadamente.

## Status
**CANDIDATA.** Nao se torna base oficial sem teste e aprovacao explicita do usuario.
