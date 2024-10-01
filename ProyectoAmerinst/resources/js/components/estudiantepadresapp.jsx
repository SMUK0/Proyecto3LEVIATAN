import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../css/app.css';
import Swal from 'sweetalert2';

const App = () => {
    const [relaciones, setRelaciones] = useState([]);
    const [form, setForm] = useState({ estudiante_id: '', padre_id: '' });
    const [editMode, setEditMode] = useState(false);
    const [editIds, setEditIds] = useState(null);
    const [loading, setLoading] = useState(false);

    // Obtener todas las relaciones estudiante-padre
    useEffect(() => {
        fetch('/api/estudiante-padre')
            .then(response => response.json())
            .then(data => setRelaciones(data))
            .catch(() => Swal.fire('Error', 'Error al cargar relaciones', 'error'));
    }, []);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Crear o actualizar una relación estudiante-padre
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

    // Editar relación estudiante-padre
    const handleEdit = (relacion) => {
        setForm({ estudiante_id: relacion.estudiante_id, padre_id: relacion.padre_id });
        setEditIds({ estudiante_id: relacion.estudiante_id, padre_id: relacion.padre_id });
        setEditMode(true);
    };

    // Eliminar relación estudiante-padre
    const handleDelete = (estudiante_id, padre_id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no puede deshacerse",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
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
        <div className="container mt-5">
            <h1 className="text-center mb-4">CRUD Estudiante-Padres</h1>

            <button className="btn btn-success mb-3" onClick={() => setEditMode(false)}>Agregar Relación</button>

            <table className="table table-striped">
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
                                <button className="btn btn-warning me-2" onClick={() => handleEdit(relacion)}>Editar</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(relacion.estudiante_id, relacion.padre_id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editMode && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Estudiante ID</label>
                        <input type="text" name="estudiante_id" value={form.estudiante_id} onChange={handleChange} className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Padre ID</label>
                        <input type="text" name="padre_id" value={form.padre_id} onChange={handleChange} className="form-control" required />
                    </div>
                    <button type="submit" className="btn btn-primary">{editMode ? 'Actualizar' : 'Agregar'}</button>
                </form>
            )}
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('crud-estudiante-padre')).render(<App />);
