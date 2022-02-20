class NotInWordListError extends Error{
    constructor(word){
        super(word + " is not in the word list")
        this.name = "NotInWordListError"
    }
}

class IncongruousSelectionError extends Error{
    constructor(){
        super("selected tiles must be congruous with the last selection")
        this.name = "IncongruousSelectionError"
    }
}
