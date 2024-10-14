import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [usuarios, setUsuarios] = useState([]); // Para almacenar los usuarios con rol de Padre
    const [estudiantes, setEstudiantes] = useState([]); // Para almacenar los estudiantes
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

    // Cargar las notificaciones, usuarios y estudiantes al iniciar
    useEffect(() => {
        fetch('/api/notificaciones')
            .then(response => response.json())
            .then(data => setNotificaciones(data))
            .catch(() => toast.error("Error al cargar notificaciones"));

        // Cargar todos los usuarios y luego filtrarlos por rol_id (Padre = 3)
        fetch('/api/usuarios')
            .then(response => response.json())
            .then(data => {
                const usuariosPadres = data.filter(usuario => usuario.rol_id === 3); // Filtrar por rol_id
                console.log("Usuarios con rol de Padre cargados:", usuariosPadres);
                setUsuarios(usuariosPadres);
            })
            .catch(() => toast.error("Error al cargar usuarios"));

        // Cargar estudiantes
        fetch('/api/estudiantes')
            .then(response => response.json())
            .then(data => {
                console.log("Estudiantes cargados:", data);
                setEstudiantes(data);
            })
            .catch(() => toast.error("Error al cargar estudiantes"));
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/notificaciones/${editId}` : `/api/notificaciones`;

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

    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ usuario_id: '', estudiante_id: '', mensaje: '', leido: false });
        setEditMode(false);
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
                                    <label>Usuario (Padre)</label>
                                    <select name="usuario_id" value={form.usuario_id} onChange={handleChange} required>
                                        <option value="">Seleccione un usuario (Padre)</option>
                                        {usuarios.map((usuario, index) => (
                                            <option key={`usuario-${index}-${usuario.usuario_id}`} value={usuario.usuario_id}>
                                                {usuario.nombre} {usuario.apellido}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Estudiante</label>
                                    <select name="estudiante_id" value={form.estudiante_id} onChange={handleChange} required>
                                        <option value="">Seleccione un estudiante</option>
                                        {estudiantes.map((estudiante, index) => (
                                            <option key={`estudiante-${index}-${estudiante.estudiante_id}`} value={estudiante.estudiante_id}>
                                                {estudiante.nombre} {estudiante.apellido}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Mensaje</label>
                                    <textarea name="mensaje" value={form.mensaje} onChange={handleChange} required></textarea>
                                </div>
                                <div>
                                    <input type="checkbox" name="leido" checked={form.leido} onChange={(e) => setForm({ ...form, leido: e.target.checked })} />
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

// Montaje manual del componente de notificaciones
window.onload = () => {
    const rootElement = document.getElementById('crud-notificaciones');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<App />);
    } else {
        console.error("No se encontró el contenedor con id 'crud-notificaciones'");
    }
};

export default App;
