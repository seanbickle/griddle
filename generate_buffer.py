'''
Generates:

* a 6x6 grid and 36x6 buffer, to ensure every player has the same each day
* The current and last griddle ID. Tied to the buffer generation to ensure
  the game only refreshes when there's a new buffer.
'''
import datetime

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
        CHARS[randint(0, len(CHARS) - 1)]
        for i in range(GRID_HEIGHT * GRID_HEIGHT * WORD_LIMIT)
    ]


if __name__ == "__main__":
    buffer = generate_buffer()

    today = datetime.datetime.utcnow().date()
    current_griddle_id = today.isoformat()
    last_griddle_id = (today - datetime.timedelta(days=1)).isoformat()

    with open("buffer.js", mode="w") as file:
        file.write(
            f'BUFFER = {generate_buffer()}\n'
            f'CURRENT_GRIDDLE_ID = "{current_griddle_id}"\n'
            f'LAST_GRIDDLE_ID = "{last_griddle_id}"\n'
        )
