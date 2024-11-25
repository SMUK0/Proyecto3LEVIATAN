import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotasEstudiantes = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [notas, setNotas] = useState([]);
    const [materias, setMaterias] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(null); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user'));
                if (!userData || userData.rol_id !== 3) {
                    window.location.href = '/login';
                    return;
                }

                console.log(`Usuario logueado ID: ${userData.user_id}`);

                const estudiantesData = await fetchEstudiantes(userData.user_id);

                if (estudiantesData && estudiantesData.length > 0) {
                    const estudiantesIds = estudiantesData.map((est) => est.estudiante_id);
                    await fetchNotas(estudiantesIds);
                    await fetchMaterias();
                }
            } catch (error) {
                console.error('Error al procesar usuario:', error);
                toast.error('Hubo un problema al cargar los datos del usuario.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchEstudiantes = async (userId) => {
        try {
            const response = await fetch(`/api/estudiantes/relacionados/${userId}`);
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error de backend:', errorData);
                throw new Error(errorData.message || 'Error al cargar estudiantes');
            }

            const estudiantesData = await response.json();
            setEstudiantes(estudiantesData);

            return estudiantesData;
        } catch (error) {
            console.error('Error en fetchEstudiantes:', error.message);
            toast.error('No se pudo cargar la lista de estudiantes.');
            return [];
        }
    };

    const fetchNotas = async (estudiantesIds) => {
        try {
            const response = await fetch('/api/notas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estudiantes_ids: estudiantesIds }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al cargar notas: ${errorText}`);
            }

            const notasData = await response.json();
            setNotas(notasData);
        } catch (error) {
            console.error('Error al recuperar notas:', error.message);
            toast.error('No se pudieron cargar las notas.');
        }
    };

    const fetchMaterias = async () => {
        try {
            const response = await fetch('/api/materias');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al cargar materias');
            }

            const materiasData = await response.json();
            setMaterias(materiasData);
        } catch (error) {
            console.error('Error al recuperar materias:', error.message);
            toast.error('No se pudieron cargar las materias.');
        }
    };

    const notasFiltradas = materiaSeleccionada
        ? notas.filter((nota) => nota.materia_nombre === materiaSeleccionada)
        : notas;

    if (loading) {
        return <div className="loading">Cargando datos...</div>;
    }

    if (estudiantes.length === 0) {
        return <div>No hay estudiantes relacionados para mostrar.</div>;
    }

    return (
        <div className="container p-4">
            <h2 className="text-center mb-4">Notas de los Estudiantes</h2>

            {/* Dropdown para seleccionar la materia */}
            <div className="form-group mb-4">
                <label htmlFor="materia">Seleccionar Materia:</label>
                <select
                    id="materia"
                    value={materiaSeleccionada || ''}
                    onChange={(e) => setMateriaSeleccionada(e.target.value)}
                    className="form-control"
                >
                    <option value="">Todas</option>
                    {materias.map((materia) => (
                        <option key={materia.materia_id} value={materia.nombre}>
                            {materia.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className="row">
                {estudiantes.map((estudiante) => (
                    <div key={estudiante.estudiante_id} className="col-md-6 col-lg-4 mb-4">
                        <div className="card shadow-sm p-3 mb-5 bg-white rounded">
                            <div className="card-body">
                                <h5 className="card-title">
                                    <strong>{estudiante.nombre} {estudiante.apellido}</strong>
                                </h5>
                                <p className="card-text">
                                    <strong>ID Estudiante:</strong> {estudiante.estudiante_id}
                                </p>
                                {/* Tabla de notas */}
                                <table className="table table-striped table-sm">
                                    <thead>
                                        <tr>
                                            <th>Nota</th>
                                            <th>Materia</th>
                                            <th>Bimestre</th>
                                            <th>Tipo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {notasFiltradas.filter((nota) => nota.estudiante_id === estudiante.estudiante_id).length > 0 ? (
                                            notasFiltradas
                                                .filter((nota) => nota.estudiante_id === estudiante.estudiante_id)
                                                .map((nota) => (
                                                    <tr key={nota.nota_id || nota.nota}>
                                                        <td>{nota.nota}</td>
                                                        <td>{nota.materia_nombre}</td>
                                                        <td>{nota.bimestre}</td>
                                                        <td>{nota.tipo}</td>
                                                    </tr>
                                                ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center">No hay notas disponibles</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
};

export default NotasEstudiantes;
