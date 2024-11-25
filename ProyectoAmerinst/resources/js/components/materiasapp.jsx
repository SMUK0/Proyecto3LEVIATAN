import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const MateriasApp = () => {
    const [materias, setMaterias] = useState([]);
    const [form, setForm] = useState({ nombre: '' });
    const [errors, setErrors] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch('/api/materias')
            .then(response => response.ok ? response.json() : Promise.reject('Error al cargar materias'))
            .then(data => setMaterias(data))
            .catch(() => toast.error("Error al cargar materias"));
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!form.nombre.trim()) newErrors.nombre = 'El nombre de la materia es obligatorio';
        else if (form.nombre.length > 100) newErrors.nombre = 'El nombre de la materia no debe exceder los 100 caracteres';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Por favor corrige los errores en el formulario");
            return;
        }
        setLoading(true);
        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/materias/${editId}` : '/api/materias';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(response => response.ok ? response.json() : Promise.reject('Error al guardar la materia'))
            .then(data => {
                if (editMode) {
                    setMaterias(materias.map(materia => materia.materia_id === editId ? data : materia));
                    toast.success("Materia actualizada exitosamente");
                } else {
                    setMaterias([...materias, data]);
                    toast.success("Materia agregada exitosamente");
                }
                handleCloseModal();
            })
            .catch(() => toast.error("Error al crear o actualizar la materia"))
            .finally(() => setLoading(false));
    };

    const handleShowAddForm = () => {
        setForm({ nombre: '' });
        setEditMode(false);
        setEditId(null);
        setErrors({});
        setShowModal(true);
    };

    const handleEdit = (materia) => {
        setForm({ nombre: materia.nombre });
        setEditId(materia.materia_id);
        setEditMode(true);
        setErrors({});
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
                fetch(`/api/materias/${id}`, { method: 'DELETE' })
                    .then(() => {
                        setMaterias(materias.filter(materia => materia.materia_id !== id));
                        toast.success("Materia eliminada exitosamente");
                        Swal.fire('Eliminado!', 'La materia ha sido eliminada.', 'success');
                    })
                    .catch(() => toast.error("Error al eliminar la materia"))
                    .finally(() => setLoading(false));
            }
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ nombre: '' });
        setEditMode(false);
        setEditId(null);
        setErrors({});
    };

    return (
        <div className="container my-4">
<h2 className="mt-4 mb-4">Gestión de Materias</h2>
{loading && <div className="alert alert-info">Cargando...</div>}
            <button className="btn btn-primary mb-3" onClick={handleShowAddForm}>
                Agregar Materia
            </button>
            

            <table className="table table-hover table-bordered">
    <thead className="table-dark">
        <tr>
            <th className="text-center">Nombre de la Materia</th>
            <th className="text-center" style={{ width: '20px' }}>Acciones</th>
        </tr>
    </thead>
    <tbody>
        {materias.map(materia => (
            <tr key={materia.materia_id}>
                <td>{materia.nombre}</td>
                <td className="text-center" style={{ width: '200px' }}>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(materia)}>
                        Editar
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(materia.materia_id)}>
                        Eliminar
                    </button>
                </td>
            </tr>
        ))}
    </tbody>
</table>



            {showModal && (
                <div className="modal show fade" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editMode ? 'Editar Materia' : 'Agregar Materia'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            className="form-control"
                                            value={form.nombre}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.nombre && <div className="text-danger">{errors.nombre}</div>}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                        Cerrar
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {editMode ? 'Actualizar Materia' : 'Agregar Materia'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

// Montaje manual para pruebas
window.onload = () => {
    const rootElement = document.getElementById('crud-materia');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<MateriasApp />);
    } else {
        console.error("No se encontró el contenedor con id 'crud-materia'");
    }
};

export default MateriasApp;
