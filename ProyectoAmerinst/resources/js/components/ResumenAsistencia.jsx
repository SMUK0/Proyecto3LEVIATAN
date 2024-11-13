import React from 'react';

const ResumenAsistencia = ({ resumen }) => (
    <div className="mt-4">
        <h4>Resumen de Asistencias</h4>
        <table className="table table-bordered">
            <thead>
                <tr>
                    <th>Estudiante</th>
                    <th>Presente</th>
                    <th>Ausente</th>
                    <th>Tarde</th>
                </tr>
            </thead>
            <tbody>
                {resumen.map(({ nombre, apellido, presente, ausente, tarde }) => (
                    <tr key={nombre + apellido}>
                        <td>{nombre} {apellido}</td>
                        <td>{presente}</td>
                        <td>{ausente}</td>
                        <td>{tarde}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default ResumenAsistencia;
