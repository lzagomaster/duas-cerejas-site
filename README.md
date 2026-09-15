# Duas Cerejas - Site V1.9.8 Candidata

Patch cirurgico sobre a V1.9.7 para corrigir o swipe lateral das lojas em iPhone/Safari e aparelhos mais simples, sem alterar o fluxo visual aprovado. A versao continua **CANDIDATA** ate aprovacao explicita.

## Correcao desta rodada
A V1.9.7 confiava no scroll horizontal nativo do navegador para toque. Em alguns iPhones e aparelhos mais simples esse gesto podia nao assumir corretamente a faixa horizontal dentro de uma home com navegacao vertical propria.

A V1.9.8 adiciona um controlador touch dedicado ao carrossel. Depois de alguns pixels ele identifica o eixo do gesto:
- se for horizontal, a faixa de lojas acompanha o dedo diretamente;
- se for vertical, o carrossel nao interfere e a home continua navegando Hero -> Lojas -> Cardapio.

O desktop continua com o arraste de mouse/caneta existente. As fachadas continuam carregando somente ao entrar em Lojas e o cardapio continua fora do carregamento inicial.

## Teste recomendado
1. Publicar a V1.9.8 e abrir no iPhone/Android.
2. Ir para Lojas.
3. Arrastar lentamente para a esquerda e para a direita em cima dos cards.
4. Confirmar que os cards acompanham o dedo e centralizam a unidade mais proxima ao soltar.
5. Fazer um gesto vertical na mesma area e confirmar que a home continua indo para Cardapio.
6. Voltar e testar novamente para os dois lados.

## QA sintetico
Em viewport touch de 390 px, o gesto horizontal moveu a faixa de `0` para `303 px`, alterou a unidade ativa de 1 para 2 e nao mudou de etapa. Em seguida, um gesto vertical na mesma regiao avancou de Lojas para Cardapio. Nenhum erro JavaScript foi registrado no teste.

---

# Duas Cerejas - Site V1.9.7 Candidata

Patch cirurgico sobre a V1.9.6 para corrigir fachadas quebradas no GitHub Pages sem reverter a otimizacao de carregamento. A versao continua **CANDIDATA** ate aprovacao explicita.

## Correcao desta rodada
No site publicado, o HTML novo podia ser entregue junto de um `site.js` antigo mantido no cache do navegador. Como a V1.9.6 deixou as fachadas em `data-src` para nao baixa-las na abertura, um JavaScript antigo nao convertia `data-src` em `src`, deixando apenas o texto alternativo da imagem.

A V1.9.7 adiciona versionamento de cache nos CSS/JS e nas URLs lazy das fachadas, garantindo que cada publicacao carregue os arquivos correspondentes. O carregamento continua sob demanda: as fachadas so sao requisitadas ao entrar em Lojas e o cardapio continua sendo carregado apenas no terceiro estagio.

## Teste recomendado apos publicar
1. Fazer o push da V1.9.7.
2. Aguardar o deploy do GitHub Pages.
3. Abrir o site normalmente (nao deve ser necessario Ctrl+F5 por causa do cache bust).
4. Ir para Lojas e confirmar as seis fachadas.
5. Recarregar a pagina e repetir o fluxo.

---

# Duas Cerejas - Site V1.9.6 Candidata

Esta versao preserva a V1.9.5 funcional e mexe somente na percepcao e no custo da entrada do site. **Nao se torna base oficial automaticamente**; aguarda teste e aprovacao explicita.

## Fluxo preservado
1. Hero, com troca a cada 2,0 segundos.
2. Lojas, com coverflow navegavel e fachadas reais.
3. Cardapio vertical, com rolagem tradicional.

## Nova abertura
Ao abrir a home, o visitante ve uma tela preta curta com uma elipse pulsante e uma barra de progresso. A experiencia e liberada assim que a primeira foto do Hero estiver pronta para aparecer sem aquele primeiro engasgo visual.

O loading nao espera o site inteiro baixar. A estrategia e proposital: entregar primeiro o que a pessoa precisa ver e jogar o restante para o momento em que for usado.

