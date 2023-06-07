import { useDispatch } from 'react-redux';
import { updateTodoInSlice, deleteTodo, updateTodo } from '../todosSlice';
import { TodoItem, useToggle } from '../../utils';
import { AppDispatch } from '../../app/store';


const deleteIcon = "\u00D7";


export function TitleCell(todo: TodoItem) {
    const { value: editTitleMode, toggle: toggleEditTitleMode } = useToggle(false);
    const dispatch = useDispatch<AppDispatch>();


    function editTitleHandler(e: React.ChangeEvent<HTMLInputElement>) {
        dispatch(updateTodoInSlice({ todoId: todo.id, attributes: { title: e.target.value } }))
    }
    function enterPressedHandler(e: React.KeyboardEvent<HTMLElement>) {
        if (e.key === 'Enter') {
            toggleEditTitleMode()
            dispatch(updateTodo({ todoId: todo.id }))
            dispatch(updateTodo({ todoId: todo.id }))

        }
    }
    function doubleClickHandler(e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) {
        if (e.detail === 2) {
            toggleEditTitleMode()
        }
    }

    return (<td><div className={"title-cell"}>
        <span className='hover-cell' onClick={() => {
            dispatch(deleteTodo({ todoIdToRemove: todo.id }))
        }}>
            {deleteIcon}
        </span>
        {editTitleMode ?
            (<input type="text" className="edit-title" value={todo.title} onChange={editTitleHandler}
                onKeyDown={enterPressedHandler}
                autoFocus />) :
            (<p onClick={e => doubleClickHandler(e)}>
                {todo.title}
            </p>)}
    </div>
    </td>

    )
}