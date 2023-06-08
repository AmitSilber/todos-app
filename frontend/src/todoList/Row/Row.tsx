import { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TitleCell } from './TitleCell';
import { updateTodoInSlice } from '../todosSlice'
import { DragHandlers, useToggle } from '../../utils';
import { selectTodoById, updateTodo } from '../todosSlice';
import { RootState, AppDispatch } from '../../app/store';


export default function Row({ todoId, onDragHandlers }:
    {
        todoId: string,
        onDragHandlers: DragHandlers
    })
    : ReactElement {
    const { value: isEditDateMode, toggle: toggleEditDateMode } = useToggle(false);
    const dispatch = useDispatch<AppDispatch>();
    const todo = useSelector((state: RootState) => selectTodoById(state, todoId))


    function editDateHandler(e: React.ChangeEvent<HTMLInputElement>) {
        dispatch(updateTodoInSlice({ todoId: todo.id, attributes: { date: e.target.value } }))

    }
    function editStatusHandler() {
        dispatch(updateTodoInSlice({ todoId: todo.id, attributes: { status: todo.status === "completed" ? "pending" : "completed" } }));
        dispatch(updateTodo({todoId:todo.id}))


    }
    function enterPressedHandler(e: React.KeyboardEvent<HTMLElement>) {
        if (e.key === 'Enter') {
            toggleEditDateMode()
            dispatch(updateTodo({ todoId: todo.id }))
        }
    }

    return (
        <tr key={todoId}
            draggable={true}
            onDragStart={onDragHandlers.start}
            onDragEnter={onDragHandlers.enter}
            onDragOver={onDragHandlers.over}>
            <TitleCell {...todo}
            />
            {isEditDateMode ?
                (<td><input type="date" className="todo-date" value={todo.date} onChange={editDateHandler}
                    onKeyDown={enterPressedHandler}
                    autoFocus /></td>) :
                (<td className='hover-cell' id='dateCell' onClick={() => {
                    toggleEditDateMode()
                }}>{todo.date}</td>)
            }
            <td className='hover-cell' id='statusCell' onClick={editStatusHandler}>{todo.status === "completed" ? '\u2713' : ''}</td>
        </tr>
    );
}








