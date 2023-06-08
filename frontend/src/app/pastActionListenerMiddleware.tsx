

import { pushSnapshotToPast, resetFuture } from '../todoList/todosSlice';
import { RootState } from './store';


const historyChangesActions = [
  "todosTimeline/addNewTodoToSlice",
  "todosTimeline/removeTodoFromSlice",
  "todosTimeline/updateTodoInSlice",
  "todosTimeline/updateOrderInSlice",
]

export const pastActionListenerMiddleware = (storeAPI: any) => (next: any) => (action: any) => {
  const actionType: string = action.type;
  if (historyChangesActions.includes(actionType)) {
    const state = storeAPI.getState() as RootState;
    const presentTodos = state.todos.present;
    storeAPI.dispatch(pushSnapshotToPast({ presentTodos }))
    storeAPI.dispatch(resetFuture())

  }

  return next(action)
}
