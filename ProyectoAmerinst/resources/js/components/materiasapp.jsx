import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
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

const MateriasApp = () => {
    const [materias, setMaterias] = useState([]);
    const [form, setForm] = useState({ nombre: '' });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch('/api/materias')
            .then(response => response.json())
            .then(data => setMaterias(data))
            .catch(() => toast.error("Error al cargar materias"));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/materias/${editId}` : '/api/materias';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(response => response.json())
            .then(data => {
                if (editMode) {
                    setMaterias(materias.map(materia => materia.materia_id === editId ? data : materia));
                    toast.success("Materia actualizada exitosamente");
                } else {
                    setMaterias([...materias, data]);
                    toast.success("Materia agregada exitosamente");
                }
                setShowModal(false);
                setForm({ nombre: '' });
                setEditMode(false);
                setEditId(null);
            })
            .catch(() => toast.error("Error al crear o actualizar la materia"))
            .finally(() => setLoading(false));
    };

    const handleShowAddForm = () => {
        setForm({ nombre: '' });
        setEditMode(false);
        setEditId(null);
        setShowModal(true);
    };

    const handleEdit = (materia) => {
        setForm({ nombre: materia.nombre });
        setEditId(materia.materia_id);
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
                fetch(`/api/materias/${id}`, { method: 'DELETE' })
                    .then(() => {
                        setMaterias(materias.filter(materia => materia.materia_id !== id));
                        toast.success("Materia eliminada exitosamente");
                        Swal.fire('Eliminado!', 'La materia ha sido eliminada.', 'success');
                    })
                    .catch(() => toast.error("Error al eliminar la materia"))
                    .finally(() => setLoading(false));
            }
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ nombre: '' });
        setEditMode(false);
        setEditId(null);
    };

    return (
        <Container>
            {loading && <div>Cargando...</div>}

            <div>
                <button onClick={handleShowAddForm}>Agregar Materia</button>
            </div>

            <Table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {materias.map(materia => (
                        <tr key={materia.materia_id}>
                            <td>{materia.nombre}</td>
                            <td>
                                <ActionButton actionType="edit" onClick={() => handleEdit(materia)}>Editar</ActionButton>
                                <ActionButton actionType="delete" onClick={() => handleDelete(materia.materia_id)}>Eliminar</ActionButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {showModal && (
                <ModalOverlay>
                    <ModalContent>
                        <div>
                            <h5>{editMode ? 'Editar Materia' : 'Agregar Materia'}</h5>
                            <button onClick={handleCloseModal}>Cerrar</button>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <div>
                                <Label>Nombre</Label>
                                <Input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
                            </div>
                            <SubmitButton type="submit" disabled={loading}>
                                {editMode ? 'Actualizar Materia' : 'Agregar Materia'}
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
    const rootElement = document.getElementById('crud-materia');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<MateriasApp />);
    } else {
        console.error("No se encontró el contenedor con id 'crud-materia'");
    }
};

export default MateriasApp;
