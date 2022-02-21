class NotInWordListError extends Error{
    constructor(word){
        super(word + " is not in the word list")
        this.name = "NotInWordListError"
    }
}

class AdjacentSelectionError extends Error{
    constructor(){
        super("selected tiles must be adjacent")
        this.name = "AdjacentSelectionError"
    }
}

class GameOver extends Error{
    constructor(){
        super("game over")
        this.name = "GameOver"
    }
}
