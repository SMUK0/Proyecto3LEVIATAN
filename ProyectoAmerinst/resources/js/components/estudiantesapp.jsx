import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';

const EstudiantesApp = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        grado: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch('/api/estudiantes')
            .then(response => response.json())
            .then(data => setEstudiantes(data))
            .catch(() => toast.error("Error al cargar estudiantes"));
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
        const url = editMode ? `/api/estudiantes/${editId}` : '/api/estudiantes';

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
                setEstudiantes(estudiantes.map(est => est.estudiante_id === editId ? data : est));
                toast.success("Estudiante actualizado exitosamente");
            } else {
                setEstudiantes([...estudiantes, data]);
                toast.success("Estudiante agregado exitosamente");
            }
            setShowModal(false);
            setForm({ nombre: '', apellido: '', fecha_nacimiento: '', grado: '' });
            setEditMode(false);
        })
        .catch(() => toast.error("Error al crear o actualizar el estudiante"))
        .finally(() => setLoading(false));
    };

    const handleEdit = (estudiante) => {
        setForm({
            nombre: estudiante.nombre,
            apellido: estudiante.apellido,
            fecha_nacimiento: estudiante.fecha_nacimiento,
            grado: estudiante.grado
        });
        setEditId(estudiante.estudiante_id);
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
                fetch(`/api/estudiantes/${id}`, { method: 'DELETE' })
                .then(() => {
                    setEstudiantes(estudiantes.filter(est => est.estudiante_id !== id));
                    toast.success("Estudiante eliminado exitosamente");
                })
                .catch(() => toast.error("Error al eliminar estudiante"))
                .finally(() => setLoading(false));
            }
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            {loading && <div>Cargando...</div>}

            <div>
                <button onClick={() => setShowModal(true)}>Agregar Estudiante</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Fecha Nacimiento</th>
                        <th>Grado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {estudiantes.map(est => (
                        <tr key={est.estudiante_id}>
                            <td>{est.estudiante_id}</td>
                            <td>{est.nombre}</td>
                            <td>{est.apellido}</td>
                            <td>{est.fecha_nacimiento}</td>
                            <td>{est.grado}</td>
                            <td>
                                <button onClick={() => handleEdit(est)}>Editar</button>
                                <button onClick={() => handleDelete(est.estudiante_id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div>
                    <div>
                        <div>
                            <h5>{editMode ? 'Editar Estudiante' : 'Agregar Estudiante'}</h5>
                            <button onClick={handleCloseModal}>Cerrar</button>
                        </div>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label>Nombre</label>
                                    <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Apellido</label>
                                    <input type="text" name="apellido" value={form.apellido} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Fecha Nacimiento</label>
                                    <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Grado</label>
                                    <input type="text" name="grado" value={form.grado} onChange={handleChange} required />
                                </div>
                                <button type="submit" disabled={loading}>
                                    {editMode ? 'Actualizar Estudiante' : 'Agregar Estudiante'}
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
    const rootElement = document.getElementById('crud-estudiante');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<EstudiantesApp />);
    } else {
        console.error("No se encontró el contenedor con id 'crud-estudiante'");
    }
};

export default EstudiantesApp;
