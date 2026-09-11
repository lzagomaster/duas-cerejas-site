# Duas Cerejas - Site V1.7 Candidata

Esta versao e um patch acumulativo da linha V1.x e **nao e considerada aprovada automaticamente**.

## Como testar
1. Extraia o ZIP inteiro.
2. Abra `index.html` com Chrome, Edge, Firefox ou Safari. Nao e necessario instalar nada.
3. Role a pagina desde o Hero sem parar no limite das secoes. O enquadramento da tela deve permanecer fixo: as cenas se substituem por cima umas das outras.
4. Confira a sequencia Hero -> preto -> `Seja bem-vindo a Duas Cerejas` -> preto -> Chocolate.
5. Continue por Brancos, Morango e demais categorias e confirme que o timing nome x fotografia continua correto.
6. Confirme que **Sem Lactose nao aparece** nesta versao.
7. Use o botao **Cardapio** do cabecalho e teste normalmente o visualizador.

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
