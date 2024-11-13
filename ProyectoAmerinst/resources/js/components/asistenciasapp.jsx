import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AsistenciasApp = () => {
    const [asistencias, setAsistencias] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [asistenciaEstados, setAsistenciaEstados] = useState({});
    const [cursos, setCursos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [estadoSeleccionado, setEstadoSeleccionado] = useState('');
    const [marcarPendientes, setMarcarPendientes] = useState(false); // Nuevo estado para marcar estudiantes pendientes

    useEffect(() => {
        fetchEstudiantes();
        fetchAsistencias();
        fetchCursos();
    }, []);

    const fetchEstudiantes = () => {
        fetch('/api/estudiantes')
            .then(response => response.json())
            .then(data => setEstudiantes(data))
            .catch(() => toast.error("Error al cargar estudiantes"));
    };

    const fetchAsistencias = () => {
        fetch('/api/asistencias')
            .then(response => response.json())
            .then(data => setAsistencias(data))
            .catch(() => toast.error("Error al cargar asistencias"));
    };

    const fetchCursos = () => {
        fetch('/api/cursos')
            .then(response => response.json())
            .then(data => setCursos(data))
            .catch(() => toast.error("Error al cargar cursos"));
    };

    const handleAsistenciaChange = (estudiante, estado) => {
        setAsistenciaEstados(prevEstados => ({
            ...prevEstados,
            [estudiante.estudiante_id]: {
                estado,
                curso_id: estudiante.curso_id,
            }
        }));
    };

    const handleCursoChange = (e) => {
        setSelectedCurso(e.target.value);  // Cambiar el curso seleccionado
        setEstadoSeleccionado('');  // Limpiar el estado seleccionado cuando se cambia el curso
        setAsistenciaEstados({});   // Limpiar las asistencias previas
        setMarcarPendientes(false);  // Limpiar la marca de los estudiantes pendientes
    };

    const estudiantesPorCurso = () => {
        if (selectedCurso) {
            return estudiantes.filter(estudiante => estudiante.curso_id === parseInt(selectedCurso));
        }
        return [];  // No mostrar estudiantes hasta que se seleccione un curso
    };

    const handleSeleccionarEstado = (estado) => {
        setEstadoSeleccionado(estado);  // Establecer el estado seleccionado para todos los estudiantes del curso
        // Establecer el estado para todos los estudiantes del curso
        const estudiantesFiltrados = estudiantesPorCurso();
        const nuevosEstados = {};
        estudiantesFiltrados.forEach(estudiante => {
            nuevosEstados[estudiante.estudiante_id] = {
                estado,
                curso_id: estudiante.curso_id
            };
        });
        setAsistenciaEstados(nuevosEstados);
    };

    const handleGuardarAsistencia = () => {
        // Verificar que todos los estudiantes del curso seleccionado tengan un estado
        const estudiantesFiltrados = estudiantesPorCurso();

        for (let estudiante of estudiantesFiltrados) {
            if (!asistenciaEstados[estudiante.estudiante_id]?.estado) {
                toast.error(`Falta establecer el estado de asistencia para: ${estudiante.nombre} ${estudiante.apellido}`);
                setMarcarPendientes(true); // Activar la marca de estudiantes pendientes
                return;  // Salir si falta algún estado
            }
        }

        // Si todos los estudiantes tienen estado, proceder a guardar
        const asistenciaData = Object.keys(asistenciaEstados).map(estudianteId => {
            const { estado, curso_id } = asistenciaEstados[estudianteId];

            if (!estado || !curso_id) {
                toast.error("Faltan datos requeridos");
                return null;
            }

            return {
                estudiante_id: parseInt(estudianteId),
                curso_id,
                estado,
            };
        }).filter(item => item !== null);

        if (asistenciaData.length > 0) {
            fetch('/api/asistencias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ asistencias: asistenciaData })
            })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => { throw new Error(text); });
                    }
                    return response.json();
                })
                .then(() => {
                    toast.success("Asistencias guardadas correctamente");
                    fetchAsistencias();
                    setMarcarPendientes(false);  // Desmarcar los estudiantes pendientes después de guardar
                })
                .catch(error => toast.error("Error al guardar asistencias: " + error.message));
        }
    };

    const renderEstudiantes = () => {
        const estudiantesFiltrados = estudiantesPorCurso();

        return (
            <div className="list-group mb-4">
                {estudiantesFiltrados.map(estudiante => {
                    // Determinamos si el estudiante tiene un estado asignado
                    const isEstadoAsignado = !!asistenciaEstados[estudiante.estudiante_id]?.estado;
                    // Determinamos si el estudiante debe marcarse como pendiente
                    const shouldMarkPending = marcarPendientes && !isEstadoAsignado;

                    return (
                        <div 
                            key={estudiante.estudiante_id} 
                            className={`list-group-item d-flex justify-content-between align-items-center border-light rounded mb-2 shadow-sm ${shouldMarkPending ? 'bg-lightblue' : ''}`}  // Color de fondo azul pálido si no tiene estado
                            style={{ backgroundColor: shouldMarkPending ? '#b3d9ff' : '' }}  // Azul pálido si no tiene estado asignado
                        >
                            <span>{estudiante.nombre} {estudiante.apellido}</span>
                            <div className="btn-group" role="group">
                                <button
                                    type="button"
                                    className={`btn ${asistenciaEstados[estudiante.estudiante_id]?.estado === 'P' ? 'btn-success' : 'btn-outline-success'}`}
                                    onClick={() => handleAsistenciaChange(estudiante, 'P')}
                                >
                                    Presente
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${asistenciaEstados[estudiante.estudiante_id]?.estado === 'A' ? 'btn-danger' : 'btn-outline-danger'}`}
                                    onClick={() => handleAsistenciaChange(estudiante, 'A')}
                                >
                                    Ausente
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${asistenciaEstados[estudiante.estudiante_id]?.estado === 'T' ? 'btn-warning' : 'btn-outline-warning'}`}
                                    onClick={() => handleAsistenciaChange(estudiante, 'T')}
                                >
                                    Tarde
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Gestión de Asistencias</h2>

            {/* Selector de Cursos */}
            <div className="mb-4">
                <label htmlFor="cursoSelect" className="form-label">Seleccionar Curso:</label>
                <select
                    id="cursoSelect"
                    className="form-select"
                    onChange={handleCursoChange}
                    value={selectedCurso || ''}
                >
                    <option value="">Seleccione un Curso</option>
                    {cursos.map(curso => (
                        <option key={curso.curso_id} value={curso.curso_id}>
                            {curso.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {/* Selección de Estado de Asistencia para Todos los Estudiantes */}
            {selectedCurso && (
                <div className="mb-4">
                    <button
                        type="button"
                        className="btn btn-success me-2"
                        onClick={() => handleSeleccionarEstado('P')}
                    >
                        Marcar Todos como Presentes
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger me-2"
                        onClick={() => handleSeleccionarEstado('A')}
                    >
                        Marcar Todos como Ausentes
                    </button>
                    <button
                        type="button"
                        className="btn btn-warning me-2"
                        onClick={() => handleSeleccionarEstado('T')}
                    >
                        Marcar Todos como Tarde
                    </button>
                </div>
            )}

            {/* Mostrar Estudiantes por Curso */}
            {selectedCurso && (
                <div className="row">
                    <div className="col-12">
                        {renderEstudiantes()}
                    </div>
                </div>
            )}

            {/* Botón para Guardar Asistencia */}
            <div className="text-center">
                <button className="btn btn-primary mb-4" onClick={handleGuardarAsistencia}>
                    Guardar Asistencia
                </button>
            </div>

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
