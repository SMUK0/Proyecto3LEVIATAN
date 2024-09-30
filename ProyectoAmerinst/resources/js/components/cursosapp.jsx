import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';  // Importar FontAwesome
import '../../css/app.css';  // Importar tu archivo CSS
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos de Toastify
import 'sweetalert2/dist/sweetalert2.min.css';  // Importar estilos de SweetAlert2

const App = () => {
    const [cursos, setCursos] = useState([]);
    const [form, setForm] = useState({
        nombre: '',
        grado: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Obtener todos los cursos al cargar la página
    useEffect(() => {
        fetch('/api/cursos')
            .then(response => response.json())
            .then(data => setCursos(data))
            .catch(() => toast.error("Error al cargar cursos"));
    }, []);

    // Manejar cambios en los inputs del formulario
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Crear o actualizar un curso
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/cursos/${editId}` : '/api/cursos';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form)
        })
        .then(response => response.json())
        .then(data => {
            if (editMode) {
                setCursos(cursos.map(curso => curso.curso_id === editId ? data : curso));
                toast.success("Curso actualizado exitosamente");
            } else {
                setCursos([...cursos, data]);
                toast.success("Curso agregado exitosamente");
            }
            setShowModal(false);
            setForm({ nombre: '', grado: '' });
            setEditMode(false);
        })
        .catch(() => {
            toast.error("Error al crear o actualizar el curso");
        })
        .finally(() => setLoading(false));
    };

    // Editar un curso
    const handleEdit = (curso) => {
        setForm({
            nombre: curso.nombre,
            grado: curso.grado
        });
        setEditId(curso.curso_id);
        setEditMode(true);
        setShowModal(true);
    };

    // Eliminar un curso con SweetAlert2
    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                fetch(`/api/cursos/${id}`, { method: 'DELETE' })
                .then(() => {
                    setCursos(cursos.filter(curso => curso.curso_id !== id));
                    toast.success("Curso eliminado exitosamente");
                    Swal.fire('Eliminado!', 'El curso ha sido eliminado.', 'success');
                })
                .catch(() => {
                    toast.error("Error al eliminar curso");
                })
                .finally(() => setLoading(false));
            }
        });
    };

    // Cerrar el modal
    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ nombre: '', grado: '' });
        setEditMode(false);
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">CRUD Cursos</h1>

            {/* Spinner de carga */}
            {loading && (
                <div className="d-flex justify-content-center mb-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Cargando...</span>
                    </div>
                </div>
            )}

            {/* Botón para abrir el modal de agregar */}
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-success" onClick={() => setShowModal(true)}>
                    <i className="fas fa-plus"></i> Agregar Curso
                </button>
            </div>

            {/* Tabla de cursos */}
            <table className="table table-striped table-hover">
                <thead className="table-success">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Grado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {cursos.map(curso => (
                        <tr key={curso.curso_id}>
                            <td>{curso.curso_id}</td>
                            <td>{curso.nombre}</td>
                            <td>{curso.grado}</td>
                            <td>
                                <button className="btn btn-warning me-2" onClick={() => handleEdit(curso)}>
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button className="btn btn-danger" onClick={() => handleDelete(curso.curso_id)}>
                                    <i className="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal de agregar/editar */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">{editMode ? 'Editar Curso' : 'Agregar Curso'}</h5>
                                <button className="btn-close text-white" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input type="text" name="nombre" className="form-control" value={form.nombre} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Grado</label>
                                        <input type="text" name="grado" className="form-control" value={form.grado} onChange={handleChange} required />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                        {editMode ? 'Actualizar Curso' : 'Agregar Curso'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Contenedor de notificaciones */}
            <ToastContainer />
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('crud-curso')).render(<App />);
