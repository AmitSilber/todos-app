import { Response } from 'express';
import { AppService } from './app.service';
import { TodoDto, UpdateTodoStringValueAttributeDto, UpdateTodoStatusAttributeDto } from './dto/todoDTO';
export declare class AppController {
    private readonly appService;
    constructor(appService?: AppService);
    create(newTodoItem: TodoDto, res: Response): Promise<Response<any, Record<string, any>>>;
    findAll(res: Response): Promise<Response<any, Record<string, any>>>;
    findOne(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    updateTodoWithStringValue(id: string, updateTodoDto: UpdateTodoStringValueAttributeDto, res: Response): Promise<Response<any, Record<string, any>>>;
    updateTodoWithStatusValue(id: string, updateTodoDto: UpdateTodoStatusAttributeDto, res: Response): Promise<Response<any, Record<string, any>>>;
    updateTodosOrder(newIdsOrder: string[], res: Response): Promise<Response<any, Record<string, any>>>;
    remove(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    writeAndReturnErrorResponse(res: Response, message: string): Response<any, Record<string, any>>;
}
