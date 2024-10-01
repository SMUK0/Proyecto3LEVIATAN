import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../css/app.css';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'sweetalert2/dist/sweetalert2.min.css';

const App = () => {
    const [maestroCursos, setMaestroCursos] = useState([]);
    const [form, setForm] = useState({
        maestro_id: '',
        curso_id: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Obtener todos los registros de maestro-curso al cargar la página
    useEffect(() => {
        fetch('/api/maestro-cursos')
            .then(response => response.json())
            .then(data => setMaestroCursos(data))
            .catch(() => toast.error("Error al cargar maestro-cursos"));
    }, []);

    // Manejar cambios en los inputs del formulario
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Crear o actualizar un registro de maestro-curso
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/maestro-cursos/${form.maestro_id}/${form.curso_id}` : '/api/maestro-cursos';

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
                setMaestroCursos(maestroCursos.map(mc => mc.maestro_id === form.maestro_id && mc.curso_id === form.curso_id ? data : mc));
                toast.success("Maestro-Curso actualizado exitosamente");
            } else {
                setMaestroCursos([...maestroCursos, data]);
                toast.success("Maestro-Curso agregado exitosamente");
            }
            setShowModal(false);
            setForm({ maestro_id: '', curso_id: '' });
            setEditMode(false);
        })
        .catch(() => toast.error("Error al crear o actualizar el maestro-curso"))
        .finally(() => setLoading(false));
    };

    // Editar un maestro-curso
    const handleEdit = (maestroCurso) => {
        setForm({
            maestro_id: maestroCurso.maestro_id,
            curso_id: maestroCurso.curso_id
        });
        setEditMode(true);
        setShowModal(true);
    };

    // Eliminar un maestro-curso
    const handleDelete = (maestro_id, curso_id) => {
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
                fetch(`/api/maestro-cursos/${maestro_id}/${curso_id}`, { method: 'DELETE' })
                .then(() => {
                    setMaestroCursos(maestroCursos.filter(mc => mc.maestro_id !== maestro_id || mc.curso_id !== curso_id));
                    toast.success("Maestro-Curso eliminado exitosamente");
                    Swal.fire('Eliminado!', 'El maestro-curso ha sido eliminado.', 'success');
                })
                .catch(() => toast.error("Error al eliminar el maestro-curso"))
                .finally(() => setLoading(false));
            }
        });
    };

    // Cerrar el modal
    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ maestro_id: '', curso_id: '' });
        setEditMode(false);
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">CRUD Maestro Cursos</h1>

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
                    <i className="fas fa-plus"></i> Agregar Maestro-Curso
                </button>
            </div>

            {/* Tabla de maestro-cursos */}
            <table className="table table-striped table-hover">
                <thead className="table-success">
                    <tr>
                        <th>Maestro ID</th>
                        <th>Curso ID</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {maestroCursos.map(mc => (
                        <tr key={`${mc.maestro_id}-${mc.curso_id}`}>
                            <td>{mc.maestro_id}</td>
                            <td>{mc.curso_id}</td>
                            <td>
                                <button className="btn btn-warning me-2" onClick={() => handleEdit(mc)}>
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button className="btn btn-danger" onClick={() => handleDelete(mc.maestro_id, mc.curso_id)}>
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
                                <h5 className="modal-title">{editMode ? 'Editar Maestro-Curso' : 'Agregar Maestro-Curso'}</h5>
                                <button className="btn-close text-white" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Maestro ID</label>
                                        <input type="number" name="maestro_id" className="form-control" value={form.maestro_id} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Curso ID</label>
                                        <input type="number" name="curso_id" className="form-control" value={form.curso_id} onChange={handleChange} required />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                        {editMode ? 'Actualizar Maestro-Curso' : 'Agregar Maestro-Curso'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Notificaciones y alertas */}
            <ToastContainer />
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('crud-maestro-cursos')).render(<App />);
