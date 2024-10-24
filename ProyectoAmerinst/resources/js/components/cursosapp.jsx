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

const CursosApp = () => {
    const [cursos, setCursos] = useState([]);
    const [form, setForm] = useState({ nombre: '', grado: '' });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch('/api/cursos')
            .then(response => response.json())
            .then(data => setCursos(data))
            .catch(() => toast.error("Error al cargar cursos"));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/cursos/${editId}` : '/api/cursos';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(response => response.json())
            .then(data => {
                if (editMode) {
                    setCursos(cursos.map(curso => curso.curso_id === editId ? data : curso));
                    toast.success("Curso actualizado exitosamente");
                } else {
                    setCursos([...cursos, data]);
                    toast.success("Curso agregado exitosamente");
                }
                setShowModal(false);
                setForm({ nombre: '', grado: '' });
                setEditMode(false);
                setEditId(null);
            })
            .catch(() => toast.error("Error al crear o actualizar el curso"))
            .finally(() => setLoading(false));
    };

    const handleShowAddForm = () => {
        setForm({ nombre: '', grado: '' });
        setEditMode(false);
        setShowModal(true);
    };

    const handleEdit = (curso) => {
        setForm({ nombre: curso.nombre, grado: curso.grado });
        setEditId(curso.curso_id);
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
                fetch(`/api/cursos/${id}`, { method: 'DELETE' })
                    .then(() => {
                        setCursos(cursos.filter(curso => curso.curso_id !== id));
                        toast.success("Curso eliminado exitosamente");
                        Swal.fire('Eliminado!', 'El curso ha sido eliminado.', 'success');
                    })
                    .catch(() => toast.error("Error al eliminar curso"))
                    .finally(() => setLoading(false));
            }
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ nombre: '', grado: '' });
        setEditMode(false);
        setEditId(null);
    };

    const opcionesGrado = [
        { value: '1er Grado', label: '1er Grado' },
        { value: '2do Grado', label: '2do Grado' },
        { value: '3er Grado', label: '3er Grado' },
        { value: '4to Grado', label: '4to Grado' },
        { value: '5to Grado', label: '5to Grado' },
        { value: '6to Grado', label: '6to Grado' },
        { value: '7mo Grado', label: '7mo Grado' },
        { value: '8vo Grado', label: '8vo Grado' }
    ];

    return (
        <Container>
            {loading && <div>Cargando...</div>}

            <div>
                <button onClick={handleShowAddForm}>Agregar Curso</button>
            </div>

            <Table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Grado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {cursos.map(curso => (
                        <tr key={curso.curso_id}>
                            <td>{curso.nombre}</td>
                            <td>{curso.grado}</td>
                            <td>
                                <ActionButton actionType="edit" onClick={() => handleEdit(curso)}>Editar</ActionButton>
                                <ActionButton actionType="delete" onClick={() => handleDelete(curso.curso_id)}>Eliminar</ActionButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {showModal && (
                <ModalOverlay>
                    <ModalContent>
                        <div>
                            <h5>{editMode ? 'Editar Curso' : 'Agregar Curso'}</h5>
                            <button onClick={handleCloseModal}>Cerrar</button>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <div>
                                <Label>Nombre</Label>
                                <Input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label>Grado</Label>
                                <Select name="grado" value={form.grado} onChange={handleChange} required>
                                    <option value="">Selecciona un grado</option>
                                    {opcionesGrado.map(opcion => (
                                        <option key={opcion.value} value={opcion.value}>
                                            {opcion.label}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <SubmitButton type="submit" disabled={loading}>
                                {editMode ? 'Actualizar Curso' : 'Agregar Curso'}
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
    const rootElement = document.getElementById('crud-curso');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<CursosApp />);
    } else {
        console.error("No se encontró el contenedor con id 'crud-curso'");
    }
};

export default CursosApp;
