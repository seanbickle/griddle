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
        this.el.style.backgroundColor = CURRENT_TILE_BG_COLOUR
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
        if(!tile) return true
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

class Selection{
    constructor(){
        this.tiles = []
    }

    add_tile(tile){
        // Add a tile to the selection array
        tile.select()
        this.tiles.push(tile)
    }

    remove_tile(tile){
        // Remove a tile from the selection array
        tile.deselect()
        this.tiles.splice(this.tiles.indexOf(tile), 1)
    }

    reset(randomise_tiles){
        // Reset tiles and clear selection
        for(var i = 0; i < this.tiles.length; i++){
            this.tiles[i].deselect()
            if(randomise_tiles) this.tiles[i].randomise()
        }
        this.tiles = []
    }

    includes(tile){
        // Proxes the array includes
        return this.tiles.includes(tile)
    }
    
    first(){
        // First tile selected
        return this.tiles[0]
    }

    last(){
        // Last tile selected
        return this.tiles[this.tiles.length - 1]
    }

    length(){
        // Proxy length
        return this.tiles.length
    }

    word(){
        // Build a string word from the current selection
        var word = ""
        for(var i = 0; i < this.tiles.length; i++){
            word += this.tiles[i].char
        }
        return word.toLowerCase()
    }

    is_word(){
        // Determines whether the user selection makes a word
        return WORDLIST.includes(this.word())
    }

    is_middle_tile(tile){
        return tile != this.last() && tile != this.first()
    }

    refresh_background(){
        // Forces the selected tiles to fresh their background
        for(var i = 0; i < this.tiles.length; i++){
            this.tiles[i].el.style.backgroundColor = CURRENT_TILE_BG_COLOUR
        }
    }
}

class WordHandler{
    grid = []
    selection = new Selection()
    user_score = 0
    selection_score = 0
    multiplier = 1
    score_el = document.getElementById("score")
    selection_score_el = document.getElementById("selection_score")
    multiplier_el = document.getElementById("score_multiplier")

    constructor(){
        this._init_grid()
    }

    // INTERFACE
    select(index){
        // Toggles selection
        var tile = this.grid[index]
        if(this.selection.includes(tile)) this._remove_selection(tile)
        else this._add_selection(tile)
    }

    reset(){
        this.selection.reset(false)
        this._hide_selection_score()
    }

    submit_word(){
        // Process user selection on submission
        if(this.selection.is_word()) {
            this.user_score += (this.selection_score * this.multiplier)
            this.selection.reset(true)
            this.score_el.innerText = this.user_score
            this._hide_selection_score()
        } else {
            var word = this.selection.word()
            this.selection.reset(false)
            this._hide_selection_score()
            throw new NotInWordListError(word)
        }
    }

    // HELPERS
    _init_grid(){
        for(var i = 0; i < NUM_TILES; i++){
            this.grid.push(new Tile(i))
        }
    }

    _add_selection(tile){
        // Add tile to user selection
        if(tile.is_congruous(this.selection.last())){
            this.selection.add_tile(tile)
            this._add_selection_score(tile.score)
            this._check_multiplier()
        } else {
            throw new IncongruousSelectionError()
        }
    }

    _remove_selection(tile){
        // Remove tile from user selection
        if(this.selection.is_middle_tile(tile)) return
        this.selection.remove_tile(tile)
        this._sub_selection_score(tile.score)
        this._check_multiplier()
    }

    _check_multiplier(){
        if(this.selection.length() >= MULTIPLIER_THRESHOLD){
            this._enable_multiplier()
        } else {
            this._disable_multiplier()
        }
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

    _hide_selection_score(){
        this.selection_score = 0
        this.selection_score_el.innerText = 0
        this.selection_score_el.parentNode.style.display = "none"

        this._disable_multiplier()
    }

    _enable_multiplier(){
        CURRENT_TILE_BG_COLOUR = TILE_MULTIPLIER_BG_COLOUR
        this.selection.refresh_background()

        this.multiplier = 2
        this.multiplier_el.innerText = 2
        this.multiplier_el.parentNode.style.display = "inline-block"
    }

    _disable_multiplier(){
        if(this.selection.length() > 0){
            CURRENT_TILE_BG_COLOUR = TILE_SELECT_BG_COLOUR
        } else {
            CURRENT_TILE_BG_COLOUR = TILE_DEFAULT_BG_COLOUR
        }
        this.selection.refresh_background()

        this.multiplier = 1
        this.multiplier_el.innerText = 2
        this.multiplier_el.parentNode.style.display = "none"
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
    wh.reset()
}
