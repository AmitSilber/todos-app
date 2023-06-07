declare const todoStatusValues: readonly ["pending", "completed"];
declare const todoStringKeys: readonly ["title", "date"];
export type TodoStringKeyTypes = (typeof todoStringKeys)[number];
export type statusValues = (typeof todoStatusValues)[number];
export declare class TodoDto {
    title: string;
    date: string;
    status: statusValues;
    id: string;
}
export type todosDto = {
    entries: {
        [id: string]: TodoDto;
    };
    todoIdsInOrder: string[];
};
export type TodosOrderDto = string[];
export declare class LimitGet {
    limit: number;
}
export {};
