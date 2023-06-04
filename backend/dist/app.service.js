"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const app_connectionService_1 = require("./app.connectionService");
let AppService = class AppService {
    constructor() {
        this.connectionService = new app_connectionService_1.ConnectionService();
    }
    async create(todo) {
        const newTodoOrder = await this.getNextTodoMaxOrder();
        const insertTodoQuery = `
    INSERT INTO "todosTable" (id,title,date,status,todosorder)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *;`;
        const todoValues = [todo.id, todo.title, todo.date, todo.status, newTodoOrder];
        return this.connectionService.query(insertTodoQuery, todoValues);
    }
    async getNextTodoMaxOrder() {
        const maxOrderQuery = `SELECT todosorder FROM "todosTable" ORDER BY todosorder DESC LIMIT 1`;
        const maxOrder = (await this.connectionService.query(maxOrderQuery)).rows[0]["todosorder"];
        return maxOrder + 1;
    }
    async findAll() {
        const selectAllQuery = `SELECT * FROM "todosTable" ORDER BY todosorder ASC LIMIT 100;`;
        return this.connectionService.query(selectAllQuery);
    }
    async findOne(id) {
        const selectTodoQuery = `SELECT * FROM "todosTable" WHERE id='${id}';`;
        return this.connectionService.query(selectTodoQuery);
    }
    async updateTodo(id, updatedAttribute) {
        const updateTodoQuery = `UPDATE "todosTable" SET ${updatedAttribute.key}='${updatedAttribute.value}' WHERE id='${id}' RETURNING *;`;
        return this.connectionService.query(updateTodoQuery);
    }
    async removeTodo(idToRemove) {
        const removeQuery = `DELETE FROM "todosTable" WHERE id='${idToRemove}' RETURNING *`;
        return this.connectionService.query(removeQuery);
    }
    async reorderTodos(newIdsOrder) {
        const client = await this.connectionService.getPoolConnection();
        try {
            await client.query('BEGIN');
            await Promise.all(newIdsOrder.map(async (todoId, index) => {
                const updateOrderQuery = `UPDATE "todosTable" SET todosorder=${index} WHERE id='${todoId}'`;
                await client.query(updateOrderQuery);
            }));
            await client.query('COMMIT');
        }
        catch (e) {
            await client.query('ROLLBACK');
            throw e;
        }
        finally {
            client.release();
        }
    }
};
AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map