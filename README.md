# Duas Cerejas - Site V1.8.3 Patch Candidato

Esta versao e um patch acumulativo da linha V1.x e **nao e considerada aprovada automaticamente**.

## Como testar
1. Extraia o ZIP inteiro.
2. Abra `index.html` com Chrome, Edge, Firefox ou Safari. Nao e necessario instalar nada.
3. No computador, use a roda do mouse/trackpad. Cada gesto deve **parar exatamente em uma etapa**: Hero -> boas-vindas -> Chocolate -> Brancos -> Morango...
4. No celular, faça **swipe vertical**: gesto curto deve mover 1 etapa, médio 2 e longo até 3.
5. Faça alguns swipes longos para frente e para trás e confirme que **foto e texto sempre aparecem juntos** na categoria de destino.
6. No Hero, confirme que o loop corrigido da V1.8.1 continua normal, inclusive na volta da 6ª para a 1ª foto.
7. Vá até **Doces** usando também um swipe longo e confira se o título e as 3 fotos entram corretamente e permanecem alinhados.
8. Continue para **Caseiros** e depois para o logo final; volte rapidamente com swipes longos para validar a navegação reversa.
9. Confirme que **Sem Lactose nao aparece** nesta versao e que o botão **Cardapio** continua funcionando normalmente.


## Patch V1.8.3 - swipe multietapas sem perder foto/texto

A V1.8.2 foi descartada porque o salto direto de 2 ou 3 categorias podia alcançar uma fotografia que ainda não estava preparada pelo motor originalmente feito para navegar uma etapa por vez.

A V1.8.3 volta à **V1.8.1 aprovada** e reimplementa o salto de forma segura. O alcance máximo do gesto é antecipado com preload de até três categorias, e a categoria de destino só entra visualmente quando a fotografia correspondente está pronta. Texto e fotografia são liberados no mesmo ciclo de renderização. Também existe uma proteção por token para impedir que um carregamento antigo, terminado depois de outro swipe, substitua a categoria atual.

No celular:
- swipe curto: 1 etapa;
- swipe médio: 2 etapas;
- swipe longo: 3 etapas.

No desktop permanece 1 etapa por gesto de wheel/trackpad.

## Atualização V1.8 - navegação por etapas

A V1.8 muda somente o motor de navegação da home e o timing das cenas. Em vez de relacionar cada frame à quantidade exata de pixels rolados, a experiência agora trabalha com capítulos discretos. No desktop, wheel/trackpad avança uma etapa; no mobile, o gesto equivalente é swipe vertical.

Isso resolve o principal problema desta rodada: foto e texto não podem mais ficar em posições diferentes da mesma transição, pois cada categoria tem um único estado visual fechado. A categoria **Doces** usa o mesmo princípio; as três fotos entram em sequência curta, mas terminam com o mesmo topo, altura e base.

O Hero também foi acelerado para aproximadamente **2,6 segundos por foto** e deixa de executar autoplay quando o visitante já avançou para outra etapa.

## Correcao estrutural V1.4
A V1.3 ainda possuia dois palcos: uma pre-visualizacao de Chocolate/Aerado na abertura e, em seguida, o palco real das categorias entrando fisicamente de baixo. Isso podia produzir a sensacao de uma foto solta e depois uma tela inteira subindo.

Na V1.4 existe somente um `cinematic-stage` sticky, ocupando 100% do viewport. Dentro dele ficam, em camadas:

1. Hero;
2. cortina preta;
3. boas-vindas;
4. palco dos sabores;
5. logo final.

A pagina continua rolando, mas o palco nao sobe. A rolagem altera apenas `opacity` e pequenos `transform` internos. Isso faz a experiencia parecer uma unica pagina/cena continua.

## Timing e distancia de rolagem
- Ponte Hero -> sabores: 54vh de deslocamento real.
- Cada transicao de categoria: 38vh.
- 12 categorias visiveis (Sem Lactose permanece oculta).
- Percurso cinematografico total: aproximadamente 610vh, praticamente igual ao V1.3, mas sem a troca fisica de palco.

O timing interno aprovado foi mantido:
- 0%-16%: fotografia assenta, sem titulo;
- 16%-32%: titulo entra;
- 32%-56%: produto + titulo no apice;
- 56%-68%: titulo sai;
- 68%-94%: crossfade para a proxima fotografia.

## Estrutura
- `index.html`: pagina inicial e palco cinematografico unico.
- `cardapio.html`: visualizador responsivo do cardapio.
- `assets/css/site.css`: estilos e camadas da experiencia.
- `assets/js/conteudo.js`: conteudo e parametros centrais de movimento (`openingVh` e `segmentVh`).
- `assets/js/site.js`: ponte Hero -> boas-vindas -> sabores.
- `assets/js/hero.js`: slider da abertura; agora pausa cedo quando o Hero deixa de ser relevante.
- `assets/js/experiencia.js`: categorias e logo final no mesmo palco sticky.
- `assets/js/cardapio.js`: revista responsiva.
- `assets/img/`: imagens WebP otimizadas.
- `assets/cardapio/`: PDF original e paginas leves.

## Performance
A V1.4 nao adiciona imagens, frameworks ou bibliotecas. Pelo contrario, remove uma superficie visual duplicada da ponte de abertura. O motor continua baseado em `requestAnimationFrame` sob demanda, `opacity`, `transform`, duas superficies de imagem reutilizadas para as categorias e preload apenas dos proximos itens.

O Service Worker/cache persistente continua desativado durante os testes locais para nao mascarar patches com arquivos antigos.

## Regra de aprovacao
Esta V1.4 e **CANDIDATA**. Ela so passa a ser base oficial quando o usuario testar e aprovar explicitamente.


## Atualização V1.5 candidata

Esta versão troca somente as imagens das categorias **Chocolate**, **Brancos**, **Meio Amargo** e **Novidades**, preservando o Hero e toda a estrutura da home.


## Atualização V1.7 candidata

Esta iteração **descarta a chuva de doces da tentativa anterior** e volta para uma solução mais elegante e fiel às fotos reais.

### O que muda
- Na categoria **Doces**, o palco entra em **preto** e surgem **3 fotos reais** alinhadas lado a lado.
- As três aparecem **uma por uma**, dentro do mesmo tempo de scroll já existente.
- A animação foi mantida leve: apenas `opacity` e `transform`, sem bibliotecas e sem partículas soltas.
- As imagens foram convertidas para WebP e enquadradas em cards verticais para melhorar a leitura visual.

### O que validar no teste
1. Role até a categoria **Doces**.
2. Confirme que ela entra com fundo preto, sem chuva e sem visual artificial.
3. Verifique se as 3 fotos aparecem em sequência, alinhadas, ainda no mesmo trecho de scroll.
4. Continue rolando e confirme que a próxima categoria assume normalmente.
5. Teste também em tela menor para conferir responsividade.

## Patch V1.8.1 - retorno do Hero
Foi corrigida a continuidade do carrossel quando a ultima fotografia volta para a primeira. O teste principal desta versao e deixar o Hero completar pelo menos dois ciclos inteiros sem interagir e conferir se a sequencia 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 1 permanece suave, sem quadro preto, salto, pausa anormal ou texto fora da fotografia.
