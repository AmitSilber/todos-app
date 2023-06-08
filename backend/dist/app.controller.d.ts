import { Response } from 'express';
import { AppService } from './app.service';
import { TodoDto } from './dto/todoDTO';
export declare class AppController {
    private readonly appService;
    constructor(appService?: AppService);
    create(newTodoItem: TodoDto, res: Response): Promise<Response<any, Record<string, any>>>;
    findAll(res: Response): Promise<unknown>;
    getTodosOrder(res: Response): Promise<Response<any, Record<string, any>>>;
    findOne(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    updateTodo(updateTodoDto: TodoDto, res: Response): Promise<Response<any, Record<string, any>>>;
    updateTodosOrder(newIdsOrder: string[], res: Response): Promise<Response<any, Record<string, any>>>;
    remove(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
