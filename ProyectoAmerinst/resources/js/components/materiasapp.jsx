import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // FontAwesome
import '../../css/app.css'; // Archivo CSS personalizado
import Swal from 'sweetalert2'; // SweetAlert2
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'sweetalert2/dist/sweetalert2.min.css'; // SweetAlert2 styles

const App = () => {
    const [materias, setMaterias] = useState([]);
    const [form, setForm] = useState({
        nombre: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Obtener todas las materias al cargar la página
    useEffect(() => {
        fetch('/api/materias')
            .then(response => response.json())
            .then(data => setMaterias(data))
            .catch(() => toast.error("Error al cargar materias"));
    }, []);

    // Manejar cambios en los inputs del formulario
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Crear o actualizar una materia
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/materias/${editId}` : '/api/materias';

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
                setMaterias(materias.map(materia => materia.materia_id === editId ? data : materia));
                toast.success("Materia actualizada exitosamente");
            } else {
                setMaterias([...materias, data]);
                toast.success("Materia agregada exitosamente");
            }
            setShowModal(false);
            setForm({ nombre: '' });
            setEditMode(false);
        })
        .catch(() => {
            toast.error("Error al crear o actualizar la materia");
        })
        .finally(() => setLoading(false));
    };

    // Editar una materia
    const handleEdit = (materia) => {
        setForm({
            nombre: materia.nombre
        });
        setEditId(materia.materia_id);
        setEditMode(true);
        setShowModal(true);
    };

    // Eliminar una materia con SweetAlert2
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
                fetch(`/api/materias/${id}`, { method: 'DELETE' })
                .then(() => {
                    setMaterias(materias.filter(materia => materia.materia_id !== id));
                    toast.success("Materia eliminada exitosamente");
                    Swal.fire('Eliminado!', 'La materia ha sido eliminada.', 'success');
                })
                .catch(() => {
                    toast.error("Error al eliminar la materia");
                })
                .finally(() => setLoading(false));
            }
        });
    };

    // Cerrar el modal
    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ nombre: '' });
        setEditMode(false);
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">CRUD Materias</h1>

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
                    <i className="fas fa-plus"></i> Agregar Materia
                </button>
            </div>

            {/* Tabla de materias */}
            <table className="table table-striped table-hover">
                <thead className="table-success">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {materias.map(materia => (
                        <tr key={materia.materia_id}>
                            <td>{materia.materia_id}</td>
                            <td>{materia.nombre}</td>
                            <td>
                                <button className="btn btn-warning me-2" onClick={() => handleEdit(materia)}>
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button className="btn btn-danger" onClick={() => handleDelete(materia.materia_id)}>
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
                                <h5 className="modal-title">{editMode ? 'Editar Materia' : 'Agregar Materia'}</h5>
                                <button className="btn-close text-white" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input type="text" name="nombre" className="form-control" value={form.nombre} onChange={handleChange} required />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                        {editMode ? 'Actualizar Materia' : 'Agregar Materia'}
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

ReactDOM.createRoot(document.getElementById('crud-materia')).render(<App />);
