import { TodosState, UpdateOrderType, Response } from "./todosSlice";
import { TodoItem } from "../utils";

export default class TodosServer {
    static baseUrl = `http://localhost:3000/todos`;
    static jsonHeader = {
        "Content-Type": "application/json",
    }

    static loadTodoById = async (todoId: string) => {
        const response = await fetch(`${TodosServer.baseUrl}/${todoId}`, {
            method: 'GET'
        })
        return await response.json() as TodoItem;
    }

    static loadTodoIdsInOrder = async () => {
        const response = await fetch(`${TodosServer.baseUrl}/order`, {
            method: 'GET'
        })
        return await response.json() as UpdateOrderType
    }

    static loadTodos = async () => {
        const response = await fetch(TodosServer.baseUrl, {
            method: 'GET'
        })
        return await response.json() as TodosState;
    };
    static createNewTodo = async (newTodo: TodoItem) => {
        const response = await fetch(TodosServer.baseUrl, {
            method: "POST",
            headers: TodosServer.jsonHeader,
            body: JSON.stringify(newTodo)
        })

        return await response.json() as Response;
    }
    static deleteTodo = async (todoIdToRemove: string) => {
        const response = await fetch(`${TodosServer.baseUrl}/${todoIdToRemove}`, {
            method: 'DELETE',
            headers: TodosServer.jsonHeader,
        })
        return await response.json() as Response;
    }
    static updateTodo = async (todoToUpdate: TodoItem) => {
        const response = await fetch(TodosServer.baseUrl, {
            method: 'PUT',
            headers: TodosServer.jsonHeader,
            body: JSON.stringify(todoToUpdate)
        })
        return await response.json() as Response;
    }

    static updateOrder = async (todoIdsOrder: string[]) => {
        const response = await fetch(`${TodosServer.baseUrl}/reorder`, {
            method: 'PUT',
            headers: TodosServer.jsonHeader,
            body: JSON.stringify(todoIdsOrder)
        })
        return await response.json() as Response;
    }
}