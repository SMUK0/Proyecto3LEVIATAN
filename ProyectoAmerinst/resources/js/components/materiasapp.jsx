import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';

const MateriasApp = () => {
    const [materias, setMaterias] = useState([]);
    const [form, setForm] = useState({
        nombre: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch('/api/materias')
            .then(response => response.json())
            .then(data => setMaterias(data))
            .catch(() => toast.error("Error al cargar materias"));
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
        const url = editMode ? `/api/materias/${editId}` : '/api/materias';

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
                setMaterias(materias.map(materia => materia.materia_id === editId ? data : materia));
                toast.success("Materia actualizada exitosamente");
            } else {
                setMaterias([...materias, data]);
                toast.success("Materia agregada exitosamente");
            }
            setShowModal(false);
            setForm({ nombre: '' });
            setEditMode(false);
        })
        .catch(() => {
            toast.error("Error al crear o actualizar la materia");
        })
        .finally(() => setLoading(false));
    };

    const handleEdit = (materia) => {
        setForm({
            nombre: materia.nombre
        });
        setEditId(materia.materia_id);
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
                fetch(`/api/materias/${id}`, { method: 'DELETE' })
                .then(() => {
                    setMaterias(materias.filter(materia => materia.materia_id !== id));
                    toast.success("Materia eliminada exitosamente");
                    Swal.fire('Eliminado!', 'La materia ha sido eliminada.', 'success');
                })
                .catch(() => {
                    toast.error("Error al eliminar la materia");
                })
                .finally(() => setLoading(false));
            }
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ nombre: '' });
        setEditMode(false);
    };

    return (
        <div>
            {loading && <div>Cargando...</div>}

            <div>
                <button onClick={() => setShowModal(true)}>Agregar Materia</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {materias.map(materia => (
                        <tr key={materia.materia_id}>
                            <td>{materia.materia_id}</td>
                            <td>{materia.nombre}</td>
                            <td>
                                <button onClick={() => handleEdit(materia)}>Editar</button>
                                <button onClick={() => handleDelete(materia.materia_id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div>
                    <div>
                        <div>
                            <h5>{editMode ? 'Editar Materia' : 'Agregar Materia'}</h5>
                            <button onClick={handleCloseModal}>Cerrar</button>
                        </div>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label>Nombre</label>
                                    <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
                                </div>
                                <button type="submit" disabled={loading}>
                                    {editMode ? 'Actualizar Materia' : 'Agregar Materia'}
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
