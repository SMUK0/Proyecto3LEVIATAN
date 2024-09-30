import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // FontAwesome
import '../../css/app.css'; // Archivo CSS personalizado
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'sweetalert2/dist/sweetalert2.min.css';

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

    // Obtener todas las notas al cargar la página
    useEffect(() => {
        fetch('/api/notas')
            .then(response => response.json())
            .then(data => setNotas(data))
            .catch(() => toast.error("Error al cargar notas"));
    }, []);

    // Manejar cambios en los inputs del formulario
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Crear o actualizar una nota
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

    // Editar una nota
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

    // Eliminar una nota
    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
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

    // Cerrar el modal
    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ estudiante_id: '', curso_id: '', materia_id: '', maestro_id: '', nota: '', fecha: '', observaciones: '' });
        setEditMode(false);
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">CRUD Notas</h1>

            {/* Spinner de carga */}
            {loading && (
                <div className="d-flex justify-content-center mb-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Cargando...</span>
                    </div>
                </div>
            )}

            {/* Botón para abrir el modal de agregar */}
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-success" onClick={() => setShowModal(true)}>
                    <i className="fas fa-plus"></i> Agregar Nota
                </button>
            </div>

            {/* Tabla de notas */}
            <table className="table table-striped table-hover">
                <thead className="table-success">
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
                                <button className="btn btn-warning me-2" onClick={() => handleEdit(nota)}>
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button className="btn btn-danger" onClick={() => handleDelete(nota.nota_id)}>
                                    <i className="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal de agregar/editar */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">{editMode ? 'Editar Nota' : 'Agregar Nota'}</h5>
                                <button className="btn-close text-white" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">ID Estudiante</label>
                                        <input type="number" name="estudiante_id" className="form-control" value={form.estudiante_id} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">ID Curso</label>
                                        <input type="number" name="curso_id" className="form-control" value={form.curso_id} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">ID Materia</label>
                                        <input type="number" name="materia_id" className="form-control" value={form.materia_id} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">ID Maestro</label>
                                        <input type="number" name="maestro_id" className="form-control" value={form.maestro_id} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Nota</label>
                                        <input type="number" step="0.01" name="nota" className="form-control" value={form.nota} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Fecha</label>
                                        <input type="date" name="fecha" className="form-control" value={form.fecha} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Observaciones</label>
                                        <textarea name="observaciones" className="form-control" value={form.observaciones} onChange={handleChange}></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                        {editMode ? 'Actualizar Nota' : 'Agregar Nota'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Notificaciones y alertas */}
            <ToastContainer />
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('crud-notas')).render(<App />);
