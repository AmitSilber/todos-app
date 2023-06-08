import { TodoDto } from './dto/todoDto';
export declare class AppService {
    private connectionService;
    create(todo: TodoDto): Promise<any>;
    getNextTodoMaxOrder(): Promise<number>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    updateTodo(updatedTodo: TodoDto): Promise<any>;
    removeTodo(idToRemove: string): Promise<any>;
    reorderTodos(newIdsOrder: string[]): Promise<any>;
}
