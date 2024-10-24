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

const Select = styled.select`
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

const NotasApp = () => {
    const [notas, setNotas] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [maestro, setMaestro] = useState(null);
    const [form, setForm] = useState({
        estudiante_id: '',
        curso_id: '',
        materia_id: '',
        maestro_id: '',
        nota: '',
        fecha: new Date().toISOString().split('T')[0],
        observaciones: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.rol === 2) {
            setMaestro(userData);
            setForm(prevForm => ({
                ...prevForm,
                maestro_id: userData.user_id
            }));
        } else {
            window.location.href = '/login';
        }

        fetch('/api/notas')
            .then(response => response.json())
            .then(data => setNotas(data))
            .catch(() => toast.error('Error al cargar notas'));

        fetch('/api/estudiantes')
            .then(response => response.json())
            .then(data => setEstudiantes(data))
            .catch(() => toast.error('Error al cargar estudiantes'));

        fetch('/api/cursos')
            .then(response => response.json())
            .then(data => setCursos(data))
            .catch(() => toast.error('Error al cargar cursos'));

        fetch('/api/materias')
            .then(response => response.json())
            .then(data => setMaterias(data))
            .catch(() => toast.error('Error al cargar materias'));
    }, []);

    const getEstudianteNombre = (id) => {
        const estudiante = estudiantes.find(e => e.estudiante_id === id);
        return estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : 'Desconocido';
    };

    const getCursoNombre = (id) => {
        const curso = cursos.find(c => c.curso_id === id);
        return curso ? curso.nombre : 'Sin asignar';
    };

    const getMateriaNombre = (id) => {
        const materia = materias.find(m => m.materia_id === id);
        return materia ? materia.nombre : 'Desconocida';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => {
            let updatedValue = value;

            if (name === 'nota') {
                updatedValue = value === '' ? '' : Math.min(Math.max(parseFloat(value), 0), 10);
            }

            if (name === 'estudiante_id') {
                const selectedEstudiante = estudiantes.find(est => est.estudiante_id === parseInt(value));
                if (selectedEstudiante) {
                    return { ...prevForm, estudiante_id: value, curso_id: selectedEstudiante.curso_id };
                }
            }

            return { ...prevForm, [name]: updatedValue };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        if (!form.maestro_id) {
            toast.error('El campo Maestro es obligatorio');
            setLoading(false);
            return;
        }

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/notas/${editId}` : '/api/notas';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(await response.text());
                }
                return response.json();
            })
            .then(data => {
                if (editMode) {
                    setNotas(notas.map(nota => nota.nota_id === editId ? data : nota));
                    toast.success('Nota actualizada exitosamente');
                } else {
                    setNotas([...notas, data]);
                    toast.success('Nota agregada exitosamente');
                }
                setShowModal(false);
                resetForm();
            })
            .catch(error => {
                let errorMessage = "Error al crear o actualizar la nota";
                try {
                    const errorData = JSON.parse(error.message);
                    if (errorData.errors) {
                        errorMessage += ": " + Object.values(errorData.errors).flat().join(", ");
                    }
                } catch { }
                toast.error(errorMessage);
            })
            .finally(() => setLoading(false));
    };

    const resetForm = () => {
        setForm({
            estudiante_id: '',
            curso_id: '',
            materia_id: '',
            maestro_id: maestro?.user_id || '',
            nota: '',
            fecha: new Date().toISOString().split('T')[0],
            observaciones: ''
        });
        setEditMode(false);
        setEditId(null);
    };

    const handleEdit = (nota) => {
        setForm({
            estudiante_id: nota.estudiante_id,
            curso_id: nota.curso_id,
            materia_id: nota.materia_id,
            maestro_id: nota.maestro_id,
            nota: String(nota.nota),
            fecha: nota.fecha,
            observaciones: nota.observaciones || ''
        });
        setEditId(nota.nota_id);
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
                fetch(`/api/notas/${id}`, { method: 'DELETE' })
                    .then(() => {
                        setNotas(notas.filter(nota => nota.nota_id !== id));
                        toast.success('Nota eliminada exitosamente');
                    })
                    .catch(() => toast.error('Error al eliminar la nota'))
                    .finally(() => setLoading(false));
            }
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    return (
        <Container>
            <h1>CRUD Notas</h1>

            {loading && <div>Cargando...</div>}

            <div>
                <button onClick={() => {
                    setEditMode(false);
                    setEditId(null);
                    setShowModal(true);
                    resetForm();
                }}>
                    Agregar Nota
                </button>
            </div>

            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Estudiante</th>
                        <th>Curso</th>
                        <th>Materia</th>
                        <th>Maestro</th>
                        <th>Nota</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {notas.map((nota) => (
                        <tr key={`nota-${nota.nota_id}`}>
                            <td>{nota.nota_id}</td>
                            <td>{getEstudianteNombre(nota.estudiante_id)}</td>
                            <td>{getCursoNombre(nota.curso_id)}</td>
                            <td>{getMateriaNombre(nota.materia_id)}</td>
                            <td>{nota.maestro_id}</td>
                            <td>{String(nota.nota)}</td>
                            <td>{String(nota.fecha)}</td>
                            <td>
                                <ActionButton actionType="edit" onClick={() => handleEdit(nota)}>Editar</ActionButton>
                                <ActionButton actionType="delete" onClick={() => handleDelete(nota.nota_id)}>Eliminar</ActionButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {showModal && (
                <ModalOverlay>
                    <ModalContent>
                        <div>
                            <h5>{editMode ? 'Editar Nota' : 'Agregar Nota'}</h5>
                            <button onClick={handleCloseModal}>Cerrar</button>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <div>
                                <Label>Estudiante</Label>
                                <Select name="estudiante_id" value={form.estudiante_id} onChange={handleChange} required>
                                    <option value="">Seleccione un estudiante</option>
                                    {estudiantes.map(estudiante => (
                                        <option key={estudiante.estudiante_id} value={estudiante.estudiante_id}>
                                            {estudiante.nombre} {estudiante.apellido}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <Label>Curso</Label>
                                <Input type="text" name="curso_id" value={getCursoNombre(form.curso_id)} readOnly />
                            </div>
                            <div>
                                <Label>Materia</Label>
                                <Select name="materia_id" value={form.materia_id} onChange={handleChange} required>
                                    <option value="">Seleccione una materia</option>
                                    {materias.map(materia => (
                                        <option key={materia.materia_id} value={materia.materia_id}>
                                            {materia.nombre}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <Label>Maestro ID</Label>
                                <Input type="text" name="maestro_id" value={form.maestro_id} readOnly />
                            </div>
                            <div>
                                <Label>Nota</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    name="nota"
                                    value={form.nota || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Fecha</Label>
                                <Input type="date" name="fecha" value={form.fecha} readOnly />
                            </div>
                            <div>
                                <Label>Observaciones</Label>
                                <TextArea name="observaciones" value={form.observaciones} onChange={handleChange}></TextArea>
                            </div>
                            <SubmitButton type="submit" disabled={loading}>
                                {editMode ? 'Actualizar Nota' : 'Agregar Nota'}
                            </SubmitButton>
                        </Form>
                    </ModalContent>
                </ModalOverlay>
            )}

            <ToastContainer />
        </Container>
    );
};

// Montaje manual para pruebas del componente NotasApp
window.onload = () => {
    const rootElement = document.getElementById('crud-notas');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<NotasApp />);
    } else {
        console.error("No se encontró el contenedor con id 'crud-notas'");
    }
};

export default NotasApp;
