class NotInWordListError extends Error{
    constructor(word){
        super("Word not in list: " + word)
        this.name = "NotInWordListError"
    }
}
