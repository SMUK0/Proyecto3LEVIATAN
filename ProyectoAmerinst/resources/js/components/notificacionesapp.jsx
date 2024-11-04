import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

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

    useEffect(() => {
        setLoading(true);
        fetch('/api/notificaciones')
            .then(response => response.json())
            .then(data => setNotificaciones(data))
            .catch(() => toast.error("Error al cargar notificaciones"))
            .finally(() => setLoading(false));
    }, []);

    const getCsrfToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]');
        return token ? token.getAttribute('content') : '';
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/notificaciones/${editId}` : '/api/notificaciones';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    ...form,
                    usuario_id: parseInt(form.usuario_id, 10),
                    estudiante_id: parseInt(form.estudiante_id, 10),
                }),
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message || 'Error en la solicitud al servidor');
            }

            if (editMode) {
                setNotificaciones(notificaciones.map(notif => notif.notificacion_id === editId ? responseData : notif));
                toast.success("Notificación actualizada exitosamente");
            } else {
                setNotificaciones([...notificaciones, responseData]);
                toast.success("Notificación agregada exitosamente");
            }
            handleCloseModal();
        } catch (error) {
            toast.error(`Error al crear o actualizar la notificación: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (notificacion) => {
        setForm({
            usuario_id: String(notificacion.usuario_id),
            estudiante_id: String(notificacion.estudiante_id),
            mensaje: notificacion.mensaje,
            leido: notificacion.leido
        });
        setEditId(notificacion.notificacion_id);
        setEditMode(true);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                fetch(`/api/notificaciones/${id}`, { method: 'DELETE', headers: { 'X-CSRF-TOKEN': getCsrfToken() } })
                    .then(() => {
                        setNotificaciones(notificaciones.filter(notif => notif.notificacion_id !== id));
                        toast.success("Notificación eliminada exitosamente");
                    })
                    .catch(() => toast.error("Error al eliminar la notificación"))
                    .finally(() => setLoading(false));
            }
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ usuario_id: '', estudiante_id: '', mensaje: '', leido: false });
        setEditMode(false);
        setEditId(null);
    };

    return (
        <div className="container">

            <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>Agregar Notificación</button>

            {loading && <div className="alert alert-info">Cargando...</div>}

            <table className="table table-hover table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Usuario ID</th>
                        <th>Estudiante ID</th>
                        <th>Mensaje</th>
                        <th>Leído</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {notificaciones.map(notif => (
                        <tr key={`notif-${notif.notificacion_id}`}>
                            <td>{notif.notificacion_id}</td>
                            <td>{notif.usuario_id}</td>
                            <td>{notif.estudiante_id}</td>
                            <td>{notif.mensaje}</td>
                            <td>{notif.leido ? 'Sí' : 'No'}</td>
                            <td>{notif.fecha}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(notif)}>Editar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(notif.notificacion_id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal show fade" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editMode ? 'Editar Notificación' : 'Agregar Notificación'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Usuario ID</label>
                                        <input type="number" name="usuario_id" className="form-control" value={form.usuario_id} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Estudiante ID</label>
                                        <input type="number" name="estudiante_id" className="form-control" value={form.estudiante_id} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Mensaje</label>
                                        <textarea name="mensaje" className="form-control" value={form.mensaje} onChange={handleChange} required></textarea>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="leido" className="form-check-input" checked={form.leido} onChange={handleChange} />
                                        <label className="form-check-label">Leído</label>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cerrar</button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {editMode ? 'Actualizar Notificación' : 'Agregar Notificación'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

// Montaje del componente
window.onload = () => {
    const rootElement = document.getElementById('crud-notificaciones');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<App />);
    }
};

export default App;
