// Game constants
// Keeps track of whether wordle needs to be refreshed
CURRENT_GRIDDLE_ID = new Date().toISOString().split("T")[0]
GRIDDLE_OUTDATED = (CURRENT_GRIDDLE_ID != localStorage.last_griddle_id)
localStorage.last_griddle_id = CURRENT_GRIDDLE_ID

WORD_LIMIT = 5
NUM_TILES = 36
GRID_WIDTH = Math.sqrt(NUM_TILES)
LETTER_SCORES = {"A": 1, "B": 3, "C": 3, "D": 2, "E": 1, "F": 4, "G": 2, "H": 4, "I": 1, "J": 8, "K": 5, "L": 1, "M": 3, "N": 1, "O": 1, "P": 3, "Q": 10, "R": 1, "S": 1, "T": 1, "U": 1, "V": 4, "W": 4, "X": 8, "Y": 4, "Z": 10}
// Number of characters required to enable multiplier
MULTIPLIER_THRESHOLD = 7

// Tile default styling
// TODO: Find a better way to transition this
TILE_DEFAULT_BG_COLOUR = "rgb(250,250,250)"
TILE_DEFAULT_COLOUR = "rgb(50,50,50)"
TILE_SELECT_BG_COLOUR = "rgb(0, 204, 156)"
TILE_MULTIPLIER_BG_COLOUR = "rgb(3, 145, 111)"
TILE_SELECT_COLOUR = "white"

CURRENT_TILE_BG_COLOUR = TILE_DEFAULT_BG_COLOUR
