## V1.9.4 CANDIDATA - Hero 2s + cardápio vertical (2026-09-14)
- Base: V1.9.3, que o usuário confirmou como perfeita antes desta rodada.
- Hero reduzido de 2,6 s para **2,0 s por fotografia**.
- Cardápio deixou o modo revista/livro horizontal e passou para leitura **vertical tradicional**, com as 15 páginas em sequência.
- Removidos swipe lateral, setas de troca de página, slider de página e lógica de páginas duplas.
- Mantido o PDF original para download.
- Página 1 do cardápio continua priorizada; páginas seguintes usam `loading="lazy"` para reduzir custo inicial.
- Adicionado contador discreto da página atualmente visível usando `IntersectionObserver`.
- Removidos `conteudo.js` e `site.js` da página de cardápio por não serem necessários ao novo visualizador, reduzindo JavaScript nessa rota.
- Coverflow das lojas e fachadas da V1.9.3 foram preservados sem alteração.
- Versão segue **CANDIDATA** até aprovação explícita.

## V1.9.3 CANDIDATA - fachadas nas lojas (2026-09-14)
- Base tecnica: V1.9.2 que o usuario confirmou como funcional no coverflow/navegacao.
- Mantido integralmente o comportamento aprovado do coverflow das lojas: swipe lateral, card central em destaque, dots, setas e scroll vertical Hero -> Lojas.
- Adicionadas as fotografias reais das fachadas das 6 unidades diretamente nos cards do carrossel.
- As imagens foram extraidas da pagina publica de Lojas da Duas Cerejas e incorporadas localmente ao projeto, evitando dependencia externa durante o teste.
- Fachadas salvas em WebP e carregadas com `loading="lazy"` para reduzir impacto inicial na home.
- Layout dos cards ajustado para acomodar foto + informacoes sem perder legibilidade nem quebrar a area rolavel lateral.
- Rodada pontual: nenhum catalogo antigo foi reativado; a home segue com somente Hero -> Lojas.
- Versao segue **CANDIDATA** e nao vira base oficial sem nova aprovacao explicita.

## V1.9.2 CANDIDATA - Coverflow navegavel das lojas (2026-09-14)
- Reconstruida a navegacao das lojas para priorizar usabilidade, nao apenas o efeito 3D.
- Corrigido o contenedor flex/grid que podia crescer junto com os cards e eliminar a area rolavel lateral.
- `scroll-snap` alterado de obrigatorio para `proximity`, permitindo controlar livremente a posicao durante o gesto.
- Profundidade passa a acompanhar continuamente a distancia de cada card ao centro usando apenas `transform`, `opacity` e `z-index`.
- Swipe em celular voltou a usar scroll/inercia nativos do navegador; mouse/caneta recebem drag dedicado no desktop.
- Clique/toque em card lateral centraliza a loja; adicionada paginacao visual/clicavel com 6 posicoes.
- Mantidos Hero -> Lojas como as unicas duas etapas da home e intervalo do Hero em 2,6 s.
- QA interna: desktop 1440 px confirmou 3632 px de largura rolavel e drag 0 -> 877 px; mobile 390 px confirmou 1961 px rolaveis e gesto 0 -> 282 px.
- QA de gestos confirmou Hero -> Lojas, swipe horizontal sem trocar de etapa e retorno Lojas -> Hero.
- Versao segue **CANDIDATA** e nao se torna base oficial sem aprovacao explicita.

## V1.9.0 CANDIDATA - Home enxuta: Hero -> Lojas (2026-09-14)
- Patch aplicado diretamente sobre o ZIP reenviado pelo usuario nesta rodada; **nao promove a versao automaticamente a base aprovada**.
- Home reduzida temporariamente a somente duas etapas verticais: **Hero** e **Lojas**.
- Boas-vindas, catalogos/categorias e final antigo deixam de ser carregados pelo `index.html`, mas seus arquivos permanecem preservados no projeto.
- Hero mantido com as 6 fotografias e intervalo de 2,6 s; com crossfade curto, a permanencia nominal fica abaixo de 3 s por foto.
- Criada tela de lojas com 6 unidades, telefone, WhatsApp, endereco, horario e atalho para rotas.
- Carrossel horizontal inspirado no Responsive Faux 3D Content Scroller, adaptado para cards institucionais e desempenho: scroll nativo + `scroll-snap` + `transform`/`opacity`, sem biblioteca ou Canvas.
- Novo `home-conteudo.js` reduz o conteudo interpretado na home somente ao Hero e aos parametros de navegacao.
- Logo final reduzido e incorporado ao rodape da propria tela de lojas.
- Cardapio permanece separado e funcional.

