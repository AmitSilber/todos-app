import { TodosState, UpdateOrderType, Response } from "../todosSlice";
import { TodoItem } from "../../utils";
import FetchError from "./FetchError";

export type ErrorContent =  { [key: string]: string | string[] };

export default class TodosServer {
    static baseUrl = `http://localhost:3000/todos`;
    static jsonHeader = {
        "Content-Type": "application/json",
    }

    static loadTodoById = async (todoId: string) => {
        const url = `${TodosServer.baseUrl}/${todoId}`
        const response = await fetch(url, {
            method: 'GET'
        })
        await TodosServer.throwErrorIfResponseFailed(response)
        return await response.json() as TodoItem;
    }

    static loadTodoIdsInOrder = async () => {
        const url = `${TodosServer.baseUrl}/order`
        const response = await fetch(url, {
            method: 'GET'
        })
        await TodosServer.throwErrorIfResponseFailed(response)
        return await response.json() as UpdateOrderType
    }

    static loadTodos = async () => {
        const url = TodosServer.baseUrl
        const response = await fetch(url, {
            method: 'GET'
        })
        await TodosServer.throwErrorIfResponseFailed(response)
        return await response.json() as TodosState;
    };
    static createNewTodo = async (newTodo: TodoItem) => {
        const url = TodosServer.baseUrl;
        const response = await fetch(url, {
            method: "POST",
            headers: TodosServer.jsonHeader,
            body: JSON.stringify(newTodo)
        })
        await TodosServer.throwErrorIfResponseFailed(response)
        return await response.json() as Response;
    }
    static deleteTodo = async (todoIdToRemove: string) => {
        const url = `${TodosServer.baseUrl}/${todoIdToRemove}`;
        console.log(url)
        const response = await fetch(url, {
            method: 'DELETE',
            headers: TodosServer.jsonHeader,
        })
        await TodosServer.throwErrorIfResponseFailed(response)
        return await response.json() as Response;
    }
    static updateTodo = async (todoToUpdate: TodoItem) => {
        const url = TodosServer.baseUrl
        const response = await fetch(url, {
            method: 'PUT',
            headers: TodosServer.jsonHeader,
            body: JSON.stringify(todoToUpdate)
        })
        await TodosServer.throwErrorIfResponseFailed(response)
        return await response.json() as Response;
    }

    static updateOrder = async (todoIdsOrder: string[]) => {
        const url = `${TodosServer.baseUrl}/reorder`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: TodosServer.jsonHeader,
            body: JSON.stringify(todoIdsOrder)
        })
        await TodosServer.throwErrorIfResponseFailed(response)
        return await response.json() as Response;
    }

    static async throwErrorIfResponseFailed(response: globalThis.Response) {
        if (!response.ok) {
            const errorBody = await response!.json() as ErrorContent;
            throw new FetchError(response.statusText,errorBody)
        }
    }
}