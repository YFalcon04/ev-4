import React, { Fragment, useState, useRef, useEffect } from "react";
import TodoItem from "./TodoItem";
/* Importamos id para los productos, unico y aleatorio */
import uuid4 from "uuid4";
/* Importamos modal */
import Modal from "react-modal";
/* Para la paginacion */
import Pagination from "./Pagination";
/* Para personalizar */
import '../styles/style.css'; // Asegúrate de que la ruta es correcta


const ITEMS_PER_PAGE = 6; // Número de productos por página

/* Estilo modal */
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'cornsilk',
        color: 'black'
    },
};

Modal.setAppElement('#root'); // Configura el elemento principal de la aplicación para accesibilidad

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [productoToDelete, setproductoToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
    const [itemOffset, setItemOffset] = useState(0); //para la paginación
    /* para modal de edicion */
    const [productoToEdit, setProductoToEdit] = useState(null);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    

    const productoRef = useRef();
    const categoriaRef = useRef();
    const precioRef = useRef();

    const agregarProducto = () => {
        const producto = productoRef.current.value.trim();
        const categoria = categoriaRef.current.value.trim();
        const precio = precioRef.current.value.trim();
        //Validaciones, todos los campos obligatorios y campo precio no puede ser negativo
        if (!producto) {
            alert("El nombre es obligatorio")
            }
        
        if (!categoria) {
            alert("La categoria es obligatoria");
            return;
        }
        
        if (precio < 0) {
            alert("El precio debe ser un numero positivo");
            return;
        }
        if (!precio) {
            alert("El precio es obligatorio");
            return;
        }


        if (producto === '' || categoria === '' || precio === '') return;


        const nuevoProducto = {
            id: uuid4(),
            producto: producto,
            categoria: categoria,
            precio: parseFloat(precio),
            estado: false
        };

        setTodos((prevTodos) => [...prevTodos, nuevoProducto]);
        


        productoRef.current.value = '';
        categoriaRef.current.value = '';
        precioRef.current.value = '';
    };

    const cambiarEstadoTarea = (id) => {
        const newTodos = [...todos];
        const todo = newTodos.find((todo) => todo.id === id);
        todo.estado = !todo.estado;
        setTodos(newTodos);
    };

    const openModal = (producto) => {
        setproductoToDelete(producto);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const confirmDelete = () => {
        const productos = todos.filter((todo) => todo.id !== productoToDelete.id);
        setTodos(productos)
        closeModal();
    };


    const eliminarTareasCompletas = () => {
        const productos = todos.filter((todo) => !todo.estado);
        setTodos(productos);
    };

    const contarProductos = () => {
        return todos.filter((todo) => !todo.estado).length;
    };

    const ResumenProductos = () => {
        const cantidad = contarProductos()
        if (cantidad === 0) {
            return (
                <div className="alert alert-danger mt-3 text-center">
                    No tienes productos disponibles 😥😔
                </div>
            )
        }
        if (cantidad <=3) {
            return (
                <div className="alert alert-warning mt-3 text-center">
                    Tienes solamente {cantidad} productos!!! 🫨😣
                </div>
            )
        }
        return (
            <div className="alert alert-info mt-3 text-center">
                Te quedan {cantidad} productos 🤔👀
            </div>
        );
    };

    // Filtra los productos basado en el término de búsqueda
    const filteredTodos = todos.filter((todo) =>
        todo.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // PAGINACION
    const endOffset = itemOffset + ITEMS_PER_PAGE;
    const currentItems = filteredTodos.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(filteredTodos.length / ITEMS_PER_PAGE);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * ITEMS_PER_PAGE) % filteredTodos.length;
        setItemOffset(newOffset);
    };
    
    /* MODAL EDICION */

    const openEditModal = (producto) => {
        setProductoToEdit(producto);
        setEditModalIsOpen(true);
    };

    const closeEditModal = () => {
        setEditModalIsOpen(false);
        setProductoToEdit(null);
    };

    const editarProducto = (id, producto, categoria, precio) => {
        const updatedTodos = todos.map((todo) =>
            todo.id === id ? { ...todo, producto, categoria, precio: parseFloat(precio) } : todo
        );
        setTodos(updatedTodos);
        closeEditModal();
    };


    /* LocalStorage */
    const KEY = 'todos';
    useEffect(() => {
        const storedTodos = JSON.parse(localStorage.getItem(KEY));
        if (storedTodos) setTodos(storedTodos);
    }, []);

    useEffect(() => {
        localStorage.setItem(KEY, JSON.stringify(todos));
    }, [todos]);

    return (
        <Fragment>
            <div className="row">
            <div className="col-12 col-lg-12 col-md-12 col-sm-12">
            <h1 className="display-5 text-center">Catálogo de Productos</h1>
            </div>
            </div>
            <div className="title-container d-flex align-items-center">
                <img src="/gif.gif" alt="Descripción del GIF" className="gif-image ms-2" />
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="container ">
                <div className="input-group my-5">
                    <div className="mb-3 w-100">
                        <h5>Agregar nuevo producto al Catalogo:</h5>
                        <input
                            type="text"
                            className="form-control mb-2 w-100"
                            id="producto"
                            placeholder="Ingrese nombre del producto"
                            ref={productoRef}
                        />
                        <input
                            type="text"
                            className="form-control mb-2"
                            id="categoria"
                            placeholder="Ingrese la categoría del producto"
                            ref={categoriaRef}
                        />
                        <input
                            type="number"
                            className="form-control"
                            id="precio"
                            placeholder="Ingrese el precio del producto"
                            ref={precioRef}
                        />
                    </div>
                    <button className="btn btn-info w-100" type="button" onClick={agregarProducto}>
                        <i className="bi bi-clipboard-plus"></i>   Agregar Producto  
                    </button>
                </div>

                {/* Campo de búsqueda */}
                <div className="input-group m-3">
                    <h6>Ingrese el nombre del producto que desea buscar: </h6>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ingrese producto a buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="row">
                    {currentItems.map((todo) => (
                        <div className="col-12 col-lg-4 col-md-6 col-sm-12 mb-3" key={todo.id}>
                            <TodoItem todo={todo} cambiarEstado={cambiarEstadoTarea} openModal={openModal} openEditModal={openEditModal} />
                        </div>
                    ))}
                </div>


                <ResumenProductos />

                <Pagination
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                />
            
    
            </form>

            {/* Modal */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Confirm Delete Modal"
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-center">Confirmar Eliminación</h5>
                    </div>
                    <div className="modal-body">
                        <p>¿Está segurx de que desea eliminar el producto seleccionado? 🤨🤨🤨</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-danger ms-3" onClick={confirmDelete}>Eliminar ✖️</button>
                        <button className="btn btn-success ms-3" onClick={closeModal}>Cancelar 😅 </button>
                    </div>
                </div>

            </Modal>
            {/* Modal edicion */}
            <Modal
                isOpen={editModalIsOpen}
                onRequestClose={closeEditModal}
                style={customStyles}
                contentLabel="Edit Modal"
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-center">Editar Producto</h5>
                    </div>
                    <div className="modal-body">
                        {productoToEdit && (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                editarProducto(
                                    productoToEdit.id,
                                    productoRef.current.value,
                                    categoriaRef.current.value,
                                    precioRef.current.value
                                );
                            }}>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    defaultValue={productoToEdit.producto}
                                    ref={productoRef}
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    defaultValue={productoToEdit.categoria}
                                    ref={categoriaRef}
                                />
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    defaultValue={productoToEdit.precio}
                                    ref={precioRef}
                                />
                                <button className="btn btn-primary" type="submit">Guardar Cambios</button>
                                <button className="btn btn-secondary ms-2" type="button" onClick={closeEditModal}>Cancelar</button>
                            </form>
                        )}
                    </div>
                </div>
            </Modal>
            
        </Fragment>
    );
};

export default TodoList;