## V1.8 Patch - Swipe, timing e performance (2026-09-11)
- Patch acumulativo aplicado sobre o ZIP V1.7 candidata enviado pelo usuário; **não promove esta versão a base aprovada automaticamente**.
- Home deixa de depender da posição contínua do scroll para sincronizar foto e texto.
- Navegação passa a funcionar por **etapas fechadas**: roda do mouse/trackpad no desktop e **swipe vertical** no celular avançam ou voltam exatamente um capítulo por gesto.
- Adicionada trava de gesto para evitar pular várias categorias por inércia do trackpad ou por uma rolagem mais forte.
- Hero acelerado: autoplay reduzido de 4,3 s para 2,6 s e transição visual encurtada, diminuindo a sensação de lentidão/peso.
- O Hero pausa completamente quando deixa de ser a cena ativa, evitando trabalho em segundo plano.
- Categorias agora trocam foto e texto pelo mesmo estado discreto, eliminando o desencontro de timing causado por diferentes quantidades de scroll.
- Categoria **Doces** refeita para o novo motor: título e galeria entram juntos em animação curta e previsível; as 3 fotos aparecem rapidamente em sequência e terminam perfeitamente alinhadas.
- Removidos cálculos por `requestAnimationFrame` disparados durante scroll na home; as transições passam a depender apenas de eventos de mudança de etapa e CSS com `opacity`/`transform`.
- Cardápio permanece independente e sem mudança funcional.


## V1.7 Candidata
- Substitui a ideia de “chuva de docinhos” por um trecho mais clean e profissional na categoria **Doces**.
- A categoria Doces agora entra com **fundo preto cinematográfico** e revela **3 fotografias reais** em sequência, lado a lado, dentro do mesmo tempo de scroll já existente.
- Não altera o tempo total da rolagem nem o comportamento das demais categorias.
- As três fotos foram preparadas em WebP otimizadas e levemente recortadas para melhor enquadramento em cards verticais.
- A transição para Doces passa a ir para o preto antes da galeria; a saída de Doces continua entregando a próxima categoria normalmente.
- Mantidos Hero, Welcome, demais categorias, cardápio e Sem Lactose oculta.

# CHANGELOG

## V1.5 CANDIDATA - Troca de fotos em categorias (2026-09-11)

### Alterações
- Categoria **Chocolate** deixou de usar o Aerado repetido após o Hero e passou a usar a nova foto de **Mousse de Chocolate**.
- Categoria **Brancos** passou a usar a nova foto enviada de **Chocolate Branco**.
- Categoria **Meio Amargo** passou a usar a nova foto enviada para essa categoria.
- Categoria **Novidades** passou a usar a nova foto enviada de **Red Velvet de Pistache**.
- Hero inicial foi preservado sem alterações, evitando regressão na abertura.
- Novos derivados WebP 640/1440 foram incorporados com nomes limpos ao acervo do projeto.

### Observação
- Esta versão continua **CANDIDATA** e só vira base oficial após aprovação explícita do usuário.

# V1.4 CANDIDATA

- Corrigida a quebra visual entre Hero/boas-vindas e a primeira categoria.
- Hero, boas-vindas, todas as categorias e logo final agora compartilham UM UNICO palco sticky de 100% da tela.
- Removida a fotografia intermediaria duplicada de Chocolate/Aerado usada na ponte da V1.3.
- Removido o segundo palco que subia fisicamente pelo viewport ao iniciar a historia.
- Chocolate agora nasce por opacidade sobre o mesmo preto da abertura; nenhuma camada principal muda de posicao vertical durante a passagem.
- Preservado integralmente o timing aprovado de foto x texto e os 38vh de scroll por categoria.
- Hero interrompe o autoplay logo apos o usuario iniciar a saida da abertura, reduzindo trabalho desnecessario fora do momento em que o slider esta visivel.
- Sem Lactose segue oculta.

# V1.3 CANDIDATA

- Transformada a passagem Hero -> boas-vindas em uma composicao sobreposta no mesmo palco sticky.
- Removida a sensacao de que "Seja bem-vindo" esta em uma secao abaixo do Hero.
- Hero agora escurece progressivamente, revela a mensagem e depois entrega a tela para a primeira categoria, que nasce do preto.
- Reduzida a distancia de scroll por categoria para 38vh, mantendo as janelas relativas de entrada/saida do texto da V1.2.
- A abertura foi encurtada e agora usa 158svh (154svh em mobile), com sobreposicao de 100svh sobre a historia para evitar uma tela vazia entre as experiencias.
- Sem Lactose segue oculta.

# Changelog

## V1.2 Candidata
- Patch acumulativo sobre a V1.1 candidata, sem promover nenhuma versao a base oficial.
- Hero agora escurece progressivamente conforme a rolagem se aproxima da tela de boas-vindas.
- A passagem Hero -> "Seja bem-vindo a Duas Cerejas" deixa de parecer uma troca seca: o preto funciona como ponte visual entre as secoes.
- A tela de boas-vindas tambem escurece progressivamente na saida.
- O primeiro produto (Chocolate) nasce do preto gradualmente nos primeiros momentos da experiencia, em vez de aparecer com opacidade total de imediato.
- Mantidos o timing V1.1 dos titulos no apice do produto e a categoria Sem Lactose oculta.
- Implementacao feita somente com opacity, variaveis CSS e requestAnimationFrame sob demanda; sem imagens ou bibliotecas adicionais.

