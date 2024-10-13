import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';

const UsuariosApp = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        rol_id: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch('/api/usuarios')
            .then(response => response.json())
            .then(data => setUsuarios(data))
            .catch(() => toast.error("Error al cargar usuarios"));
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
        const formData = { ...form };

        if (editMode && formData.password === '') {
            delete formData.password;
        }

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/usuarios/${editId}` : '/api/usuarios';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.message || 'Error en la operación') });
                }
                return response.json();
            })
            .then(data => {
                if (editMode) {
                    setUsuarios(usuarios.map(usuario => usuario.user_id === editId ? data : usuario));
                    toast.success('Usuario actualizado exitosamente');
                } else {
                    setUsuarios([...usuarios, data]);
                    toast.success('Usuario agregado exitosamente');
                }
                setEditMode(false);
                setEditId(null);
                setForm({ nombre: '', apellido: '', email: '', password: '', rol_id: '' });
                setShowModal(false);
            })
            .catch(error => {
                console.error('Error en la operación:', error);
                toast.error('Error al crear o actualizar el usuario: ' + error.message);
            })
            .finally(() => setLoading(false));
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
                fetch(`/api/usuarios/${id}`, { method: 'DELETE' })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Error al eliminar usuario");
                        }
                        setUsuarios(usuarios.filter(usuario => usuario.user_id !== id));
                        toast.success('Usuario eliminado exitosamente');
                    })
                    .catch(error => {
                        console.error('Error al eliminar usuario:', error);
                        toast.error('Error al eliminar usuario: ' + error.message);
                    })
                    .finally(() => setLoading(false));

                Swal.fire('Eliminado!', 'El usuario ha sido eliminado.', 'success');
            }
        });
    };

    const handleShowAddForm = () => {
        setForm({ nombre: '', apellido: '', email: '', password: '', rol_id: '' });
        setEditMode(false);
        setShowModal(true);
    };

    const handleEdit = (usuario) => {
        setForm({
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            password: '',
            rol_id: usuario.rol_id
        });
        setEditMode(true);
        setEditId(usuario.user_id);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            {loading && <div>Cargando...</div>}

            <div>
                <button onClick={handleShowAddForm}>Agregar Usuario</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>UserID</th>
                        <th>Username</th>
                        <th>Email-ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(usuario => (
                        <tr key={usuario.user_id}>
                            <td>{usuario.user_id}</td>
                            <td>@{usuario.nombre.toLowerCase()}</td>
                            <td>{usuario.email}</td>
                            <td>
                                <button onClick={() => handleEdit(usuario)}>Editar</button>
                                <button onClick={() => handleDelete(usuario.user_id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div>
                    <div>
                        <div>
                            <h5>{editMode ? 'Editar Usuario' : 'Agregar Usuario'}</h5>
                            <button onClick={handleCloseModal}>Cerrar</button>
                        </div>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label>Nombre</label>
                                    <input name="nombre" value={form.nombre} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Apellido</label>
                                    <input name="apellido" value={form.apellido} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Email</label>
                                    <input name="email" value={form.email} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Contraseña</label>
                                    <input name="password" value={form.password} onChange={handleChange} required={!editMode} />
                                </div>
                                <div>
                                    <label>Rol ID</label>
                                    <input name="rol_id" value={form.rol_id} onChange={handleChange} required />
                                </div>
                                <button type="submit" disabled={loading}>
                                    {editMode ? 'Actualizar Usuario' : 'Agregar Usuario'}
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

// Montaje manual para pruebas
window.onload = () => {
    const rootElement = document.getElementById('crud-usuario');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<UsuariosApp />);
    } else {
        console.error("No se encontró el contenedor con id 'crud-usuario'");
    }
};

export default UsuariosApp;
