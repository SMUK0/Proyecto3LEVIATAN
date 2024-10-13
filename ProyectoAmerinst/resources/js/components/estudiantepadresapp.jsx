import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';

const App = () => {
    const [relaciones, setRelaciones] = useState([]);
    const [form, setForm] = useState({ estudiante_id: '', padre_id: '' });
    const [editMode, setEditMode] = useState(false);
    const [editIds, setEditIds] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/api/estudiante-padre')
            .then(response => response.json())
            .then(data => setRelaciones(data))
            .catch(() => Swal.fire('Error', 'Error al cargar relaciones', 'error'));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/estudiante-padre/${editIds.estudiante_id}/${editIds.padre_id}` : '/api/estudiante-padre';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(response => response.json())
            .then(data => {
                if (editMode) {
                    setRelaciones(relaciones.map(relacion => 
                        (relacion.estudiante_id === editIds.estudiante_id && relacion.padre_id === editIds.padre_id) ? data : relacion
                    ));
                    Swal.fire('Actualizado', 'Relación actualizada exitosamente', 'success');
                } else {
                    setRelaciones([...relaciones, data]);
                    Swal.fire('Creado', 'Relación creada exitosamente', 'success');
                }
                setForm({ estudiante_id: '', padre_id: '' });
                setEditMode(false);
            })
            .catch(() => Swal.fire('Error', 'Error al crear o actualizar relación', 'error'))
            .finally(() => setLoading(false));
    };

    const handleEdit = (relacion) => {
        setForm({ estudiante_id: relacion.estudiante_id, padre_id: relacion.padre_id });
        setEditIds({ estudiante_id: relacion.estudiante_id, padre_id: relacion.padre_id });
        setEditMode(true);
    };

    const handleDelete = (estudiante_id, padre_id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no puede deshacerse",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/api/estudiante-padre/${estudiante_id}/${padre_id}`, { method: 'DELETE' })
                    .then(() => {
                        setRelaciones(relaciones.filter(relacion => !(relacion.estudiante_id === estudiante_id && relacion.padre_id === padre_id)));
                        Swal.fire('Eliminado', 'Relación eliminada exitosamente', 'success');
                    })
                    .catch(() => Swal.fire('Error', 'Error al eliminar relación', 'error'));
            }
        });
    };

    return (
        <div>
            <h1>CRUD Estudiante-Padres</h1>

            <button onClick={() => setEditMode(false)}>Agregar Relación</button>

            <table>
                <thead>
                    <tr>
                        <th>Estudiante ID</th>
                        <th>Padre ID</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {relaciones.map(relacion => (
                        <tr key={`${relacion.estudiante_id}-${relacion.padre_id}`}>
                            <td>{relacion.estudiante_id}</td>
                            <td>{relacion.padre_id}</td>
                            <td>
                                <button onClick={() => handleEdit(relacion)}>Editar</button>
                                <button onClick={() => handleDelete(relacion.estudiante_id, relacion.padre_id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editMode && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Estudiante ID</label>
                        <input type="text" name="estudiante_id" value={form.estudiante_id} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Padre ID</label>
                        <input type="text" name="padre_id" value={form.padre_id} onChange={handleChange} required />
                    </div>
                    <button type="submit">{editMode ? 'Actualizar' : 'Agregar'}</button>
                </form>
            )}
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('crud-estudiante-padre')).render(<App />);