## O que foi otimizado
- Primeira foto do Hero continua com prioridade alta.
- Segunda foto do Hero so comeca a ser pre-carregada depois da liberacao da abertura.
- As 6 fachadas nao sao mais requisitadas na entrada; so carregam ao abrir Lojas.
- O cardapio incorporado continua sem `src` ate o terceiro swipe.
- O arquivo PDF de 12,7 MB e apenas um download opcional e nao participa da abertura da home.
- Em retorno na mesma aba, o loading usa retencao minima menor porque os recursos ja tendem a estar em cache.

## Como testar
1. Extraia o ZIP e abra `index.html`.
2. Recarregue com cache limpo e observe a tela de loading: elipse pulsante + barra, seguida de transicao limpa para o primeiro Hero.
3. Confirme que o Hero segue trocando a cada 2 s.
4. Entre em Lojas e confirme que as fachadas aparecem e que o coverflow segue igual.
5. Entre em Cardapio e confirme a rolagem vertical de 15 paginas.
6. Volte ao inicio ou recarregue e observe que uma visita repetida deve liberar mais rapidamente.

## Arquivos alterados
- `index.html`
- `assets/js/boot.js` (novo)
- `assets/js/hero.js`
- `assets/js/site.js`
- `assets/css/site.css`
- `README.md`
- `CHANGELOG.md`
- `AUDITORIA_PERFORMANCE.md`
- `VERSAO.txt`

## Regra de aprovacao
**V1.9.6 CANDIDATA.** So passa a ser base depois do teste e da aprovacao explicita do usuario.

---

# Duas Cerejas - Site V1.9.5 Candidata

Esta versao usa a V1.9.4 candidata como fonte desta rodada, mas **nao se torna base oficial automaticamente**.

## Fluxo da home nesta candidata
1. Hero (2,0 s por foto);
2. Lojas com coverflow e fachadas;
3. Cardapio vertical com as mesmas 15 paginas do `cardapio.html`.

## Comportamento do terceiro swipe
- Um swipe/scroll para baixo a partir de Lojas entra no Cardapio.
- Ao entrar, o `cardapio.html` e carregado sob demanda em modo incorporado.
- Depois disso, o scroll fica livre para percorrer o PDF para cima e para baixo.
- No topo do Cardapio, um gesto para baixo retorna a Lojas.
- O botao Cardapio do header continua abrindo a pagina dedicada normalmente.

## Regra de aprovacao
**V1.9.5 CANDIDATA.** So vira base oficial depois do teste e da aprovacao explicita do usuario.

---

# Duas Cerejas - Site V1.9.4 Candidata

Base desta rodada: **V1.9.3**, confirmada pelo usuário como perfeita antes destas alterações. A V1.9.4 continua candidata e só vira base oficial após novo teste e aprovação explícita.

## Alterações desta rodada
- Hero: intervalo reduzido para **2.000 ms** por fotografia.
- Cardápio: navegação alterada de revista horizontal para **rolagem vertical tradicional**.
- As 15 páginas agora aparecem em sequência, uma embaixo da outra, no desktop e no celular.
- Mantido botão para baixar o PDF original.
- Mantido contador discreto da página visível.
- Páginas posteriores são carregadas progressivamente para preservar desempenho.
- Lojas, fachadas e coverflow da V1.9.3 foram preservados.

## Como testar
1. Abra `index.html` e confirme a troca do Hero aproximadamente a cada 2 segundos.
2. Faça swipe vertical para Lojas e confirme que o coverflow e as fachadas continuam como na V1.9.3.
3. Abra `cardapio.html` pelo botão Cardápio.
4. Role para baixo e para cima: não deve existir mais navegação lateral/livro; as páginas devem seguir verticalmente.
5. Confira o contador de página e o botão `Baixar PDF` no desktop.
6. No celular, verifique que não existe rolagem horizontal do documento.

## Regra de aprovação
**V1.9.4 CANDIDATA.** Não considerar base oficial sem aprovação explícita do usuário.

---

# Duas Cerejas - Site V1.9.3 Candidata

