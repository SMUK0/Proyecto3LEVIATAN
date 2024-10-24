import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importar CSS para las notificaciones
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

const AsistenciasApp = () => {
    const [asistencias, setAsistencias] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [form, setForm] = useState({
        estudiante_id: '',
        curso_id: '',
        fecha: new Date().toISOString().split('T')[0],
        estado: 'Presente',
        observaciones: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const getCsrfToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]');
        return token ? token.getAttribute('content') : '';
    };

    useEffect(() => {
        fetch('/api/asistencias')
            .then(response => response.json())
            .then(data => setAsistencias(data))
            .catch(() => toast.error("Error al cargar asistencias"));

        fetch('/api/estudiantes')
            .then(response => response.json())
            .then(data => setEstudiantes(data))
            .catch(() => toast.error("Error al cargar estudiantes"));

        fetch('/api/cursos')
            .then(response => response.json())
            .then(data => setCursos(data))
            .catch(() => toast.error("Error al cargar cursos"));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "estudiante_id") {
            const estudianteSeleccionado = estudiantes.find(est => est.estudiante_id === parseInt(value));
            if (estudianteSeleccionado) {
                setForm({
                    ...form,
                    [name]: value,
                    curso_id: estudianteSeleccionado.curso_id
                });
            } else {
                setForm({ ...form, [name]: value, curso_id: '' });
            }
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/asistencias/${editId}` : '/api/asistencias';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken()
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
                    setAsistencias(asistencias.map(asistencia => asistencia.asistencia_id === editId ? data : asistencia));
                    toast.success("Asistencia actualizada exitosamente");
                } else {
                    setAsistencias([...asistencias, data]);
                    toast.success("Asistencia agregada exitosamente");
                }
                setShowModal(false);
                setForm({ estudiante_id: '', curso_id: '', fecha: new Date().toISOString().split('T')[0], estado: 'Presente', observaciones: '' });
                setEditMode(false);
            })
            .catch((error) => toast.error("Error al crear o actualizar la asistencia: " + error.message))
            .finally(() => setLoading(false));
    };

    const handleEdit = (asistencia) => {
        setForm({
            estudiante_id: asistencia.estudiante_id,
            curso_id: asistencia.curso_id,
            fecha: asistencia.fecha,
            estado: asistencia.estado,
            observaciones: asistencia.observaciones || ''
        });
        setEditId(asistencia.asistencia_id);
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
                fetch(`/api/asistencias/${id}`, { method: 'DELETE', headers: { 'X-CSRF-TOKEN': getCsrfToken() } })
                    .then(() => {
                        setAsistencias(asistencias.filter(asistencia => asistencia.asistencia_id !== id));
                        toast.success("Asistencia eliminada exitosamente");
                        Swal.fire('Eliminado!', 'La asistencia ha sido eliminada.', 'success');
                    })
                    .catch(() => toast.error("Ocurrió un problema al eliminar la asistencia."))
                    .finally(() => setLoading(false));
            }
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ estudiante_id: '', curso_id: '', fecha: new Date().toISOString().split('T')[0], estado: 'Presente', observaciones: '' });
        setEditMode(false);
    };

    const getEstudianteNombre = (id) => {
        const estudiante = estudiantes.find(e => e.estudiante_id === id);
        return estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : 'Desconocido';
    };

    const getCursoNombre = (id) => {
        const curso = cursos.find(c => c.curso_id === id);
        return curso ? curso.nombre : 'Sin asignar';
    };

    return (
        <Container>
            {loading && <div>Cargando...</div>}

            <div>
                <button onClick={() => {
                    setShowModal(true);
                    setEditMode(false);
                    setForm({ estudiante_id: '', curso_id: '', fecha: new Date().toISOString().split('T')[0], estado: 'Presente', observaciones: '' });
                }}>Agregar Asistencia</button>
            </div>

            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Estudiante</th>
                        <th>Curso</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {asistencias.map(asistencia => (
                        <tr key={asistencia.asistencia_id}>
                            <td>{asistencia.asistencia_id}</td>
                            <td>{getEstudianteNombre(asistencia.estudiante_id)}</td>
                            <td>{getCursoNombre(asistencia.curso_id)}</td>
                            <td>{asistencia.fecha}</td>
                            <td>{asistencia.estado}</td>
                            <td>
                                <ActionButton actionType="edit" onClick={() => handleEdit(asistencia)}>Editar</ActionButton>
                                <ActionButton actionType="delete" onClick={() => handleDelete(asistencia.asistencia_id)}>Eliminar</ActionButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {showModal && (
                <ModalOverlay>
                    <ModalContent>
                        <div>
                            <h5>{editMode ? 'Editar Asistencia' : 'Agregar Asistencia'}</h5>
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
                                <Input type="text" name="curso" value={getCursoNombre(form.curso_id)} readOnly />
                            </div>
                            <div>
                                <Label>Fecha</Label>
                                <Input type="date" name="fecha" value={form.fecha} readOnly />
                            </div>
                            <div>
                                <Label>Estado</Label>
                                <Select name="estado" value={form.estado} onChange={handleChange} required>
                                    <option value="Presente">Presente</option>
                                    <option value="Ausente">Ausente</option>
                                    <option value="Tarde">Tarde</option>
                                </Select>
                            </div>
                            <div>
                                <Label>Observaciones</Label>
                                <TextArea name="observaciones" value={form.observaciones} onChange={handleChange}></TextArea>
                            </div>
                            <SubmitButton type="submit" disabled={loading}>
                                {editMode ? 'Actualizar Asistencia' : 'Agregar Asistencia'}
                            </SubmitButton>
                        </Form>
                    </ModalContent>
                </ModalOverlay>
            )}

            <ToastContainer />
        </Container>
    );
};

// Monta el componente en el div con id="crud-asistencias"
window.onload = () => {
    const rootElement = document.getElementById('crud-asistencias');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<AsistenciasApp />);
    } else {
        console.error("No se encontró el contenedor con id 'crud-asistencias'");
    }
};

export default AsistenciasApp;
