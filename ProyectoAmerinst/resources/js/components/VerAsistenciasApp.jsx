import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { format } from 'date-fns'; // Importamos date-fns para el formato de fecha

const AsistenciasApp = () => {
    const [asistencias, setAsistencias] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [showCounters, setShowCounters] = useState(true); // Estado para alternar entre los modos

    // Obtener el usuario logueado al cargar el componente
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user')); // Suponiendo que está en localStorage
        if (user && user.user_id) {
            fetchCursosUsuario(user.user_id); // Llamar a la función para obtener cursos
        } else {
            toast.error("No se encontró información del usuario logueado.");
        }
    }, []);

    // Cargar estudiantes y asistencias al inicializar
    useEffect(() => {
        fetchEstudiantes();
        fetchAsistencias();
    }, []);

    // Obtener estudiantes
    const fetchEstudiantes = () => {
        fetch('/api/estudiantes')
            .then(response => response.json())
            .then(data => setEstudiantes(data))
            .catch(() => toast.error("Error al cargar estudiantes"));
    };

    // Obtener asistencias
    const fetchAsistencias = () => {
        fetch('/api/asistencias')
            .then(response => response.json())
            .then(data => setAsistencias(data))
            .catch(() => toast.error("Error al cargar asistencias"));
    };

    // Obtener cursos relacionados al usuario logueado
    const fetchCursosUsuario = async (userId) => {
        try {
            const response = await fetch(`/api/cursos/usuario/${userId}`);
            if (!response.ok) throw new Error('Error al cargar los cursos');
            const data = await response.json();
            setCursos(data);
        } catch (error) {
            toast.error('No se pudieron cargar los cursos');
        }
    };

    // Filtrar estudiantes por curso seleccionado
    const estudiantesPorCurso = () => {
        if (selectedCurso) {
            return estudiantes.filter(estudiante => estudiante.curso_id === parseInt(selectedCurso));
        }
        return [];  // No mostrar estudiantes hasta que se seleccione un curso
    };

    // Contar los estados de asistencia (P, T, A)
    const contarAsistenciasPorEstudiante = (estudianteId) => {
        const asistenciasEstudiante = asistencias.filter(asistencia => asistencia.estudiante_id === estudianteId);
        const estadosContados = { P: 0, T: 0, A: 0 };

        asistenciasEstudiante.forEach(asistencia => {
            if (asistencia.estado === 'P') estadosContados.P++;
            if (asistencia.estado === 'T') estadosContados.T++;
            if (asistencia.estado === 'A') estadosContados.A++;
        });

        return estadosContados;
    };

    // Función para obtener la fecha de la asistencia (usando updated_at si es mayor)
    const obtenerFechaAsistencia = (asistencia) => {
        const fecha = asistencia.updated_at > asistencia.created_at ? asistencia.updated_at : asistencia.created_at;
        return format(new Date(fecha), 'dd/MM/yyyy'); // Solo la fecha en formato dd/MM/yyyy
    };

    // Renderizar lista de estudiantes con sus contadores de asistencia
    const renderEstudiantesConContadores = () => {
        const estudiantesFiltrados = estudiantesPorCurso();

        return (
            <div className="list-group mb-4">
                {estudiantesFiltrados.map(estudiante => {
                    const estadosContados = contarAsistenciasPorEstudiante(estudiante.estudiante_id);

                    return (
                        <div 
                            key={estudiante.estudiante_id} 
                            className="list-group-item d-flex justify-content-between align-items-center shadow-sm rounded-lg mb-2"
                            style={{ backgroundColor: '#f9f9f9' }}
                        >
                            <div>
                                <h5>{estudiante.nombre} {estudiante.apellido}</h5>
                            </div>
                            <div className="d-flex">
                                <span className="badge bg-success me-2 py-2 px-3">
                                    <FaCheckCircle /> {estadosContados.P} 
                                </span>
                                <span className="badge bg-warning me-2 py-2 px-3">
                                    <FaClock /> {estadosContados.T}
                                </span>
                                <span className="badge bg-danger me-2 py-2 px-3">
                                    <FaTimesCircle /> {estadosContados.A}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Renderizar lista de estudiantes sin los contadores, mostrando los detalles de las asistencias
    const renderEstudiantesSinContadores = () => {
        const estudiantesFiltrados = estudiantesPorCurso();

        return (
            <div className="list-group mb-4">
                {estudiantesFiltrados.map(estudiante => {
                    // Filtrar las asistencias del estudiante actual
                    const asistenciasEstudiante = asistencias.filter(asistencia => asistencia.estudiante_id === estudiante.estudiante_id);

                    return (
                        <div 
                            key={estudiante.estudiante_id} 
                            className="list-group-item shadow-sm rounded-lg mb-2"
                            style={{ backgroundColor: '#f9f9f9' }}
                        >
                            <div>
                                <h5>{estudiante.nombre} {estudiante.apellido}</h5>
                            </div>
                            <div>
                                <h6>Asistencias</h6>
                                <ul>
                                    {asistenciasEstudiante.map(asistencia => (
                                        <li key={asistencia.asistencia_id}>
                                            <p><strong>Fecha:</strong> {obtenerFechaAsistencia(asistencia)}</p>
                                            <p><strong>Estado:</strong> {asistencia.estado}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Alternar entre los modos
    const toggleViewMode = () => {
        setShowCounters(prevState => !prevState);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 text-primary">Gestión de Asistencias</h2>
            <div className="mb-4">
                <label htmlFor="cursoSelect" className="form-label fw-bold">Seleccionar Curso:</label>
                <select
                    id="cursoSelect"
                    className="form-select"
                    onChange={e => setSelectedCurso(e.target.value)}
                    value={selectedCurso || ''}
                >
                    <option value="">Seleccione un Curso</option>
                    {cursos.map(curso => (
                        <option key={curso.curso_id} value={curso.curso_id}>
                            {`${curso.nombre} - ${curso.grado}`}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <button className="btn btn-primary" onClick={toggleViewMode}>
                    {showCounters ? 'Ver Asistencias Detalladas' : 'Ver Datos con Contadores'}
                </button>
            </div>

            {selectedCurso && (
                <div className="row mb-4">
                    {showCounters ? renderEstudiantesConContadores() : renderEstudiantesSinContadores()}
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default AsistenciasApp;
