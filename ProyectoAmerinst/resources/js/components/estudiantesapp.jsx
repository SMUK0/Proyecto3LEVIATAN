import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const EstudiantesApp = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        curso_id: ''
    });
    const [errors, setErrors] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch('/api/estudiantes')
            .then(response => response.ok ? response.json() : Promise.reject('Error al cargar estudiantes'))
            .then(data => setEstudiantes(data))
            .catch(() => toast.error("Error al cargar estudiantes"));

        fetch('/api/cursos')
            .then(response => response.ok ? response.json() : Promise.reject('Error al cargar cursos'))
            .then(data => setCursos(data))
            .catch(() => toast.error("Error al cargar cursos"));
    }, []);

    const calculateAge = (fecha_nacimiento) => {
        const birthDate = new Date(fecha_nacimiento);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const isValidAge = (fecha_nacimiento) => {
        const age = calculateAge(fecha_nacimiento);
        return age >= 12 && age <= 20;
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
        else if (!/^[a-zA-Z\s]+$/.test(form.nombre)) newErrors.nombre = 'El nombre solo debe contener letras y espacios';

        if (!form.apellido.trim()) newErrors.apellido = 'El apellido es obligatorio';
        else if (!/^[a-zA-Z\s]+$/.test(form.apellido)) newErrors.apellido = 'El apellido solo debe contener letras y espacios';

        if (!form.fecha_nacimiento) newErrors.fecha_nacimiento = 'La fecha de nacimiento es obligatoria';
        else if (!isValidAge(form.fecha_nacimiento)) newErrors.fecha_nacimiento = 'La edad debe estar entre 12 y 20 años';

        if (!form.curso_id) newErrors.curso_id = 'El curso es obligatorio';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Por favor, corrige los errores en el formulario");
            return;
        }
        setLoading(true);
        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/estudiantes/${editId}` : '/api/estudiantes';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
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
                handleCloseModal();
            })
            .catch(() => toast.error("Error al crear o actualizar el estudiante"))
            .finally(() => setLoading(false));
    };

    const handleEdit = (estudiante) => {
        setForm({
            nombre: estudiante.nombre,
            apellido: estudiante.apellido,
            fecha_nacimiento: estudiante.fecha_nacimiento,
            curso_id: estudiante.curso_id
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
        setForm({ nombre: '', apellido: '', fecha_nacimiento: '', curso_id: '' });
        setEditMode(false);
        setEditId(null);
        setErrors({});
    };

    const getNombreGrado = (cursoId) => {
        const curso = cursos.find(curso => curso.curso_id === cursoId);
        return curso ? curso.nombre : 'Sin asignar';
    };

    return (
        <div className="container">
            <button className="btn btn-primary my-4" onClick={() => setShowModal(true)}>
                Agregar Estudiante
            </button>

            {loading && <div className="alert alert-info">Cargando...</div>}

            <table className="table table-hover table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>Nombre Completo</th>
                        <th>Edad</th>
                        <th>Curso</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {estudiantes.map(est => (
                        <tr key={est.estudiante_id}>
                            <td>{`${est.nombre} ${est.apellido}`}</td>
                            <td>{calculateAge(est.fecha_nacimiento)} años</td>
                            <td>{getNombreGrado(est.curso_id)}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(est)}>Editar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(est.estudiante_id)}>Eliminar</button>
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
                                <h5 className="modal-title">{editMode ? 'Editar Estudiante' : 'Agregar Estudiante'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input type="text" name="nombre" className="form-control" value={form.nombre} onChange={handleChange} required />
                                        {errors.nombre && <div className="text-danger">{errors.nombre}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Apellido</label>
                                        <input type="text" name="apellido" className="form-control" value={form.apellido} onChange={handleChange} required />
                                        {errors.apellido && <div className="text-danger">{errors.apellido}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Fecha de Nacimiento</label>
                                        <input type="date" name="fecha_nacimiento" className="form-control" value={form.fecha_nacimiento} onChange={handleChange} required />
                                        {errors.fecha_nacimiento && <div className="text-danger">{errors.fecha_nacimiento}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Curso</label>
                                        <select name="curso_id" className="form-select" value={form.curso_id} onChange={handleChange} required>
                                            <option value="">Selecciona un curso</option>
                                            {cursos.map(curso => (
                                                <option key={curso.curso_id} value={curso.curso_id}>{curso.grado}</option>
                                            ))}
                                        </select>
                                        {errors.curso_id && <div className="text-danger">{errors.curso_id}</div>}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cerrar</button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {editMode ? 'Actualizar Estudiante' : 'Agregar Estudiante'}
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
    const rootElement = document.getElementById('crud-estudiante');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<EstudiantesApp />);
    }
};

export default EstudiantesApp;
