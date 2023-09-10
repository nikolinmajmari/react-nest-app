export class HttpError extends Error{
    constructor(message:string|undefined){
        super(message);
    }
}