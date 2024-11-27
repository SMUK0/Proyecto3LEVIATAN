import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const NotasApp = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [notas, setNotas] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null); // Para almacenar el ID del usuario logueado

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

    useEffect(() => {
        fetchData('/api/estudiantes', setEstudiantes, 'Error al cargar estudiantes');
        fetchData('/api/materias', setMaterias, 'Error al cargar materias');
        fetchData('/api/notas', setNotas, 'Error al cargar notas');
    }, []);

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

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Gestión de Notas</h3>

            {/* Selector de curso */}
            <div className="mb-4">
                <label htmlFor="curso-select" className="form-label">Seleccionar Curso</label>
                <select
                    id="curso-select"
                    className="form-select"
                    value={cursoSeleccionado || ''}
                    onChange={(e) => {
                        setCursoSeleccionado(parseInt(e.target.value));
                        setMateriaSeleccionada(null); // Resetear materia al cambiar curso
                    }}
                >
                    <option value="">-- Seleccione un Curso --</option>
                    {cursos.map((curso) => (
                        <option key={curso.curso_id} value={curso.curso_id}>
                            {`${curso.nombre} - ${curso.grado}`} {/* Aquí agregamos el grado */}
                        </option>
                    ))}
                </select>
            </div>

            {/* Selector de materia (Opcional) */}
            {cursoSeleccionado && (
                <div className="mb-4">
                    <label htmlFor="materia-select" className="form-label">Seleccionar Materia (Opcional)</label>
                    <select
                        id="materia-select"
                        className="form-select"
                        value={materiaSeleccionada || ''}
                        onChange={(e) => setMateriaSeleccionada(parseInt(e.target.value))}
                    >
                        <option value="">-- Seleccione una Materia --</option>
                        {materias.map((materia) => (
                            <option key={materia.materia_id} value={materia.materia_id}>
                                {materia.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {loading && <div className="alert alert-info">Guardando...</div>}

            {/* Tabla de notas */}
            {cursoSeleccionado && (
                <div className="mb-4">
                    <h5>Notas</h5>
                    <table className="table table-bordered">
                        <thead className="table-light">
                            <tr>
                                <th>Estudiante</th>
                                <th>Nota</th>
                                <th>Tipo de Nota</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {estudiantes
                                .filter((est) => est.curso_id === cursoSeleccionado) // Filtrar estudiantes por curso
                                .map((est) => {
                                    // Filtrar notas para ese estudiante y curso
                                    const notasFiltradas = materiaSeleccionada
                                        ? notas.filter(
                                            (nota) =>
                                                nota.estudiante_id === est.estudiante_id &&
                                                nota.materia_id === materiaSeleccionada &&
                                                nota.curso_id === cursoSeleccionado
                                        )
                                        : notas.filter(
                                            (nota) =>
                                                nota.estudiante_id === est.estudiante_id &&
                                                nota.curso_id === cursoSeleccionado
                                        );

                                    // Si no hay notas para el estudiante y materia seleccionada, no mostrar nada
                                    if (notasFiltradas.length === 0) return null;

                                    return notasFiltradas
                                        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) // Ordenar por fecha
                                        .map((nota) => {
                                            return (
                                                <tr key={nota.estudiante_id + nota.bimestre + nota.tipo}>
                                                    <td>{est.nombre} {est.apellido}</td>
                                                    <td>{nota.nota !== undefined ? nota.nota : 'Sin nota'}</td>
                                                    <td>{nota.tipo}</td>
                                                    <td>{nota.fecha ? new Date(nota.fecha).toLocaleDateString() : 'Sin fecha'}</td>
                                                </tr>
                                            );
                                        });
                                })}
                        </tbody>
                    </table>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default NotasApp;
