
import { IsString, IsIn, IsInt } from "class-validator";
const todoStatusValues = ["pending", "completed"] as const;
const todoStringKeys = ["title", "date"] as const;
const todoStatusKey = ["status"] as const;
export type TodoStringKeyTypes = typeof todoStringKeys[number];
export type statusValues = typeof todoStatusValues[number];

export class TodoDto {
    @IsString()
    title: string;
    @IsString()
    date: string;
    @IsIn(todoStatusValues)
    status: statusValues;
    @IsString()
    id: string;

}

export type todosDto = {
    entries: {
        [id: string]: TodoDto
    },
    todoIdsInOrder: string[]
}

export type TodosOrderDto = String[];
export class LimitGet {
    limit: number;
}


export class UpdateTodoStringValueAttributeDto {
    @IsIn(todoStringKeys)
    key: TodoStringKeyTypes;
    @IsString()
    value: string;
}
export class UpdateTodoStatusAttributeDto {
    @IsIn(todoStatusKey)
    key: statusValues;
    @IsIn(todoStatusValues)
    value: statusValues

}


