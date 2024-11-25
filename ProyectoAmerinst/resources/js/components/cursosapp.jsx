import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const CursosApp = () => {
    const [cursos, setCursos] = useState([]);
    const [form, setForm] = useState({
        nombre: '',
        grado: ''
    });
    const [errors, setErrors] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch('/api/cursos')
            .then(response => response.ok ? response.json() : Promise.reject('Error al cargar cursos'))
            .then(data => setCursos(data))
            .catch(() => toast.error("Error al cargar cursos"));
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!form.nombre.trim()) {
            newErrors.nombre = 'El nombre del curso es obligatorio';
        } else if (form.nombre.length > 50) {
            newErrors.nombre = 'El nombre del curso no debe exceder los 50 caracteres';
        }
        if (!form.grado) {
            newErrors.grado = 'El grado es obligatorio';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Por favor corrige los errores en el formulario");
            return;
        }

        setLoading(true);
        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/cursos/${editId}` : '/api/cursos';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(response => response.ok ? response.json() : Promise.reject('Error al guardar el curso'))
            .then(data => {
                if (editMode) {
                    setCursos(cursos.map(curso => curso.curso_id === editId ? data : curso));
                    toast.success("Curso actualizado exitosamente");
                } else {
                    setCursos([...cursos, data]);
                    toast.success("Curso agregado exitosamente");
                }
                handleCloseModal();
            })
            .catch(() => toast.error("Error al crear o actualizar el curso"))
            .finally(() => setLoading(false));
    };

    const handleShowAddForm = () => {
        setForm({ nombre: '', grado: '' });
        setEditMode(false);
        setEditId(null);
        setErrors({});
        setShowModal(true);
    };

    const handleEdit = (curso) => {
        setForm({
            nombre: curso.nombre,
            grado: curso.grado
        });
        setEditId(curso.curso_id);
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
                fetch(`/api/cursos/${id}`, { method: 'DELETE' })
                    .then(() => {
                        setCursos(cursos.filter(curso => curso.curso_id !== id));
                        toast.success("Curso eliminado exitosamente");
                        Swal.fire('Eliminado!', 'El curso ha sido eliminado.', 'success');
                    })
                    .catch(() => toast.error("Error al eliminar curso"))
                    .finally(() => setLoading(false));
            }
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ nombre: '', grado: '' });
        setEditMode(false);
        setEditId(null);
        setErrors({});
    };

    const opcionesGrado = [
        { value: '1er Grado', label: '1er Grado' },
        { value: '2do Grado', label: '2do Grado' },
        { value: '3er Grado', label: '3er Grado' },
        { value: '4to Grado', label: '4to Grado' },
        { value: '5to Grado', label: '5to Grado' },
        { value: '6to Grado', label: '6to Grado' },
        { value: '7mo Grado', label: '7mo Grado' },
        { value: '8vo Grado', label: '8vo Grado' }
    ];

    return (
        <div className="container my-4">
<h2 className="mt-4 mb-4">Gestión de Cursos</h2>
{loading && <div className="alert alert-info">Cargando...</div>}
            <button className="btn btn-primary mb-3" onClick={handleShowAddForm}>
                Agregar Curso
            </button>
            

            <table className="table table-hover table-bordered">
    <thead className="table-dark">
        <tr>
            <th className="text-center">Nombre del Curso</th>
            <th className="text-center">Grado</th>
            <th className="text-center" style={{ width: '15%' }}>Acciones</th> {/* Ajustar el tamaño aquí */}
        </tr>
    </thead>
    <tbody>
        {cursos.map(curso => (
            <tr key={curso.curso_id}>
                <td>{curso.nombre}</td>
                <td>{curso.grado}</td>
                <td className="text-center" style={{ width: '15%' }}> {/* Ajuste del tamaño de la columna "Acciones" */}
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(curso)}>
                        Editar
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(curso.curso_id)}>
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
                                <h5 className="modal-title">{editMode ? 'Editar Curso' : 'Agregar Curso'}</h5>
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
                                    <div className="mb-3">
                                        <label className="form-label">Grado</label>
                                        <select
                                            name="grado"
                                            className="form-select"
                                            value={form.grado}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Selecciona un grado</option>
                                            {opcionesGrado.map(opcion => (
                                                <option key={opcion.value} value={opcion.value}>
                                                    {opcion.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.grado && <div className="text-danger">{errors.grado}</div>}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                        Cerrar
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {editMode ? 'Actualizar Curso' : 'Agregar Curso'}
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
    const rootElement = document.getElementById('crud-curso');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<CursosApp />);
    } else {
        console.error("No se encontró el contenedor con id 'crud-curso'");
    }
};

export default CursosApp;
