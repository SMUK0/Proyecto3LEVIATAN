import React, { useEffect, useState } from 'react';

const CalendarioAsistencia = ({ estudiantes, cursoId, onSave }) => {
    const [asistencias, setAsistencias] = useState({});
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    useEffect(() => {
        const initialAsistencias = {};
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        estudiantes.forEach(estudiante => {
            initialAsistencias[estudiante.estudiante_id] = {};
            for (let day = 1; day <= daysInMonth; day++) {
                initialAsistencias[estudiante.estudiante_id][day] = 'P'; // Default to "Presente"
            }
        });
        
        setAsistencias(initialAsistencias);
    }, [estudiantes, year, month]);

    const handleChange = (estudianteId, day, value) => {
        setAsistencias(prev => ({
            ...prev,
            [estudianteId]: { ...prev[estudianteId], [day]: value }
        }));
    };

    const saveAsistencias = () => {
        onSave(asistencias);
    };

    return (
        <div className="calendar-container">
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Estudiante</th>
                        {[...Array(31)].map((_, i) => (
                            <th key={i + 1}>{i + 1}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {estudiantes.map(estudiante => (
                        <tr key={estudiante.estudiante_id}>
                            <td>{estudiante.nombre} {estudiante.apellido}</td>
                            {[...Array(31)].map((_, day) => (
                                <td key={day + 1}>
                                    <select
                                        value={asistencias[estudiante.estudiante_id]?.[day + 1] || 'P'}
                                        onChange={(e) =>
                                            handleChange(estudiante.estudiante_id, day + 1, e.target.value)
                                        }
                                    >
                                        <option value="P">P</option>
                                        <option value="A">A</option>
                                        <option value="T">T</option>
                                    </select>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={saveAsistencias} className="btn btn-primary mt-3">Guardar Asistencias</button>
        </div>
    );
};

export default CalendarioAsistencia;
