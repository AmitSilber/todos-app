import { ErrorContent } from "./todosServer";

export default class FetchError extends Error {
    constructor(message:string,errotDetails:ErrorContent){
        const details = Object.entries(errotDetails).map(([key,value])=>`${key}= ${value}`).join('\n')
        super(`message: ${message} \n ${details}`);

    }

}