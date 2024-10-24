import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
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

const EstudiantesApp = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        curso_id: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Cargar estudiantes
        fetch('/api/estudiantes')
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar estudiantes');
                return response.json();
            })
            .then(data => setEstudiantes(data))
            .catch(() => toast.error("Error al cargar estudiantes"));

        // Cargar cursos (grados)
        fetch('/api/cursos')
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar cursos');
                return response.json();
            })
            .then(data => setCursos(data))
            .catch(() => toast.error("Error al cargar cursos"));
    }, []);

    const calculateAge = (fecha_nacimiento) => {
        const birthDate = new Date(fecha_nacimiento);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
    };

    const isValidAge = (fecha_nacimiento) => {
        const age = calculateAge(fecha_nacimiento);
        return age >= 12 && age <= 20;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isValidAge(form.fecha_nacimiento)) {
            toast.error("La edad debe estar entre 12 y 20 años.");
            return;
        }
        setLoading(true);

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/estudiantes/${editId}` : '/api/estudiantes';

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form)
        })
            .then(response => response.json())
            .then(data => {
                if (editMode) {
                    setEstudiantes(estudiantes.map(est => est.estudiante_id === editId ? data : est));
                    toast.success("Estudiante actualizado exitosamente");
                } else {
                    setEstudiantes([...estudiantes, data]);
                    toast.success("Estudiante agregado exitosamente");
                }
                handleCloseModal();
            })
            .catch(() => toast.error("Error al crear o actualizar el estudiante"))
            .finally(() => setLoading(false));
    };

    const handleEdit = (estudiante) => {
        setForm({
            nombre: estudiante.nombre,
            apellido: estudiante.apellido,
            fecha_nacimiento: estudiante.fecha_nacimiento,
            curso_id: estudiante.curso_id
        });
        setEditId(estudiante.estudiante_id);
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
                fetch(`/api/estudiantes/${id}`, { method: 'DELETE' })
                    .then(() => {
                        setEstudiantes(estudiantes.filter(est => est.estudiante_id !== id));
                        toast.success("Estudiante eliminado exitosamente");
                    })
                    .catch(() => toast.error("Error al eliminar estudiante"))
                    .finally(() => setLoading(false));
            }
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ nombre: '', apellido: '', fecha_nacimiento: '', curso_id: '' });
        setEditMode(false);
        setEditId(null);
    };

    const getNombreGrado = (cursoId) => {
        const curso = cursos.find(curso => curso.curso_id === cursoId);
        return curso ? curso.nombre : 'Sin asignar';
    };

    return (
        <Container>
            {loading && <div>Cargando...</div>}

            <div>
                <button onClick={() => {
                    setShowModal(true);
                    setEditMode(false);
                    setForm({ nombre: '', apellido: '', fecha_nacimiento: '', curso_id: '' });
                }}>Agregar Estudiante</button>
            </div>

            <Table>
                <thead>
                    <tr>
                        <th>Nombre Completo</th>
                        <th>Edad</th>
                        <th>Curso</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {estudiantes.map(est => (
                        <tr key={est.estudiante_id}>
                            <td>{`${est.nombre} ${est.apellido}`}</td>
                            <td>{calculateAge(est.fecha_nacimiento)} años</td>
                            <td>{getNombreGrado(est.curso_id)}</td>
                            <td>
                                <ActionButton actionType="edit" onClick={() => handleEdit(est)}>Editar</ActionButton>
                                <ActionButton actionType="delete" onClick={() => handleDelete(est.estudiante_id)}>Eliminar</ActionButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {showModal && (
                <ModalOverlay>
                    <ModalContent>
                        <div>
                            <h5>{editMode ? 'Editar Estudiante' : 'Agregar Estudiante'}</h5>
                            <button onClick={handleCloseModal}>Cerrar</button>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <div>
                                <Label>Nombre</Label>
                                <Input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label>Apellido</Label>
                                <Input type="text" name="apellido" value={form.apellido} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label>Fecha Nacimiento</Label>
                                <Input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label>Grado</Label>
                                <Select name="curso_id" value={form.curso_id} onChange={handleChange} required>
                                    <option value="">Selecciona un grado</option>
                                    {cursos.map(curso => (
                                        <option key={curso.curso_id} value={curso.curso_id}>
                                            {curso.grado}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <SubmitButton type="submit" disabled={loading}>
                                {editMode ? 'Actualizar Estudiante' : 'Agregar Estudiante'}
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
    const rootElement = document.getElementById('crud-estudiante');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<EstudiantesApp />);
    } else {
        console.error("No se encontró el contenedor con id 'crud-estudiante'");
    }
};

export default EstudiantesApp;
