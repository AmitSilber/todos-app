import { Injectable } from '@nestjs/common';
import { TodoDto, UpdateTodoStringValueAttributeDto, UpdateTodoStatusAttributeDto, } from './dto/todoDto';
import { ConnectionService } from './app.connectionService';


@Injectable()
export class AppService {
  private connectionService = new ConnectionService()

  async create(todo: TodoDto): Promise<any> {

    const newTodoOrder = await this.getNextTodoMaxOrder()
    const insertTodoQuery = `
    INSERT INTO "todosTable" (id,title,date,status,todosorder)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *;`
    const todoValues = [todo.id, todo.title, todo.date, todo.status, newTodoOrder]
    return this.connectionService.query(insertTodoQuery, todoValues)
  }

  async getNextTodoMaxOrder(): Promise<number> {
    const maxOrderQuery = `SELECT todosorder FROM "todosTable" ORDER BY todosorder DESC LIMIT 1`
    const maxOrder = (await this.connectionService.query(maxOrderQuery)).rows[0]["todosorder"] as number;
    return maxOrder + 1;
  }

  async findAll(): Promise<any> {
    const selectAllQuery = `SELECT * FROM "todosTable" ORDER BY todosorder ASC LIMIT 100;`
    return this.connectionService.query(selectAllQuery);
  }

  async findOne(id: string): Promise<any> {
    const selectTodoQuery = `SELECT * FROM "todosTable" WHERE id='${id}';`
    return this.connectionService.query(selectTodoQuery)
  }
  async updateTodo(id: string, updatedAttribute: UpdateTodoStringValueAttributeDto | UpdateTodoStatusAttributeDto): Promise<any> {
    const updateTodoQuery = `UPDATE "todosTable" SET ${updatedAttribute.key}='${updatedAttribute.value}' WHERE id='${id}' RETURNING *;`
    return this.connectionService.query(updateTodoQuery)
  }
  async removeTodo(idToRemove: string): Promise<any> {
    const removeQuery = `DELETE FROM "todosTable" WHERE id='${idToRemove}' RETURNING *`
    return this.connectionService.query(removeQuery);
  }


  async reorderTodos(newIdsOrder: string[]): Promise<void> {
    const client = await this.connectionService.getPoolConnection();
    try {
      await client.query('BEGIN')
      await Promise.all(newIdsOrder.map(async (todoId, index) => {
        const updateOrderQuery = `UPDATE "todosTable" SET todosorder=${index} WHERE id='${todoId}'`
        await client.query(updateOrderQuery)
      }))
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  }
}
