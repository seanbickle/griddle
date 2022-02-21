'''
Generates a 6x6 grid and 36x6 buffer, to ensure every player has the same each
day
'''
from random import randint


# Users can enter 5 words on a 6x6 grid each day, so at most the buffer
# needs to be 6x6x5
# TODO: These could probably be pulled from the env and pushed to both this
# script and the js if we want to make grid size more flexible.
GRID_WIDTH = 6
GRID_HEIGHT = 6
WORD_LIMIT = 5
# This is ordered by the frequency of each letter in the english vocabulary.
# It looks pretty bonkers but it's a low-complexity means of getting
# semi-random letters with a usable distribution.
CHARS = (
    "EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE"
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR"
    "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII"
    "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO"
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN"
    "SSSSSSSSSSSSSSSSSSSSSSSSSSSSS"
    "LLLLLLLLLLLLLLLLLLLLLLLLLLLL"
    "CCCCCCCCCCCCCCCCCCCCCCC"
    "UUUUUUUUUUUUUUUUUUU"
    "DDDDDDDDDDDDDDDDD"
    "PPPPPPPPPPPPPPPP"
    "MMMMMMMMMMMMMMM"
    "HHHHHHHHHHHHHHH"
    "GGGGGGGGGGGGG"
    "BBBBBBBBBBB"
    "FFFFFFFFF"
    "YYYYYYYYY"
    "WWWWWWW"
    "KKKKKK"
    "VVVVV"
    "XX"
    "ZZ"
    "JJ"
    "QQ"
)


def generate_buffer():
    return [
        CHARS[randint(0, len(CHARS))]
        for i in range(GRID_HEIGHT * GRID_HEIGHT * WORD_LIMIT)
    ]


if __name__ == "__main__":
    with open("buffer.js", mode="w") as file:
        file.write(f'BUFFER = {generate_buffer()}\n')
