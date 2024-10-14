import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';

const AsistenciasApp = () => {
    const [asistencias, setAsistencias] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [form, setForm] = useState({
        estudiante_id: '',
        curso_id: '',
        fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
        estado: '',
        observaciones: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Obtener el token CSRF desde el meta tag del HTML
    const getCsrfToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]');
        return token ? token.getAttribute('content') : '';
    };

    // Cargar asistencias, estudiantes y cursos al iniciar
    useEffect(() => {
        fetch('/api/asistencias')
            .then(response => response.json())
            .then(data => setAsistencias(data))
            .catch((error) => {
                console.log("Error al cargar asistencias:", error);
                toast.error("Error al cargar asistencias");
            });

        fetch('/api/estudiantes')  // API para obtener los estudiantes
            .then(response => response.json())
            .then(data => setEstudiantes(data))
            .catch((error) => {
                console.log("Error al cargar estudiantes:", error);
                toast.error("Error al cargar estudiantes");
            });

        fetch('/api/cursos')  // API para obtener los cursos
            .then(response => response.json())
            .then(data => setCursos(data))
            .catch((error) => {
                console.log("Error al cargar cursos:", error);
                toast.error("Error al cargar cursos");
            });
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
    
        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/asistencias/${editId}` : `/api/asistencias`;
    
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken() // Incluye el token CSRF en la solicitud
            },
            body: JSON.stringify(form)
        })
        .then(response => {
            console.log("Respuesta del servidor completa:", response);
            if (!response.ok) {
                return response.text().then(text => {
                    // Verifica si la respuesta es HTML (normalmente en casos de redireccionamiento)
                    if (text.startsWith('<!DOCTYPE html>')) {
                        console.error("Se recibió HTML en lugar de JSON. Posible redireccionamiento o error del servidor.");
                        throw new Error("Error inesperado: El servidor devolvió HTML en lugar de JSON.");
                    }
                    console.error("Respuesta no válida, cuerpo del servidor:", text);
                    throw new Error(text);
                });
            }
            return response.json(); // Si no es redireccionado, intenta parsear el JSON
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
            setForm({ estudiante_id: '', curso_id: '', fecha: new Date().toISOString().split('T')[0], estado: '', observaciones: '' });
            setEditMode(false);
        })
        .catch((error) => {
            console.log("Error al crear o actualizar la asistencia:", error);
            toast.error("Error al crear o actualizar la asistencia: " + error.message);
        })
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
                .catch((error) => {
                    console.log("Error al eliminar la asistencia:", error);
                    toast.error("Error al eliminar la asistencia");
                })
                .finally(() => setLoading(false));
            }
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ estudiante_id: '', curso_id: '', fecha: new Date().toISOString().split('T')[0], estado: '', observaciones: '' });
        setEditMode(false);
    };

    return (
        <div>
            {loading && <div>Cargando...</div>}

            <div>
                <button onClick={() => setShowModal(true)}>Agregar Asistencia</button>
            </div>

            <table>
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
                            <td>{asistencia.estudiante_id}</td>
                            <td>{asistencia.curso_id}</td>
                            <td>{asistencia.fecha}</td>
                            <td>{asistencia.estado}</td>
                            <td>
                                <button onClick={() => handleEdit(asistencia)}>Editar</button>
                                <button onClick={() => handleDelete(asistencia.asistencia_id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div>
                    <div>
                        <div>
                            <h5>{editMode ? 'Editar Asistencia' : 'Agregar Asistencia'}</h5>
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
                                    <select name="curso_id" value={form.curso_id} onChange={handleChange} required>
                                        <option value="">Seleccione un curso</option>
                                        {cursos.map(curso => (
                                            <option key={curso.curso_id} value={curso.curso_id}>
                                                {curso.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Fecha</label>
                                    <input type="date" name="fecha" value={form.fecha} readOnly />
                                </div>
                                <div>
                                    <label>Estado</label>
                                    <select name="estado" value={form.estado} onChange={handleChange} required>
                                        <option value="Presente">Presente</option>
                                        <option value="Ausente">Ausente</option>
                                        <option value="Tarde">Tarde</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Observaciones</label>
                                    <textarea name="observaciones" value={form.observaciones} onChange={handleChange}></textarea>
                                </div>
                                <button type="submit" disabled={loading}>
                                    {editMode ? 'Actualizar Asistencia' : 'Agregar Asistencia'}
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
