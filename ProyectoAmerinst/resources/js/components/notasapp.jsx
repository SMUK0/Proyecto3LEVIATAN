import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const NotasApp = () => {
    const [notas, setNotas] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [materias, setMaterias] = useState([]);
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
    const [userMaestroId, setUserMaestroId] = useState(null);

    // Cargar datos al montar el componente
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.user_id) {
            setUserMaestroId(user.user_id);  // Guardamos el maestro_id del usuario logueado
            setForm(prevForm => ({ ...prevForm, maestro_id: user.user_id }));
        }

        fetchData('/api/notas', (data) => {
            // Filtramos las notas que pertenecen al maestro logueado
            setNotas(data.filter(nota => nota.maestro_id === user.user_id));
        }, 'Error al cargar notas');
        fetchData('/api/estudiantes', setEstudiantes, 'Error al cargar estudiantes');
        fetchData('/api/cursos', setCursos, 'Error al cargar cursos');
        fetchData('/api/materias', setMaterias, 'Error al cargar materias');
    }, []);

    // Función para cargar datos desde la API
    const fetchData = async (url, setter, errorMessage) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(errorMessage);
            const data = await response.json();
            setter(data);
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Obtener nombres para mostrar en la tabla
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

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "estudiante_id") {
            const estudianteSeleccionado = estudiantes.find(est => est.estudiante_id === parseInt(value));
            setForm(prevForm => ({
                ...prevForm,
                estudiante_id: value,
                curso_id: estudianteSeleccionado ? estudianteSeleccionado.curso_id : '' // Asignar automáticamente el curso_id
            }));
        } else {
            setForm(prevForm => ({
                ...prevForm,
                [name]: name === 'nota' ? Math.min(Math.max(parseFloat(value), 0), 10) : value
            }));
        }
    };

    // Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/notas/${editId}` : '/api/notas';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (!response.ok) {
                if (response.status === 422) {  // Manejar error 422
                    const errorData = await response.json();
                    const errorMessage = errorData.errors 
                        ? Object.values(errorData.errors).join(', ') 
                        : 'Error de validación.';
                    throw new Error(errorMessage);
                }
                throw new Error('Error en la solicitud');
            }

            await fetchData('/api/notas', (data) => {
                setNotas(data.filter(nota => nota.maestro_id === userMaestroId));  // Recargamos solo las notas del maestro logueado
            }, 'Error al cargar notas');
            toast.success(editMode ? 'Nota actualizada exitosamente' : 'Nota agregada exitosamente');
            setShowModal(false);
            resetForm();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Restablecer formulario
    const resetForm = () => {
        setForm({ 
            estudiante_id: '', 
            curso_id: '', 
            materia_id: '', 
            maestro_id: userMaestroId,  // Mantener maestro_id del usuario logueado
            nota: '', 
            fecha: new Date().toISOString().split('T')[0], 
            observaciones: '' 
        });
        setEditMode(false);
        setEditId(null);
    };

    // Editar nota existente
    const handleEdit = (nota) => {
        setForm({ ...nota });
        setEditId(nota.nota_id);
        setEditMode(true);
        setShowModal(true);
    };

    // Eliminar nota
    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    await fetch(`/api/notas/${id}`, { method: 'DELETE' });
                    setNotas(notas.filter(nota => nota.nota_id !== id));
                    toast.success('Nota eliminada exitosamente');
                } catch {
                    toast.error('Error al eliminar la nota');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    // Cerrar el modal
    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    return (
        <div className="container">
            <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>Agregar Nota</button>

            {loading && <div className="alert alert-info">Cargando...</div>}

            <table className="table table-hover table-bordered">
                <thead className="table-dark">
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
                    {notas.map((nota, index) => (
                        <tr key={nota.nota_id || `nota-${index}`}>
                            <td>{nota.nota_id || '-'}</td>
                            <td>{getEstudianteNombre(nota.estudiante_id)}</td>
                            <td>{getCursoNombre(nota.curso_id)}</td>
                            <td>{getMateriaNombre(nota.materia_id)}</td>
                            <td>{nota.maestro_id || '-'}</td>
                            <td>{nota.nota || '-'}</td>
                            <td>{nota.fecha || '-'}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(nota)}>Editar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(nota.nota_id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal show fade" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editMode ? 'Editar Nota' : 'Agregar Nota'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Estudiante</label>
                                        <select name="estudiante_id" className="form-select" value={form.estudiante_id} onChange={handleChange} required>
                                            <option value="">Seleccione un estudiante</option>
                                            {estudiantes.map(est => (
                                                <option key={est.estudiante_id} value={est.estudiante_id}>
                                                    {est.nombre} {est.apellido}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Curso</label>
                                        <input type="text" className="form-control" value={getCursoNombre(form.curso_id)} readOnly />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Materia</label>
                                        <select name="materia_id" className="form-select" value={form.materia_id} onChange={handleChange} required>
                                            <option value="">Seleccione una materia</option>
                                            {materias.map(materia => (
                                                <option key={materia.materia_id} value={materia.materia_id}>
                                                    {materia.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Nota</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            step="0.01"
                                            name="nota"
                                            value={form.nota || ''}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Fecha</label>
                                        <input type="date" className="form-control" name="fecha" value={form.fecha} readOnly />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Observaciones</label>
                                        <textarea className="form-control" name="observaciones" value={form.observaciones} onChange={handleChange}></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cerrar</button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {editMode ? 'Actualizar Nota' : 'Agregar Nota'}
                                    </button>
                                </div>
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
