import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';  // Importar FontAwesome
import '../../css/app.css';  // Importar tu archivo CSS
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos de Toastify
import Swal from 'sweetalert2'; // Importar SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css';  // Importar estilos de SweetAlert2

const App = () => {
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
    const [loading, setLoading] = useState(false);  // Indicador de carga
    const [showModal, setShowModal] = useState(false); // Controlar la visibilidad del modal

    // Obtener todos los usuarios al cargar la página
    useEffect(() => {
        fetch('/api/usuarios')
            .then(response => response.json())
            .then(data => setUsuarios(data))
            .catch(() => toast.error("Error al cargar usuarios"));
    }, []);

    // Manejar cambios en los inputs del formulario
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Crear o actualizar un usuario
    const handleSubmit = (e) => {
        e.preventDefault();

        setLoading(true);

        const formData = { ...form };

        if (editMode && formData.password === '') {
            delete formData.password;  // No enviar la contraseña vacía al actualizar
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
                setShowModal(false);  // Ocultar el modal después de agregar/editar
            })
            .catch(error => {
                console.error('Error en la operación:', error);
                toast.error('Error al crear o actualizar el usuario: ' + error.message);
            })
            .finally(() => setLoading(false));  // Finaliza la carga
    };

    // Eliminar un usuario con SweetAlert2
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
                    .finally(() => setLoading(false));  // Finaliza la carga

                Swal.fire(
                    'Eliminado!',
                    'El usuario ha sido eliminado.',
                    'success'
                );
            }
        });
    };

    // Mostrar formulario para agregar un usuario
    const handleShowAddForm = () => {
        setForm({ nombre: '', apellido: '', email: '', password: '', rol_id: '' });
        setEditMode(false);
        setShowModal(true); // Mostrar modal para agregar
    };

    // Editar un usuario
    const handleEdit = (usuario) => {
        setForm({
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            password: '', // No se puede mostrar la contraseña
            rol_id: usuario.rol_id
        });
        setEditMode(true);
        setEditId(usuario.user_id);
        setShowModal(true); // Mostrar el modal para editar
    };

    // Cerrar el modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">CRUD Usuarios</h1>

            {/* Animación de Cargando */}
            {loading && (
                <div className="d-flex justify-content-center mb-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Cargando...</span>
                    </div>
                </div>
            )}

            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-success" onClick={handleShowAddForm}>
                    <i className="fas fa-plus"></i> Agregar Usuario
                </button>
            </div>

            <table className="table table-striped table-hover shadow">
                <thead className="table-success">
                    <tr>
                        <th scope="col">UserID</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email-ID</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(usuario => (
                        <tr key={usuario.user_id}>
                            <td>{usuario.user_id}</td>
                            <td>@{usuario.nombre.toLowerCase()}</td>
                            <td>{usuario.email}</td>
                            <td>
                                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(usuario)}>
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(usuario.user_id)}>
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content shadow-lg">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">{editMode ? 'Editar Usuario' : 'Agregar Usuario'}</h5>
                                <button type="button" className="btn-close text-white" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="nombre" className="form-label">Nombre</label>
                                        <input name="nombre" value={form.nombre} onChange={handleChange} className="form-control" placeholder="Nombre" required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="apellido" className="form-label">Apellido</label>
                                        <input name="apellido" value={form.apellido} onChange={handleChange} className="form-control" placeholder="Apellido" required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input name="email" value={form.email} onChange={handleChange} className="form-control" placeholder="Email" required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Contraseña</label>
                                        <input name="password" value={form.password} onChange={handleChange} className="form-control" placeholder="Contraseña" required={!editMode} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="rol_id" className="form-label">Rol ID</label>
                                        <input name="rol_id" value={form.rol_id} onChange={handleChange} className="form-control" placeholder="Rol ID" required />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                        {editMode ? 'Actualizar Usuario' : 'Agregar Usuario'}
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

ReactDOM.createRoot(document.getElementById('crud-usuario')).render(<App />);
