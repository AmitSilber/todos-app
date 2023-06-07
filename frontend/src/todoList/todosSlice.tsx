import {
    TodoItem,
    TodoStatus,
} from '../utils';

import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit'

import { RootState, AppDispatch } from "../app/store";
import { v4 as uuid } from 'uuid';
import TodosServer from './todosServer';


export type AddNewTodoType = { title: string, date: string }
export type RemoveTodoType = { todoIdToRemove: string }
export type UpdateOrderType = { todoIdsOrder: string[] }
export type Response = { result: string }
type UpdatedAttributesType = { todoId: string, attributes: Partial<Omit<TodoItem, "id">> }
type LoadingStatusType =  'idle' | 'loading'

export type TodosState = {
    entries: {
        [id: string]: TodoItem
    },
    todoIdsInOrder: string[],
    loadingStatus:LoadingStatusType

}
type timelineState = {
    present: TodosState,
    past: TodosState[],
    future: TodosState[],
}

type ThunkApi = { getState: RootState, dispatch: AppDispatch, rejectValue: Response };

const initialPresentState: TodosState = { entries: {}, todoIdsInOrder: [], loadingStatus: 'idle' };
const initialTimelineState: timelineState = {
    present: initialPresentState,
    past: [],
    future: [],
   
}

export const loadTodos = createAsyncThunk<TodosState>('todosTimeline/fetchTodos', TodosServer.loadTodos);

export const createNewTodo = createAsyncThunk<
    Response,
    AddNewTodoType,
    ThunkApi>
    ('todosTimeline/createNewTodo', async ({ title, date }, thunkApi) => {
        const newTodo = {
            title,
            date,
            status: "pending" as TodoStatus,
            id: uuid(),
        } as TodoItem
        thunkApi.dispatch(addNewTodoToSlice(newTodo))
        try {
            return await TodosServer.createNewTodo(newTodo)
        } catch (error) {
            thunkApi.dispatch(removeTodoFromSlice({ todoIdToRemove: newTodo.id }))
            return thunkApi.rejectWithValue({ result: "Failed to connect to server" })
        }
    });

export const deleteTodo = createAsyncThunk<
    Response,
    RemoveTodoType,
    ThunkApi>
    ('todosTimeline/removeTodo', async ({ todoIdToRemove}, thunkApi) => {
        try {
            const response = await TodosServer.deleteTodo(todoIdToRemove)
            thunkApi.dispatch(removeTodoFromSlice({ todoIdToRemove }))
            return response;
        } catch (error) {
            return { result: "Failed to delete todo" }
        }
    });
export const updateTodo = createAsyncThunk<
    Response,
    { todoId: string },
    ThunkApi>
    ('todosTimeline/updateTodo', async ({ todoId }, thunkApi) => {
        const todoToUpdate = selectTodoById(thunkApi.getState() as RootState, todoId)
        try {
            return TodosServer.updateTodo(todoToUpdate)
        } catch (e) {
            const backupTodo = await TodosServer.loadTodoById(todoId);
            const { id, ...backupUpdateAttributes } = backupTodo
            thunkApi.dispatch(updateTodoInSlice({ todoId: id, attributes: backupUpdateAttributes }))
            return thunkApi.rejectWithValue({ result: `Failed to update todo with id ${todoId}` })
        }
    });

export const updateOrder = createAsyncThunk<
    Response,
    UpdateOrderType,
    ThunkApi>
    ('todosTimeline/updateOrder', async ({ todoIdsOrder }, thunkApi) => {
        try {
            return TodosServer.updateOrder(todoIdsOrder);
        } catch (e) {
            const backupTodosIdsInOrder = await TodosServer.loadTodoIdsInOrder();  
            thunkApi.dispatch(updateOrderInSlice(backupTodosIdsInOrder))
            return thunkApi.rejectWithValue({ result: `Failed to update todos order` })
        }
    });





