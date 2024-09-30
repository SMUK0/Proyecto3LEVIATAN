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
    const [estudiantes, setEstudiantes] = useState([]);
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        grado: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Obtener todos los estudiantes al cargar la página
    useEffect(() => {
        fetch('/api/estudiantes')
            .then(response => response.json())
            .then(data => setEstudiantes(data))
            .catch((error) => {
                console.error("Error al cargar estudiantes:", error);
                toast.error("Error al cargar estudiantes");
            });
    }, []);

    // Manejar cambios en los inputs del formulario
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Crear o actualizar un estudiante
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/estudiantes/${editId}` : '/api/estudiantes';

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
                setEstudiantes(estudiantes.map(est => est.estudiante_id === editId ? data : est));
                toast.success("Estudiante actualizado exitosamente");
            } else {
                setEstudiantes([...estudiantes, data]);
                toast.success("Estudiante agregado exitosamente");
            }
            setShowModal(false);
            setForm({ nombre: '', apellido: '', fecha_nacimiento: '', grado: '' });
            setEditMode(false);
        })
        .catch((error) => {
            console.error("Error al crear o actualizar el estudiante:", error);
            toast.error("Error al crear o actualizar el estudiante");
        })
        .finally(() => setLoading(false));
    };

    // Editar un estudiante
    const handleEdit = (estudiante) => {
        setForm({
            nombre: estudiante.nombre,
            apellido: estudiante.apellido,
            fecha_nacimiento: estudiante.fecha_nacimiento,
            grado: estudiante.grado
        });
        setEditId(estudiante.estudiante_id);
        setEditMode(true);
        setShowModal(true);
    };

    // Eliminar un estudiante con SweetAlert2
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
                fetch(`/api/estudiantes/${id}`, { method: 'DELETE' })
                .then(() => {
                    setEstudiantes(estudiantes.filter(est => est.estudiante_id !== id));
                    toast.success("Estudiante eliminado exitosamente");
                    Swal.fire('Eliminado!', 'El estudiante ha sido eliminado.', 'success');
                })
                .catch((error) => {
                    console.error("Error al eliminar estudiante:", error);
                    toast.error("Error al eliminar estudiante");
                })
                .finally(() => setLoading(false));
            }
        });
    };

    // Cerrar el modal
    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ nombre: '', apellido: '', fecha_nacimiento: '', grado: '' });
        setEditMode(false);
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">CRUD Estudiantes</h1>

            {/* Animación de Cargando */}
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
                    <i className="fas fa-plus"></i> Agregar Estudiante
                </button>
            </div>

            {/* Tabla de estudiantes */}
            <table className="table table-striped table-hover">
                <thead className="table-success">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Fecha Nacimiento</th>
                        <th>Grado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {estudiantes.map(est => (
                        <tr key={est.estudiante_id}>
                            <td>{est.estudiante_id}</td>
                            <td>{est.nombre}</td>
                            <td>{est.apellido}</td>
                            <td>{est.fecha_nacimiento}</td>
                            <td>{est.grado}</td>
                            <td>
                                <button className="btn btn-warning me-2" onClick={() => handleEdit(est)}>
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button className="btn btn-danger" onClick={() => handleDelete(est.estudiante_id)}>
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
                                <h5 className="modal-title">{editMode ? 'Editar Estudiante' : 'Agregar Estudiante'}</h5>
                                <button className="btn-close text-white" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input type="text" name="nombre" className="form-control" value={form.nombre} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Apellido</label>
                                        <input type="text" name="apellido" className="form-control" value={form.apellido} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Fecha Nacimiento</label>
                                        <input type="date" name="fecha_nacimiento" className="form-control" value={form.fecha_nacimiento} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Grado</label>
                                        <input type="text" name="grado" className="form-control" value={form.grado} onChange={handleChange} required />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                        {editMode ? 'Actualizar Estudiante' : 'Agregar Estudiante'}
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

ReactDOM.createRoot(document.getElementById('crud-estudiante')).render(<App />);
