import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
  BadRequestException,
  ParseArrayPipe,
  Res,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { TodoDto, todosDto } from './dto/todoDTO';
import { TodoValidationPipe } from './validation.pipe';

@Controller('todos')
export class AppController {
  constructor(private readonly appService: AppService = new AppService()) {}

  @Post()
  async create(
    @Body(new TodoValidationPipe()) newTodoItem: TodoDto,
    @Res() res: Response,
  ) {
    try {
      await this.appService.create(newTodoItem);
      return res
        .status(HttpStatus.CREATED)
        .send({ result: 'created new todo successfully' });
    } catch (e) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ result: 'Failed to create new Todo item' });
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
        todoIdsInOrder: todos.map((todo) => todo.id),
      };
      return res.status(HttpStatus.ACCEPTED).json(todosJsonWithOrderedIds);
    } catch (e) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ result: 'Failed to create new Todo item' });
    }
  }

  @Get('order')
  async getTodosOrder(@Res() res: Response) {
    try {
      const todos = (await this.appService.findAll()).rows as TodoDto[];
      const todosOrder = { todoIdsOrder: todos.map((todo) => todo.id) };
      return res.status(HttpStatus.ACCEPTED).json(todosOrder);
    } catch (e) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ result: 'Failed to retrive todos order' });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const todosAffected = (await this.appService.findOne(id)).rows;
      if (todosAffected.length !== 1) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ result: `Id ${id} created conflict - not unique` });
      }

      return res.status(HttpStatus.ACCEPTED).json(todosAffected[0] as TodoDto);
    } catch (e) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ result: `Failed to find todo with id: ${id}` });
    }
  }

  @Put()
  async updateTodo(
    @Body(new TodoValidationPipe())
    updateTodoDto: TodoDto,
    @Res() res: Response,
  ) {
    try {
      const todosAffected = (await this.appService.updateTodo(updateTodoDto))
        .rows;
      if (todosAffected.length !== 1) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          result: `Id ${updateTodoDto.id} created conflict - not unique`,
        });
      }
      return res.status(HttpStatus.ACCEPTED).send({
        result: `updated todo with id ${updateTodoDto.id} successfully`,
      });
    } catch (e) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ result: `Filed to update todo with id: ${updateTodoDto.id}` });
    }
  }

  @Put('reorder')
  async updateTodosOrder(
    @Body(new ParseArrayPipe({ items: String })) newIdsOrder: string[],
    @Res() res: Response,
  ) {
    try {
      this.appService.reorderTodos(newIdsOrder);
      return res
        .status(HttpStatus.ACCEPTED)
        .send({ result: 'updated todos order successfully' });
    } catch (e) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ result: `Filed to update todos Order` });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      console.log('remove todo with id: ', id);
      const todosAffected = (await this.appService.removeTodo(id)).rows;
      if (todosAffected.length !== 1) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ result: `Id ${id} created conflict - not unique` });
      }
      return res
        .status(HttpStatus.ACCEPTED)
        .send(`deleted todo with id ${id} successfully`);
    } catch (e) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ result: `Filed to delete todo with id: ${id}` });
    }
  }
}
