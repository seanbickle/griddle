class NotInWordListError extends Error{
    constructor(word){
        super("Word not in list: " + word)
        this.name = "NotInWordListError"
    }
}

class IncongruousSelectionError extends Error{
    constructor(){
        super("Selected tiles must be congruous with the last selection")
        this.name = "IncongruousSelectionError"
    }
}
