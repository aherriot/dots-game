## AI for the dots, lines, and squares game.

There is a classic children's game for people who are extremely bored. You first draw a grid of dots and then take turns drawing a single line between adjacent dots. If you enclose a square with your line, you score a point and get another turn. See [Wikipedia article](https://en.wikipedia.org/wiki/Dots_and_Boxes).

This computer program finds the optimal playing strategy by using the [minimax algorithm with alpha-beta pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning). It searches through every possible variation of play to the end of the game until we find the best strategy.

Here is a sample output (with added commentary):

```
Legend:
# or ## represents the most recent turn played
AA represents a square completed by player A
BB represents a square completed by player B

Starting configuration after random play
*--*  *--*  *
|     |     |
*  *--*  *--*
|     |
*--*  *--*--*

Player A turn
*--*##*--*  *
|     |     |
*  *--*  *--*
|     |
*--*  *--*--*

Player B turn
*--*--*--*  *
|  #BB|     |
*  *--*  *--*
|     |
*--*  *--*--*

Player B turn again
*--*--*--*  *
|BB|BB|     |
*##*--*  *--*
|     |
*--*  *--*--*

Player B turn again.
# Notice how player B can complete another square,
# but chooses not to. Instead B allows A to get two points,
# but this forces A to give away 4 points at the end.
# This is the optimal way to play this game and the minimax
# algorithm has successfully found the winning strategy.
*--*--*--*  *
|BB|BB|     |
*--*--*  *--*
|     |
*--*##*--*--*

Player A turn
*--*--*--*  *
|BB|BB|     |
*--*--*  *--*
|AA#AA|
*--*--*--*--*

Player A turn again
*--*--*--*##*
|BB|BB|     |
*--*--*  *--*
|AA|AA|
*--*--*--*--*

Player B turn
*--*--*--*--*
|BB|BB|  #BB|
*--*--*  *--*
|AA|AA|
*--*--*--*--*

Player B turn again
*--*--*--*--*
|BB|BB|BB|BB|
*--*--*##*--*
|AA|AA|
*--*--*--*--*

Player B turn again
*--*--*--*--*
|BB|BB|BB|BB|
*--*--*--*--*
|AA|AA|BB#
*--*--*--*--*

Player B turn again
*--*--*--*--*
|BB|BB|BB|BB|
*--*--*--*--*
|AA|AA|BB|BB#
*--*--*--*--*

Player B wins by 6 points to 2.
Even though Player A went first,
there was no way to prevent this outcome.
```
