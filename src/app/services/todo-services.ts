import CommonService from './common-service';
import { _Object } from '../utils/interface';
import { generateQueryParams } from '../utils/service';


class TodoService extends CommonService {
  async getTodos(params: _Object | string) {
    return await this.get(`todos?${generateQueryParams(params)}`)
  }
  async getTodo(id: string) {
    return await this.get(`todos/${id}`)
  }
  async createTodo(parmas: { [key: string]: boolean | string | null }) {
    return await this.post('todos/add', parmas)
  }
  async updateTodo(id: string, params: { [key: string]: boolean | string }) {
    return await this.put(`todos/${id}`, params)
  }
  async deleteTodo(id: string) {
    return await this.delete(`todos/${id}`)
  }
}
export const todoService = new TodoService();
