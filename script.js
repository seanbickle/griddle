class WordHandler{
    GRID_HEIGHT = 10
    GRID_WIDTH = 10
    wordlist = wordlist
    chars = "abcdefghijklmnopqrstuvwxyz"
    grid = []

    constructor(){
        this._init_grid()
    }

    _init_grid(){
        // Pushes GRID_HEIGHT rows of GRID_WIDTH letters to grid
        for(var x = 0; x < this.GRID_HEIGHT; x++){
            var row = []
            for(var y = 0; y < this.GRID_WIDTH; y++){
                row.push(this._get_rand_char())
            }
            this.grid.push(row)
        }
    }

    _get_rand_char(){
        // Random char A to Z
        return this.chars.charAt(this._get_rand_char_idx())
    }

    _get_rand_char_idx(){
        // Random int between 0 and 25
        return Math.floor(Math.random() * this.chars.length)
    }
}
