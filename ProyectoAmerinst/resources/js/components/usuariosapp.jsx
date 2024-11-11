import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const generarEmail = (nombre, apellido) => {
    const iniciales = nombre.charAt(0).toLowerCase() + apellido.charAt(0).toLowerCase();
    const dominio = 'example.com';
    const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);
    return `${iniciales}${numeroAleatorio}@${dominio}`;
};

const UsuariosApp = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '', rol_id: '' });
    const [errors, setErrors] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [rolesLoaded, setRolesLoaded] = useState(false); // Estado para verificar si los roles están cargados

    useEffect(() => {
        fetchUsuarios();
        fetchRoles();
    }, []);
    
    const fetchUsuarios = () => {
        setLoading(true);
        fetch('/api/usuarios')
            .then(response => response.json())
            .then(data => setUsuarios(data))
            .catch(() => toast.error("Error al cargar usuarios"))
            .finally(() => setLoading(false));
    };
    
    const fetchRoles = () => {
        fetch('/api/roles')
            .then(response => response.json())
            .then(data => {
                setRoles(data);
                setRolesLoaded(true);
            })
            .catch(() => toast.error("Error al cargar roles"));
    };
    

    const palabrasProhibidas = ['groseria1', 'groseria2', 'groseria3']; // Lista de palabras prohibidas

    const validateForm = () => {
        const newErrors = {};

        // Función para detectar caracteres repetidos
        const esCaracterRepetido = (valor) => /^(.)\1*$/.test(valor);

        // Validación de nombre
        if (!form.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
        } else if (!/^[a-zA-Z\s]+$/.test(form.nombre)) {
            newErrors.nombre = 'El nombre solo debe contener letras y espacios';
        } else if (palabrasProhibidas.some(palabra => form.nombre.toLowerCase().includes(palabra))) {
            newErrors.nombre = 'El nombre contiene palabras no permitidas';
        } else if (esCaracterRepetido(form.nombre)) {
            newErrors.nombre = 'El nombre no puede contener un solo carácter repetido';
        }

        // Validación de apellido
        if (!form.apellido.trim()) {
            newErrors.apellido = 'El apellido es obligatorio';
        } else if (!/^[a-zA-Z\s]+$/.test(form.apellido)) {
            newErrors.apellido = 'El apellido solo debe contener letras y espacios';
        } else if (palabrasProhibidas.some(palabra => form.apellido.toLowerCase().includes(palabra))) {
            newErrors.apellido = 'El apellido contiene palabras no permitidas';
        } else if (esCaracterRepetido(form.apellido)) {
            newErrors.apellido = 'El apellido no puede contener un solo carácter repetido';
        }

        // Validación de email
        if (!form.email.trim()) {
            newErrors.email = 'El correo electrónico es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'El formato del correo es inválido';
        }

        // Validación de contraseña (opcional según modo)
        const passwordPattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
        if (!editMode && !form.password.trim()) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (form.password && !passwordPattern.test(form.password)) {
            newErrors.password = 'La contraseña debe incluir mayúscula, número, carácter especial y al menos 8 caracteres';
        }

        // Validación de rol
        if (!form.rol_id) newErrors.rol_id = 'El rol es obligatorio';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => {
            const newForm = { ...prevForm, [name]: value };
            if (name === 'apellido' && !editMode) {
                newForm.email = generarEmail(newForm.nombre, newForm.apellido);
            }
            return newForm;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Por favor, corrige los errores en el formulario");
            return;
        }
        handleSave(form);
    };

    const handleSave = (usuario) => {
        setLoading(true);
        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/usuarios/${editId}` : '/api/usuarios';
    
        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(usuario),
        })
            .then(response => response.ok ? response.json() : Promise.reject())
            .then(() => {
                fetchUsuarios(); // Volver a cargar usuarios después de guardar
                toast.success(editMode ? 'Usuario actualizado' : 'Usuario agregado');
                setShowModal(false);
                setEditMode(false);
                setEditId(null);
                setForm({ nombre: '', apellido: '', email: '', password: '', rol_id: '' });
                setErrors({});
            })
            .catch(() => toast.error('Error en la operación'))
            .finally(() => setLoading(false));
    };
    

    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar!',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/api/usuarios/${id}`, { method: 'DELETE' })
                    .then(response => response.ok ? setUsuarios(usuarios.filter(u => u.user_id !== id)) : Promise.reject())
                    .then(() => toast.success('Usuario eliminado'))
                    .catch(() => toast.error('Error al eliminar usuario'));
            }
        });
    };

    const handleEdit = (usuario) => {
        setForm({ ...usuario, password: '' });
        setEditMode(true);
        setEditId(usuario.user_id);
        setShowModal(true);
    };

    const obtenerNombreRol = (rol_id) => {
        if (!roles || roles.length === 0) return 'Cargando...'; // Indica que los roles están cargando
        const rol = roles.find(r => r.rol_id === rol_id);
        return rol ? rol.nombre : 'Sin rol';
    };

    return (
        <div className="container">
            {loading && <div className="alert alert-info">Cargando datos...</div>}
            <button className="btn btn-primary mt-4 mb-4" onClick={() => setShowModal(true)} disabled={!rolesLoaded}>Agregar Usuario</button>

            <table className="table table-hover table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>Nombre y Apellido</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(usuario => (
                        <tr key={usuario.user_id}>
                            <td>{usuario.nombre} {usuario.apellido}</td>
                            <td>{usuario.email}</td>
                            <td>{obtenerNombreRol(usuario.rol_id)}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(usuario)}>Editar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(usuario.user_id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && rolesLoaded && (
                <div className="modal show fade" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editMode ? 'Editar Usuario' : 'Agregar Usuario'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input name="nombre" className="form-control" value={form.nombre} onChange={handleChange} required />
                                        {errors.nombre && <div className="text-danger">{errors.nombre}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Apellido</label>
                                        <input name="apellido" className="form-control" value={form.apellido} onChange={handleChange} required />
                                        {errors.apellido && <div className="text-danger">{errors.apellido}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input name="email" className="form-control" value={form.email} onChange={handleChange} required readOnly={editMode} />
                                        {errors.email && <div className="text-danger">{errors.email}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Contraseña</label>
                                        <input
                                            name="password"
                                            type="password"
                                            className="form-control"
                                            value={form.password}
                                            onChange={handleChange}
                                            required={!editMode}
                                        />
                                        {errors.password && <div className="text-danger">{errors.password}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Rol</label>
                                        <select name="rol_id" className="form-select" value={form.rol_id} onChange={handleChange} required>
                                            <option value="">Selecciona un rol</option>
                                            {roles.map((rol) => (
                                                <option key={rol.rol_id} value={rol.rol_id}>{rol.nombre}</option>
                                            ))}
                                        </select>
                                        {errors.rol_id && <div className="text-danger">{errors.rol_id}</div>}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cerrar</button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {editMode ? 'Actualizar Usuario' : 'Agregar Usuario'}
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

window.onload = () => {
    const rootElement = document.getElementById('crud-usuario');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<UsuariosApp />);
    }
};

export default UsuariosApp;
