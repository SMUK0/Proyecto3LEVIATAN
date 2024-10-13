import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
    const [notas, setNotas] = useState([]);
    const [form, setForm] = useState({
        estudiante_id: '',
        curso_id: '',
        materia_id: '',
        maestro_id: '',
        nota: '',
        fecha: '',
        observaciones: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch('/api/notas')
            .then(response => response.json())
            .then(data => setNotas(data))
            .catch(() => toast.error("Error al cargar notas"));
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
        const url = editMode ? `/api/notas/${editId}` : '/api/notas';

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
                setNotas(notas.map(nota => nota.nota_id === editId ? data : nota));
                toast.success("Nota actualizada exitosamente");
            } else {
                setNotas([...notas, data]);
                toast.success("Nota agregada exitosamente");
            }
            setShowModal(false);
            setForm({ estudiante_id: '', curso_id: '', materia_id: '', maestro_id: '', nota: '', fecha: '', observaciones: '' });
            setEditMode(false);
        })
        .catch(() => toast.error("Error al crear o actualizar la nota"))
        .finally(() => setLoading(false));
    };

    const handleEdit = (nota) => {
        setForm({
            estudiante_id: nota.estudiante_id,
            curso_id: nota.curso_id,
            materia_id: nota.materia_id,
            maestro_id: nota.maestro_id,
            nota: nota.nota,
            fecha: nota.fecha,
            observaciones: nota.observaciones || ''
        });
        setEditId(nota.nota_id);
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
                fetch(`/api/notas/${id}`, { method: 'DELETE' })
                .then(() => {
                    setNotas(notas.filter(nota => nota.nota_id !== id));
                    toast.success("Nota eliminada exitosamente");
                    Swal.fire('Eliminado!', 'La nota ha sido eliminada.', 'success');
                })
                .catch(() => toast.error("Error al eliminar la nota"))
                .finally(() => setLoading(false));
            }
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ estudiante_id: '', curso_id: '', materia_id: '', maestro_id: '', nota: '', fecha: '', observaciones: '' });
        setEditMode(false);
    };

    return (
        <div>
            <h1>CRUD Notas</h1>

            {loading && <div>Cargando...</div>}

            <div>
                <button onClick={() => setShowModal(true)}>Agregar Nota</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Estudiante</th>
                        <th>Curso</th>
                        <th>Materia</th>
                        <th>Maestro</th>
                        <th>Nota</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {notas.map(nota => (
                        <tr key={nota.nota_id}>
                            <td>{nota.nota_id}</td>
                            <td>{nota.estudiante_id}</td>
                            <td>{nota.curso_id}</td>
                            <td>{nota.materia_id}</td>
                            <td>{nota.maestro_id}</td>
                            <td>{nota.nota}</td>
                            <td>{nota.fecha}</td>
                            <td>
                                <button onClick={() => handleEdit(nota)}>Editar</button>
                                <button onClick={() => handleDelete(nota.nota_id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div>
                    <div>
                        <div>
                            <h5>{editMode ? 'Editar Nota' : 'Agregar Nota'}</h5>
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
                                    <label>ID Materia</label>
                                    <input type="number" name="materia_id" value={form.materia_id} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>ID Maestro</label>
                                    <input type="number" name="maestro_id" value={form.maestro_id} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Nota</label>
                                    <input type="number" step="0.01" name="nota" value={form.nota} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Fecha</label>
                                    <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Observaciones</label>
                                    <textarea name="observaciones" value={form.observaciones} onChange={handleChange}></textarea>
                                </div>
                                <button type="submit" disabled={loading}>
                                    {editMode ? 'Actualizar Nota' : 'Agregar Nota'}
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

ReactDOM.createRoot(document.getElementById('crud-notas')).render(<App />);
