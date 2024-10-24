import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import styled from 'styled-components';

// Definir la función generarEmail
const generarEmail = (nombre, apellido) => {
    const iniciales = nombre.charAt(0).toLowerCase() + apellido.charAt(0).toLowerCase();
    const dominio = 'example.com';
    return `${iniciales}${Math.floor(Math.random() * 1000)}@${dominio}`;
};

// Estilos para el contenedor principal
const Container = styled.div`
    padding: 20px;
    background-color: #f4f4f9;
    min-height: 100vh;
`;

// Estilos para la tabla
const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;

    th, td {
        border: 1px solid #ccc;
        padding: 10px;
        text-align: left;
    }

    th {
        background-color: #870e20;
        color: white;
    }
`;

// Estilos para los botones de acción
const ActionButton = styled.button`
    background-color: ${({ actionType }) => actionType === 'edit' ? '#007bff' : '#dc3545'};
    color: white;
    border: none;
    padding: 5px 10px;
    margin-right: 5px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: ${({ actionType }) => actionType === 'edit' ? '#0056b3' : '#c82333'};
    }
`;

// Estilos para el modal
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 500px;
    max-width: 90%;
`;

// Estilos para el formulario dentro del modal
const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

const Label = styled.label`
    margin-top: 10px;
    font-weight: bold;
`;

const Input = styled.input`
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const Select = styled.select`
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const SubmitButton = styled.button`
    background-color: #870e20;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    margin-top: 20px;
    cursor: pointer;

    &:hover {
        background-color: #a22835;
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

const UsuariosApp = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
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
            .then(data => setRoles(data))
            .catch(() => toast.error("Error al cargar roles"));
    }, []);

    // Función para obtener el nombre del rol
    const obtenerNombreRol = (rol_id) => {
        const rol = roles.find(r => r.rol_id === rol_id);
        return rol ? rol.nombre : 'Sin rol';
    };

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
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => {
            const newForm = { ...prevForm, [name]: value };

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
            method,
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
        <Container>
            {loading && <div>Cargando...</div>}

            <div>
                <button onClick={handleShowAddForm}>Agregar Usuario</button>
            </div>

            <Table>
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
                                <ActionButton actionType="edit" onClick={() => handleEdit(usuario)}>Editar</ActionButton>
                                <ActionButton actionType="delete" onClick={() => handleDelete(usuario.user_id)}>Eliminar</ActionButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {showModal && (
                <ModalOverlay>
                    <ModalContent>
                        <div>
                            <h5>{editMode ? 'Editar Usuario' : 'Agregar Usuario'}</h5>
                            <button onClick={handleCloseModal}>Cerrar</button>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <div>
                                <Label>Nombre</Label>
                                <Input name="nombre" value={form.nombre} onChange={handleChange} required />
                                {errors.nombre && <div>{errors.nombre}</div>}
                            </div>
                            <div>
                                <Label>Apellido</Label>
                                <Input name="apellido" value={form.apellido} onChange={handleChange} required />
                                {errors.apellido && <div>{errors.apellido}</div>}
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input name="email" value={form.email} onChange={handleChange} required readOnly />
                                {errors.email && <div>{errors.email}</div>}
                            </div>
                            <div>
                                <Label>Contraseña</Label>
                                <Input type="password" name="password" value={form.password} onChange={handleChange} required={!editMode} />
                                {errors.password && <div>{errors.password}</div>}
                            </div>
                            <div>
                                <Label>Rol ID</Label>
                                <Select name="rol_id" value={form.rol_id} onChange={handleChange} required>
                                    <option value="">Selecciona un rol</option>
                                    {roles.map((rol) => (
                                        <option key={rol.rol_id} value={rol.rol_id}>
                                            {rol.nombre}
                                        </option>
                                    ))}
                                </Select>
                                {errors.rol_id && <div>{errors.rol_id}</div>}
                            </div>
                            <SubmitButton type="submit" disabled={loading}>
                                {editMode ? 'Actualizar Usuario' : 'Agregar Usuario'}
                            </SubmitButton>
                        </Form>
                    </ModalContent>
                </ModalOverlay>
            )}

            <ToastContainer />
        </Container>
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
