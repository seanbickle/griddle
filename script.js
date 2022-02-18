class WordHandler{
    GRID_HEIGHT = 10
    GRID_WIDTH = 10
    wordlist = wordlist
    chars = "abcdefghijklmnopqrstuvwxyz"
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
        // Triggered by user entering selection
        return this._in_word_list(this.word())
    }
    
    word(){
        // Convert user selection to word
        var word = ""
        for(var i = 0; i < this.user_selection.length; i++){
            word += this.grid[this.user_selection[i]]
        }
        return word
    }

    // HELPERS
    _init_grid(){
        // Pushes GRID_HEIGHT * GRID_WIDTH letters to grid
        for(var i = 0; i < this.GRID_WIDTH * this.GRID_HEIGHT; i++){
            this.grid.push(this._get_rand_char())
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

    _in_word_list(word){
        // Checks word in word list
        return this.wordlist.includes(word)
    }

    _toggle_select(index){
        // If index already selected, remove. Else, add.
        if(this._already_selected(index)) this._remove_selection(index)
        else this._add_selection(index)
    }

    _already_selected(index){
        // If grid index is already in the user's selection
        return this.user_selection.includes(index)
    }

    _add_selection(index){
        // Add grid index to user selection
        this.user_selection.push(index)
    }

    _remove_selection(index){
        // Remove grid index from user selection
        this.user_selection.splice(this.user_selection.indexOf(index))
    }
}

var wh = new WordHandler()
