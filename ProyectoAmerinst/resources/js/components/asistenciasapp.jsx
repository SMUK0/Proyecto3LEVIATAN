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
    const [userId, setUserId] = useState(null); // ID del usuario logueado

    // Obtener el usuario logueado al cargar el componente
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user')); // Suponiendo que está en localStorage
        if (user && user.user_id) {
            setUserId(user.user_id);
            console.log(`Usuario logueado ID: ${user.user_id}`); // Depuración
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
            console.log('Cursos relacionados:', data); // Mostrar cursos en consola
            setCursos(data);
        } catch (error) {
            console.error('Error al obtener los cursos:', error);
            toast.error('No se pudieron cargar los cursos');
        }
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
        const estudiantesFiltrados = estudiantesPorCurso();

        for (let estudiante of estudiantesFiltrados) {
            if (!asistenciaEstados[estudiante.estudiante_id]?.estado) {
                toast.error(`Falta establecer el estado de asistencia para: ${estudiante.nombre} ${estudiante.apellido}`);
                setMarcarPendientes(true); // Activar la marca de estudiantes pendientes
                return;  // Salir si falta algún estado
            }
        }

        const asistenciaData = Object.keys(asistenciaEstados).map(estudianteId => {
            const { estado, curso_id } = asistenciaEstados[estudianteId];
            return {
                estudiante_id: parseInt(estudianteId),
                curso_id,
                estado,
            };
        });

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
                    const isEstadoAsignado = !!asistenciaEstados[estudiante.estudiante_id]?.estado;
                    const shouldMarkPending = marcarPendientes && !isEstadoAsignado;

                    return (
                        <div 
                            key={estudiante.estudiante_id} 
                            className={`list-group-item d-flex justify-content-between align-items-center ${shouldMarkPending ? 'bg-lightblue' : ''}`}
                            style={{ backgroundColor: shouldMarkPending ? '#b3d9ff' : '' }}
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

            {selectedCurso && <div className="row">{renderEstudiantes()}</div>}

            <div className="text-center">
                <button className="btn btn-primary mb-4" onClick={handleGuardarAsistencia}>
                    Guardar Asistencia
                </button>
            </div>

            <ToastContainer />
        </div>
    );
};

export default AsistenciasApp;