Esta versao foi criada sobre a V1.9.2 que o usuario sinalizou como funcional para o coverflow das lojas. Mesmo assim, **ela continua candidata** e **nao se torna base oficial automaticamente**. A base so muda depois do teste e da aprovacao explicita do usuario.

## Objetivo desta candidata
Manter exatamente a navegacao que funcionou na V1.9.2 e acrescentar **a foto da fachada de cada loja** dentro dos cards do coverflow.

## O que mudou nesta rodada
- Mantido o fluxo enxuto da home: **Hero -> Lojas**.
- Mantido o Hero com 6 fotos e intervalo de **2,6 s** por slide.
- Mantido o coverflow navegavel aprovado: swipe lateral livre, card central dominante, cards vizinhos visiveis, dots e setas.
- Adicionadas as **6 fotos reais das fachadas** das unidades.
- As fotos foram incorporadas localmente em `assets/img/lojas/` e convertidas para **WebP**.
- As imagens das fachadas usam `loading="lazy"`, preservando o objetivo de medir desempenho sem reativar peso desnecessario na home.

## Como testar
1. Extraia o ZIP inteiro e abra `index.html` no Chrome ou Edge.
2. Confirme que o Hero continua leve e passando as fotos em no maximo cerca de 3 segundos por imagem.
3. Faca swipe vertical/role para chegar em **Lojas**.
4. Deslize horizontalmente entre as lojas e confirme que o carrossel continua fluido.
5. Verifique se cada card agora mostra a **fachada correta** da unidade, junto do endereco, telefone, WhatsApp e botao de rotas.
6. Teste voltar ao Hero e entrar novamente em Lojas.
7. Abra `cardapio.html` e confirme que segue intacto.

## Arquivos alterados nesta rodada
- `index.html`
- `assets/css/site.css`
- `assets/img/lojas/*` (novo conjunto de fotos das fachadas)
- `README.md`
- `CHANGELOG.md`
- `AUDITORIA_PERFORMANCE.md`
- `VERSAO.txt`

## Regra de aprovacao
**V1.9.3 CANDIDATA.** Nao usar como nova base oficial ate o usuario testar e aprovar explicitamente.

---

# Duas Cerejas - Site V1.9.2 Candidata

Esta versao foi criada **sobre o ZIP reenviado pelo usuario nesta rodada**. Ela e um patch de avaliacao e **nao se torna base oficial automaticamente**. A base so muda depois do teste e da aprovacao explicita do usuario.

## Objetivo desta candidata
A home foi simplificada temporariamente para medir desempenho sem perder o trabalho anterior. O fluxo ativo agora tem somente duas etapas verticais:

1. Hero com as 6 fotografias atuais;
2. Lojas, contatos e enderecos.

As categorias e seus arquivos continuam preservados no projeto, mas ficam fora da execucao da home nesta versao.

## Como testar
1. Extraia o ZIP inteiro e abra `index.html` no Chrome ou Edge. Nao e necessario instalar nada.
2. Deixe o Hero completar pelo menos dois ciclos, inclusive a volta da foto 6 para a 1. Cada foto deve permanecer no maximo aproximadamente 3 segundos na tela (intervalo de 2,6 s com crossfade curto).
3. Faca um swipe vertical para cima no celular, ou role para baixo no desktop. A home deve ir **direto do Hero para Lojas**, sem boas-vindas e sem catalogos/categorias intermediarias.
4. Na tela Lojas, deslize horizontalmente o carrossel. O card central deve ganhar protagonismo e os laterais devem produzir sensacao de profundidade, sem travar o swipe.
5. Confira as 6 unidades e teste os botoes de telefone, WhatsApp e Rotas.
6. Confirme o logo menor no rodape da tela de lojas.
7. Faca swipe vertical para baixo/role para cima e confirme o retorno ao Hero. O autoplay do Hero deve retomar normalmente.
8. Abra `cardapio.html` pelo botao Cardapio e confirme que ele continua funcionando.

