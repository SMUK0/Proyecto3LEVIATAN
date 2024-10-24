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

const App = () => {
    const [maestroCursos, setMaestroCursos] = useState([]);
    const [form, setForm] = useState({ maestro_id: '', curso_id: '' });
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch('/api/maestro-cursos')
            .then(response => response.json())
            .then(data => setMaestroCursos(data))
            .catch(() => toast.error("Error al cargar maestro-cursos"));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/maestro-cursos/${form.maestro_id}/${form.curso_id}` : '/api/maestro-cursos';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(response => response.json())
            .then(data => {
                if (editMode) {
                    setMaestroCursos(maestroCursos.map(mc => mc.maestro_id === form.maestro_id && mc.curso_id === form.curso_id ? data : mc));
                    toast.success("Maestro-Curso actualizado exitosamente");
                } else {
                    setMaestroCursos([...maestroCursos, data]);
                    toast.success("Maestro-Curso agregado exitosamente");
                }
                setShowModal(false);
                setForm({ maestro_id: '', curso_id: '' });
                setEditMode(false);
            })
            .catch(() => toast.error("Error al crear o actualizar el maestro-curso"))
            .finally(() => setLoading(false));
    };

    const handleEdit = (maestroCurso) => {
        setForm({ maestro_id: maestroCurso.maestro_id, curso_id: maestroCurso.curso_id });
        setEditMode(true);
        setShowModal(true);
    };

    const handleDelete = (maestro_id, curso_id) => {
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
                fetch(`/api/maestro-cursos/${maestro_id}/${curso_id}`, { method: 'DELETE' })
                    .then(() => {
                        setMaestroCursos(maestroCursos.filter(mc => mc.maestro_id !== maestro_id || mc.curso_id !== curso_id));
                        toast.success("Maestro-Curso eliminado exitosamente");
                        Swal.fire('Eliminado!', 'El maestro-curso ha sido eliminado.', 'success');
                    })
                    .catch(() => toast.error("Error al eliminar el maestro-curso"))
                    .finally(() => setLoading(false));
            }
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ maestro_id: '', curso_id: '' });
        setEditMode(false);
    };

    return (
        <Container>
            <h1>CRUD Maestro Cursos</h1>

            {loading && <div>Cargando...</div>}

            <div>
                <button onClick={() => setShowModal(true)}>Agregar Maestro-Curso</button>
            </div>

            <Table>
                <thead>
                    <tr>
                        <th>Maestro ID</th>
                        <th>Curso ID</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {maestroCursos.map(mc => (
                        <tr key={`${mc.maestro_id}-${mc.curso_id}`}>
                            <td>{mc.maestro_id}</td>
                            <td>{mc.curso_id}</td>
                            <td>
                                <ActionButton actionType="edit" onClick={() => handleEdit(mc)}>Editar</ActionButton>
                                <ActionButton actionType="delete" onClick={() => handleDelete(mc.maestro_id, mc.curso_id)}>Eliminar</ActionButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {showModal && (
                <ModalOverlay>
                    <ModalContent>
                        <div>
                            <h5>{editMode ? 'Editar Maestro-Curso' : 'Agregar Maestro-Curso'}</h5>
                            <button onClick={handleCloseModal}>Cerrar</button>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <div>
                                <Label>Maestro ID</Label>
                                <Input type="number" name="maestro_id" value={form.maestro_id} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label>Curso ID</Label>
                                <Input type="number" name="curso_id" value={form.curso_id} onChange={handleChange} required />
                            </div>
                            <SubmitButton type="submit" disabled={loading}>
                                {editMode ? 'Actualizar Maestro-Curso' : 'Agregar Maestro-Curso'}
                            </SubmitButton>
                        </Form>
                    </ModalContent>
                </ModalOverlay>
            )}

            <ToastContainer />
        </Container>
    );
};

ReactDOM.createRoot(document.getElementById('crud-maestro-cursos')).render(<App />);
