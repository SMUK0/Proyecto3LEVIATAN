import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';  // FontAwesome
import '../../css/app.css'; // CSS personalizado
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'sweetalert2/dist/sweetalert2.min.css';

const App = () => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [form, setForm] = useState({
        usuario_id: '',
        estudiante_id: '',
        mensaje: '',
        leido: false
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Obtener todas las notificaciones al cargar la página
    useEffect(() => {
        fetch('/api/notificaciones')
            .then(response => response.json())
            .then(data => setNotificaciones(data))
            .catch(() => toast.error("Error al cargar notificaciones"));
    }, []);

    // Manejar cambios en los inputs del formulario
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Crear o actualizar una notificación
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/notificaciones/${editId}` : '/api/notificaciones';

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
                setNotificaciones(notificaciones.map(notif => notif.notificacion_id === editId ? data : notif));
                toast.success("Notificación actualizada exitosamente");
            } else {
                setNotificaciones([...notificaciones, data]);
                toast.success("Notificación agregada exitosamente");
            }
            setShowModal(false);
            setForm({ usuario_id: '', estudiante_id: '', mensaje: '', leido: false });
            setEditMode(false);
        })
        .catch(() => toast.error("Error al crear o actualizar la notificación"))
        .finally(() => setLoading(false));
    };

    // Editar una notificación
    const handleEdit = (notificacion) => {
        setForm({
            usuario_id: notificacion.usuario_id,
            estudiante_id: notificacion.estudiante_id,
            mensaje: notificacion.mensaje,
            leido: notificacion.leido
        });
        setEditId(notificacion.notificacion_id);
        setEditMode(true);
        setShowModal(true);
    };

    // Eliminar una notificación
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
                fetch(`/api/notificaciones/${id}`, { method: 'DELETE' })
                .then(() => {
                    setNotificaciones(notificaciones.filter(notif => notif.notificacion_id !== id));
                    toast.success("Notificación eliminada exitosamente");
                    Swal.fire('Eliminado!', 'La notificación ha sido eliminada.', 'success');
                })
                .catch(() => toast.error("Error al eliminar la notificación"))
                .finally(() => setLoading(false));
            }
        });
    };

    // Cerrar el modal
    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ usuario_id: '', estudiante_id: '', mensaje: '', leido: false });
        setEditMode(false);
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">CRUD Notificaciones</h1>

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
                    <i className="fas fa-plus"></i> Agregar Notificación
                </button>
            </div>

            {/* Tabla de notificaciones */}
            <table className="table table-striped table-hover">
                <thead className="table-success">
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Estudiante</th>
                        <th>Mensaje</th>
                        <th>Leído</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {notificaciones.map(notif => (
                        <tr key={notif.notificacion_id}>
                            <td>{notif.notificacion_id}</td>
                            <td>{notif.usuario_id}</td>
                            <td>{notif.estudiante_id}</td>
                            <td>{notif.mensaje}</td>
                            <td>{notif.leido ? 'Sí' : 'No'}</td>
                            <td>
                                <button className="btn btn-warning me-2" onClick={() => handleEdit(notif)}>
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button className="btn btn-danger" onClick={() => handleDelete(notif.notificacion_id)}>
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
                                <h5 className="modal-title">{editMode ? 'Editar Notificación' : 'Agregar Notificación'}</h5>
                                <button className="btn-close text-white" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">ID Usuario</label>
                                        <input type="number" name="usuario_id" className="form-control" value={form.usuario_id} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">ID Estudiante</label>
                                        <input type="number" name="estudiante_id" className="form-control" value={form.estudiante_id} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Mensaje</label>
                                        <textarea name="mensaje" className="form-control" value={form.mensaje} onChange={handleChange} required></textarea>
                                    </div>
                                    <div className="mb-3 form-check">
                                        <input type="checkbox" className="form-check-input" name="leido" checked={form.leido} onChange={(e) => setForm({ ...form, leido: e.target.checked })} />
                                        <label className="form-check-label">Leído</label>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                        {editMode ? 'Actualizar Notificación' : 'Agregar Notificación'}
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

ReactDOM.createRoot(document.getElementById('crud-notificaciones')).render(<App />);