## Performance desta rodada
- `index.html` nao carrega mais `assets/js/experiencia.js`.
- A home nao carrega mais o arquivo completo `assets/js/conteudo.js`; usa `assets/js/home-conteudo.js`, contendo somente Hero e parametros necessarios.
- Nenhuma imagem de categoria e requisitada pela home enquanto esta candidata estiver ativa.
- A secao de lojas usa cards de texto e o logo local; nao adiciona fotografias externas nem downloads de loja.
- O carrossel usa scroll horizontal nativo, `scroll-snap`, `transform` e `opacity`; nao usa Canvas, biblioteca de animacao nem calculo pesado por frame.
- O primeiro Hero continua com preload; as demais imagens seguem carregamento progressivo pelo slider existente.
- `prefers-reduced-motion` continua respeitado.

## Arquivos alterados
- `index.html`
- `assets/css/site.css`
- `assets/js/site.js`
- `assets/js/home-conteudo.js` (novo)
- `README.md`
- `CHANGELOG.md`
- `AUDITORIA_PERFORMANCE.md`
- `VERSAO.txt`

## O que foi preservado
Os arquivos das categorias, a experiencia anterior, as imagens e o cardapio **nao foram apagados**. Esta rodada apenas os retira do caminho ativo do `index.html`, permitindo comparar fluidez e consumo sem perder o que ja foi desenvolvido.

## Regra de aprovacao
**V1.9.2 CANDIDATA.** Nao usar como nova base oficial ate o usuario testar e aprovar explicitamente.

## Patch V1.9.1 - Faux 3D das lojas
A V1.9.0 usava uma animacao de profundidade condicionada ao suporte de `animation-timeline:view(inline)`. Em navegadores onde essa condicao nao era atendida, o carrossel continuava funcional, mas os cards permaneciam planos.

A V1.9.1 remove essa dependencia: o arraste continua sendo scroll horizontal nativo com snap e a profundidade visual e atualizada de forma leve apenas enquanto o carrossel se move. O card central deve ficar frontal e os vizinhos devem inclinar/recuar para os lados.

### Teste principal
1. Abra `index.html` e avance do Hero para Lojas.
2. Arraste as lojas horizontalmente com o mouse/trackpad ou com o dedo.
3. Verifique se o card no centro fica frontal e os cards laterais aparecem inclinados/recuados, mudando continuamente enquanto voce arrasta.
4. Confirme que o arraste continua fluido e que os links WhatsApp/Rotas permanecem clicaveis.
5. Esta versao continua **CANDIDATA** ate aprovacao explicita.


## Patch V1.9.2 - Coverflow navegavel das lojas
A V1.9.1 corrigiu a profundidade, mas ainda tratava o carrossel mais como efeito visual do que como controle de navegacao. A V1.9.2 troca essa abordagem por um coverflow utilizavel:

- arraste horizontal livre durante o gesto;
- `scroll-snap` em modo `proximity`, sem prender o dedo a cada card;
- card central praticamente frontal e em primeiro plano;
- cards vizinhos continuam visiveis, inclinados e recuados para indicar que ha mais conteudo;
- no celular o swipe horizontal usa a rolagem/inercia nativa do navegador;
- no desktop, mouse e caneta podem agarrar e arrastar a faixa;
- ao soltar mouse/caneta, o card mais proximo centraliza suavemente;
- toque/clique em um card lateral centraliza aquela loja;
- pontos de navegacao mostram a posicao entre as 6 unidades e tambem podem ser clicados;
- setas e teclado continuam funcionando no desktop.

### QA interna desta candidata
A interacao foi exercitada em Chromium headless com o HTML/CSS/JS reais injetados na pagina de teste:
- desktop 1440 px: `clientWidth=1440`, `scrollWidth=3632`; arraste real de mouse moveu `scrollLeft` de 0 para 877 e o card ativo de 1 para 3;
- mobile 390 px: `clientWidth=390`, `scrollWidth=1961`; gesto de toque lateral moveu `scrollLeft` de 0 para 282 e o card ativo de 1 para 2;
- swipe vertical no mobile avançou Hero -> Lojas; swipe horizontal manteve a etapa Lojas; swipe vertical inverso retornou Lojas -> Hero;
- Hero confirmado em 2.600 ms por slide;
- nenhum erro JavaScript foi registrado nos testes de interacao.

A candidata continua **nao aprovada** ate o teste local do usuario.
