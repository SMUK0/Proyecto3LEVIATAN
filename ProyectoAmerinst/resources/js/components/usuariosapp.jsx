import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';

// Definir la función generarEmail
const generarEmail = (nombre, apellido) => {
    const iniciales = nombre.charAt(0).toLowerCase() + apellido.charAt(0).toLowerCase();
    const dominio = 'example.com';
    return `${iniciales}${Math.floor(Math.random() * 1000)}@${dominio}`;
};

const UsuariosApp = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);  // Estado para los roles
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        rol_id: ''
    });
    const [errors, setErrors] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Cargar usuarios
        fetch('/api/usuarios')
            .then(response => response.json())
            .then(data => setUsuarios(data))
            .catch(() => toast.error("Error al cargar usuarios"));

        // Cargar roles desde la API
        fetch('/api/roles')
        .then(response => response.json())
        .then(data => {
            console.log('Roles:', data); // Verifica los datos en la consola
            setRoles(data);
        })
        .catch(() => toast.error("Error al cargar roles"));
    }, []);

    // Función para obtener el nombre del rol
    const obtenerNombreRol = (rol_id) => {
        const rol = roles.find(r => r.rol_id === rol_id);
        return rol ? rol.nombre : 'Sin rol';  // Retorna el nombre del rol o 'Sin rol' si no se encuentra
    };

    // Definir la función validateForm para validar el formulario
    const validateForm = () => {
        const newErrors = {};

        // Validar nombre
        if (!form.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }

        // Validar apellido
        if (!form.apellido.trim()) {
            newErrors.apellido = 'El apellido es requerido';
        }

        // Validar email
        if (!form.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'El formato del email es inválido';
        }

        // Validar contraseña solo si no estamos en modo de edición
        if (!editMode && !form.password.trim()) {
            newErrors.password = 'La contraseña es requerida';
        } else if (form.password.length > 0 && !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(form.password)) {
            newErrors.password = 'La contraseña debe incluir al menos 1 mayúscula, 1 número y 1 carácter especial';
        }

        // Validar rol_id
        if (!form.rol_id.trim()) {
            newErrors.rol_id = 'El Rol es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => {
            const newForm = { ...prevForm, [name]: value };

            // Generar email cuando se completa el apellido
            if (name === 'apellido') {
                newForm.email = generarEmail(newForm.nombre, newForm.apellido);
            }

            return newForm;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Por favor corrige los errores en el formulario");
            return;
        }

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
                                    {errors.nombre && <div>{errors.nombre}</div>}
                                </div>
                                <div>
                                    <label>Apellido</label>
                                    <input name="apellido" value={form.apellido} onChange={handleChange} required />
                                    {errors.apellido && <div>{errors.apellido}</div>}
                                </div>
                                <div>
                                    <label>Email</label>
                                    <input name="email" value={form.email} onChange={handleChange} required readOnly />
                                    {errors.email && <div>{errors.email}</div>}
                                </div>
                                <div>
                                    <label>Contraseña</label>
                                    <input name="password" value={form.password} onChange={handleChange} required={!editMode} />
                                    {errors.password && <div>{errors.password}</div>}
                                </div>
                                <div>
                                    <label>Rol ID</label>
                                    <select name="rol_id" value={form.rol_id} onChange={handleChange} required>
                                        <option value="">Selecciona un rol</option>
                                        {roles.map((rol) => (
                                            <option key={rol.rol_id} value={rol.rol_id}>
                                                {rol.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.rol_id && <div>{errors.rol_id}</div>}
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
