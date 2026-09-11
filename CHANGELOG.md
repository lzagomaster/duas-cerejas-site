
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