const todosTimelineSlice = createSlice({
    name: 'todosTimeline',
    initialState: initialTimelineState,
    reducers: {
        addNewTodoToSlice(state, action: PayloadAction<TodoItem>) {
            const newTodo = action.payload;
            state.present.entries[newTodo.id] = newTodo;
            state.present.todoIdsInOrder.push(newTodo.id);
        },
        removeTodoFromSlice(state, action: PayloadAction<RemoveTodoType>) {
            const { todoIdToRemove: todoId } = action.payload;
            const todoIndex = state.present.todoIdsInOrder.findIndex(id => id === todoId);
            state.present.todoIdsInOrder.splice(todoIndex, 1);
            delete state.present.entries[todoId];
        },
        updateTodoInSlice(state, action: PayloadAction<UpdatedAttributesType>) {
            const { todoId, attributes } = action.payload;
            state.present.entries[todoId] = { ...state.present.entries[todoId], ...attributes };
        },
        updateOrderInSlice(state, action: PayloadAction<UpdateOrderType>) {
            const { todoIdsOrder } = action.payload;
            if (state.present.todoIdsInOrder.length === todoIdsOrder.length) {
                state.present.todoIdsInOrder = todoIdsOrder;
            }
        },
        undoTodos(state) {
            const present = state.present;
            state.future.unshift(present);
            const lastPastState = state.past.pop()
            if (lastPastState !== undefined) {
                state.present = lastPastState;
            }
        },
        redoTodos(state) {
            const present = state.present;
            state.past.push(present)
            const nextFutureState = state.future.shift();
            if (nextFutureState !== undefined) {
                state.present = nextFutureState;
            }
        },
        pushSnapshotToPast(state, action: PayloadAction<{ presentTodos: TodosState }>) {
            const { presentTodos } = action.payload;
            state.past.push(presentTodos)
        },
        resetFuture(state) {
            state.future = [];
        }

    },
    extraReducers: builder => {
        builder.addCase(loadTodos.pending, (state, action) => {
            state.present.loadingStatus = 'loading'
        })
            .addCase(loadTodos.fulfilled, (state, action) => {
                state.present = action.payload;
                state.present.loadingStatus = 'idle';
            })

            .addCase(createNewTodo.rejected, (state, action) => {
                if (action.payload !== undefined) {
                    alert(action.payload.result);
                }
            })
            .addCase(deleteTodo.rejected, (state, action) => {
                if (action.payload !== undefined) {
                    alert(action.payload.result)
                }
            })
            .addCase(updateTodo.fulfilled, (state, action) => {
                console.log(action.payload.result)
            })
            .addCase(updateTodo.rejected, (state, action) => {
                if (action.payload !== undefined) {
                    alert(action.payload.result)
                }
            })
            .addCase(updateOrder.fulfilled, (state,action)=>{
                console.log(action.payload.result)
            })
            .addCase(updateOrder.rejected, (state,action)=>{
                if (action.payload !== undefined) {
                    alert(action.payload.result)
                }
            })
    }
}
)



export const selectTodoIdsInorder = (state: RootState): string[] => state.todos.present.todoIdsInOrder;
export const selectTodos = (state: RootState): { [id: string]: TodoItem } => state.todos.present.entries;
export const selectTodoById = (state: RootState, id: string): TodoItem => state.todos.present.entries[id]
export const selectPast = (state: RootState): TodosState[] => state.todos.past
export const selectFuture = (state: RootState): TodosState[] => state.todos.future;
export const selectLoadingStatus = (state:RootState): LoadingStatusType => state.todos.present.loadingStatus






export const {
    addNewTodoToSlice,
    removeTodoFromSlice,
    updateTodoInSlice,
    updateOrderInSlice,
    pushSnapshotToPast,
    undoTodos,
    redoTodos,
    resetFuture,
} = todosTimelineSlice.actions;
export default todosTimelineSlice.reducer;
