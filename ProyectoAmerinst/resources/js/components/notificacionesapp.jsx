import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

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

const TextArea = styled.textarea`
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
            .then(data => {
                setNotificaciones(data);
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
        <Container>
            <h1>CRUD Notificaciones</h1>

            {loading && <div>Cargando...</div>}

            <div>
                <button onClick={() => setShowModal(true)}>Agregar Notificación</button>
            </div>

            <Table>
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
                                <ActionButton actionType="edit" onClick={() => handleEdit(notif)}>Editar</ActionButton>
                                <ActionButton actionType="delete" onClick={() => handleDelete(notif.notificacion_id)}>Eliminar</ActionButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {showModal && (
                <ModalOverlay>
                    <ModalContent>
                        <div>
                            <h5>{editMode ? 'Editar Notificación' : 'Agregar Notificación'}</h5>
                            <button onClick={handleCloseModal}>Cerrar</button>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <div>
                                <Label>Usuario ID</Label>
                                <Input
                                    type="number"
                                    name="usuario_id"
                                    value={form.usuario_id}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Estudiante ID</Label>
                                <Input
                                    type="number"
                                    name="estudiante_id"
                                    value={form.estudiante_id}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Mensaje</Label>
                                <TextArea name="mensaje" value={form.mensaje} onChange={handleChange} required></TextArea>
                            </div>
                            <div>
                                <Input type="checkbox" name="leido" checked={form.leido} onChange={handleChange} />
                                <Label>Leído</Label>
                            </div>
                            <SubmitButton type="submit" disabled={loading}>
                                {editMode ? 'Actualizar Notificación' : 'Agregar Notificación'}
                            </SubmitButton>
                        </Form>
                    </ModalContent>
                </ModalOverlay>
            )}

            <ToastContainer />
        </Container>
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
