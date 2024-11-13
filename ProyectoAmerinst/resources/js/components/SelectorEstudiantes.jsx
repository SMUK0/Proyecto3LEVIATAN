import React from 'react';

const SelectorEstudiantes = ({ cursos, onCursoSelect }) => (
    <div className="mb-3">
        <label htmlFor="cursoSelect">Selecciona un curso:</label>
        <select id="cursoSelect" className="form-select" onChange={(e) => onCursoSelect(e.target.value)}>
            <option value="">Selecciona un curso</option>
            {cursos.map((curso) => (
                <option key={curso.curso_id} value={curso.curso_id}>
                    {curso.nombre} - {curso.grado}
                </option>
            ))}
        </select>
    </div>
);

export default SelectorEstudiantes;
