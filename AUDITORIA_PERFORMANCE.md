# Auditoria de Performance - V1.9.8 Candidata

## Swipe mobile
- O carrossel nao depende mais exclusivamente do motor de scroll touch do navegador.
- O fallback touch atua somente durante o gesto e atualiza `scrollLeft` diretamente.
- O calculo de profundidade continua limitado a `requestAnimationFrame` e aos 6 cards existentes.
- O eixo so e assumido apos 7 px de deslocamento, reduzindo falsos positivos e evitando conflito com a navegacao vertical.
- No mobile, `scroll-snap-stop` deixa de forcar parada obrigatoria em cada card e o snap permanece em `proximity`.
- Nenhuma imagem, biblioteca ou recurso novo foi adicionado.

## QA touch
Teste sintetico em Chromium com emulacao touch 390 x 844 confirmou:
- area rolavel: 390 px visiveis / 1926 px de conteudo no fixture de teste;
- swipe horizontal: `scrollLeft 0 -> 303`, loja ativa `0 -> 1`, etapa permaneceu `Lojas`;
- swipe vertical na mesma area: etapa `Lojas -> Cardapio`;
- nenhum erro JavaScript.

---

# Auditoria de Performance - V1.9.7 Candidata

## Correcao GitHub Pages / cache
- Fachadas continuam fora do carregamento inicial.
- Cache bust e aplicado a CSS/JS por query string de versao.
- As imagens de loja continuam carregando somente ao entrar na etapa Lojas.
- Primeiro card recebe `fetchPriority=high` apenas no momento em que Lojas e aberta.
- Uma unica tentativa de retry e feita se uma fachada falhar por erro transitorio de rede.
- Cardapio/PDF continuam fora da entrada inicial.

---

# Auditoria de Performance - V1.9.6 Candidata

## Diagnostico da entrada
O cardapio/PDF nao fazia parte do caminho inicial da home: o iframe ja estava sem `src` e so era ativado na terceira etapa. O PDF de download possui aproximadamente 12,7 MB, mas ele nao e transferido automaticamente na abertura.

O ponto mais importante encontrado foi o carregamento potencial das fachadas. Elas estavam com `loading=lazy`, porem a secao Lojas continua posicionada no mesmo viewport e e escondida por opacidade. Dependendo do navegador, isso permite antecipacao do download. As seis fachadas somam aproximadamente 179 KB.

## Correcao
- Fachadas migradas para `data-src`; nenhum `src` e emitido na entrada.
- `site.js` injeta o `src` somente quando a etapa Lojas e aberta.
- Cardapio continua recebendo `src` somente na etapa Cardapio.
- `hero.js` nao pre-carrega o segundo slide ate o evento `dc:appready`.
- `boot.js` aguarda a primeira imagem do Hero estar carregada/decodificada antes da liberacao visual.
- Watchdog de 4,5 s impede que qualquer falha de imagem retenha o usuario.

## QA de integracao
Teste sintetico em Chromium headless, usando o DOM/JS reais com recursos visuais substituidos por data URI, confirmou:
- estado inicial: `Hero`, 6 fachadas sem atributo `src`, iframe do cardapio sem atributo `src`;
- etapa `Lojas`: as 6 fachadas recebem `src` e concluem carregamento;
- etapa `Cardapio`: iframe recebe o endereco apenas nesse momento;
- `DC_APP_READY=true` apos o loading e `body.is-loading=false`;
- nenhum erro JavaScript durante o fluxo sintetico.

## Observacao
A tela de loading melhora a percepcao, mas a principal melhoria desta rodada e a remocao de downloads nao essenciais do caminho inicial.

---

# Auditoria de Performance - V1.9.5 Candidata

## Alteracao
- Adicionada terceira etapa da home: Cardapio vertical.
- O cardapio nao e carregado no primeiro acesso ao Hero nem durante Lojas. O iframe recebe `src` somente ao entrar na etapa Cardapio.
- Nenhuma segunda copia das 15 paginas foi criada; o projeto reutiliza `cardapio.html`.
- O scroll do PDF continua nativo e as paginas mantem `loading="lazy"`.

## Impacto esperado
- Hero e Lojas preservam o mesmo custo inicial da V1.9.4.
- O custo das paginas do cardapio so aparece quando o visitante realmente entra na terceira etapa.

---

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

## QA interna V1.9.5
- Fluxo de etapas confirmado em Chromium: Hero (0) -> Lojas (1) -> Cardapio (2).
- O iframe do Cardapio permanece sem `src` no Hero e em Lojas; recebe `cardapio.html?embed=1` somente ao entrar na terceira etapa.
- Cardapio incorporado confirmou 15 paginas e scroll vertical ate Pagina 15 de 15.
- Em viewport mobile de 390 px, o documento confirmou `clientWidth=390` e `scrollWidth=390`, sem rolagem horizontal.
- O coverflow permaneceu com 6 cards e area horizontal rolavel (`390 px` visiveis / `1961 px` de conteudo no teste sintetico).
- Mensagem de retorno no topo do Cardapio confirmou transicao Cardapio -> Lojas.
- Validacao de sintaxe concluida em `assets/js/site.js`, `assets/js/cardapio.js`, `assets/js/hero.js` e `assets/js/home-conteudo.js`.
