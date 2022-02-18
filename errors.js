class NotInWordListError extends Error{
    constructor(message){
        super("Word not in list!")
        this.name = "NotInWordListError"
    }
}
