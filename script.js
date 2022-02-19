class Tile{

    constructor(index){
        this.index = index
        this.coords = [index % GRID_WIDTH, Math.floor(index / GRID_WIDTH)]
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
        this.el.style.backgroundColor = TILE_SELECT_BG_COLOUR
        this.el.style.color = TILE_SELECT_COLOUR
    }

    deselect(){
        this.el.style.backgroundColor = TILE_DEFAULT_BG_COLOUR
        this.el.style.color = TILE_DEFAULT_COLOUR
    }

    randomise(){
        this.set_char(this._get_rand_char())
    }

    is_congruous(tile){
        // Whether this tile is congruous to another tile
        if(tile === undefined) return true
        return (
            Math.abs(this.coords[0] - tile.coords[0]) <= 1 &&
            Math.abs(this.coords[1] - tile.coords[1]) <= 1
        )
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
    grid = []
    user_selection = []
    user_score = 0
    selection_score = 0
    score_el = document.getElementById("score")
    selection_score_el = document.getElementById("selection_score")

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
                this.user_score += this.user_selection[i].score
                this.user_selection[i].deselect()
                this.user_selection[i].randomise()
            }
            this.score_el.innerText = this.user_score
            this.user_selection = []
            this._reset_selection_score()
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
        this._reset_selection_score()
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
        for(var i = 0; i < NUM_TILES; i++){
            this.grid.push(new Tile(i))
        }
    }

    _toggle_select(index){
        // If tile already selected, remove. Else, add.
        var tile = this.grid[index]
        if(this._already_selected(tile)) this._remove_selection(tile)
        else this._add_selection(tile)
    }

    _get_last_selection(){
        return this.user_selection[this.user_selection.length - 1]
    }

    _already_selected(tile){
        // If tile is already in the user's selection
        return this.user_selection.includes(tile)
    }

    _add_selection(tile){
        // Add tile to user selection
        if(tile.is_congruous(this._get_last_selection())){
            tile.select()
            this.user_selection.push(tile)
            this._add_selection_score(tile.score)
        } else {
            throw new IncongruousSelectionError()
        }
    }

    _remove_selection(tile){
        // Remove tile from user selection
        if(tile != this._get_last_selection() && tile != this.user_selection[0]) return
        tile.deselect()
        this.user_selection.splice(this.user_selection.indexOf(tile), 1)
        this._sub_selection_score(tile.score)
    }

    _add_selection_score(score){
        this.selection_score += score
        this.selection_score_el.innerText = this.selection_score
        if(this.selection_score > 0){
            this.selection_score_el.parentNode.style.display = "inline-block"
        }
    }

    _sub_selection_score(score){
        this.selection_score -= score
        this.selection_score_el.innerText = this.selection_score
        if(this.selection_score === 0){
            this.selection_score_el.parentNode.style.display = "none"
        }
    }

    _reset_selection_score(){
        this.selection_score = 0
        this.selection_score_el.innerText = 0
        this.selection_score_el.parentNode.style.display = "none"
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
