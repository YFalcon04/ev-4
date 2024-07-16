
import { Fragment } from "react";
import '../styles/TodoItemStyle.css';

const TodoItem = ({ todo, cambiarEstado, openModal, openEditModal }) => {
    const { id, producto, categoria, precio, estado } = todo

    const fnCambiarEstado = () => {
        cambiarEstado(id);
    }
    const handleOpenModal = (e) => {
        e.stopPropagation();
        openModal(todo);
    };

    return (
        <Fragment>
        <div className="card mb-3">
            <div className="card-body">
                <h4 className="card-title">{producto}</h4>
                <p className="card-text">Categoría: {categoria}</p>
                <p className="card-text">Precio: ${precio}</p>
                <p className="card-text">
                    Estado:
                    <input 
                        type="checkbox" 
                        className="form-check-input ms-3" 
                        checked={estado} 
                        onChange={() => cambiarEstado(id)}
                    />
                </p>

                    <button className="btn btn-warning me-2" onClick={(e) => { e.stopPropagation(); openEditModal(todo); }}>Editar <i class="bi bi-pencil-square"></i></button>

                    <button className="btn btn-danger" onClick={() => openModal(todo)}>Eliminar

                    <i class="bi bi-trash3"></i>
                    </button>
                
                
            </div>
        </div>
        </Fragment>
    );
};

export default TodoItem;
