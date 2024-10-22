import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';

const CursosApp = () => {
    const [cursos, setCursos] = useState([]);
    const [form, setForm] = useState({
        nombre: '',
        grado: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch('/api/cursos')
            .then(response => response.json())
            .then(data => setCursos(data))
            .catch(() => toast.error("Error al cargar cursos"));
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
        const url = editMode ? `/api/cursos/${editId}` : '/api/cursos';

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
                setCursos(cursos.map(curso => curso.curso_id === editId ? data : curso));
                toast.success("Curso actualizado exitosamente");
            } else {
                setCursos([...cursos, data]);
                toast.success("Curso agregado exitosamente");
            }
            setShowModal(false);
            setForm({ nombre: '', grado: '' });  // Reiniciar formulario
            setEditMode(false);                  // Reiniciar modo de edición
        })
        .catch(() => {
            toast.error("Error al crear o actualizar el curso");
        })
        .finally(() => setLoading(false));
    };

    // Abrir el modal para agregar un curso
    const handleShowAddForm = () => {
        setForm({ nombre: '', grado: '' });  // Reiniciar formulario
        setEditMode(false);                  // Asegurarse de que no está en modo edición
        setShowModal(true);                  // Mostrar el modal
    };

    // Abrir el modal para editar un curso
    const handleEdit = (curso) => {
        setForm({
            nombre: curso.nombre,
            grado: curso.grado
        });
        setEditId(curso.curso_id);
        setEditMode(true);
        setShowModal(true);                  // Mostrar el modal en modo edición
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
                .catch(() => {
                    toast.error("Error al eliminar curso");
                })
                .finally(() => setLoading(false));
            }
        });
    };

    // Cerrar el modal y reiniciar el formulario
    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ nombre: '', grado: '' });  // Reiniciar formulario al cerrar
        setEditMode(false);                  // Reiniciar modo de edición
        setEditId(null);                     // Limpiar el ID de edición
    };

    // Opciones para los grados
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
        <div>
            {loading && <div>Cargando...</div>}

            <div>
                <button onClick={handleShowAddForm}>Agregar Curso</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Grado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {cursos.map(curso => (
                        <tr key={curso.curso_id}>
                            <td>{curso.nombre}</td>
                            <td>{curso.grado}</td>
                            <td>
                                <button onClick={() => handleEdit(curso)}>Editar</button>
                                <button onClick={() => handleDelete(curso.curso_id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div>
                    <div>
                        <div>
                            <h5>{editMode ? 'Editar Curso' : 'Agregar Curso'}</h5>
                            <button onClick={handleCloseModal}>Cerrar</button>
                        </div>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label>Nombre</label>
                                    <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Grado</label>
                                    <select name="grado" value={form.grado} onChange={handleChange} required>
                                        <option value="">Selecciona un grado</option>
                                        {opcionesGrado.map((opcion) => (
                                            <option key={opcion.value} value={opcion.value}>
                                                {opcion.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" disabled={loading}>
                                    {editMode ? 'Actualizar Curso' : 'Agregar Curso'}
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
    const rootElement = document.getElementById('crud-curso');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<CursosApp />);
    } else {
        console.error("No se encontró el contenedor con id 'crud-curso'");
    }
};

export default CursosApp;
