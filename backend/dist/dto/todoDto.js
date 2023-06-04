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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTodoStatusAttributeDto = exports.UpdateTodoStringValueAttributeDto = exports.LimitGet = exports.TodoDto = void 0;
const class_validator_1 = require("class-validator");
const todoStatusValues = ["pending", "completed"];
const todoStringKeys = ["title", "date"];
const todoStatusKey = ["status"];
class TodoDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TodoDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TodoDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsIn)(todoStatusValues),
    __metadata("design:type", String)
], TodoDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TodoDto.prototype, "id", void 0);
exports.TodoDto = TodoDto;
class LimitGet {
}
exports.LimitGet = LimitGet;
class UpdateTodoStringValueAttributeDto {
}
__decorate([
    (0, class_validator_1.IsIn)(todoStringKeys),
    __metadata("design:type", String)
], UpdateTodoStringValueAttributeDto.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTodoStringValueAttributeDto.prototype, "value", void 0);
exports.UpdateTodoStringValueAttributeDto = UpdateTodoStringValueAttributeDto;
class UpdateTodoStatusAttributeDto {
}
__decorate([
    (0, class_validator_1.IsIn)(todoStatusKey),
    __metadata("design:type", String)
], UpdateTodoStatusAttributeDto.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsIn)(todoStatusValues),
    __metadata("design:type", String)
], UpdateTodoStatusAttributeDto.prototype, "value", void 0);
exports.UpdateTodoStatusAttributeDto = UpdateTodoStatusAttributeDto;
//# sourceMappingURL=todoDto.js.map