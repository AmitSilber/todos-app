"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const todoDTO_1 = require("./dto/todoDTO");
const validation_pipe_1 = require("./validation.pipe");
let AppController = class AppController {
    constructor(appService = new app_service_1.AppService()) {
        this.appService = appService;
    }
    async create(newTodoItem, res) {
        try {
            await this.appService.create(newTodoItem);
            return res
                .status(common_1.HttpStatus.CREATED)
                .send({ result: 'created new todo successfully' });
        }
        catch (e) {
            return res
                .status(common_1.HttpStatus.BAD_REQUEST)
                .json({ result: 'Failed to create new Todo item' });
        }
    }
    async findAll(res) {
        try {
            const todos = (await this.appService.findAll()).rows;
            const todosJsonWithOrderedIds = {
                entries: todos.reduce((resultJson, todo) => {
                    resultJson[todo.id] = todo;
                    return resultJson;
                }, {}),
                todoIdsInOrder: todos.map((todo) => todo.id),
            };
            return res.status(common_1.HttpStatus.ACCEPTED).json(todosJsonWithOrderedIds);
        }
        catch (e) {
            return res
                .status(common_1.HttpStatus.BAD_REQUEST)
                .json({ result: 'Failed to create new Todo item' });
        }
    }
    async getTodosOrder(res) {
        try {
            const todos = (await this.appService.findAll()).rows;
            const todosOrder = { todoIdsOrder: todos.map((todo) => todo.id) };
            return res.status(common_1.HttpStatus.ACCEPTED).json(todosOrder);
        }
        catch (e) {
            return res
                .status(common_1.HttpStatus.BAD_REQUEST)
                .json({ result: 'Failed to retrive todos order' });
        }
    }
    async findOne(id, res) {
        try {
            const todosAffected = (await this.appService.findOne(id)).rows;
            if (todosAffected.length !== 1) {
                return res
                    .status(common_1.HttpStatus.BAD_REQUEST)
                    .json({ result: `Id ${id} created conflict - not unique` });
            }
            return res.status(common_1.HttpStatus.ACCEPTED).json(todosAffected[0]);
        }
        catch (e) {
            return res
                .status(common_1.HttpStatus.BAD_REQUEST)
                .json({ result: `Failed to find todo with id: ${id}` });
        }
    }
    async updateTodo(updateTodoDto, res) {
        try {
            const todosAffected = (await this.appService.updateTodo(updateTodoDto))
                .rows;
            if (todosAffected.length !== 1) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    result: `Id ${updateTodoDto.id} created conflict - not unique`,
                });
            }
            return res.status(common_1.HttpStatus.ACCEPTED).send({
                result: `updated todo with id ${updateTodoDto.id} successfully`,
            });
        }
        catch (e) {
            return res
                .status(common_1.HttpStatus.BAD_REQUEST)
                .json({ result: `Filed to update todo with id: ${updateTodoDto.id}` });
        }
    }
    async updateTodosOrder(newIdsOrder, res) {
        try {
            this.appService.reorderTodos(newIdsOrder);
            return res
                .status(common_1.HttpStatus.ACCEPTED)
                .send({ result: 'updated todos order successfully' });
        }
        catch (e) {
            return res
                .status(common_1.HttpStatus.BAD_REQUEST)
                .json({ result: `Filed to update todos Order` });
        }
    }
    async remove(id, res) {
        try {
            console.log('remove todo with id: ', id);
            const todosAffected = (await this.appService.removeTodo(id)).rows;
            if (todosAffected.length !== 1) {
                return res
                    .status(common_1.HttpStatus.BAD_REQUEST)
                    .json({ result: `Id ${id} created conflict - not unique` });
            }
            return res
                .status(common_1.HttpStatus.ACCEPTED)
                .send(`deleted todo with id ${id} successfully`);
        }
        catch (e) {
            return res
                .status(common_1.HttpStatus.BAD_REQUEST)
                .json({ result: `Filed to delete todo with id: ${id}` });
        }
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(new validation_pipe_1.TodoValidationPipe())),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [todoDTO_1.TodoDto, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('order'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getTodosOrder", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)(new validation_pipe_1.TodoValidationPipe())),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [todoDTO_1.TodoDto, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateTodo", null);
__decorate([
    (0, common_1.Put)('reorder'),
    __param(0, (0, common_1.Body)(new common_1.ParseArrayPipe({ items: String }))),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateTodosOrder", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "remove", null);
AppController = __decorate([
    (0, common_1.Controller)('todos'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map