## V1.1 Candidata
- Patch acumulativo preservando toda a fundacao visual e tecnica da V1.0 candidata.
- Adicionado um novo capitulo de boas-vindas entre o Hero e a sequencia de sabores.
- Nova tela "Seja bem-vindo à Duas Cerejas" com entrada tipografica triunfal e leve, feita somente com CSS/opacity/transform.
- O atalho de rolagem do Hero agora leva primeiro para a tela de boas-vindas.
- Sincronizacao das transicoes de produtos refeita: a imagem assenta primeiro, o nome aparece apenas no apice visual e desaparece antes do crossfade para o proximo produto.
- Crossfade entre categorias foi deslocado para o final de cada capitulo, evitando nome de um produto sobre a imagem dominante de outro.
- Categoria Sem Lactose marcada como oculta enquanto nao houver fotografia real aprovada.
- Contador da experiencia passa a considerar somente as 12 categorias atualmente visiveis.
- Mantidas as regras de carregamento progressivo, imagens WebP responsivas e animacoes baseadas em transform/opacity.

## V1.0 Candidata
- Nova fundacao limpa baseada no acervo `Duas_cerejas_site_raiz.zip`.
- Cabecalho fixo com acesso permanente ao Cardapio.
- Hero slider com 6 fotografias reais e carregamento progressivo.
- Experiencia por rolagem em ordem 01 Chocolate -> 13 Caseiros.
- Categoria Sem Lactose mantida sem fotografia artificial.
- Encerramento em preto com logo Duas Cerejas.
- Cardapio responsivo em formato revista (desktop) e pagina unica (mobile).
- PDF original mantido para download.
- Todas as fotografias do acervo convertidas para WebP com nomes normalizados.
- Sem frameworks, sem dependencias externas e sem servidor obrigatorio.

## V1.8.1 CANDIDATA - Correcao do retorno do Hero (2026-09-11)

### Diagnostico
- O Hero reutilizava dois elementos `<img>` alternadamente.
- O handler `onload` da imagem reutilizada podia permanecer associado ao ciclo anterior.
- Em imagens ja em cache/pre-carregadas, sobretudo na volta da 6a foto para a 1a, isso podia criar uma segunda chamada de transicao ou deixar o estado interno atrasado em relacao ao crossfade.
- O autoplay usava `setInterval`, entao o relogio continuava correndo enquanto a imagem ainda estava em transicao/carregamento.

### Correcao
- Handlers `onload/onerror` sao limpos antes de cada reutilizacao de imagem.
- Cada troca recebe um token proprio; callbacks antigos sao ignorados.
- O indice, `front` e `back` passam a ser atualizados no inicio efetivo do crossfade, e nao somente no fim.
- O autoplay passa a usar `setTimeout` encadeado, contado depois da conclusao de cada troca, evitando sobreposicao e deriva entre ciclos.
- Mantidos os 2,6 s configurados para o Hero, o swipe/wheel por etapas e todas as demais alteracoes da V1.8.

### Status
- Versao candidata. Nao deve ser promovida a base oficial antes do teste e aprovacao explicita do usuario.

## V1.8.4 candidata - sincronismo bidirecional do swipe
- Base: V1.8.1 aprovada. V1.8.2 e V1.8.3 permanecem descartadas/não aprovadas.
- Swipe móvel volta a permitir 1, 2 ou 3 etapas conforme a distância do gesto.
- Corrigido o desalinhamento que surgia ao chegar ao final e navegar de volta.
- A camada de imagem ativa agora é confirmada no mesmo instante em que o texto entra; o timer posterior serve apenas para limpeza.
- Pré-carregamento passa a cobrir até 3 categorias para frente e para trás.
- Callbacks atrasados são invalidados por token de renderização, evitando que uma imagem antiga reapareça após outro swipe.

## V1.9.1 CANDIDATA - correcao do Faux 3D das lojas (2026-09-14)
- Base reconstruida a partir do ZIP-fonte reenviado pelo usuario; V1.9.0 permanece nao aprovada.
- Corrigido o carrossel de lojas que podia ficar visualmente plano.
- Removida a dependencia funcional de `animation-timeline:view(inline)` para a profundidade dos cards.
- Mantido o `scroll-snap` horizontal nativo e adicionada mascara lateral inspirada no Responsive Faux 3D Content Scroller de Jhey.
- A perspectiva passa a ser calculada somente durante o deslocamento horizontal, via `requestAnimationFrame`, atualizando apenas `transform` e `opacity` dos seis cards.
- Card central fica frontal; cards laterais recuam e rotacionam progressivamente, inclusive durante o arraste com o dedo.
- `prefers-reduced-motion` continua respeitado.
- Hero permanece com intervalo de 2,6 s e a home continua reduzida a duas etapas: Hero -> Lojas.
- Status: candidata; aguarda teste e aprovacao explicita.
