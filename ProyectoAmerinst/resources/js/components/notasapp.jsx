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
    const [tipoSeleccionado, setTipoSeleccionado] = useState('Tarea'); // "tarea" por defecto
    const [bimestreSeleccionado, setBimestreSeleccionado] = useState(1); // Primer bimestre por defecto
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

    const handleNotaChange = (e, estudianteId) => {
        const { value } = e.target;
        const notaValue = Math.min(Math.max(parseFloat(value), 0), 10);

        setNotas((prevNotas) => {
            const updatedNotas = [...prevNotas];
            const notaIndex = updatedNotas.findIndex(
                (nota) =>
                    nota.estudiante_id === estudianteId &&
                    nota.materia_id === materiaSeleccionada &&
                    nota.tipo === tipoSeleccionado &&
                    nota.bimestre === bimestreSeleccionado
            );

            if (notaIndex !== -1) {
                // Actualiza la nota existente
                updatedNotas[notaIndex] = {
                    ...updatedNotas[notaIndex],
                    nota: notaValue,
                };
            } else {
                // Crea una nueva nota si no existe
                updatedNotas.push({
                    estudiante_id: estudianteId,
                    materia_id: materiaSeleccionada,
                    curso_id: cursoSeleccionado,
                    tipo: tipoSeleccionado, // Aquí debería ser "Examen" cuando corresponda
                    bimestre: bimestreSeleccionado,
                    nota: notaValue,
                    maestro_id: userId,
                    fecha: new Date().toISOString().split('T')[0],
                });
                
            }

            return updatedNotas;
        });
    };

    const handleSave = async () => {
        const notasFiltradas = notas.filter((nota) =>
            nota.curso_id === cursoSeleccionado &&
            nota.materia_id === materiaSeleccionada &&
            nota.tipo === tipoSeleccionado &&
            nota.bimestre === bimestreSeleccionado &&
            nota.maestro_id === userId
        );
    
        console.log("Notas enviadas al servidor:", notasFiltradas);
    
        if (notasFiltradas.length === 0) {
            toast.error("No hay notas para guardar.");
            return;
        }
    
        setLoading(true);
        try {
            const response = await fetch('/api/notas/bulk-save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notasFiltradas),
            });
            if (!response.ok) throw new Error('Error al guardar notas');
            toast.success('Notas guardadas exitosamente');
            fetchData('/api/notas', setNotas, 'Error al cargar notas');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
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
                        setMateriaSeleccionada(null);
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

            {/* Selector de materia */}
            {cursoSeleccionado && (
                <div className="mb-4">
                    <label htmlFor="materia-select" className="form-label">Seleccionar Materia</label>
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

            {/* Selector de tipo de nota */}
            {materiaSeleccionada && (
                <div className="mb-4">
                    <label htmlFor="tipo-select" className="form-label">Tipo de Nota</label>
                    <select
    id="tipo-select"
    className="form-select"
    value={tipoSeleccionado}
    onChange={(e) => setTipoSeleccionado(e.target.value)}
>
    <option value="Tarea">Tarea</option>
    <option value="Examen">Examen</option>
</select>

                </div>
            )}

            {/* Selector de bimestre */}
            {materiaSeleccionada && (
                <div className="mb-4">
                    <label htmlFor="bimestre-select" className="form-label">Seleccionar Bimestre</label>
                    <select
                        id="bimestre-select"
                        className="form-select"
                        value={bimestreSeleccionado}
                        onChange={(e) => setBimestreSeleccionado(parseInt(e.target.value))}
                    >
                        {[1, 2, 3, 4].map((bimestre) => (
                            <option key={bimestre} value={bimestre}>
                                Bimestre {bimestre}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {loading && <div className="alert alert-info">Guardando...</div>}

            {/* Tabla de notas */}
            {cursoSeleccionado && materiaSeleccionada && (
                <div className="mb-4">
                    <h5>Notas de {tipoSeleccionado} - Bimestre {bimestreSeleccionado}</h5>
                    <table className="table table-bordered">
                        <thead className="table-light">
                            <tr>
                                <th>Estudiante</th>
                                <th>Nota</th>
                            </tr>
                        </thead>
                        <tbody>
                            {estudiantes
                                .filter((est) => est.curso_id === cursoSeleccionado)
                                .map((est) => {
                                    const nota = notas.find(
                                        (n) =>
                                            n.estudiante_id === est.estudiante_id &&
                                            n.materia_id === materiaSeleccionada &&
                                            n.tipo === tipoSeleccionado &&
                                            n.bimestre === bimestreSeleccionado
                                    );
                                    return (
                                        <tr key={est.estudiante_id}>
                                            <td>{est.nombre} {est.apellido}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="10"
                                                    step="0.1"
                                                    value={nota ? nota.nota : ''}
                                                    onChange={(e) => handleNotaChange(e, est.estudiante_id)}
                                                    className="form-control"
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                    <button className="btn btn-primary" onClick={handleSave}>Guardar Notas</button>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default NotasApp;
