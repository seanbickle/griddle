class Tile{
    constructor(index){
        this.index = index
        this.coords = [index % GRID_WIDTH, Math.floor(index / GRID_WIDTH)]
        this.el = document.getElementById("tile_" + index)
        this.char = ""

        this.set_next_char()
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

    set_next_char(){
        // Sets the char to the next char in the buffer
        var next_char = BUFFER.shift()
        if(next_char) this.set_char(next_char)
    }

    toJSON(){
        return this.char
    }

    is_adjacent(tile){
        // Whether this tile is adjacent to another tile
        if(!tile) return true
        return (
            Math.abs(this.coords[0] - tile.coords[0]) <= 1 &&
            Math.abs(this.coords[1] - tile.coords[1]) <= 1
        )
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
            if(randomise_tiles) this.tiles[i].set_next_char()
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

class Score{
    constructor(){
        this.score = 0
        this.score_el = document.getElementById("score")
        this.set(this._load())
    }

    add(score){
        // Add onto the existing score
        this.score += score
        this._render()
        this._save()
    }

    set(score){
        // Overwrite the existing score
        this.score = score
        this._render()
        this._save()
    }

    _render(){
        // Update the element
        this.score_el.innerText = this.score
    }

    _save(){
        // Save the current score
        try{
            localStorage.score = this.score
        } catch(err){
            console.error("Problem saving score: ", err)
        }
    }

    _load(){
        // Load the last score
        // TODO: Reset if there's a new griddle
        try{
            var stored_score = localStorage.score
            if(stored_score) return parseInt(localStorage.score)
            else return this.score
        } catch(err){
            console.error("Problem loading score: ", err)
            return this.score
        }
    }
}

class Words{
    constructor(){
        this.words = []

        this.set(this._load())
    }

    count(){
        // Return the number of words that the player has entered
        return this.words.length
    }

    set(words){
        this.words = words
        this._save()
    }

    add(word){
        // Add a word to the user's list of words
        this.words.push(word)
        this._save()
    }

    _save(){
        // Save today's entered  words
        try{
            localStorage.words = JSON.stringify(this.words)
        } catch(err){
            console.error("Problem saving words: ", err)
        }
    }

    _load(){
        // Load today's entered words
        // TODO: Reset if there's a new griddle
        try{
            var stored_words = localStorage.words
            if(stored_words) return JSON.parse(localStorage.words)
            else return this.words
        } catch(err){
            console.error("Problem loading words: ", err)
            return this.words
        }
    }
}

class WordHandler{
    grid = []
    score = new Score()
    selection = new Selection()
    words = new Words()
    selection_score = 0
    multiplier = 1
    selection_score_el = document.getElementById("selection_score")
    multiplier_el = document.getElementById("score_multiplier")

    constructor(){
        this._load_buffer()
        this._init_grid()
    }

    // INTERFACE
    select(index){
        // Toggles selection
        this._check_gameover()
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
        var word = this.selection.word()
        if(WORDLIST.includes(word)) {
            var score = this.selection_score * this.multiplier

            this.score.add(score)
            this.words.add([word, score])
            this.selection.reset(true)
            this._hide_selection_score()
            this._set_top_word(word, score)

            this._save_buffer()
        } else {
            this.selection.reset(false)
            this._hide_selection_score()
            throw new NotInWordListError(word)
        }

        this._check_gameover()
    }

    is_gameover(){
        return this.words.count() >= WORD_LIMIT
    }

    // HELPERS
    _init_grid(){
        for(var i = 0; i < NUM_TILES; i++){
            this.grid.push(new Tile(i))
        }
    }

    _load_buffer(){
        // Load the buffer back from local storage if it exists.
        // TODO: Check whether the buffer has expired.
        try {
            if(localStorage.buffer) BUFFER = JSON.parse(localStorage.buffer)
        } catch(err) {
            console.error("Problem loading buffer, using original: ", err)
        }
    }

    _save_buffer(){
        // Store the grid plus the remainder of the buffer
        // This will be read back into the grid in order when the game reloads
        localStorage.buffer = JSON.stringify(this.grid.concat(BUFFER))
    }

    _check_gameover(){
        if(this.words.count() >= WORD_LIMIT) throw new GameOver()
    }

    _add_selection(tile){
        // Add tile to user selection
        if(tile.is_adjacent(this.selection.last())){
            this.selection.add_tile(tile)
            this._add_selection_score(tile.score)
            this._check_multiplier()
        } else {
            throw new AdjacentSelectionError()
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

    // STATS
    _set_top_word(word, score){
        if(parseInt(localStorage.top_word_score) > score) return
        localStorage.top_word_score = score
        localStorage.top_word = word
        show_toast("new top word!")
    }
}

// GAME CONTROLS
var wh = new WordHandler()

function select(i){
    try{
        wh.select(i)
    } catch(err) {
        if(err instanceof AdjacentSelectionError){
            show_toast(err.message)
        } else if(err instanceof GameOver){
            show_toast("come back tomorrow for another griddle")
        }
    }
}

function submit(){
    try{
        wh.submit_word()
    } catch(err) {
        if(err instanceof NotInWordListError){
            show_toast(err.message)
        } else if(err instanceof GameOver){
            show_stats_modal()
        }
    }
}

function reset(){
    wh.reset()
}

// INFO MODAL
function show_info_modal(){
    document.getElementById("info_modal").style.display = "inline-block"
}

function hide_info_modal(){
    document.getElementById("info_modal").style.display = "none"
}

// STATS MODAL
var stats_gameover_container = document.getElementById("stats_gameover_container")
var stats_gameover_clock_el = document.getElementById("stats_gameover_clock")
var stats_gameover_clock = null

function show_stats_modal(){
    if(wh.is_gameover() && !stats_gameover_clock){
        update_next_griddle_clock()
        stats_gameover_clock = setInterval(update_next_griddle_clock, 1000)
        stats_gameover_container.style.display = "inline"
    }

    document.getElementById("stats_modal__top_word").innerText = localStorage.top_word || "none"
    document.getElementById("stats_modal__top_word_score").innerText = localStorage.top_word_score || "0"
    
    document.getElementById("stats_modal").style.display = "inline-block"
}

function hide_stats_modal(){
    document.getElementById("stats_modal").style.display = "none"
}

function update_next_griddle_clock(){
    // Tick gameover clock
    var time_now = new Date().getTime()
    var distance = get_next_griddle_time() - time_now
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    stats_gameover_clock_el.innerHTML = hours + "h " + minutes + "m " + seconds + "s ";

    if(distance <= 0){
        show_toast("refresh the page for a new griddle!")
        clearInterval(stats_gameover_clock)
    }
}

function get_next_griddle_time(){
    var time_tomorrow = new Date()
    time_tomorrow.setHours(0)
    time_tomorrow.setMinutes(0)
    time_tomorrow.setSeconds(0)
    time_tomorrow.setDate(time_tomorrow.getDate() + 1)
    return time_tomorrow.getTime()
}

// TOASTS
var toast = document.getElementById("toast_container")
toast.addEventListener("click", hide_toast)
var toast_timeout = null

function show_toast(text){
    clearTimeout(toast_timeout)
    toast.innerText = text
    toast.style.bottom = "0"
    toast_timeout = setTimeout(hide_toast, 3000)
}

function hide_toast(){
    toast.innerText = ""
    toast.style.bottom = "-25%"
}
