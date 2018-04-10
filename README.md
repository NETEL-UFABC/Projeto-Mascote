# Projeto-Mascote

O que é sprite?

    Sprite é uma das várias imagens sequenciais que compõem uma animação ou, em outras palavras, podemos dizer que é um frame, um quadro.

* O que é spriteSheet?

    SpriteSheet é o conjunto de sprites que preferencialmente se localizam em um mesmo arquivo de imagem, como o PNG.

* O que é o mascote?

    O mascote é uma animação de um personagem. Essa animação pode conter apenas um comportamento ou pode ser a composição de vários comportamentos.
    Os comportamentos de um dado mascote foram criados separados e podem ser animados separadamente a fim de dar vida a apenas uma ação do personagem (como por exemplo o mascote dando oi ou dando tchau). Mas, os comportamentos podem ser combinados sequencialmente de modo que o mascote passe a ter um ciclo de vida maior e com diferentes comportamentos (por exemplo dando oi, depois dizendo seja bem vindo e, por fim, dando tchau).

* Qual a relação do mascote com os spritesSheets?

    Cada comportamento dos mascotes são criados separadamente (pelo criador de animações) e é gerado um spriteSheet para cada comportamento, em PNG de fundo transparente.

* Como funciona a animação de uma spriteSheet?

    O arquivo PNG Spritsheet contém, como vimos, uma séries de sprites (ou frames) que ditarão um determinado comportamento.
    Além disso, há para cada arquivo PNG um arquivo JSON associado, este contendo os dados de cada frame como tamanho do frame, ordem de execuçnão e etc.

    O animador criado por mim lê o arquivo JSON, obtem os dados de cada frame e com base neles, olha para o PNG e foca somente no sprite da vez a ser exibido.

    O que dá a sensação de animação não é a exibição de UM sprite, até porque o sprite em si é uma imagem estática. O que dá a sensação de animação, então, é a exibição sequencial e na ordem correta desses sprites.



**** Estrutura de arquivos da biblioteca que ja esta pronta ****


A pasta raiz do projeto chama-se SpritesheetLib.

Dentro da raiz encontram-se o arquivo javascript (anim.js) - que é o código fonte da animação - o arquivo html (index.html) - que é o página html que instanciamos os mascotes e, por fim, os arquivos *.json e *.png que correspondem aos mascotes a serem animados.
