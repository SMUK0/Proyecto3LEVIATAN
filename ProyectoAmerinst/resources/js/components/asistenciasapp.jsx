import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

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
            setForm({
                ...form,
                [name]: value,
                curso_id: estudianteSeleccionado ? estudianteSeleccionado.curso_id : ''
            });
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
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form)
        })
            .then(async (response) => {
                if (!response.ok) throw new Error(await response.text());
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
                handleCloseModal();
            })
            .catch(error => toast.error("Error al crear o actualizar la asistencia"))
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
                fetch(`/api/asistencias/${id}`, { method: 'DELETE' })
                    .then(() => {
                        setAsistencias(asistencias.filter(asistencia => asistencia.asistencia_id !== id));
                        toast.success("Asistencia eliminada exitosamente");
                    })
                    .catch(() => toast.error("Ocurrió un problema al eliminar la asistencia"))
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
        <div className="container">
            <button className="btn btn-primary mt-4 mb-4" onClick={() => setShowModal(true)}>Agregar Asistencia</button>

            {loading && <div className="alert alert-info">Cargando...</div>}

            <table className="table table-hover table-bordered">
                <thead className="table-dark">
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
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(asistencia)}>Editar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(asistencia.asistencia_id)}>Eliminar</button>
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
                                <h5 className="modal-title">{editMode ? 'Editar Asistencia' : 'Agregar Asistencia'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Estudiante</label>
                                        <select name="estudiante_id" className="form-select" value={form.estudiante_id} onChange={handleChange} required>
                                            <option value="">Seleccione un estudiante</option>
                                            {estudiantes.map(estudiante => (
                                                <option key={estudiante.estudiante_id} value={estudiante.estudiante_id}>
                                                    {estudiante.nombre} {estudiante.apellido}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Curso</label>
                                        <input type="text" className="form-control" value={getCursoNombre(form.curso_id)} readOnly />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Fecha</label>
                                        <input type="date" name="fecha" className="form-control" value={form.fecha} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Estado</label>
                                        <select name="estado" className="form-select" value={form.estado} onChange={handleChange} required>
                                            <option value="Presente">Presente</option>
                                            <option value="Ausente">Ausente</option>
                                            <option value="Tarde">Tarde</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Observaciones</label>
                                        <textarea name="observaciones" className="form-control" value={form.observaciones} onChange={handleChange}></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cerrar</button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {editMode ? 'Actualizar Asistencia' : 'Agregar Asistencia'}
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

window.onload = () => {
    const rootElement = document.getElementById('crud-asistencias');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<AsistenciasApp />);
    } else {
        console.error("No se encontró el contenedor con id 'crud-asistencias'");
    }
};

export default AsistenciasApp;
