class Tile{

    constructor(index){
        this.index = index
        this.el = document.getElementById("tile_" + index)
        this.char = ""

        this.randomise()
    }

    set_char(char){
        this.score = LETTER_SCORES[char]
        this.el.innerHTML = char + " <sub>" + this.score + "</sub>"
        this.char = char
    }

    select(){
        this.el.style.backgroundColor = TILE_SELECT_COLOUR
    }

    deselect(){
        this.el.style.backgroundColor = TILE_DEFAULT_COLOUR
    }

    randomise(){
        this.set_char(this._get_rand_char())
    }

    _get_rand_char(){
        // Random char A to Z
        return CHARS.charAt(this._get_rand_char_idx())
    }

    _get_rand_char_idx(){
        // Random int between 0 and 25
        return Math.floor(Math.random() * CHARS.length)
    }
}

class WordHandler{
    GRID_HEIGHT = 10
    GRID_WIDTH = 10
    grid = []
    user_selection = []

    constructor(){
        this._init_grid()
    }

    // INTERFACE
    select(index){
        this._toggle_select(index)
    }

    submit_word(){
        // Process user selection on submission
        var word = this.word()
        if(WORDLIST.includes(word)) {
            for(var i = 0; i < this.user_selection.length; i++){
                this.user_selection[i].deselect()
                this.user_selection[i].randomise()
            }
            this.user_selection = []
        } else {
            this.reset_selection()
            throw new NotInWordListError(word)
        }
    }

    reset_selection(){
        // Remove all from selection and reset tiles
        for(var i = 0; i < this.user_selection.length; i++){
            this.user_selection[i].deselect()
        }
        this.user_selection = []
    }

    word(){
        // Convert user selection to word
        var word = ""
        for(var i = 0; i < this.user_selection.length; i++){
            word += this.user_selection[i].char
        }
        return word.toLowerCase()
    }

    // HELPERS
    _init_grid(){
        // Pushes GRID_HEIGHT * GRID_WIDTH letters to grid
        for(var i = 0; i < this.GRID_HEIGHT * this.GRID_WIDTH; i++){
            this.grid.push(new Tile(i))
        }
    }

    _toggle_select(index){
        // If tile already selected, remove. Else, add.
        var tile = this.grid[index]
        if(this._already_selected(tile)) this._remove_selection(tile)
        else this._add_selection(tile)
    }

    _already_selected(tile){
        // If grid index is already in the user's selection
        return this.user_selection.includes(tile)
    }

    _add_selection(tile){
        // Add grid index to user selection
        tile.select()
        this.user_selection.push(tile)
    }

    _remove_selection(tile){
        // Remove grid index from user selection
        tile.deselect()
        this.user_selection.splice(this.user_selection.indexOf(tile), 1)
    }
}

var wh = new WordHandler()

function select(i){
    wh.select(i)
}

function submit(){
    wh.submit_word()
}

function reset(){
    wh.reset_selection()
}
