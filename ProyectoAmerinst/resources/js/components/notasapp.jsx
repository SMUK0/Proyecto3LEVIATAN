import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';

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
                    const text = await response.text();
                    if (text.startsWith('<!DOCTYPE html>')) {
                        throw new Error('El servidor devolvió HTML. Posible redireccionamiento.');
                    }
                    throw new Error(text);
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
                console.error('Error al crear o actualizar la nota:', error);
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
        <div>
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

            <table>
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
                                <button onClick={() => handleEdit(nota)}>Editar</button>
                                <button onClick={() => handleDelete(nota.nota_id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div>
                    <div>
                        <div>
                            <h5>{editMode ? 'Editar Nota' : 'Agregar Nota'}</h5>
                            <button onClick={handleCloseModal}>Cerrar</button>
                        </div>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label>Estudiante</label>
                                    <select name="estudiante_id" value={form.estudiante_id} onChange={handleChange} required>
                                        <option value="">Seleccione un estudiante</option>
                                        {estudiantes.map(estudiante => (
                                            <option key={estudiante.estudiante_id} value={estudiante.estudiante_id}>
                                                {estudiante.nombre} {estudiante.apellido}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Curso</label>
                                    <input type="text" name="curso_id" value={getCursoNombre(form.curso_id)} readOnly />
                                </div>
                                <div>
                                    <label>Materia</label>
                                    <select name="materia_id" value={form.materia_id} onChange={handleChange} required>
                                        <option value="">Seleccione una materia</option>
                                        {materias.map(materia => (
                                            <option key={materia.materia_id} value={materia.materia_id}>
                                                {materia.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Maestro ID</label>
                                    <input type="text" name="maestro_id" value={form.maestro_id} readOnly />
                                </div>
                                <div>
                                    <label>Nota</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="nota"
                                        value={form.nota || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Fecha</label>
                                    <input type="date" name="fecha" value={form.fecha} readOnly />
                                </div>
                                <div>
                                    <label>Observaciones</label>
                                    <textarea name="observaciones" value={form.observaciones} onChange={handleChange}></textarea>
                                </div>
                                <button type="submit" disabled={loading}>
                                    {editMode ? 'Actualizar Nota' : 'Agregar Nota'}
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
