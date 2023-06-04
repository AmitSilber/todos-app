import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe, BadRequestException, ParseArrayPipe, Res, HttpStatus, HttpCode } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { TodoDto, todosDto, UpdateTodoStringValueAttributeDto, UpdateTodoStatusAttributeDto } from './dto/todoDTO';
import { TodoValidationPipe } from './validation.pipe';

@Controller('todos')
export class AppController {
  constructor(private readonly appService: AppService = new AppService()) { }

  @Post()
  async create(@Body(new TodoValidationPipe()) newTodoItem: TodoDto, @Res() res: Response
  ) {
    try {
      await this.appService.create(newTodoItem)
      return res.status(HttpStatus.CREATED).send('created new todo successfully')
    } catch (e) {
      return this.writeAndReturnErrorResponse(res.status(HttpStatus.BAD_REQUEST), 'Failed to create new Todo item');
    }
  }


  @Get()
  async findAll(@Res() res: Response) {
    try {
      const todos = (await this.appService.findAll()).rows as TodoDto[];
      const todosJsonWithOrderedIds = {
        entries: todos.reduce((resultJson, todo) => {
          resultJson[todo.id] = todo;
          return resultJson;
        }, {}),
        todoIdsInOrder: todos.map(todo => todo.id)
      }
      return res.status(HttpStatus.ACCEPTED).json(todosJsonWithOrderedIds)
    } catch (e) {
      return this.writeAndReturnErrorResponse(res.status(HttpStatus.BAD_REQUEST), 'Failed to create new Todo item');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const todosAffected = (await this.appService.findOne(id)).rows;
      if (todosAffected.length !== 1) {
        return this.writeAndReturnErrorResponse(res.status(HttpStatus.BAD_REQUEST), `Id ${id} created conflict - not unique`)
      }
      return res.status(HttpStatus.ACCEPTED).json(todosAffected[0] as TodoDto);
    } catch (e) {
      return this.writeAndReturnErrorResponse(res.status(HttpStatus.BAD_REQUEST), `Failed to find todo with id: ${id}`)
    }
  }

  @Put('stringAttributes/:id')
  async updateTodoWithStringValue(@Param('id') id: string, @Body(new TodoValidationPipe()) updateTodoDto: UpdateTodoStringValueAttributeDto, @Res() res: Response) {
    try {
      const todosAffected = (await this.appService.updateTodo(id, updateTodoDto)).rows
      if (todosAffected.length !== 1) {
        return this.writeAndReturnErrorResponse(res.status(HttpStatus.BAD_REQUEST), `Id ${id} created conflict - not unique`)
      }
      return res.status(HttpStatus.ACCEPTED).send(`updated ${updateTodoDto.key} attribute of todo with id ${id} successfully`)
    } catch (e) {
      return this.writeAndReturnErrorResponse(res.status(HttpStatus.BAD_REQUEST), `Filed to update todo with id: ${id}`)
    }
  }
  @Put('statusAttributes/:id')
  async updateTodoWithStatusValue(@Param('id') id: string, @Body(new TodoValidationPipe()) updateTodoDto: UpdateTodoStatusAttributeDto, @Res() res: Response) {
    try {
      const todosAffected = (await this.appService.updateTodo(id, updateTodoDto)).rows;
      if (todosAffected.length !== 1) {
        return this.writeAndReturnErrorResponse(res.status(HttpStatus.BAD_REQUEST), `Id ${id} created conflict - not unique`)
      }
      return res.status(HttpStatus.ACCEPTED).send(`updated status attribute of todo with id ${id} successfully`)
    } catch (e) {
      return this.writeAndReturnErrorResponse(res.status(HttpStatus.BAD_REQUEST), `Filed to update todo with id: ${id}`)
    }
  }

  @Put('reorder')
  async updateTodosOrder(@Body(new ParseArrayPipe({ items: String })) newIdsOrder: string[], @Res() res: Response) {
    try {
      this.appService.reorderTodos(newIdsOrder)
      return res.status(HttpStatus.ACCEPTED).send('updated todos order successfully');
    } catch (e) {
      return this.writeAndReturnErrorResponse(res.status(HttpStatus.BAD_REQUEST), `Filed to update todos Order`)
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const todosAffected = (await this.appService.removeTodo(id)).rows;
      if (todosAffected.length !== 1) {
        return this.writeAndReturnErrorResponse(res.status(HttpStatus.BAD_REQUEST), `Id ${id} created conflict - not unique`);
      }
      return res.status(HttpStatus.ACCEPTED).send(`deleted todo with id ${id} successfully`);
    } catch (e) {
      return this.writeAndReturnErrorResponse(res.status(HttpStatus.BAD_REQUEST), `Filed to delete todo with id: ${id}`)
    }
  }

  writeAndReturnErrorResponse(res: Response, message: string) {
    return res.json({
      message: message
    })
  }

}
