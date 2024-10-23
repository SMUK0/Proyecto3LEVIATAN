import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';

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

    // Cargar todas las notificaciones al iniciar
    useEffect(() => {
        setLoading(true);
        fetch('/api/notificaciones')
            .then(response => response.json())
            .then(data => {
                setNotificaciones(data);
                console.log("Notificaciones cargadas desde la API:", data);
            })
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
        console.log(`Campo actualizado: ${name}, Valor: ${value}`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("Datos del formulario que se enviarán:", form);

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
                console.error('Error en la respuesta del servidor:', responseData);
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
            console.error('Error al crear o actualizar la notificación:', error);
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
                        Swal.fire('Eliminado!', 'La notificación ha sido eliminada.', 'success');
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
        <div>
            <h1>CRUD Notificaciones</h1>

            {loading && <div>Cargando...</div>}

            <div>
                <button onClick={() => setShowModal(true)}>Agregar Notificación</button>
            </div>

            <table>
                <thead>
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
                                <button onClick={() => handleEdit(notif)}>Editar</button>
                                <button onClick={() => handleDelete(notif.notificacion_id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div>
                    <div>
                        <div>
                            <h5>{editMode ? 'Editar Notificación' : 'Agregar Notificación'}</h5>
                            <button onClick={handleCloseModal}>Cerrar</button>
                        </div>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label>Usuario ID</label>
                                    <input
                                        type="number"
                                        name="usuario_id"
                                        value={form.usuario_id}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Estudiante ID</label>
                                    <input
                                        type="number"
                                        name="estudiante_id"
                                        value={form.estudiante_id}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Mensaje</label>
                                    <textarea name="mensaje" value={form.mensaje} onChange={handleChange} required></textarea>
                                </div>
                                <div>
                                    <input type="checkbox" name="leido" checked={form.leido} onChange={handleChange} />
                                    <label>Leído</label>
                                </div>
                                <button type="submit" disabled={loading}>
                                    {editMode ? 'Actualizar Notificación' : 'Agregar Notificación'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

// Montaje manual del componente
window.onload = () => {
    const rootElement = document.getElementById('crud-notificaciones');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<App />);
    } else {
        console.error("No se encontró el contenedor con id 'crud-notificaciones'");
    }
};

export default App;
