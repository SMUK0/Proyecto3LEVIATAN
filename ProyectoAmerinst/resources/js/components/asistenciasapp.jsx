import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
    const [asistencias, setAsistencias] = useState([]);
    const [form, setForm] = useState({
        estudiante_id: '',
        curso_id: '',
        fecha: '',
        estado: '',
        observaciones: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch('/api/asistencias')
            .then(response => response.json())
            .then(data => setAsistencias(data))
            .catch(() => toast.error("Error al cargar asistencias"));
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/asistencias/${editId}` : '/api/asistencias';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form)
        })
        .then(response => response.json())
        .then(data => {
            if (editMode) {
                setAsistencias(asistencias.map(asistencia => asistencia.asistencia_id === editId ? data : asistencia));
                toast.success("Asistencia actualizada exitosamente");
            } else {
                setAsistencias([...asistencias, data]);
                toast.success("Asistencia agregada exitosamente");
            }
            setShowModal(false);
            setForm({ estudiante_id: '', curso_id: '', fecha: '', estado: '', observaciones: '' });
            setEditMode(false);
        })
        .catch(() => toast.error("Error al crear o actualizar la asistencia"))
        .finally(() => setLoading(false));
    };

    const handleEdit = (asistencia) => {
        setForm({
            estudiante_id: asistencia.estudiante_id,
            curso_id: asistencia.curso_id,
            fecha: asistencia.fecha,
            estado: asistencia.estado,
            observaciones: asistencia.observaciones || ''
        });
        setEditId(asistencia.asistencia_id);
        setEditMode(true);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                fetch(`/api/asistencias/${id}`, { method: 'DELETE' })
                .then(() => {
                    setAsistencias(asistencias.filter(asistencia => asistencia.asistencia_id !== id));
                    toast.success("Asistencia eliminada exitosamente");
                    Swal.fire('Eliminado!', 'La asistencia ha sido eliminada.', 'success');
                })
                .catch(() => toast.error("Error al eliminar la asistencia"))
                .finally(() => setLoading(false));
            }
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ estudiante_id: '', curso_id: '', fecha: '', estado: '', observaciones: '' });
        setEditMode(false);
    };

    return (
        <div>
            {loading && <div>Cargando...</div>}

            <div>
                <button onClick={() => setShowModal(true)}>Agregar Asistencia</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Estudiante</th>
                        <th>Curso</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {asistencias.map(asistencia => (
                        <tr key={asistencia.asistencia_id}>
                            <td>{asistencia.asistencia_id}</td>
                            <td>{asistencia.estudiante_id}</td>
                            <td>{asistencia.curso_id}</td>
                            <td>{asistencia.fecha}</td>
                            <td>{asistencia.estado}</td>
                            <td>
                                <button onClick={() => handleEdit(asistencia)}>Editar</button>
                                <button onClick={() => handleDelete(asistencia.asistencia_id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div>
                    <div>
                        <div>
                            <h5>{editMode ? 'Editar Asistencia' : 'Agregar Asistencia'}</h5>
                            <button onClick={handleCloseModal}>Cerrar</button>
                        </div>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label>ID Estudiante</label>
                                    <input type="number" name="estudiante_id" value={form.estudiante_id} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>ID Curso</label>
                                    <input type="number" name="curso_id" value={form.curso_id} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Fecha</label>
                                    <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Estado</label>
                                    <select name="estado" value={form.estado} onChange={handleChange} required>
                                        <option value="Presente">Presente</option>
                                        <option value="Ausente">Ausente</option>
                                        <option value="Tarde">Tarde</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Observaciones</label>
                                    <textarea name="observaciones" value={form.observaciones} onChange={handleChange}></textarea>
                                </div>
                                <button type="submit" disabled={loading}>
                                    {editMode ? 'Actualizar Asistencia' : 'Agregar Asistencia'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('crud-asistencias')).render(<App />);
